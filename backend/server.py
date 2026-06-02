from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import math
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt

# ---------- ENV ----------
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']
JWT_SECRET = os.environ.get('JWT_SECRET', 'change-me-in-prod-bishnu-luxury-key')
JWT_ALG = 'HS256'
JWT_TTL_MIN = 60 * 12  # 12 hours

ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'bishnu@bbchauffeur.com')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'BayArea2025!')

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="Bishnu Bhattarai Private Chauffeur API")
api = APIRouter(prefix="/api")

# ---------- LOGGING ----------
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("chauffeur")

# ============================================================
# PRICING ENGINE
# ============================================================
ZONES = {
    "SFO":       {"lat": 37.6213, "lng": -122.3790, "label": "SFO Airport"},
    "OAK":       {"lat": 37.7126, "lng": -122.2197, "label": "OAK Airport"},
    "SJC":       {"lat": 37.3639, "lng": -121.9289, "label": "SJC Airport"},
    "SF":        {"lat": 37.7749, "lng": -122.4194, "label": "San Francisco"},
    "Peninsula": {"lat": 37.4419, "lng": -122.1430, "label": "Peninsula (Palo Alto)"},
    "SouthBay":  {"lat": 37.3382, "lng": -121.8863, "label": "South Bay (San Jose)"},
    "EastBay":   {"lat": 37.8044, "lng": -122.2712, "label": "East Bay (Oakland)"},
    "Marin":     {"lat": 37.9735, "lng": -122.5311, "label": "Marin"},
    "Napa":      {"lat": 38.2975, "lng": -122.2869, "label": "Napa Valley"},
    "Sonoma":    {"lat": 38.2919, "lng": -122.4580, "label": "Sonoma Valley"},
}

# Common Bay Area pickup chips (for live quote when user picks a chip)
CHIPS = {
    "SFO Airport":         {"lat": 37.6213, "lng": -122.3790},
    "OAK Airport":         {"lat": 37.7126, "lng": -122.2197},
    "SJC Airport":         {"lat": 37.3639, "lng": -121.9289},
    "Downtown San Francisco": {"lat": 37.7935, "lng": -122.3964},
    "Palo Alto":           {"lat": 37.4419, "lng": -122.1430},
    "Mountain View":       {"lat": 37.3861, "lng": -122.0839},
    "San Jose Downtown":   {"lat": 37.3382, "lng": -121.8863},
    "Oakland Downtown":    {"lat": 37.8044, "lng": -122.2712},
    "Berkeley":            {"lat": 37.8716, "lng": -122.2727},
    "Sausalito":           {"lat": 37.8590, "lng": -122.4853},
    "Napa Valley":         {"lat": 38.2975, "lng": -122.2869},
    "Sonoma":              {"lat": 38.2919, "lng": -122.4580},
    "Half Moon Bay":       {"lat": 37.4636, "lng": -122.4286},
    "Carmel":              {"lat": 36.5552, "lng": -121.9233},
}

SERVICE_RULES = {
    "airport":   {"base": 95.00,  "per_mile": 3.75, "minimum": 110.00},
    "winery":    {"base": 150.00, "per_mile": 4.25, "minimum": 850.00, "is_hourly": True, "hours": 6},
    "corporate": {"base": 110.00, "per_mile": 4.00, "minimum": 140.00},
    "hourly":    {"base": 0.00,   "hourly_rate": 145.00, "minimum_hours": 3, "per_mile": 0.0},
    "event":     {"base": 175.00, "per_mile": 4.25, "minimum": 250.00},
}

GRATUITY_RATE = 0.20
NIGHT_SURCHARGE = 25.00
AIRPORT_FEE = 15.00


def haversine_miles(lat1, lng1, lat2, lng2):
    R = 3958.8
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lng2 - lng1)
    a = math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2 * R * math.asin(math.sqrt(a))


def detect_zone(lat, lng):
    best, bd = None, 1e9
    for k, z in ZONES.items():
        d = haversine_miles(lat, lng, z["lat"], z["lng"])
        if d < bd:
            bd = d
            best = k
    return best


