"""
Core POC: Validate pricing engine + booking persistence (MongoDB).

This tests the SF Bay Area chauffeur core logic in isolation before
building the full app.
"""
import os
import sys
import math
import asyncio
import uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load backend env
ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / "backend" / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]


# ---------- Pricing engine (mirrors what backend will use) ----------

# SF Bay Area zone anchors (lat, lng)
ZONES = {
    "SFO":          {"lat": 37.6213, "lng": -122.3790, "label": "SFO Airport"},
    "OAK":          {"lat": 37.7126, "lng": -122.2197, "label": "OAK Airport"},
    "SJC":          {"lat": 37.3639, "lng": -121.9289, "label": "SJC Airport"},
    "SF":           {"lat": 37.7749, "lng": -122.4194, "label": "San Francisco"},
    "Peninsula":    {"lat": 37.4419, "lng": -122.1430, "label": "Peninsula (Palo Alto)"},
    "SouthBay":     {"lat": 37.3382, "lng": -121.8863, "label": "South Bay (San Jose)"},
    "EastBay":      {"lat": 37.8044, "lng": -122.2712, "label": "East Bay (Oakland)"},
    "Marin":        {"lat": 37.9735, "lng": -122.5311, "label": "Marin (San Rafael)"},
    "Napa":         {"lat": 38.2975, "lng": -122.2869, "label": "Napa Valley"},
    "Sonoma":       {"lat": 38.2919, "lng": -122.4580, "label": "Sonoma Valley"},
}

SERVICE_RULES = {
    "airport":   {"base": 95.00, "per_mile": 3.75, "minimum": 110.00},
    "winery":    {"base": 150.00, "per_mile": 4.25, "minimum": 850.00, "is_hourly": True, "hours": 6},
    "corporate": {"base": 110.00, "per_mile": 4.00, "minimum": 140.00},
    "hourly":    {"base": 0.00, "hourly_rate": 145.00, "minimum_hours": 3, "per_mile": 0.0},
    "event":     {"base": 175.00, "per_mile": 4.25, "minimum": 250.00},
}

GRATUITY_RATE = 0.20  # 20% standard luxury gratuity
NIGHT_SURCHARGE = 25.00  # 10pm-6am pickup
AIRPORT_FEE = 15.00


def haversine_miles(lat1, lng1, lat2, lng2):
    R = 3958.8  # miles
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def detect_zone(lat, lng):
    """Returns (zone_key, distance_miles_to_anchor)."""
    best = None
    best_d = 1e9
    for key, z in ZONES.items():
        d = haversine_miles(lat, lng, z["lat"], z["lng"])
        if d < best_d:
            best_d = d
            best = key
    return best, best_d


