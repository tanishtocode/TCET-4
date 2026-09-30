# 🍱 MealLink — AI Surplus Food Matcher
**Rescue surplus. Deliver meals. Before time runs out.** (Statement #5 — Surplus Food Matcher)

## Problem
Wedding halls and restaurants have cooked food left over; nearby NGOs need meals. Donors send hurried WhatsApp-style messages, details go missing, matching is manual, and food has a short window.

## Solution
Message → AI extraction → **human confirmation** → structured donation → deadline-aware NGO matching → explained match → claim → pickup → completed (or auto-**EXPIRED**).

## Features
Landing page · AI listing creation · confirm/edit step with missing-field errors · match results + "Why this match?" · live countdown (🟢🟠🔴) · auto-expiry · NGO dashboard & claim flow · pickup message + copy · status timeline · impact dashboard · pricing · glassmorphism, mobile-first UI.

## Tech stack
React 18 + TypeScript, Vite, Tailwind CSS 3, Supabase (Postgres, Auth, Realtime, Edge Functions), Gemini for extraction. See `supabase/schema.sql`.

## AI workflow
`src/lib/ai.ts`: if `VITE_ANTHROPIC_API_KEY` is set, Claude returns strict JSON (`null` for anything not stated — never guessed). If the key is missing or the call fails, **Demo Mode** (a rule-based extractor) is used; the UI labels which one ran. The AI never publishes: the donor must confirm. Pickup messages are template-generated.

## Matching logic (`src/lib/match.ts`)
Distance 30% · Capacity 25% · Food compatibility 20% · Pickup availability 15% · Time feasibility 10%. ETA = 10 min prep + 3 min/km. NGOs failing capacity, food type, pickup, or ETA-before-deadline are excluded. Every score comes with human-readable reasons.

## Data model
`Donation{id,donor,quantity,foodType,veg,location,lat?,lng?,createdAt,deadline,status,ngoId?,claimedAt?,pickedAt?}` with status `AVAILABLE→CLAIMED→PICKUP_IN_PROGRESS→PICKED_UP→COMPLETED` or `EXPIRED` (derived when the deadline passes). `Ngo{id,name,area,km,capacity,accepts[],pickup,contact}`. Seed data in `src/data.ts`.

## Environment variables
See `.env.example`: `VITE_ANTHROPIC_API_KEY` (optional). Browser-side keys are for demos only — proxy in production.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```
## Production build
```bash
npm run build && npm run preview
```
## Demo flow
Donate Food → try the first sample chip (*60 veg biryani meals… within 45 minutes*) → ✨ Create Listing with AI → Confirm → matches → *Why this match?* → NGO tab → Claim → Copy Message → Start pickup / Picked up / Completed → Impact tab. Use **↺ Reset demo** to restart.

## Business model (proposed, not validated)
Businesses pay, NGOs are free: Starter ₹999/mo, Business ₹2,499/mo, Enterprise custom.

## Safety
The platform does not independently certify food safety. Donors and recipient organizations remain responsible for following applicable food-safety requirements. Deadlines are donor-provided.

## Limitations / future work
Supabase persistence + realtime, real geocoding/distances (NGO distances are static demo values), auth & roles, notifications, server-side AI proxy, multi-donor analytics. All organizations are fictional.
