# SpePas — E2E Validation Test Plan

> **Created:** 2026-02-25 | **Updated:** 2026-02-25
> **Payment sandbox:** CalBank test sandbox for MoMo
> **Related docs:** [Admin Portal PRD](prd/admin-portal-prd.md) · [USSD & Phone Orders PRD](prd/ussd-and-phone-orders-prd.md) · [Product Overview](prd/spepas-overview.md)

---

## How to Use This Document

- Each task has a **clear goal**, **steps**, and **pass/fail criteria**.
- Tasks are ordered by priority — complete Phase 1A before moving to Phase 1B, etc.
- Credentials are in `.env.test.local` (gitignored). Ask Gaia or Ben if you don't have this file.
- If a task is **blocked** (feature not built yet), mark it blocked in ClickUp with the reason.

---

## Test Accounts

| Account | Env Var | Used For |
|---------|---------|----------|
| Multi-role (Web + USSD) | `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` | All buyer/seller/gopa/rider/mepa flows |
| Admin Portal | `TEST_ADMIN_EMAIL` / `TEST_ADMIN_PASSWORD` | Admin portal testing |
| MoMo sandbox | CalBank test wallet | Payment testing |

All credentials stored in `.env.test.local` (not checked into git).

---

## Core Flow (All Channels)

```
Buyer requests part → Sellers bid → Buyer accepts bid → Cart →
Checkout (MoMo) → Seller prepares → Rider picks up → Rider delivers
```

---

## Phase 1A — Admin Portal + Phone + USSD (MVP0 Happy Path)

> **Priority: Highest.** This is the primary ordering channel. Test this first.

### Admin Portal

| # | Task | What to Test | Pass Criteria |
|---|------|-------------|---------------|
| 0A | **Login & Dashboard** | Log in at `admin.spepas.com`. Verify dashboard loads with KPI cards and Quick Actions. Click through all 7 sidebar sections. | All pages render. No blank screens or JS errors. |
| 0B | **User Management** | Search for a buyer by name/phone in Buyers page. Browse Sellers, Riders, Mepa, Gopa lists. Test pagination and "Add" buttons. | Search returns results. Lists paginate. Add-user forms open. |
| 0C | **Call-In Order Wizard** | Open Call In Management → Calls Orders. Enter a phone number in Step 1. Walk through Steps 2–4 (Confirm Buyer → Order Details → Review & Submit). | 4-step wizard completes. Order appears in Active Requests. |
| 0D | **Order & Bid Monitoring** | Open Order Management → Active Requests. Search/filter requests. Click View on a request to see bid details. Click Assign to assign to a seller. | Requests searchable. Bids visible with pricing. Assign works. Admin cannot accept bids (MVP policy). |
| 0E | **Access Management** | Check Roles page for "Phone Order Agent" and "Supervisor" roles. Review Permissions (8), Groups (4), Applications (6). | Document whether MVP0 roles exist. If missing, flag as blocker. |
| 0F | **Inventory & Wallets** | Browse Categories, Manufacturers, Spare Parts. Check Wallets page (4 wallets). Open Settings → verify profile shows actual user data. | Data renders on inventory pages. Wallet balances display. |

### Phone Order + USSD Flow

