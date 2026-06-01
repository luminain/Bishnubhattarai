# plan.md

## 1. Objectives
- Deliver an ultra-luxury, high-converting website for **Bishnu Bhattarai — Private Chauffeur** (SF Bay Area).
- Ship a **cinematic 3D hero** (React Three Fiber + drei + GSAP ScrollTrigger) with scroll-driven motion + interactive hotspots.
- Provide a **real booking flow** (multi-step) with **live Bay Area pricing** (haversine + zone rules) and MongoDB persistence.
- Provide **one-tap concierge** links (tel/sms/WhatsApp) and premium content (services/fleet/testimonials).
- Provide **admin-only dashboard** with JWT auth to manage bookings, statuses, and revenue stats.
- Clearly note: **no provider email/SMS sending**; confirmations are in-app + device handoff links.

## 2. Implementation Steps

### Phase 1: Core Flow POC (Isolation) — Booking + Pricing + Persistence
**Goal:** Prove the hardest business core works end-to-end (rate calc  booking creation  storage  confirmation) before full UI.

**POC Scope (minimal UI, real logic):**
1. Define pricing model
   - Zone list (SFO/OAK/SJC, SF, Peninsula, South Bay, East Bay, Marin, Napa/Sonoma) + base fees.
   - Haversine distance + per-mile rate + time-of-day multiplier + service-type modifiers (airport/winery/hourly).
2. Backend (FastAPI + Motor)
   - `POST /api/quote` returns priced breakdown (zones detected, miles, fees, total).
   - `POST /api/bookings` creates booking with generated confirmation code.
   - `GET /api/bookings/{confirmation}` returns booking.
3. Minimal frontend page `/book-poc`
   - Inputs: service type, pickup/dropoff text, date/time, passengers, luggage.
   - Shows live quote (debounced).
   - Submit booking, display confirmation code + summary.
4. Data validation + error states
   - Required fields, date in future, passenger limits, empty addresses.
5. Web research (quick)
   - Confirm best practices for R3F + GSAP ScrollTrigger + performance budgets (for Phase 2 hero).

**Phase 1 user stories**
1. As a client, I can enter pickup/drop-off and instantly see an estimated rate update.
2. As a client, I can submit a booking and receive a confirmation number.
3. As a client, I can refresh the page and still retrieve my booking by confirmation code.
4. As an admin, I can see that bookings are stored in MongoDB with all required fields.
5. As a client, I see clear validation messages when required booking inputs are missing.

**Exit criteria:** Quote accuracy and booking persistence verified with multiple Bay Area scenarios.

---

### Phase 2: V1 App Development (Luxury UI + 3D Hero + Full Pages) 
**Goal:** Build the full marketing + booking experience around the proven booking core (no admin auth yet).

**Frontend (React CRA + Tailwind + shadcn/ui + Framer Motion + GSAP + R3F):**
1. Design system
   - Colors: obsidian blacks, metallic silvers, muted gold accents; subtle grain + vignette.
   - Typography: editorial serif for headings + geometric sans for body.
   - Components: premium buttons, cards, stepper, inputs, badges, toast.
2. Home page sections
   - **3D Hero**: R3F Cadillac/Escalade scene; HDRI studio lighting; contact shadows; cinematic camera.
   - GSAP ScrollTrigger: drive-in/rotate + parallax text reveals.
   - Hotspots: click/hover to reveal luxury features panel.
   - Services strip, Fleet preview, How-it-works, Testimonials, Stats, CTA.
3. Booking
   - `/book` multi-step booking wizard with live quote and final review.
   - Confirmation screen with code + next steps (call/sms/WhatsApp links).
4. Content pages
   - `/services`, `/fleet`, `/about`, `/contact` (concierge CTAs + service area).
5. Backend adjustments (as needed)
   - Harden schema, indexes (createdAt, status, confirmation).
   - Add `GET /api/services` static config endpoint (optional) for UI consistency.

**Phase 2 user stories**
1. As a visitor, I see a cinematic 3D Cadillac hero that animates smoothly as I scroll.
2. As a visitor, I can interact with hotspots to learn about luxury features.
3. As a client, I can complete a multi-step booking with a live price estimate at every step.
4. As a client, I can immediately contact concierge via Call/SMS/WhatsApp from any page.
5. As a visitor, I can explore services and fleet details without losing my booking progress.

**End of phase:** 1 full end-to-end test pass (Home  Book  Confirmation  DB verify) + visual QA of 3D hero.

---

### Phase 3: Admin Dashboard + Auth (JWT) + Ops Views
**Goal:** Add admin-only operations after V1 UX is stable.

1. Backend auth
   - Admin login endpoint (env-based single admin user) + bcrypt password hash.
   - JWT access token; auth dependency for admin routes.
2. Admin APIs
   - `GET /api/admin/bookings` (filters: date range, status).
   - `PATCH /api/admin/bookings/{id}` status updates + notes.
   - `GET /api/admin/stats` revenue totals by status/date.
3. Admin UI
   - `/admin/login` + `/admin/dashboard` (table, status controls, detail drawer).
   - Basic audit fields (updatedAt, statusHistory minimal).

**Phase 3 user stories**
1. As Bishnu (admin), I can log in and stay signed in during my session.
2. As Bishnu, I can view all bookings sorted by newest first.
3. As Bishnu, I can update booking status (Pending/Confirmed/Completed).
4. As Bishnu, I can filter bookings by status and date range.
5. As Bishnu, I can view revenue stats for a selected time window.

**End of phase:** 1 full end-to-end test pass including admin login and status update.

---

### Phase 4: Polish, Performance, and Hardening
1. 3D performance
   - Asset compression (draco/meshopt if used), lazy-load GLB, fallback poster.
   - Reduce draw calls, limit lights, prefer baked env + contact shadows.
2. UX polish
   - Micro-interactions, skeleton loaders, empty states, error boundaries.
3. SEO + trust
   - Structured footer, service area copy, testimonials formatting, basic meta tags.
4. Data hardening
   - Server-side validation, rate limiting (basic), sanitize inputs.

**Phase 4 user stories**
1. As a visitor on a slower device, I still get a fast first paint with a graceful 3D fallback.
2. As a client, I never lose feedback during loading states (clear spinners/skeletons).
3. As a client, I can recover from errors (network/validation) without redoing the whole form.
4. As Bishnu, I can reliably manage bookings without inconsistent status updates.
5. As a visitor, I can find key trust signals (service area, premium features, testimonials) quickly.

## 3. Next Actions
1. Confirm preferred brand lockup text: **"Bishnu Bhattarai  Private Chauffeur"** vs adding a service descriptor (e.g., “Bay Area Executive Chauffeur”).
2. Approve the initial pricing rules (zones + base + per-mile + hourly minimums) for Phase 1 implementation.
3. Decide 3D asset approach priority: (A) sourced Cadillac/Escalade GLB, (B) stylized placeholder GLB until a licensed model is provided.
4. Start Phase 1 build: implement `/api/quote`, `/api/bookings`, and `/book-poc` and validate with real scenarios.

## 4. Success Criteria
- 3D hero loads reliably, maintains smooth scroll animation, and hotspots are usable on desktop and mobile fallbacks.
- Booking wizard completes with live pricing, stores booking in MongoDB, and returns a confirmation code.
- Concierge actions work via device links (tel/sms/wa.me) across major browsers.
- Admin dashboard supports login, booking status updates, and basic revenue stats without data inconsistency.
- End-to-end tests pass at the end of each phase; no regressions in core booking flow.