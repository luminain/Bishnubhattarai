import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Plane, Wine, Briefcase, Clock, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { api, fmtUSD } from "@/lib/api";
import { BOOK } from "@/constants/testIds";

const SERVICES = [
  { key: "airport", title: "Airport Transfer", icon: Plane, hint: "from $110", desc: "SFO, OAK, SJC — flight tracked." },
  { key: "winery",  title: "Winery Day Tour",  icon: Wine, hint: "from $1,020/day", desc: "Napa & Sonoma full-day chauffeured." },
  { key: "corporate", title: "Corporate Exec", icon: Briefcase, hint: "from $140", desc: "Discreet roadshow & meetings." },
  { key: "hourly", title: "Hourly Charter", icon: Clock, hint: "$145/hr (3h min)", desc: "Open itinerary. Multiple stops." },
  { key: "event", title: "Events & Weddings", icon: Sparkles, hint: "from $250", desc: "Galas, weddings, premieres." },
];

const VEHICLES = [
  { key: "escalade", name: "Cadillac Escalade", desc: "Up to 6 pax · 6 bags" },
  { key: "ct6",      name: "Cadillac CT6",      desc: "Up to 3 pax · 3 bags" },
];

const CHIP_LIST = [
  "SFO Airport", "OAK Airport", "SJC Airport",
  "Downtown San Francisco", "Palo Alto", "Mountain View",
  "San Jose Downtown", "Oakland Downtown", "Berkeley",
  "Sausalito", "Napa Valley", "Sonoma", "Half Moon Bay", "Carmel",
];

const STEP_TITLES = ["Service", "Vehicle", "Where", "When", "Details", "Review"];