| # | Task | What to Test | Pass Criteria |
|---|------|-------------|---------------|
| 1 | **Agent Creates Phone Order** | Agent takes a call, looks up buyer in admin portal, creates a request (part + qty + notes, source = Phone). | Request created. Buyer receives SMS with tracking code. Request visible in admin and via USSD. |
| 2 | **Seller Bids (USSD)** | Seller dials `*773727#` → Open requests → selects request → enters price + delivery date → confirms with PIN. | Bid created (status: Pending). Buyer gets SMS about new bids. |
| 3 | **Buyer Accepts Bid (USSD)** | Buyer dials `*773727#` → My requests → selects request → views bids → enters PIN to accept. | Bid added to cart. Seller bid status changes to Accepted. |
| 4 | **Buyer Checkout (USSD)** | Buyer → Cart → Check out → selects delivery option → MoMo payment (CalBank sandbox). | Order confirmation shows order code + delivery code. Invoice created. |
| 5 | **GOPA Assigns & Accepts Invoice** | GOPA dials `*773727#` → Browse requests → forwards to seller. After checkout, accepts invoice. | Request forwarded. Invoice accepted. Seller notified. |
| 6 | **Seller Marks Ready (USSD)** | Seller → My bids → selects accepted bid → marks "Ready for Pickup" → PIN. | Status → READY_TO_BE_PICKED. Visible in rider's New pickups. |
| 7 | **Rider Accepts Pickup (USSD)** | Rider dials `*773727#` → New pickups → selects seller → confirms. | Rider assigned. Item moves to In-progress deliveries. |
| 8 | **Rider Picks Up** | Rider goes to seller. Seller verifies rider. Rider collects part. | Status → SHIPPED. Item in rider's In-progress deliveries. |
| 9 | **Rider Delivers (Delivery Code)** | Rider → In-progress deliveries → selects delivery. Buyer gives delivery code verbally. Rider enters code in USSD. | Status → DELIVERED. Delivery in Completed deliveries. |
| 10 | **Rider Wallet** | Rider → Wallet → view balance → withdraw → enter amount → PIN. | Balance correct. Withdrawal processed. |
| 11 | **Wallet Settlement** | Check seller wallet (pending credit, 24hr hold). Check rider wallet. Verify amounts match order. | All wallets credited correctly. |

---

## Phase 1B — Phone/USSD Rejection Scenarios

| # | Task | What to Test | Pass Criteria |
|---|------|-------------|---------------|
| 12 | **No Bids Received** | Agent creates request. No seller bids. Buyer checks USSD. | Request shows "no bids" or appropriate status. Buyer not stuck. |
| 13 | **Buyer Ignores Bids** | Bids arrive. Buyer views but doesn't accept any. | Request stays open. No cart item created. |
| 14 | **Payment Failure** | Buyer checks out. MoMo fails (CalBank sandbox — insufficient funds). | Error shown. No invoice created. Buyer can retry. |
| 15 | **GOPA Rejects Invoice** | Buyer checks out. GOPA rejects invoice. | Invoice cancelled. Buyer notified via SMS. No orphaned records. |
| 16 | **Seller Can't Fulfill** | Invoice accepted. Seller can't fulfill (out of stock). | Order cancelled gracefully. Buyer notified. *(May not be implemented — document current state.)* |
| 17 | **Rider Declines Job** | Item ready for pickup. Rider doesn't accept. | Job stays in pool for other riders. |

---

## Phase 2A — Web App Happy Path (MVP1)

> **Web app:** `localhost:3001` (dev) or `spepas.com` (prod). All routes behind `/95668339501103956045/`.
> After login, user selects a role profile: BUYER, GOPA, MEPA, SELLER, or RIDER.

### Registration & Profiling

| # | Task | What to Test | Pass Criteria |
|---|------|-------------|---------------|
| 18 | **Buyer Sign Up & Profile** | Sign up → OTP → select BUYER profile → complete General Profile → add delivery address (My Addresses tab). | Account active. Profile saved. Address saved. |
| 19 | **Seller Sign Up & Profile** | Sign up → select SELLER → complete seller profiling (store name, location, GOPA ID, payment account). | Seller profiled and linked to GOPA. |
| 27 | **Rider Sign Up & Profile** | Sign up → select RIDER → complete rider profiling (vehicle type, licence). Verify rider pages load (Orders, Pickup, Drop-off). | Rider profiled. Rider-specific pages accessible. |

### Order Flow