def resolve_location(loc: "Location") -> Dict[str, Any]:
    """Resolve a location: prefer lat/lng; else match address to CHIPS."""
    if loc.lat is not None and loc.lng is not None:
        return {"lat": loc.lat, "lng": loc.lng, "address": loc.address or ""}
    if loc.address:
        # Try exact CHIP match
        addr_norm = loc.address.strip()
        if addr_norm in CHIPS:
            c = CHIPS[addr_norm]
            return {"lat": c["lat"], "lng": c["lng"], "address": addr_norm}
        # Fuzzy contains
        for k, v in CHIPS.items():
            if k.lower() in addr_norm.lower() or addr_norm.lower() in k.lower():
                return {"lat": v["lat"], "lng": v["lng"], "address": loc.address}
        # Default to SF center if free text — still allow booking
        return {"lat": 37.7749, "lng": -122.4194, "address": loc.address}
    return {"lat": 37.7749, "lng": -122.4194, "address": ""}


def calculate_quote(service_type: str, pickup: Dict, dropoff: Optional[Dict],
                    pickup_time: str, hours: Optional[int] = None) -> Dict:
    rule = SERVICE_RULES.get(service_type)
    if not rule:
        raise HTTPException(400, f"Unknown service type: {service_type}")

    pickup_zone = detect_zone(pickup["lat"], pickup["lng"])
    dropoff_zone = None
    miles = 0.0
    if dropoff:
        dropoff_zone = detect_zone(dropoff["lat"], dropoff["lng"])
        miles = haversine_miles(pickup["lat"], pickup["lng"],
                                dropoff["lat"], dropoff["lng"])

    breakdown = []
    subtotal = 0.0

    if service_type == "hourly":
        hrs = max(hours or rule["minimum_hours"], rule["minimum_hours"])
        amt = hrs * rule["hourly_rate"]
        breakdown.append({"label": f"Hourly service ({hrs}h \u00d7 ${rule['hourly_rate']:.0f}/h)",
                          "amount": amt})
        subtotal += amt
    elif service_type == "winery" and rule.get("is_hourly"):
        hrs = max(hours or rule["hours"], rule["hours"])
        amt = max(rule["minimum"], rule["base"] + miles * rule["per_mile"])
        breakdown.append({"label": f"Winery day trip ({hrs}h, all-inclusive)", "amount": amt})
        subtotal += amt
    else:
        base = rule["base"]
        mileage = miles * rule.get("per_mile", 0)
        breakdown.append({"label": "Base fare", "amount": base})
        breakdown.append({"label": f"Distance ({miles:.1f} mi \u00d7 ${rule['per_mile']:.2f})",
                          "amount": mileage})
        subtotal = base + mileage
        minimum = rule.get("minimum", 0)
        if subtotal < minimum:
            breakdown.append({"label": "Minimum fare adjustment", "amount": minimum - subtotal})
            subtotal = minimum

    surcharges = 0.0
    is_airport = pickup_zone in ("SFO", "OAK", "SJC") or (dropoff_zone in ("SFO", "OAK", "SJC"))
    if is_airport and service_type != "winery":
        breakdown.append({"label": "Airport access fee", "amount": AIRPORT_FEE})
        surcharges += AIRPORT_FEE

    try:
        dt = datetime.fromisoformat(pickup_time.replace("Z", "+00:00"))
        hr = dt.hour
        if hr >= 22 or hr < 6:
            breakdown.append({"label": "Late-night surcharge (10pm\u20136am)", "amount": NIGHT_SURCHARGE})
            surcharges += NIGHT_SURCHARGE
    except Exception:
        pass

    pre = subtotal + surcharges
    gratuity = round(pre * GRATUITY_RATE, 2)
    breakdown.append({"label": f"Gratuity ({int(GRATUITY_RATE*100)}%)", "amount": gratuity})
    total = round(pre + gratuity, 2)

    return {
        "service_type": service_type,
        "pickup_zone": pickup_zone,
        "dropoff_zone": dropoff_zone,
        "distance_miles": round(miles, 2),
        "subtotal": round(subtotal, 2),
        "surcharges": round(surcharges, 2),
        "gratuity": gratuity,
        "total": total,
        "breakdown": [{"label": b["label"], "amount": round(b["amount"], 2)} for b in breakdown],
        "currency": "USD",
    }