const BookingStepper = () => {
  const [params] = useSearchParams();
  const initialVehicle = (params.get("vehicle") || "").toLowerCase().includes("ct6") ? "ct6" : "escalade";

  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    service_type: "airport",
    vehicle: initialVehicle === "ct6" ? "Cadillac CT6" : "Cadillac Escalade",
    pickup: "SFO Airport",
    dropoff: "Downtown San Francisco",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: "10:00",
    hours: 4,
    passengers: 2,
    luggage: 2,
    flight_number: "",
    notes: "",
    name: "",
    email: "",
    phone: "",
  });
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const isoPickup = useMemo(() => {
    try { return new Date(`${data.date}T${data.time}:00`).toISOString(); }
    catch { return new Date().toISOString(); }
  }, [data.date, data.time]);

  // Live quote (debounced)
  useEffect(() => {
    if (confirmation) return;
    const t = setTimeout(async () => {
      try {
        setQuoteLoading(true);
        const payload = {
          service_type: data.service_type,
          pickup: { address: data.pickup },
          dropoff: data.service_type === "hourly" ? null : { address: data.dropoff },
          pickup_time: isoPickup,
          hours: ["hourly", "winery"].includes(data.service_type) ? Number(data.hours) : null,
        };
        const res = await api.post("/quote", payload);
        setQuote(res.data);
      } catch (e) {
        // noop
      } finally {
        setQuoteLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [data.service_type, data.pickup, data.dropoff, isoPickup, data.hours, confirmation]);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const validateStep = () => {
    if (step === 2 && (!data.pickup || (data.service_type !== "hourly" && !data.dropoff))) {
      toast.error("Please provide pickup" + (data.service_type !== "hourly" ? " and drop-off." : "."));
      return false;
    }
    if (step === 3) {
      if (!data.date || !data.time) { toast.error("Pick a date and time."); return false; }
      const dt = new Date(`${data.date}T${data.time}:00`);
      if (dt < new Date()) { toast.error("Pickup must be in the future."); return false; }
    }
    if (step === 4) {
      if (data.passengers < 1) { toast.error("At least 1 passenger."); return false; }
    }
    if (step === 5) {
      if (!data.name || !data.email || !data.phone) { toast.error("Name, email and phone are required."); return false; }
      if (!/^\S+@\S+\.\S+$/.test(data.email)) { toast.error("Enter a valid email."); return false; }
    }
    return true;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, STEP_TITLES.length - 1)); };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const payload = {
        service_type: data.service_type,
        vehicle: data.vehicle,
        pickup: { address: data.pickup },
        dropoff: data.service_type === "hourly" ? null : { address: data.dropoff },
        pickup_time: isoPickup,
        hours: ["hourly", "winery"].includes(data.service_type) ? Number(data.hours) : null,
        passengers: Number(data.passengers),
        luggage: Number(data.luggage),
        flight_number: data.flight_number || null,
        notes: data.notes || null,
        customer: { name: data.name, email: data.email, phone: data.phone },
      };
      const res = await api.post("/bookings", payload);
      setConfirmation(res.data);
      toast.success(`Booking confirmed: ${res.data.confirmation}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      const msg = e?.response?.data?.detail || "Could not create booking. Please try again.";
      toast.error(typeof msg === "string" ? msg : "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- Confirmation screen ---------- */
  if (confirmation) {
    const b = confirmation.booking;
    return (
      <div className="max-w-3xl mx-auto card-lux chrome-rule p-8 sm:p-12">
        <div className="flex items-center gap-3 text-[#B08D57]">
          <div className="h-10 w-10 rounded-full border border-[#B08D57] bg-[#2A2216] flex items-center justify-center">
            <Check size={20} />
          </div>
          <div className="font-serif text-2xl text-[#E7EBF2]">Reservation received</div>
        </div>
        <p className="mt-3 text-[#C9D0DB]">
          Thank you. Bishnu will personally review and confirm your itinerary within minutes.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-lg border border-[#232A36] bg-[#0B0D10]">
            <div className="lux-kicker">Confirmation</div>
            <div className="font-mono text-2xl text-[#B08D57] mt-1" data-testid={BOOK.confirmationCode}>{confirmation.confirmation}</div>
          </div>
          <div className="p-5 rounded-lg border border-[#232A36] bg-[#0B0D10]">
            <div className="lux-kicker">Estimated total</div>
            <div className="font-mono text-2xl text-[#E7EBF2] mt-1">{fmtUSD(b.quote.total)}</div>
          </div>
        </div>
        <div className="mt-6 text-sm text-[#C9D0DB] space-y-1.5">
          <div><span className="text-[#9AA3B2]">Service:</span> {b.service_type}</div>
          <div><span className="text-[#9AA3B2]">Vehicle:</span> {b.vehicle}</div>
          <div><span className="text-[#9AA3B2]">Pickup:</span> {b.pickup?.address}</div>
          {b.dropoff?.address && <div><span className="text-[#9AA3B2]">Drop-off:</span> {b.dropoff?.address}</div>}
          <div><span className="text-[#9AA3B2]">When:</span> {new Date(b.pickup_time).toLocaleString()}</div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="btn-lux-primary inline-flex items-center justify-center h-11 px-5 rounded-md text-sm">Back to home</Link>
          <button
            onClick={() => { setConfirmation(null); setStep(0); }}
            className="btn-lux-secondary inline-flex items-center justify-center h-11 px-5 rounded-md text-sm"
          >
            Book another ride
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Steps content ---------- */
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              const active = data.service_type === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => set("service_type", s.key)}
                  className={`card-lux chrome-rule p-5 text-left transition-all ${active ? "!border-[#B08D57] !bg-[#1A2230]" : ""}`}
                  data-testid={BOOK.serviceOption(s.key)}
                >
                  <div className="flex items-start justify-between">
                    <Icon size={22} className="text-[#B08D57]" />
                    <span className="font-mono text-xs text-[#9AA3B2]">{s.hint}</span>
                  </div>
                  <div className="mt-3 font-serif text-xl text-[#E7EBF2]">{s.title}</div>
                  <div className="text-sm text-[#C9D0DB] mt-1">{s.desc}</div>
                </button>
              );
            })}
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VEHICLES.map((v) => {
              const active = data.vehicle === v.name;
              return (
                <button
                  key={v.key}
                  onClick={() => set("vehicle", v.name)}
                  className={`card-lux chrome-rule p-6 text-left ${active ? "!border-[#B08D57] !bg-[#1A2230]" : ""}`}
                  data-testid={BOOK.vehicleOption(v.key)}
                >
                  <div className="font-serif text-2xl text-[#E7EBF2]">{v.name}</div>
                  <div className="text-sm text-[#9AA3B2] mt-1">{v.desc}</div>
                  <div className="mt-4 text-[12px] tracking-[0.22em] uppercase text-[#B08D57]">{active ? "Selected ✓" : "Select"}</div>
                </button>
              );
            })}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block lux-kicker mb-2">Pickup</label>
              <input
                value={data.pickup}
                onChange={(e) => set("pickup", e.target.value)}
                placeholder="e.g., SFO Airport, 425 Market St SF"
                className="input-lux w-full h-12 px-4 rounded-md text-sm"
                data-testid={BOOK.pickupInput}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {CHIP_LIST.slice(0, 8).map((c) => (
                  <button key={c}
                    onClick={() => set("pickup", c)}
                    className={`px-3 py-1.5 rounded-full text-xs border ${data.pickup === c ? "border-[#B08D57] text-[#B08D57] bg-[#2A2216]" : "border-[#2A3342] text-[#C9D0DB] hover:border-[#3A465B]"}`}
                    data-testid={BOOK.pickupChip(c.toLowerCase().replace(/\s+/g, "-"))}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            {data.service_type !== "hourly" && (
              <div>
                <label className="block lux-kicker mb-2">Drop-off</label>
                <input
                  value={data.dropoff}
                  onChange={(e) => set("dropoff", e.target.value)}
                  placeholder="e.g., Napa Valley, Palo Alto"
                  className="input-lux w-full h-12 px-4 rounded-md text-sm"
                  data-testid={BOOK.dropoffInput}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {CHIP_LIST.slice(0, 8).map((c) => (
                    <button key={c}
                      onClick={() => set("dropoff", c)}
                      className={`px-3 py-1.5 rounded-full text-xs border ${data.dropoff === c ? "border-[#B08D57] text-[#B08D57] bg-[#2A2216]" : "border-[#2A3342] text-[#C9D0DB] hover:border-[#3A465B]"}`}
                      data-testid={BOOK.dropoffChip(c.toLowerCase().replace(/\s+/g, "-"))}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block lux-kicker mb-2">Date</label>
              <input type="date" value={data.date} onChange={(e) => set("date", e.target.value)}
                     className="input-lux w-full h-12 px-4 rounded-md text-sm" data-testid={BOOK.dateInput} />
            </div>
            <div>
              <label className="block lux-kicker mb-2">Time</label>
              <input type="time" value={data.time} onChange={(e) => set("time", e.target.value)}
                     className="input-lux w-full h-12 px-4 rounded-md text-sm" data-testid={BOOK.timeInput} />
            </div>
            {["hourly", "winery"].includes(data.service_type) && (
              <div className="sm:col-span-2">
                <label className="block lux-kicker mb-2">Hours</label>
                <select value={data.hours} onChange={(e) => set("hours", e.target.value)}
                        className="input-lux w-full h-12 px-4 rounded-md text-sm" data-testid={BOOK.hoursSelect}>
                  {[3, 4, 5, 6, 7, 8, 10, 12].map((h) => <option key={h} value={h}>{h} hours</option>)}
                </select>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block lux-kicker mb-2">Passengers</label>
              <select value={data.passengers} onChange={(e) => set("passengers", e.target.value)}
                      className="input-lux w-full h-12 px-4 rounded-md text-sm" data-testid={BOOK.passengersSelect}>
                {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block lux-kicker mb-2">Luggage</label>
              <select value={data.luggage} onChange={(e) => set("luggage", e.target.value)}
                      className="input-lux w-full h-12 px-4 rounded-md text-sm" data-testid={BOOK.luggageSelect}>
                {[0, 1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            {data.service_type === "airport" && (
              <div className="sm:col-span-2">
                <label className="block lux-kicker mb-2">Flight number (optional, enables tracking)</label>
                <input value={data.flight_number} onChange={(e) => set("flight_number", e.target.value)}
                       placeholder="UA 1234" className="input-lux w-full h-12 px-4 rounded-md text-sm"
                       data-testid={BOOK.flightInput} />
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="block lux-kicker mb-2">Notes / requests</label>
              <textarea value={data.notes} onChange={(e) => set("notes", e.target.value)}
                        rows={4} placeholder="Child seat, water preference, multiple stops..."
                        className="input-lux w-full px-4 py-3 rounded-md text-sm"
                        data-testid={BOOK.notesInput} />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block lux-kicker mb-2">Full name</label>
              <input value={data.name} onChange={(e) => set("name", e.target.value)}
                     className="input-lux w-full h-12 px-4 rounded-md text-sm" data-testid={BOOK.nameInput} />
            </div>
            <div>
              <label className="block lux-kicker mb-2">Email</label>
              <input type="email" value={data.email} onChange={(e) => set("email", e.target.value)}
                     className="input-lux w-full h-12 px-4 rounded-md text-sm" data-testid={BOOK.emailInput} />
            </div>
            <div className="sm:col-span-2">
              <label className="block lux-kicker mb-2">Phone</label>
              <input value={data.phone} onChange={(e) => set("phone", e.target.value)}
                     placeholder="+1 (415) 555-0100"
                     className="input-lux w-full h-12 px-4 rounded-md text-sm" data-testid={BOOK.phoneInput} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Stepper + form */}
      <div className="lg:col-span-7">
        {/* Progress */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {STEP_TITLES.map((t, i) => (
            <div key={t} className="flex items-center gap-2 shrink-0">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-mono ${
                i === step ? "bg-[#B08D57] text-[#07080A]" :
                i < step ? "bg-[#2A2216] text-[#B08D57] border border-[#B08D57]" :
                "border border-[#2A3342] text-[#9AA3B2]"
              }`}>{i < step ? <Check size={13} /> : i + 1}</div>
              <div className={`text-[11px] tracking-[0.22em] uppercase ${i === step ? "text-[#E7EBF2]" : "text-[#9AA3B2]"}`}>{t}</div>
              {i < STEP_TITLES.length - 1 && <div className="h-px w-6 bg-[#2A3342]" />}
            </div>
          ))}
        </div>

        <div className="card-lux chrome-rule p-6 sm:p-8">
          <div className="font-serif text-2xl text-[#E7EBF2]">{STEP_TITLES[step]}</div>
          <div className="text-sm text-[#9AA3B2] mt-1">Step {step + 1} of {STEP_TITLES.length}</div>
          <div className="mt-6">{renderStep()}</div>
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 0}
              className="btn-lux-secondary inline-flex items-center gap-2 h-11 px-5 rounded-md text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              data-testid={BOOK.backBtn}
            >
              <ArrowLeft size={15} /> Back
            </button>
            {step < STEP_TITLES.length - 1 ? (
              <button onClick={next} className="btn-lux-primary inline-flex items-center gap-2 h-11 px-6 rounded-md text-sm" data-testid={BOOK.nextBtn}>
                Next <ArrowRight size={15} />
              </button>
            ) : (
              <button onClick={submit} disabled={submitting} className="btn-lux-primary inline-flex items-center gap-2 h-11 px-6 rounded-md text-sm disabled:opacity-60" data-testid={BOOK.confirmBtn}>
                {submitting ? "Reserving..." : "Confirm reservation"} <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rate breakdown sticky */}
      <aside className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <div className="card-lux chrome-rule p-6" data-testid={BOOK.rateCard}>
            <div className="lux-kicker">Live rate estimate</div>
            <div className="mt-2 font-serif text-4xl text-[#E7EBF2]" data-testid={BOOK.rateTotal}>
              {quote ? fmtUSD(quote.total) : (quoteLoading ? "…" : "—")}
            </div>
            <div className="text-xs text-[#9AA3B2] mt-1">All-inclusive. 20% gratuity included.</div>

            <div className="mt-6 space-y-2.5 text-sm">
              {(quote?.breakdown || []).map((b, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[#C9D0DB]">{b.label}</span>
                  <span className="font-mono text-[#E7EBF2]">{fmtUSD(b.amount)}</span>
                </div>
              ))}
            </div>

            <div className="lux-divider mt-6" />
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-[#C9D0DB]">
              <div><div className="text-[#9AA3B2]">Service</div>{data.service_type}</div>
              <div><div className="text-[#9AA3B2]">Vehicle</div>{data.vehicle}</div>
              <div><div className="text-[#9AA3B2]">Pickup</div>{data.pickup || "—"}</div>
              <div><div className="text-[#9AA3B2]">Drop-off</div>{data.dropoff || (data.service_type === "hourly" ? "Open" : "—")}</div>
              <div className="col-span-2"><div className="text-[#9AA3B2]">When</div>{data.date} · {data.time}</div>
              {quote?.distance_miles ? (
                <div className="col-span-2"><div className="text-[#9AA3B2]">Distance</div>{quote.distance_miles} mi</div>
              ) : null}
            </div>
          </div>

          <div className="mt-4 text-xs text-[#9AA3B2] leading-relaxed">
            Free cancellation up to 6 hours before pickup. Bishnu confirms every reservation personally.
          </div>
        </div>
      </aside>
    </div>
  );
};

export default BookingStepper;
