# SpePas — USSD & Phone Order System PRD

> **Last updated:** 2026-02-25
> **Prototype:** [v0 USSD Prototype](https://v0.app/chat/spe-pas-prototype-e22fV21yU0X)
> **Status:** MVP0 — this is the primary ordering channel, ahead of the web app

---

## 1. Overview

SpePas MVP0 is a **phone call + USSD** ordering system. Buyers place orders by calling a SpePas phone line, where a human agent captures the request. After that, all participants (buyer, seller, rider) use USSD (`*773727#`) to track status, review bids, manage cart, checkout, and handle delivery. There is no mobile app — USSD works from any phone.

**Why phone-first:** The target market includes mechanics and end-users who may not have smartphones or data. A phone call is the lowest-barrier entry point. USSD requires no data, no app, and no smartphone.

---

## 2. System Components

| Component | Purpose |
|-----------|---------|
| **3CX Phone System** | Inbound call handling, routing, recording, queue management |
| **USSD Service** (`*773727#`) | State-machine menu system for all roles; source of truth for bids, cart, checkout |
| **Admin Portal** | Phone Order Agents create requests, look up buyers, build part codes |
| **SMS Notifications** | Automated messages to buyers at key milestones |
| **USSD Mocker** (mocker.spepas.com) | QA tool — web UI that simulates USSD handset sessions |

---

## 3. Phone Call System (3CX)

### 3.1 Scope
- Inbound calls only (no IVR self-service in MVP)
- Human-assisted ordering — SpePas agents take orders verbally
- Up to 5–6 concurrent lines via "Phone Orders" agent group

### 3.2 Call Routing
- **Distribution:** Round-robin across available agents
- **No-answer:** 20–30 seconds, then advance to next agent; 90 seconds total before queue/voicemail
- **Queue experience:** Brief hold message; offer callback; send SMS: "Track/accept bids anytime via `*773727#`"
- **After-hours:** Voicemail + auto-SMS: "Sorry we missed you — reply with MAKE/MODEL + PART or call again"
- **Failover (no agents online):** Auto-SMS: "Sorry we missed you — reply with MAKE/MODEL + PART or call again"

### 3.3 Hours & SLAs
- **Operating hours (proposed):** Mon–Sat 08:00–17:00 GMT
- **Target wait time:** ≤ 60 seconds average
- **Metrics to track:** Calls received/answered, abandon rate, requests created, avg call duration
- **Quality:** Weekly QA on call recordings; coaching; track conversion (calls → accepted bids)

### 3.4 Recording & Logs
- All calls recorded for QA
- Store: call ID, timestamp, agent, duration
- Surface call logs in Admin Portal
- Mask phone numbers in shared views

---

## 4. Caller Flows (What the Agent Does)

### 4A. New Order (Phone → Admin Portal → USSD)

```
Caller phones in
    ↓
Agent answers (3CX)
    ↓
1. Identify caller
   - Capture phone number
   - Look up existing buyer profile (or create minimal profile)
    ↓
2. Vehicle basics
   - Year, Brand, Model
   - Simple prompts: "Diesel? Hybrid? 2WD/AWD/4x4?"
    ↓
3. Trim/drivetrain
   - Agent derives T code (0–9) from answers
    ↓
4. Parts & quantity
   - Caller describes parts in plain language
   - Agent maps each to catalog PPPP code and sets quantities
    ↓
5. Read-back
   - "You requested [Year Brand Model], parts: [list]. We'll collect bids and text you to review."
    ↓
6. Agent creates request in Admin Portal
   - One request per part type (not combined)
   - Source = Phone; attach call ID + agent ID
    ↓
7. System sends SMS to buyer:
   "SpePas: request R48291 created. Review bids via *773727# → My requests."
   + Link to see part images: https://spepas.com/R48291
    ↓
8. Seller bid flow triggers (same as USSD/web)
    ↓
9. When bids arrive, SMS to buyer:
   "SpePas: new bids for R48291. Dial *773727# → My bids to compare and accept."
```

### 4B. Check Status (Phone)
- Caller asks about an existing order
- Agent looks up open requests in Admin Portal, summarizes status verbally
- Nudge: "For full details or to accept a bid, dial `*773727#` → My requests / My bids"
- **PIN is never collected on the phone** — buyer accepts bids and checks out in USSD only

---

## 5. Part Code Schema (Internal — Admin Use Only)

10-digit numeric code: `YYMMMT-PPPP`

| Segment | Digits | Source |
|---------|--------|--------|
| **YY** | 2 | Last two digits of vehicle year |
| **MMM** | 3 | Model code (from Models lookup sheet) |
| **T** | 1 | Trim/drivetrain/fuel variant (0–9) |
| **PPPP** | 4 | Part code (from Parts lookup sheet) |

- Callers **never see or need** the code — the agent builds it using the Code Builder widget
- The Admin Portal assembles the code automatically and displays decoded text alongside it
- Example: `2310140500` = 2023 model 101, trim 4, part 0500

---

## 6. USSD Flow Specification (`*773727#`)

### 6.1 Navigation Conventions
- Enter a display number (1, 2, 3…) to select an option
- Enter `0` to go back / return to main menu
- Sessions are stateful — the system tracks position across menu selections
- Sessions identified by MSISDN (phone number); no explicit login step
- PIN required for sensitive actions (bid acceptance, checkout, withdrawal)

### 6.2 Main Menu

```
SpePas – dialled via *773727#

1 Buyer
2 Seller
3 Rider
4 GoPa
5 MePa
0 Exit
```

*Note: In production, the role selection screen would not appear — the system identifies the user's role by their registered phone number. The menu above is the prototype's testing scaffold.*

---

### 6.3 Buyer USSD Flow

#### Main Menu
```
SpePas ▸ Main menu

1 Create request
2 My requests
3 Cart
4 Deliveries
5 Contact us
0 Exit
```

#### Create Request Flow
```
Step 1: Enter part code
→ "Enter the 10-digit part code"
→ User enters code (e.g., 2310140500)

Step 2: Confirm part
→ "2023 Toyota Corolla spark plugs"
→ "1 Confirm  0 Back"

Step 3: Enter quantity
→ "2023 Toyota Corolla spark plugs"
→ "Quantity? (1-99)"

Step 4: Confirm with PIN
→ User enters 4-digit PIN

Step 5: Submitted
→ "Request submitted!"
→ "Tracking code R4821."
→ "We'll send an SMS when bids arrive."
→ "0 Back"
```

#### My Requests
```
My requests

1 R1001 Toyota Corolla spark plugs
2 R4821 Nissan Navara brake pads
3 R0999 Honda Civic radiator
0 Back
```

*Selecting a request shows its bids.*

#### Bid Detail (Accept Bid)
```
R4821 · 2023 Toyota Corolla SE spark plugs (2)
Price per unit GHS 118
Total cost GHS 236

Accept this bid?
Enter your 4-digit PIN to add it to your cart.

0 Back
```

#### Cart
```
Cart

1 2023 Toyota Corolla spark plugs (2) GHS 236
2 Honda Civic radiator (1) GHS 94
3 Nissan Navara brake pads (4) GHS 200
Subtotal: GHS 530
1 Check out  2 Remove item  0 Back
```

#### Delivery Option (during checkout)
```
Delivery option

1 Deliver items as soon as each is ready: GHS 40
2 One delivery within 24 hrs (save GHS 10): GHS 30
0 Back
```

#### Order Placed
```
Order placed!
Order code ORD2876.
Rider will pick up the items when they are ready.

Your delivery code: 7310
Give this code to the rider upon delivery.

0 Back
```

#### Deliveries
```
Deliveries

ORD2876: Spark plugs - Code 7310
ORD2880: Radiator - Code 7311

0 Back
```

#### Contact Us
```
Contact us
Call / WhatsApp +233 24 123 4567
Email info@spepas.com

0 Back
```

---

### 6.4 Seller USSD Flow

#### Main Menu
```
SpePas Seller ▸ Main menu

1 Open requests
2 My bids
3 Wallet
4 Contact us
0 Exit
```

#### Open Requests
- Browse all open requests, filter by car brand, or filter by part type
- Select a request → enter unit price → enter delivery date → confirm → bid submitted

#### My Bids
```
My bids

1 B9912: Toyota Corolla spark plugs (Pending)
2 B8871: Honda Civic radiator (Accepted)
3 B7766: Nissan Navara brake pads (Expired)
0 Back
```

*Selecting an accepted bid allows the seller to mark it as "Ready for Pickup" (PIN confirmation).*

---

### 6.5 Rider USSD Flow

#### Main Menu
```
SpePas Rider ▸ Main menu

1 New pickups
2 In progress deliveries
3 Completed deliveries
4 Wallet
5 Contact us
0 Exit
```

#### Pickup Detail
```
Spark plugs (2)

Seller
Auto Hub, 12 Spintex Rd, Accra
Landmark: opposite KFC, yellow gate
Phone 024 123 4567

Confirm pickup?

1 Yes
0 Back
```

#### In-Progress Deliveries
```
In-progress deliveries

1 Spark plugs (2) – 1 pickup location
0 Back
```

#### Delivery Detail
```
Buyer: Kwame Asante
Phone: +233 24 567 8901
Address: 5 Ring Rd West, Accra

Deliver now?

1 Yes
0 Back
```

#### Completed Deliveries
```
Completed deliveries

1 Spark plugs - Ring Rd West
0 Back
```

#### Wallet
- View: current balance, available balance, total earnings
- Withdraw: enter amount → confirm with PIN

---

### 6.6 GoPa USSD Flow

#### Main Menu
```
SpePas GoPa ▸ Main menu

1 Browse requests
2 Forwarded requests
3 Wallet
4 Contact us
0 Exit
```

- **Browse requests:** View unassigned buyer requests; forward to sellers in network
- **Forwarded requests:** Track requests already assigned to sellers

---

### 6.7 MePa USSD Flow

#### Main Menu
```
SpePas MePa ▸ Main menu

1 Create request
2 My requests
3 Cart
4 Wallet
5 Contact us
0 Exit
```

MePa flow mirrors the Buyer flow with these differences:
- **Cart shows payment status** per item: `(Paid)` or `(Pending payment)`
- **"Send reminder"** option in cart — MePa can nudge the end buyer to pay
- **Invoicing:** MePa creates the request on behalf of a customer; payment responsibility may be redirected to the customer's account

#### MePa Cart (showing payment status)
```
Cart

1 2023 Toyota Corolla spark plugs (2) GHS 236 (Paid)
2 Honda Civic radiator (1) GHS 94 (Pending payment)
3 Nissan Navara brake pads (4) GHS 200 (Paid)
Subtotal: GHS 530
1 Check out  2 Send reminder  0 Back
```

---

## 7. Admin Portal — Phone Order Requirements

### 7.1 Roles & Permissions

| Role | Capabilities |
|------|-------------|
| **Phone Order Agent** | Create requests, view bids, send buyer SMS; no payouts or buyer PIN actions |
| **Supervisor** | All agent capabilities + reporting, QA access to call recordings |

### 7.2 Features

| Feature | Description |
|---------|-------------|
| **Buyer lookup** | Search by phone; show prior requests, PIN status |
| **Code Builder widget** | Fields: Year, Brand, Model (MMM lookup), guided drivetrain/fuel prompts → T, Part search (PPPP). Auto-assemble `YYMMMT-PPPP`; display decoded text alongside |
| **Request composer** | Multiple line items (Part, Qty), optional notes to sellers, source = Phone. One request per part type |
| **SMS notifications** | One-click SMS to buyer with summary + USSD instructions |
| **Status screen** | View incoming bids (price per unit, total cost). Admins do NOT accept bids on buyer's behalf in MVP |
| **Audit & QA** | Show who created/edited; attach call ID and recording link |

### 7.3 Data Model Additions

| Field | Purpose |
|-------|---------|
| `request_source` | Phone / Web / USSD |
| `call_id` | Link to 3CX call recording |
| `agent_id` | Which agent created the request |
| `language_used` | Language of the call (for analytics) |
| `vehicle_plate` | Optional — for disambiguation |
| `vehicle_vin` | Optional — for disambiguation |
| `free_text_notes` | Agent notes from the call |

---

## 8. SMS Notification Templates

| Trigger | Message |
|---------|---------|
| Request created | `SpePas: request R48291 created. Review bids via *773727# → My requests.` |
| Bids arrive | `SpePas: new bids for R48291. Dial *773727# → My bids to compare and accept.` |
| Queue / missed call | `Track/accept bids anytime via *773727#.` |
| After-hours / no agents | `Sorry we missed you — reply with MAKE/MODEL + PART or call again.` |

---

## 9. Delivery Confirmation (USSD-Only Flow)

In the USSD flow, delivery confirmation uses a **numeric delivery code** instead of QR scanning:

1. At checkout, buyer receives a unique delivery code (e.g., `7310`)
2. The code is shown in the "Order placed" screen and in the "Deliveries" list
3. When the rider arrives, the buyer gives the code verbally
4. The rider enters the code via USSD to confirm delivery

This replaces the QR scan used in the web app.

---

## 10. Security & Privacy

- **PIN is never collected on phone calls** — all PIN-based actions happen in USSD only
- **PIN set/reset via USSD only**
- Limit access to call recordings; mask phone numbers in shared views
- Least-privilege roles; full audit trail on request edits
- Sessions identified by MSISDN — no separate login for USSD

---

## 11. Open Questions

| Question | Status |
|----------|--------|
| Final operating hours and callback SLA | Decide before launch |
| 3CX queue behavior when all lines are full | Investigate 3CX capabilities |
| 3CX after-hours auto-message capabilities | Investigate 3CX capabilities |
| Call recording storage and retention policy | Decide before launch |
| Agent onboarding plan (call scripts, training) | Needed before launch |
| Part images dependency (JA) for `spepas.com/R48291` links | Blocked on JA |
| Automated vs agent-triggered SMS after request creation | Clarify with engineering |

---

## 12. Feature × Channel Matrix

| Flow | Phone Call | USSD | Web App |
|------|-----------|------|---------|
| Place a part request | Agent creates on behalf of buyer | Buyer enters part code | Buyer self-service |
| View bids | Agent summarizes verbally (read-only) | Buyer selects and accepts (PIN) | Buyer self-service |
| Accept a bid / Add to cart | **Not allowed** (PIN required) | Buyer with PIN | Buyer self-service |
| Checkout / Payment | **Not allowed** (PIN required) | Buyer with PIN + MoMo | Buyer self-service |
| Submit a bid (Seller) | N/A | Seller via USSD | Seller via web |
| Mark ready for pickup (Seller) | N/A | Seller via USSD (PIN) | Seller via web |
| Accept pickup (Rider) | N/A | Rider via USSD | Rider via web |
| Confirm delivery (Rider) | N/A | Rider enters delivery code | QR scan (web) |
| Wallet / Withdrawal | N/A | Rider/Seller via USSD (PIN) | Web (if implemented) |
| Forward request (GoPa) | N/A | GoPa via USSD | GoPa via web |
| Create request for customer (MePa) | N/A | MePa via USSD | MePa via web |