# ============================================================
# MODELS
# ============================================================
class Location(BaseModel):
    address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None


class QuoteRequest(BaseModel):
    service_type: str
    pickup: Location
    dropoff: Optional[Location] = None
    pickup_time: str
    hours: Optional[int] = None


class Customer(BaseModel):
    name: str
    email: EmailStr
    phone: str


class BookingCreate(BaseModel):
    service_type: str
    vehicle: str = "Cadillac XT6"
    pickup: Location
    dropoff: Optional[Location] = None
    pickup_time: str  # ISO
    hours: Optional[int] = None
    passengers: int = 1
    luggage: int = 0
    flight_number: Optional[str] = None
    notes: Optional[str] = None
    customer: Customer


class AdminLogin(BaseModel):
    email: str
    password: str


class StatusUpdate(BaseModel):
    status: str  # pending|confirmed|completed|cancelled


# ============================================================
# AUTH
# ============================================================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/login", auto_error=False)

def create_token(sub: str) -> str:
    payload = {
        "sub": sub,
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=JWT_TTL_MIN),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def admin_required(token: Optional[str] = Depends(oauth2_scheme)):
    if not token:
        raise HTTPException(401, "Authentication required")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Session expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
    if payload.get("role") != "admin":
        raise HTTPException(403, "Admin only")
    return payload


# Seed admin on startup
_admin_seeded = False
async def seed_admin():
    global _admin_seeded
    if _admin_seeded:
        return
    existing = await db.admins.find_one({"email": ADMIN_EMAIL})
    if not existing:
        hashed = bcrypt.hashpw(ADMIN_PASSWORD.encode(), bcrypt.gensalt()).decode()
        await db.admins.insert_one({
            "id": str(uuid.uuid4()),
            "email": ADMIN_EMAIL,
            "password_hash": hashed,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Seeded admin user: {ADMIN_EMAIL}")
    _admin_seeded = True


# ============================================================
# ROUTES — Public
# ============================================================
@api.get("/")
async def root():
    return {"name": "Bishnu Bhattarai Private Chauffeur API", "status": "ok"}


@api.get("/static/cadillac_xt6.glb")
async def xt6_glb():
    # Prefer compressed version (3.7MB meshopt) if present
    base = ROOT_DIR / "static"
    path = base / "cadillac_xt6_min.glb"
    if not path.exists():
        path = base / "cadillac_xt6.glb"
    if not path.exists():
        raise HTTPException(404, "Model not found")
    return FileResponse(
        path,
        media_type="model/gltf-binary",
        headers={
            "Cache-Control": "public, max-age=31536000, immutable",
            "Access-Control-Allow-Origin": "*",
        },
    )


@api.get("/health")
async def health():
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}


@api.get("/locations")
async def locations():
    return {"chips": list(CHIPS.keys()), "zones": list(ZONES.keys())}


@api.post("/quote")
async def quote(req: QuoteRequest):
    pickup = resolve_location(req.pickup)
    dropoff = resolve_location(req.dropoff) if req.dropoff else None
    q = calculate_quote(req.service_type, pickup, dropoff, req.pickup_time, req.hours)
    return q


@api.post("/bookings")
async def create_booking(b: BookingCreate):
    pickup = resolve_location(b.pickup)
    dropoff = resolve_location(b.dropoff) if b.dropoff else None
    q = calculate_quote(b.service_type, pickup, dropoff, b.pickup_time, b.hours)

    confirmation = "BB-" + uuid.uuid4().hex[:8].upper()
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "confirmation": confirmation,
        "service_type": b.service_type,
        "vehicle": b.vehicle,
        "pickup": pickup,
        "dropoff": dropoff,
        "pickup_time": b.pickup_time,
        "hours": b.hours,
        "passengers": b.passengers,
        "luggage": b.luggage,
        "flight_number": b.flight_number,
        "notes": b.notes,
        "customer": b.customer.model_dump(),
        "quote": q,
        "status": "pending",
        "created_at": now,
        "updated_at": now,
    }
    await db.bookings.insert_one(doc.copy())
    logger.info(f"Booking created: {confirmation} total=${q['total']}")
    doc.pop("_id", None)
    return {"ok": True, "confirmation": confirmation, "booking": doc}


