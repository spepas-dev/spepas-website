# SpePas — E2E Validation Test Plan

> **Created:** 2026-02-25 | **Updated:** 2026-02-25
> **Context:** Engineering walkthrough (Joseph Boadi & Ben Kwame) + USSD prototype + phone order spec + Playwright inspection of admin.spepas.com and web app
> **Goal:** Validate every step of the core marketplace flow (happy path + rejection scenarios)
> **Payment sandbox:** CalBank test sandbox for MoMo payments
> **Prototype:** [v0 USSD Prototype](https://v0.app/chat/spe-pas-prototype-e22fV21yU0X)
> **USSD PRD:** [docs/prd/ussd-and-phone-orders-prd.md](prd/ussd-and-phone-orders-prd.md)

---

## Overview

SpePas operates through two channels, prioritized in this order:

1. **MVP0 — Phone Call + USSD:** Buyers place orders over a phone call with a SpePas agent. The agent enters the order into the system. Buyers, sellers, and riders then use USSD to track status, manage bids, and handle delivery. This is the primary channel and must work first.
2. **MVP1 — Web App:** The full self-service web experience at spepas.com. No mobile app is involved.

The core flow across both channels is:

```
Buyer requests part → Sellers bid → Buyer selects bid → Add to cart →
Checkout & payment (MoMo) → Seller prepares order → Rider picks up → Rider delivers
```

Each step below maps to a ClickUp task. Every step must be validated on the **happy path** first, then rejection/error scenarios tested separately.

---

## Test Accounts

### Multi-role account (Web + USSD)
- **Email:** `TEST_USER_EMAIL` (see `.env.test.local`)
- **Password:** `TEST_USER_PASSWORD` (see `.env.test.local`)
- Supports all profile types: Buyer, Seller, GOPA, Rider, MePa
- Use role switching (OTP) to test each flow with this single account

### Admin Portal
- **Email:** `TEST_ADMIN_EMAIL` (see `.env.test.local`)
- **Password:** `TEST_ADMIN_PASSWORD` (see `.env.test.local`)
- Required for: Phone Order Agent role, request creation, bid monitoring, QA/audit

### Payment
- CalBank sandbox MoMo — test wallet number from sandbox environment

---

## MVP0 — Phone Call + USSD System

This is the primary channel. Buyers call in to place orders; all participants use USSD for tracking and actions. The web app is used internally by agents/admins to enter orders.

### Phase 1A — Happy Path (Admin Portal + Phone Order + USSD)

#### Task 0A: Admin Portal — Login & Access Validation
**Precondition:** Admin account exists
**Steps:**
1. Navigate to admin.spepas.com
2. Log in with admin credentials
3. Verify dashboard loads (sales, signups, reviews analytics)
4. Verify navigation: Users, Orders, Bids, Spare Parts, Categories, Wallets, Groups

**Pass criteria:** Admin can log in and access all main sections. Dashboard renders without errors.

---

#### Task 0B: Admin Portal — Buyer Lookup
**Precondition:** Task 0A complete, test buyer account exists (see `.env.test.local`)
**Steps:**
1. Navigate to user management / buyer search
2. Search for buyer by phone number
3. Verify buyer profile displays: name, phone, email, prior requests, PIN status
4. Test creating a minimal buyer profile for a new phone number (simulating a first-time caller)

**Pass criteria:** Existing buyer found by phone. New minimal profile can be created. Prior requests visible.

---

#### Task 0C: Admin Portal — Code Builder & Request Creation
**Precondition:** Task 0B complete
**Steps:**
1. Open the Code Builder widget (or request creation form)
2. Select: Year → Brand → Model (verify MMM lookup populates)
3. Answer drivetrain/fuel prompts → verify T code derived correctly
4. Search for part → verify PPPP code found
5. Verify assembled code `YYMMMT-PPPP` displayed with decoded text alongside
6. Create request: part, quantity = 2, notes = "Test phone order", source = Phone
7. Verify request created successfully — check it appears in the orders/requests list
8. Verify SMS sent to buyer (or SMS trigger logged)

**Pass criteria:** Code Builder assembles correct 10-digit code. Request created with source = Phone. Decoded text matches the selected vehicle + part. Request visible in admin request list.

**Note:** If the Code Builder widget is not yet built, document what exists and what's missing.

---

#### Task 0D: Admin Portal — Bid Monitoring (Read-Only)
**Precondition:** Task 0C complete, at least one seller has submitted a bid
**Steps:**
1. Navigate to the request created in Task 0C
2. View incoming bids: verify price per unit, total cost displayed
3. Verify admin can see bid details but **cannot accept bids** on buyer's behalf (MVP policy)

**Pass criteria:** Bids visible to admin with pricing. No "accept bid" action available to admin.

---

#### Task 0E: Admin Portal — Roles & Permissions
**Precondition:** Task 0A complete
**Steps:**
1. Verify Phone Order Agent role exists (or document if it needs to be created)
2. Verify agent can: create requests, view bids, send buyer SMS
3. Verify agent **cannot**: access payouts, accept bids on behalf of buyer, manage user accounts
4. If Supervisor role exists, verify: all agent capabilities + reporting + QA access

**Pass criteria:** Role-based access enforced. Phone Order Agent has appropriate permissions only.

**Note:** If these roles don't exist yet, this becomes a blocker — document and create ClickUp task for Stephen.

---

#### Task 1: Phone Order — Agent Creates Request on Behalf of Buyer
**Precondition:** Buyer account exists (registered via web or phone intake), agent has Phone Order Agent role in Admin Portal, 3CX is configured
**Steps:**
1. Buyer calls SpePas phone line (3CX routes to available agent)
2. Agent looks up buyer by phone number in Admin Portal — verify buyer profile found (or create minimal profile)
3. Agent collects vehicle basics: year, brand, model + drivetrain/fuel prompts ("Diesel? Hybrid? 2WD/AWD/4x4?")
4. Agent uses Code Builder widget to assemble part code (`YYMMMT-PPPP`) — verify decoded text displays correctly
5. Agent creates request in Admin Portal: part, quantity, notes, source = Phone, call ID attached
6. System sends SMS to buyer: "SpePas: request R_____ created. Review bids via `*773727#` → My requests." + link to part images
7. Verify: one request per part type (not combined)

**Pass criteria:** OrderRequest created with source = Phone, linked to buyer and agent. Buyer can see the request via USSD (`*773727#` → My requests). SMS received. Call ID logged in Admin Portal.

---

#### Task 2: USSD Seller — Browse Requests & Submit Bid
**Precondition:** Task 1 complete, seller account profiled
**Steps:**
1. Seller dials `*773727#` → Seller menu
2. Verify main menu: `1 Open requests  2 My bids  3 Wallet  4 Contact us  0 Exit`
3. Select `1 Open requests` → browse all / filter by car brand / filter by part type
4. Select the test request → enter unit price → enter delivery date → confirm with PIN
5. Verify bid appears in `2 My bids` with status `(Pending)`

**Pass criteria:** Bid created with status Pending. Buyer receives SMS: "New bids for R_____. Dial `*773727#` → My bids to compare and accept." Bid visible in seller's "My bids" list.

---

#### Task 3: USSD Buyer — View Bids & Accept
**Precondition:** Task 2 complete (at least one bid exists)
**Steps:**
1. Buyer dials `*773727#` → Buyer menu
2. Verify main menu: `1 Create request  2 My requests  3 Cart  4 Deliveries  5 Contact us  0 Exit`
3. Select `2 My requests` → verify request list shows (e.g., "R4821 Nissan Navara brake pads")
4. Select request → view bids list
5. Select a bid → verify bid detail screen shows: part name, quantity, price per unit, total cost
6. Enter 4-digit PIN to accept bid and add to cart

**Pass criteria:** Bid added to buyer's cart. Cart shows item with price. Seller bid status changes to `(Accepted)`.

---

#### Task 4: USSD Buyer — Checkout & Payment (MoMo)
**Precondition:** Task 3 complete
**Steps:**
1. USSD → `3 Cart` → verify cart shows items with subtotal (e.g., "Subtotal: GHS 530")
2. Select `1 Check out`
3. Verify delivery option screen: "1 Deliver items as soon as each is ready: GHS 40" / "2 One delivery within 24 hrs (save GHS 10): GHS 30"
4. Select delivery option
5. MoMo payment prompt sent to buyer's phone
6. Buyer approves payment (CalBank sandbox)
7. Verify order confirmation shows: order code (e.g., ORD2876) + **delivery code** (e.g., 7310)

**Pass criteria:** Invoice created. Buyer sees "Order placed! Order code ORD____. Your delivery code: ____. Give this code to the rider upon delivery." Delivery code is the USSD equivalent of QR scanning.

---

#### Task 5: GOPA — Assign Request & Accept Invoice
**Precondition:** Task 4 complete (if GOPA is involved in the flow)
**Steps:**
1. GOPA dials `*773727#` → GoPa menu
2. Verify main menu: `1 Browse requests  2 Forwarded requests  3 Wallet  4 Contact us  0 Exit`
3. Select `1 Browse requests` → locate unassigned request
4. Forward request to seller(s) in network
5. After checkout, review and accept the invoice

**Pass criteria:** Invoice accepted. Seller notified to prepare order. Request appears in `2 Forwarded requests`.

---

#### Task 6: USSD Seller — Mark Item Ready for Pickup
**Precondition:** Task 5 complete (invoice accepted)
**Steps:**
1. Seller dials `*773727#` → `2 My bids`
2. Locate the accepted bid (status should show `(Accepted)`)
3. Select item → mark as "Ready for Pickup" → confirm with PIN

**Pass criteria:** Invoice item status → READY_TO_BE_PICKED. Item visible in rider's `1 New pickups` list.

---

#### Task 7: USSD Rider — Accept Pickup Job
**Precondition:** Task 6 complete, rider account profiled
**Steps:**
1. Rider dials `*773727#` → Rider menu
2. Verify main menu: `1 New pickups  2 In progress deliveries  3 Completed deliveries  4 Wallet  5 Contact us  0 Exit`
3. Select `1 New pickups` → browse list of sellers with items ready
4. Select seller → verify pickup detail shows: seller name, address, landmark, phone number
5. Confirm pickup (`1 Yes`)

**Pass criteria:** Rider assigned to the pickup job. Item moves from `1 New pickups` to `2 In progress deliveries`.

---

#### Task 8: Rider — Pick Up from Seller
**Precondition:** Task 7 complete
**Steps:**
1. Rider navigates to seller location (using address + landmark from pickup detail)
2. Seller verifies rider identity
3. Handshake — rider collects the part
4. Rider confirms pickup via USSD (already done in Task 7 acceptance, or additional confirmation step)

**Pass criteria:** Invoice item status → SHIPPED / in-transit. Item visible in rider's `2 In progress deliveries`.

---

#### Task 9: Rider — Deliver to Buyer (Delivery Code Confirmation)
**Precondition:** Task 8 complete
**Steps:**
1. Rider selects delivery from `2 In progress deliveries`
2. Verify delivery detail shows: buyer name, phone, address
3. Rider navigates to buyer's address
4. **Buyer gives the delivery code verbally** (the code received at checkout, e.g., 7310)
5. Rider enters delivery code via USSD to confirm delivery (`1 Yes`)

**Pass criteria:** Invoice item status → DELIVERED. Invoice closed. Delivery moves to `3 Completed deliveries`.

---

#### Task 10: USSD Rider — Wallet Balance & Withdrawal
**Precondition:** Task 9 complete
**Steps:**
1. Rider dials USSD → Wallet
2. View balance: current balance, available balance, total earnings
3. Select Withdraw → enter amount → confirm with PIN

**Pass criteria:** Wallet shows correct balance post-delivery. Withdrawal request processed.

---

#### Task 11: Post-Delivery — Wallet Settlement (All Roles)
**Precondition:** Task 9 complete
**Steps:**
1. Check seller wallet (USSD or system) — should show pending credit (24-hour hold)
2. Check rider wallet (USSD) — should show credit
3. Verify transaction records match the order amounts

**Pass criteria:** Wallets credited correctly. Transaction history accurate.

---

### Phase 1B — Rejection & Error Scenarios (Phone/USSD)

#### Task 12: No Bids Received on Phone Order
**Steps:**
1. Agent creates request on behalf of buyer
2. No seller submits a bid
3. Verify buyer can check status via USSD and sees "no bids" or similar

**Pass criteria:** Buyer is not stuck. Request shows appropriate status.

---

#### Task 13: Buyer Rejects All Bids (USSD)
**Steps:**
1. Bids come in on a request
2. Buyer views bids via USSD but does not select any
3. Verify request remains open or can be closed

**Pass criteria:** No cart item created. Request lifecycle is clean.

---

#### Task 14: Payment Failure (USSD Checkout)
**Steps:**
1. Buyer checks out via USSD
2. MoMo payment fails (simulate via CalBank sandbox — insufficient funds, timeout)
3. Verify error messaging via USSD
4. Verify buyer can retry

**Pass criteria:** No invoice created for failed payment. Buyer can retry checkout.

---

#### Task 15: GOPA Rejects Invoice
**Steps:**
1. Buyer checks out, invoice created
2. GOPA reviews and REJECTS the invoice
3. Verify: buyer notification (SMS/USSD), seller notification, invoice status

**Pass criteria:** Invoice marked rejected/cancelled. Buyer notified. No orphaned records.

---

#### Task 16: Seller Cannot Fulfill After Invoice Accepted
**Steps:**
1. Invoice accepted, seller expected to prepare order
2. Seller cannot fulfill (out of stock, wrong part)
3. Verify cancellation or reassignment path

**Pass criteria:** Order handled gracefully. Buyer notified.

**Note:** This flow may not be implemented — document current state.

---

#### Task 17: Rider Declines Pickup Job (USSD)
**Steps:**
1. Item marked ready for pickup
2. Rider views the job via USSD but does NOT accept
3. Verify job remains in the available pool for other riders

**Pass criteria:** Job stays available. No rider incorrectly assigned.

---

---

## MVP1 — Web App

Self-service web experience. Builds on the same backend as MVP0 but with the full UI at spepas.com.

### Phase 2A — Happy Path (Web App)

#### Task 18: Buyer — Sign Up, Activate & Profile (Web)
**Precondition:** None
**Steps:**
1. Register a new buyer account (phone + email + password)
2. Receive OTP and activate account
3. Complete buyer profiling (name, contact info)
4. Add a delivery address (with map location picker)

**Pass criteria:** Account is active, profiled, and has a saved delivery address.

---

#### Task 19: Seller — Sign Up, Activate & Profile (Web)
**Precondition:** GOPA account exists
**Steps:**
1. Register a new seller account
2. Activate via OTP
3. Complete seller profiling (store name, location, GOPA ID, payment account)

**Pass criteria:** Seller account is active, profiled, and linked to a GOPA.

---

#### Task 20: Buyer — Post a Part Request (Web)
**Precondition:** Task 18 complete
**Steps:**
1. Log in as buyer
2. Navigate to "Post a Request"
3. Select car make / model / year
4. Enter part description, quantity, and attach photo (if supported)
5. Submit request

**Pass criteria:** OrderRequest created with status visible in buyer's request list. Request appears in seller/GOPA views.

---

#### Task 21: GOPA — Assign Request to Seller(s) (Web)
**Precondition:** Task 20 complete
**Steps:**
1. Log in as GOPA
2. View unassigned buyer requests
3. Locate the test request
4. Assign to one or more sellers in the GOPA's network

**Pass criteria:** Request assigned; seller(s) can see it in their queue.

---

#### Task 22: Seller — Submit a Bid (Web)
**Precondition:** Task 21 complete
**Steps:**
1. Log in as seller
2. View assigned requests
3. Submit a bid: unit price, expected delivery date, optional photo

**Pass criteria:** Bidding record created. Buyer can see it in bid list.

---

#### Task 23: Buyer — Review Bids & Add to Cart (Web)
**Precondition:** Task 22 complete
**Steps:**
1. Log in as buyer
2. View bids on the test request
3. Select the preferred bid
4. Add to cart

**Pass criteria:** Cart contains the bid. Cart total reflects bid price.

---

#### Task 24: Buyer — Checkout & Payment (Web, MoMo via CalBank Sandbox)
**Precondition:** Task 23 complete
**Steps:**
1. Open cart
2. Select delivery address (or add new)
3. Proceed to checkout
4. Enter MoMo wallet number and network
5. Confirm payment (approve MoMo prompt via sandbox)

**Pass criteria:** Invoice created with status PENDING. Payment recorded. Buyer sees order confirmation.

---

#### Task 25: GOPA — Accept Invoice (Web)
**Precondition:** Task 24 complete
**Steps:**
1. Log in as GOPA
2. View pending invoices → open test invoice
3. Review details and accept

**Pass criteria:** Invoice status updated. Seller notified to prepare order.

---

#### Task 26: Seller — Mark Order Ready for Pickup (Web)
**Precondition:** Task 25 complete
**Steps:**
1. Log in as seller
2. View active orders → locate test order
3. Mark item as "Ready for Pickup"

**Pass criteria:** Invoice item status → READY_TO_BE_PICKED. Visible in rider's pickup jobs.

---

#### Task 27: Rider — Sign Up, Activate & Profile (Web)
**Precondition:** None (can run in parallel)
**Steps:**
1. Register a new rider account
2. Activate via OTP
3. Complete rider profiling (name, vehicle type, licence number)

**Pass criteria:** Rider account is active and profiled.

---

#### Task 28: Rider — Accept Pickup, Pick Up & Deliver (Web)
**Precondition:** Tasks 26 and 27 complete
**Steps:**
1. Log in as rider → view available pickup jobs
2. Accept the job → verify seller address on map
3. Navigate to seller → seller verifies rider → rider scans QR to confirm pickup
4. Navigate to buyer → buyer scans rider's QR to confirm delivery
5. Rider uploads proof-of-delivery photo

**Pass criteria:** Invoice item status → SHIPPED → DELIVERED. Invoice closed.

**Known gap:** QR scanning is placeholder only. Photo upload may not be wired to backend.

---

#### Task 29: Post-Delivery — Wallet Settlement (Web)
**Precondition:** Task 28 complete
**Steps:**
1. Seller checks wallet balance (web) — should show pending credit
2. Rider checks wallet balance (web) — should show credit
3. Verify transaction records

**Pass criteria:** Wallets credited correctly. Transaction history accurate.

---

### Phase 2B — Rejection & Error Scenarios (Web)

#### Task 30: Buyer — Payment Failure (Web)
**Steps:**
1. Buyer proceeds to checkout on web
2. Simulate payment failure via CalBank sandbox
3. Verify error messaging and ability to retry

**Pass criteria:** Clear error shown. No invoice for failed payment. Retry works.

---

#### Task 31: GOPA — Reject Invoice (Web)
**Steps:**
1. Complete flow through checkout
2. GOPA rejects the invoice
3. Verify buyer/seller notifications and invoice status

**Pass criteria:** Invoice cancelled/rejected. Buyer notified. No orphaned records.

---

#### Task 32: Buyer — Cancel Order After Checkout (Web)
**Steps:**
1. Buyer checks out → invoice created
2. Buyer requests cancellation before seller marks ready
3. Verify cancellation flow and refund handling

**Pass criteria:** Invoice → CANCELLED. Notifications sent. Refund initiated.

**Note:** Cancellation flow may not be implemented — document current state.

---

#### Task 33: Seller — Unable to Fulfill (Web)
**Steps:**
1. Invoice accepted by GOPA
2. Seller cannot fulfill → cancels or rejects
3. Verify buyer notification and order handling

**Pass criteria:** Order cleanly cancelled. Buyer notified.

**Note:** May not be implemented — document current state.

---

#### Task 34: Rider — Decline Pickup Job (Web)
**Steps:**
1. Item ready for pickup
2. Rider views job but does not accept
3. Verify job remains available for other riders

**Pass criteria:** Job stays in the pool. No incorrect assignment.

---

### Phase 3 — Cross-Cutting Concerns

#### Task 35: Role Switching (OTP Verification)
**Steps:**
1. Log in with multi-role account (e.g., Buyer + Seller)
2. Switch roles → verify OTP required
3. Complete OTP → verify role-specific views load

**Pass criteria:** Role switch works with OTP. UI updates correctly.

---

#### Task 36: Session & Auth Validation
**Steps:**
1. Log in → verify session cookie set
2. Test inactivity timeout (2-hour auto-logout)
3. Test refresh token flow

**Pass criteria:** Session management works. No stale auth states.

---

#### Task 37: Notifications & Status Updates (All Channels)
**Steps:**
1. Walk through the happy path and at each transition verify:
   - Buyer receives updates (SMS for USSD users, in-app for web)
   - Seller receives updates
   - Rider receives updates
2. Document which notifications work vs. are not yet implemented

**Pass criteria:** All implemented notification paths documented and validated.

**Known gap:** Push notifications and real-time WebSocket updates are partially implemented.

---

## Summary

| Phase | Tasks | Channel | Description |
|-------|-------|---------|-------------|
| Phase 1A | Tasks 0A–0E, 1–11 | Admin Portal + Phone + USSD | **MVP0 happy path** — admin portal validation, phone order intake, USSD tracking/actions |
| Phase 1B | Tasks 12–17 | Phone + USSD | MVP0 rejection & error scenarios |
| Phase 2A | Tasks 18–29 | Web App | MVP1 happy path — full self-service web flow |
| Phase 2B | Tasks 30–34 | Web App | MVP1 rejection & error scenarios |
| Phase 3 | Tasks 35–37 | All | Cross-cutting concerns |

**Total tasks:** 42 (5 admin portal + 11 phone/USSD + 6 rejection + 12 web + 5 web rejection + 3 cross-cutting)

### Priority Order
1. **Phase 1A first** — Admin Portal validation (0A–0E), then phone + USSD happy path. The admin portal is the tool agents use to create phone orders, so it must work before the phone order flow can be tested.
2. **Phase 1B next** — rejection scenarios for the primary channel
3. **Phase 2A** — web app happy path (can begin in parallel with Phase 1B if different testers)
4. **Phase 2B** — web app rejection scenarios
5. **Phase 3 last** — cross-cutting validation

### Open Questions for Engineering
- ~~How does pickup/delivery confirmation work in the USSD-only flow?~~ **Answered:** Buyer receives a numeric delivery code at checkout; rider enters code via USSD to confirm delivery.
- ~~Does the GOPA use the web app or a separate tool for MVP0?~~ **Answered:** GoPa has a USSD flow (`*773727#` → GoPa: Browse requests, Forwarded requests, Wallet).
- ~~What is the phone order intake process?~~ **Answered:** Agent uses the Admin Portal (Code Builder widget + Request Composer) to create requests on behalf of callers. See [USSD & Phone Orders PRD](prd/ussd-and-phone-orders-prd.md).
- ~~Is there an SMS notification system?~~ **Answered:** SMS sent at request creation and when bids arrive. Templates defined in PRD.
- **NEW:** Does the rider need to enter the buyer's delivery code via USSD, or is there a separate confirmation mechanism?
- **NEW:** What are the final 3CX operating hours and callback SLA?
- **NEW:** Is the Admin Portal Phone Order Agent role implemented, or does it need to be built? (Tasks for Stephen)
- **NEW:** Part images on `spepas.com/R_____` links — blocked on JA. What's the timeline?

### Known Implementation Gaps (from PRD gap analysis)
These may surface as blockers during testing:
- QR code scanning: placeholder UI only, camera/QR library not integrated
- Live MoMo payment: UI scaffolded, live gateway not connected (use CalBank sandbox)
- Push notifications: not implemented end-to-end
- Real-time WebSocket updates: Socket.IO in gateway but frontend not connected
- Seller rating / rider rating: no UI or endpoint wired
- Delivery proof photo upload: UI exists but not wired to backend
- Order cancellation: flow described but no implementation confirmed