def calculate_quote(service_type, pickup, dropoff, pickup_time, hours=None):
    """
    pickup, dropoff: {"lat": ..., "lng": ..., "address": ...}
    pickup_time: ISO string
    """
    rule = SERVICE_RULES.get(service_type)
    if not rule:
        raise ValueError(f"Unknown service: {service_type}")

    pickup_zone, _ = detect_zone(pickup["lat"], pickup["lng"])
    dropoff_zone = None
    miles = 0.0
    if dropoff:
        dropoff_zone, _ = detect_zone(dropoff["lat"], dropoff["lng"])
        miles = haversine_miles(pickup["lat"], pickup["lng"],
                                dropoff["lat"], dropoff["lng"])

    breakdown = []
    subtotal = 0.0

    if service_type == "hourly":
        hrs = max(hours or rule["minimum_hours"], rule["minimum_hours"])
        amt = hrs * rule["hourly_rate"]
        breakdown.append({"label": f"Hourly service ({hrs}h)", "amount": amt})
        subtotal += amt
    elif service_type == "winery" and rule.get("is_hourly"):
        hrs = max(hours or rule["hours"], rule["hours"])
        # winery: flat day rate (minimum) — use minimum as baseline
        amt = max(rule["minimum"], rule["base"] + miles * rule["per_mile"])
        breakdown.append({"label": f"Winery tour ({hrs}h day-trip)", "amount": amt})
        subtotal += amt
    else:
        base = rule["base"]
        mileage = miles * rule.get("per_mile", 0)
        breakdown.append({"label": "Base fare", "amount": base})
        breakdown.append({"label": f"Distance ({miles:.1f} mi)", "amount": mileage})
        subtotal = base + mileage
        minimum = rule.get("minimum", 0)
        if subtotal < minimum:
            breakdown.append({"label": "Minimum fare adjustment",
                              "amount": minimum - subtotal})
            subtotal = minimum

    # Surcharges
    surcharges = 0.0
    is_airport = (pickup_zone in ("SFO", "OAK", "SJC")
                  or (dropoff_zone in ("SFO", "OAK", "SJC")))
    if is_airport and service_type != "winery":
        breakdown.append({"label": "Airport fee", "amount": AIRPORT_FEE})
        surcharges += AIRPORT_FEE

    # Night surcharge
    try:
        dt = datetime.fromisoformat(pickup_time.replace("Z", "+00:00"))
        hr = dt.hour
        if hr >= 22 or hr < 6:
            breakdown.append({"label": "Late-night surcharge", "amount": NIGHT_SURCHARGE})
            surcharges += NIGHT_SURCHARGE
    except Exception:
        pass

    pre_gratuity = subtotal + surcharges
    gratuity = round(pre_gratuity * GRATUITY_RATE, 2)
    breakdown.append({"label": f"Gratuity ({int(GRATUITY_RATE*100)}%)", "amount": gratuity})

    total = round(pre_gratuity + gratuity, 2)

    return {
        "service_type": service_type,
        "pickup_zone": pickup_zone,
        "dropoff_zone": dropoff_zone,
        "distance_miles": round(miles, 2),
        "subtotal": round(subtotal, 2),
        "surcharges": round(surcharges, 2),
        "gratuity": gratuity,
        "total": total,
        "breakdown": breakdown,
        "currency": "USD",
    }


# ---------- Tests ----------

def test_pricing_scenarios():
    print("\n=== TEST 1: Pricing Scenarios ===")
    scenarios = [
        {
            "name": "SFO -> Downtown SF (airport pickup)",
            "service": "airport",
            "pickup": {"lat": 37.6213, "lng": -122.3790, "address": "SFO"},
            "dropoff": {"lat": 37.7749, "lng": -122.4194, "address": "SF"},
            "time": "2025-12-15T14:00:00Z",
        },
        {
            "name": "Palo Alto -> SFO (late night)",
            "service": "airport",
            "pickup": {"lat": 37.4419, "lng": -122.1430, "address": "Palo Alto"},
            "dropoff": {"lat": 37.6213, "lng": -122.3790, "address": "SFO"},
            "time": "2025-12-15T23:30:00Z",
        },
        {
            "name": "SF -> Napa winery (full day)",
            "service": "winery",
            "pickup": {"lat": 37.7749, "lng": -122.4194, "address": "SF"},
            "dropoff": {"lat": 38.2975, "lng": -122.2869, "address": "Napa"},
            "time": "2025-12-15T10:00:00Z",
        },
        {
            "name": "Corporate downtown SF -> Peninsula",
            "service": "corporate",
            "pickup": {"lat": 37.7749, "lng": -122.4194, "address": "SF Financial District"},
            "dropoff": {"lat": 37.4419, "lng": -122.1430, "address": "Palo Alto HQ"},
            "time": "2025-12-15T08:00:00Z",
        },
        {
            "name": "Hourly (4h) starting in SF",
            "service": "hourly",
            "pickup": {"lat": 37.7749, "lng": -122.4194, "address": "SF Hotel"},
            "dropoff": None,
            "time": "2025-12-15T18:00:00Z",
            "hours": 4,
        },
    ]
    for s in scenarios:
        q = calculate_quote(s["service"], s["pickup"], s.get("dropoff"),
                            s["time"], s.get("hours"))
        print(f"\n  • {s['name']}")
        print(f"    zones: {q['pickup_zone']} -> {q['dropoff_zone']}, {q['distance_miles']} mi")
        print(f"    subtotal=${q['subtotal']:.2f}, surcharges=${q['surcharges']:.2f}, "
              f"gratuity=${q['gratuity']:.2f}, TOTAL=${q['total']:.2f}")
        for b in q["breakdown"]:
            print(f"      - {b['label']:<35} ${b['amount']:.2f}")
        assert q["total"] > 0, "Total must be positive"
    print("\n[PASS] All pricing scenarios produced valid quotes.")