@api.get("/bookings/{confirmation}")
async def get_booking(confirmation: str):
    doc = await db.bookings.find_one({"confirmation": confirmation}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Booking not found")
    return doc


# ============================================================
# ROUTES — Admin
# ============================================================
@api.post("/admin/login")
async def admin_login(payload: AdminLogin):
    await seed_admin()
    user = await db.admins.find_one({"email": payload.email})
    if not user:
        raise HTTPException(401, "Invalid credentials")
    if not bcrypt.checkpw(payload.password.encode(), user["password_hash"].encode()):
        raise HTTPException(401, "Invalid credentials")
    token = create_token(payload.email)
    return {"access_token": token, "token_type": "bearer", "email": payload.email}


@api.get("/admin/me")
async def admin_me(user=Depends(admin_required)):
    return {"email": user.get("sub"), "role": user.get("role")}


@api.get("/admin/bookings")
async def admin_bookings(status: Optional[str] = None,
                          limit: int = 200,
                          user=Depends(admin_required)):
    q = {}
    if status:
        q["status"] = status
    items = await db.bookings.find(q, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return {"items": items, "count": len(items)}


@api.patch("/admin/bookings/{confirmation}/status")
async def admin_update_status(confirmation: str, payload: StatusUpdate,
                               user=Depends(admin_required)):
    allowed = {"pending", "confirmed", "completed", "cancelled"}
    if payload.status not in allowed:
        raise HTTPException(400, f"Invalid status. Allowed: {allowed}")
    res = await db.bookings.update_one(
        {"confirmation": confirmation},
        {"$set": {"status": payload.status,
                  "updated_at": datetime.now(timezone.utc).isoformat()}},
    )
    if res.matched_count == 0:
        raise HTTPException(404, "Booking not found")
    doc = await db.bookings.find_one({"confirmation": confirmation}, {"_id": 0})
    return {"ok": True, "booking": doc}


@api.get("/admin/stats")
async def admin_stats(user=Depends(admin_required)):
    items = await db.bookings.find({}, {"_id": 0}).to_list(2000)
    total_bookings = len(items)
    revenue = sum((it.get("quote", {}) or {}).get("total", 0) for it in items)
    confirmed_revenue = sum((it.get("quote", {}) or {}).get("total", 0)
                             for it in items if it.get("status") in ("confirmed", "completed"))
    upcoming = 0
    now = datetime.now(timezone.utc)
    by_status = {"pending": 0, "confirmed": 0, "completed": 0, "cancelled": 0}
    revenue_by_day = {}
    for it in items:
        s = it.get("status", "pending")
        by_status[s] = by_status.get(s, 0) + 1
        try:
            pt = datetime.fromisoformat(it["pickup_time"].replace("Z", "+00:00"))
            if pt > now and s in ("pending", "confirmed"):
                upcoming += 1
        except Exception:
            pass
        try:
            ct = datetime.fromisoformat(it["created_at"].replace("Z", "+00:00"))
            day = ct.strftime("%Y-%m-%d")
            revenue_by_day[day] = revenue_by_day.get(day, 0) + (it.get("quote", {}) or {}).get("total", 0)
        except Exception:
            pass
    avg_fare = round(revenue / total_bookings, 2) if total_bookings else 0
    series = [{"date": d, "revenue": round(v, 2)} for d, v in sorted(revenue_by_day.items())][-14:]
    return {
        "total_bookings": total_bookings,
        "revenue": round(revenue, 2),
        "confirmed_revenue": round(confirmed_revenue, 2),
        "avg_fare": avg_fare,
        "upcoming": upcoming,
        "by_status": by_status,
        "revenue_series": series,
    }


# ============================================================
# Include + middleware
# ============================================================
app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await seed_admin()
    await db.bookings.create_index("confirmation", unique=True)
    await db.bookings.create_index("created_at")
    await db.bookings.create_index("status")
    logger.info("Chauffeur API ready.")


@app.on_event("shutdown")
async def shutdown():
    client.close()