| # | Task | What to Test | Pass Criteria |
|---|------|-------------|---------------|
| 20 | **Buyer Posts Request** | Post a Request page: select Manufacturer → Brand → Model → enter part name + qty + description → submit. Check My Requests → Active tab. | Request created and visible in Active tab. |
| 21 | **GOPA Assigns to Seller** | Log in as GOPA → Unassigned Requests → assign request to seller(s). Check Assigned Requests. | Request moves to assigned. Seller can see it. |
| 22 | **Seller Submits Bid** | Log in as SELLER → Bids page → submit bid (price + delivery date). | Bid created. Buyer can see it. |
| 23 | **Buyer Accepts Bid** | Log in as BUYER → My Requests → view bids → accept → verify item in Cart. | Item in cart with correct price. |
| 24 | **Buyer Checkout (MoMo)** | Cart → Checkout → select address → MoMo payment (CalBank sandbox). | Invoice created. Order confirmation shown. |
| 25 | **GOPA Accepts Invoice** | Log in as GOPA → view pending invoices → accept. | Invoice status updated. Seller notified. |
| 26 | **Seller Marks Ready** | Log in as SELLER → Invoices → mark item "Ready for Pickup". | Status → READY_TO_BE_PICKED. |
| 28 | **Rider Pickup & Deliver** | Log in as RIDER → Orders → accept job → Pickup → Scan QR → Drop-off → proof of delivery. | Status → SHIPPED → DELIVERED. Invoice closed. |
| 29 | **Wallet Settlement** | Seller and rider check wallet balances. Verify transaction amounts. | Wallets credited correctly. |

## Phase 2B — Web App Rejection Scenarios

| # | Task | What to Test | Pass Criteria |
|---|------|-------------|---------------|
| 30 | **Payment Failure** | Checkout → simulate MoMo failure. | Error shown. No invoice. Retry works. |
| 31 | **GOPA Rejects Invoice** | Checkout → GOPA rejects. | Invoice cancelled. Buyer notified. |
| 32 | **Buyer Cancels Order** | Checkout → buyer cancels before seller marks ready. | Invoice cancelled. Refund initiated. *(May not be implemented.)* |
| 33 | **Seller Can't Fulfill** | Invoice accepted → seller cancels. | Order cancelled. Buyer notified. *(May not be implemented.)* |
| 34 | **Rider Declines Job** | Item ready → rider doesn't accept. | Job stays in pool. |

---

## Phase 3 — Cross-Cutting

| # | Task | What to Test | Pass Criteria |
|---|------|-------------|---------------|
| 35 | **Role Switching** | Log in → select BUYER → Switch Profile → SELLER → GOPA → RIDER. Verify each role loads correct pages. | Each role shows correct nav. No stale data. |
| 36 | **Session & Auth** | Web: session persists across navigation. Admin: session works with sidebar clicks (breaks on direct URL nav). Test "Forgot password?" on both. | Sessions work. No stale auth states. |
| 37 | **Notifications** | Walk through happy path. At each step, verify buyer/seller/rider receive SMS (USSD) or in-app updates (web). | Document which notifications work vs missing. |
| 38 | **Contact & Support** | Submit Contact form (First Name, Last Name, Subject, Phone, Message). Open Chat page. Check Terms/Privacy links. | Form submits. Pages render. |
| 39 | **Shop & Vehicle Selector** | Shop page → select Year → Make → Model (cascading dropdowns). Verify parts display. | Dropdowns cascade correctly. Results display. |

---

## Summary

| Phase | Tasks | Channel | Priority |
|-------|-------|---------|----------|
| **1A** | 0A–0F, 1–11 | Admin + Phone + USSD | **Highest** — test first |
| **1B** | 12–17 | Phone + USSD | High |
| **2A** | 18–29 | Web App | Medium (can parallel with 1B) |
| **2B** | 30–34 | Web App | Lower |
| **3** | 35–39 | All | Last |

**Total: 45 tasks** (6 admin + 11 USSD + 6 USSD errors + 12 web + 5 web errors + 5 cross-cutting)