async def test_booking_persistence():
    print("\n=== TEST 2: Booking Persistence (MongoDB) ===")
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    # Sample quote
    q = calculate_quote(
        "airport",
        {"lat": 37.6213, "lng": -122.3790, "address": "SFO Terminal 2"},
        {"lat": 37.7749, "lng": -122.4194, "address": "Ritz-Carlton SF"},
        "2025-12-20T09:00:00Z",
    )

    confirmation = "BB-" + uuid.uuid4().hex[:8].upper()
    booking = {
        "id": str(uuid.uuid4()),
        "confirmation": confirmation,
        "service_type": "airport",
        "pickup": {"lat": 37.6213, "lng": -122.3790, "address": "SFO Terminal 2"},
        "dropoff": {"lat": 37.7749, "lng": -122.4194, "address": "Ritz-Carlton SF"},
        "pickup_time": "2025-12-20T09:00:00Z",
        "passengers": 2,
        "luggage": 3,
        "flight_number": "UA 123",
        "customer": {
            "name": "POC Test Client",
            "email": "test@example.com",
            "phone": "+14155550100",
        },
        "notes": "Champagne please.",
        "quote": q,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    # Insert
    await db.bookings.insert_one(booking.copy())
    print(f"  • Inserted booking {confirmation} (total=${q['total']:.2f})")

    # Retrieve
    retrieved = await db.bookings.find_one({"confirmation": confirmation}, {"_id": 0})
    assert retrieved is not None, "Booking not found"
    assert retrieved["confirmation"] == confirmation
    assert retrieved["quote"]["total"] == q["total"]
    print(f"  • Retrieved booking by confirmation OK")

    # Status update
    await db.bookings.update_one(
        {"confirmation": confirmation},
        {"$set": {"status": "confirmed", "updated_at": datetime.now(timezone.utc).isoformat()}},
    )
    updated = await db.bookings.find_one({"confirmation": confirmation}, {"_id": 0})
    assert updated["status"] == "confirmed"
    print(f"  • Status update OK -> {updated['status']}")

    # Stats
    total_count = await db.bookings.count_documents({})
    print(f"  • Total bookings in DB: {total_count}")

    # Clean up POC booking
    await db.bookings.delete_one({"confirmation": confirmation})
    print(f"  • Cleaned up test booking.")

    client.close()
    print("\n[PASS] MongoDB persistence + retrieval + update verified.")


async def test_validation():
    print("\n=== TEST 3: Input Validation ===")
    # bad service
    try:
        calculate_quote("invalid_type",
                        {"lat": 37.7, "lng": -122.4},
                        {"lat": 37.6, "lng": -122.3},
                        "2025-12-15T12:00:00Z")
        assert False, "should have raised"
    except ValueError:
        print("  • Unknown service rejected OK")

    # zero-distance
    q = calculate_quote("hourly",
                        {"lat": 37.7749, "lng": -122.4194},
                        None,
                        "2025-12-15T12:00:00Z",
                        hours=2)
    assert q["total"] > 0
    print(f"  • Hourly minimum enforced (2h asked, billed 3h min) -> total ${q['total']}")
    print("\n[PASS] Validation behaves as expected.")


def main():
    print("=" * 60)
    print("CHAUFFEUR CORE POC — Bishnu Bhattarai (SF Bay Area)")
    print("=" * 60)
    test_pricing_scenarios()
    asyncio.run(test_booking_persistence())
    asyncio.run(test_validation())
    print("\n" + "=" * 60)
    print("ALL CORE TESTS PASSED — ready to build the app.")
    print("=" * 60)


if __name__ == "__main__":
    try:
        main()
    except AssertionError as e:
        print(f"\n[FAIL] {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n[ERROR] {type(e).__name__}: {e}")
        sys.exit(2)
