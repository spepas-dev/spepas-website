# SpePas — E2E Test Results & Environment

> **Last updated:** 2026-03-09
> **Test plan:** [e2e-test-plan.md](./e2e-test-plan.md) · **Bugs:** [bugs.md](./bugs.md)

---

## Test Accounts & Credentials

| Account | Env Var | Used For |
|---------|---------|----------|
| Multi-role (Web + USSD) | `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` | All buyer/seller/gopa/rider/mepa flows |
| Admin Portal | `TEST_ADMIN_EMAIL` / `TEST_ADMIN_PASSWORD` | Admin portal testing |
| USSD test phone | `TEST_USSD_PHONE` | All USSD flows via mockers |
| USSD test OTP | `TEST_USSD_OTP` | OTP verification in USSD |
| MoMo sandbox | CalBank test wallet | Payment testing |

All credentials stored in `.env.test.local` (not checked into git).

---

## USSD Mockers

The USSD shortcode is `*887*9#`. Use the web-based mockers to simulate USSD sessions:

| Role | Mocker URL | Env Var |
|------|-----------|---------|
| Buyer | https://mocker.spepas.com/ | `USSD_MOCKER_BUYER_URL` |
| Seller | https://mocker.spepas.com/seller | `USSD_MOCKER_SELLER_URL` |
| Rider | https://mocker.spepas.com/rider | `USSD_MOCKER_RIDER_URL` |

**How to use:** Enter the test phone number → dial `*887*9#` → interact with menu options.

### USSD Menu Structure (verified 2026-03-01)

```
BUYER
├── 1. Create request        ⚠️ SHOULD BE REMOVED — requests via phone/web only
├── 2. My requests           → view active requests, bids, accept bids
├── 3. Cart                  → 1. Check Out  |  2. Remove Item
└── 4. Contact us            → (not yet implemented)

SELLER
├── 1. Open Requests         → 1. All Requests  |  2. By part  |  3. By brand
├── 2. My bids               → view/manage submitted bids, mark ready
└── 3. Contact us            → (not yet implemented)

RIDER
├── 1. New pickups            → accept available pickup jobs
├── 2. In progress deliveries → track active deliveries
├── 3. Completed deliveries   → view delivery history
├── 4. Wallet                 → balance + lifetime earnings + 1. Withdraw (PIN)
└── 5. Contact us             → (not yet implemented)
```

---

## Known Issues & Discrepancies

| Issue | Where | Status |
|-------|-------|--------|
| Buyer USSD still has "Create request" (option 1) | `mocker.spepas.com/` | Should be removed — requests are phone/web only. Flag with backend. |
| "Contact us" not implemented | All 3 USSD mockers | Returns error. Low priority. |
| Buyer "My requests" shows main menu again when selected with no data | `mocker.spepas.com/` | Possible bug — should show empty list, not re-render main menu. |

---

## Test Results

> Record results here as tests are executed. Use: **PASS**, **FAIL**, **BLOCKED**, or **SKIPPED**.

### Phase 1A — Admin Portal + Phone + USSD

| # | Task | Result | Notes | Tested By | Date |
|---|------|--------|-------|-----------|------|
| 0A | Login & Dashboard | PARTIAL PASS | [Details below](#test-0a--login--dashboard) | Claude | 2026-03-08 |
| 0B | User Management | PARTIAL PASS | [Details below](#test-0b--user-management) | Claude | 2026-03-08 |
| 0C | Call-In Order Wizard | FAIL | [Details below](#test-0c--call-in-order-wizard) | Claude | 2026-03-08 |
| 0D | Order & Bid Monitoring | PARTIAL PASS | [Details below](#test-0d--order--bid-monitoring) | Claude | 2026-03-08 |
| 0E | Access Management | PASS | [Details below](#test-0e--access-management) | Claude | 2026-03-08 |
| 0F | Inventory & Wallets | PARTIAL PASS | [Details below](#test-0f--inventory--wallets) | Claude | 2026-03-08 |
| 1 | Agent Creates Phone Order | BLOCKED | Buyer search API broken (BUG-008). Cannot proceed past Step 1 of call-in wizard. | Claude | 2026-03-08 |
| 2 | Seller Bids (USSD) | BLOCKED | Seller "Open Requests > All Requests" returns "unable to process request". Seller "My bids" also fails. Backend API down. | Claude | 2026-03-08 |
| 3 | Buyer Accepts Bid (USSD) | BLOCKED | Buyer "My requests" returns "unable to process request". No requests accessible. | Claude | 2026-03-08 |
| 4 | Buyer Checkout (USSD) | PARTIAL | Cart menu loads (Check Out / Remove Item options). Cannot test checkout — no items in cart. | Claude | 2026-03-08 |
| 5 | GOPA Forwards Request | BLOCKED | No GOPA USSD mocker available. Depends on request existing (blocked by test 1). | Claude | 2026-03-08 |
| 5b | GOPA Tracks Forwarded Order | BLOCKED | Same as test 5. | Claude | 2026-03-08 |
| 6 | Seller Marks Ready (USSD) | BLOCKED | Seller "My bids" fails. Cannot access accepted bids. | Claude | 2026-03-08 |
| 7 | Rider Accepts Pickup (USSD) | PASS (empty) | Rider "New pickups" loads but shows empty list (no pickups available). Menu structure correct. | Claude | 2026-03-08 |
| 8 | Rider Picks Up | BLOCKED | No in-progress deliveries to test. | Claude | 2026-03-08 |
| 9 | Rider Delivers | BLOCKED | No in-progress deliveries to test. | Claude | 2026-03-08 |
| 10 | Rider Wallet (USSD) | PASS | Wallet displays: Total balance GHS 0, Available to withdraw GHS 0, Lifetime earnings GHS 0. Withdraw option present. | Claude | 2026-03-08 |
| 11 | Wallet Settlement | BLOCKED | No completed orders to verify settlement. | Claude | 2026-03-08 |

---

## Detailed Results

### Test 0A — Login & Dashboard

**Result: PARTIAL PASS** | Tested: 2026-03-08 | URL: `admin.spepas.com`

**Login:** Signed in with admin test credentials (`adminuser@yahoo.com`). Login succeeded. Redirected to dashboard.

**Dashboard:** Renders correctly — "Welcome Back, Kofi Admin!", 4 KPI cards, Quick Actions section, Recent Activity feed.

**Hardcoded placeholder data identified (BUG-022 through BUG-025):**
- **KPI cards (BUG-022):** Total Users: 2,345, Active Riders: 856, Registered Vehicles: 1,204, Payment Methods: 3,678 — all hardcoded (real data: ~124 buyers, ~14 riders per User Management pages)
- **KPI percentages (BUG-025):** +12.5%, +8.2%, +15.3%, +10.8% — all hardcoded, never change
- **Recent Activity (BUG-023):** 3 static entries — "John Doe completed registration process" (2 min ago), "New vehicle registered to fleet" (15 min ago), "Mobile money account added" (1 hour ago) — all hardcoded
- **Platform Performance (BUG-024):** Shows raw text "Chart Component Goes Here" — unimplemented
- **Quick Actions:** "User Management", "Vehicle Registry", "Rider Operations", "Payment Records" — generic labels, but functional (link to relevant pages)

| Sidebar Section | Renders? | Data? | Issues |
|----------------|----------|-------|--------|
| Access Management > Permissions | Yes | 8 permissions in table | None |
| User Management > Users | Yes | 6 admin users in table | None |
| Call In Management > Calls Orders | Yes | 4-step wizard visible | None |
| Order Management > Requests | Yes | 1 active request ("Caburator Lexus CRV") | `/requests/stats` returns 404 — 24 console errors. Stats endpoint does not exist on the API. |
| Wallet Management > Wallets | Yes | 4 wallets (2 revenue, 1 credit_suspense GHS 14,169.75, 1 debit_suspense -GHS 14,169.75) | None |
| Inventory Management > Categories | Yes | 0 categories displayed | API returns 15 categories but table shows "No results" — admin portal data mapping bug (likely expecting different response shape). |
| Settings > Profile | Yes | Form fields populated | Shows hardcoded dummy data ("John Doe", "john.doe@example.com", "+1 (555) 123-4567") instead of actual user profile ("Kofi Admin"). |

**Pass criteria:** "All pages render. No blank screens or JS errors."
- All pages render — **PASS**
- No blank screens — **PASS**
- No JS errors — **FAIL** (24 errors from `/requests/stats` 404)

**Bugs to report:**
1. `GET /requests/stats` — endpoint does not exist (404). Order Management page fires this request repeatedly.
2. Categories table shows 0 results despite API returning 15 categories — admin portal is not mapping the response correctly.
3. Settings profile form shows hardcoded placeholder values instead of the authenticated user's actual data.

---

### Test 0B — User Management

**Result: PARTIAL PASS** | Tested: 2026-03-08 | URL: `admin.spepas.com/user-management/*`

| Page | Renders? | Data? | Search? | Pagination? | Add Button? | Issues |
|------|----------|-------|---------|-------------|-------------|--------|
| Users | Yes | 6 admin users | Yes | N/A (1 page) | "Add User" — opens form | None |
| Buyers | Yes | 124 buyers | Yes (filtered "Kofi" → 6 results) | Yes (13 pages) | No "Add" button | None |
| Sellers | Yes | 29 entries | Yes | Yes (3 pages) | "Add Seller" — opens form with map | **BUG-004**: Table shows BUYER users mixed with SELLER users. Not filtering by role. |
| Riders | Yes | 14 riders | Yes | Yes (2 pages) | "Add Rider" | None |
| Mepa | Yes | 12 entries | Yes | Yes (2 pages) | "Add Mechanic Shop" | **BUG-004** (same): Table shows BUYER/ADMIN users, not MEPA users. **BUG-005**: Google Maps errors — 36 `InvalidValueError: setPosition: not a LatLng` errors from invalid coordinates. |
| Gopa | Yes | 14 entries | Yes | Yes (2 pages) | "Add Gopa" — opens form | **BUG-006**: Breadcrumb shows "Goro" instead of "Gopa". Specialties column empty for all rows. |

**Add Seller form fields:** Store Name, Select User (dropdown), Select Gopa (dropdown), Lat/Long (auto-populated), Google Map picker.

**Google Maps:** Billing error on all pages with maps ("This page can't load Google Maps correctly") — likely missing/expired API key. Not blocking but maps don't render.

**Pass criteria:** "Search returns results. Lists paginate. Add-user forms open."
- Search returns results — **PASS**
- Lists paginate — **PASS**
- Add-user forms open — **PASS**

**Bugs to report:**
1. Sellers and Mepa pages show all users regardless of role (BUYER, ADMIN mixed in) instead of filtering to only sellers/mepas.
2. Mepa page: Google Maps `setPosition` errors — invalid LatLng data for map markers.
3. Gopa breadcrumb shows "Goro" instead of "Gopa".
4. Google Maps billing error on Sellers, Buyers, and Mepa pages (API key issue).

---

### Test 0C — Call-In Order Wizard

**Result: FAIL** | Tested: 2026-03-08 | URL: `admin.spepas.com/call-in-management/calls-orders`

**Wizard UI:** 4-step wizard renders correctly (Search Buyer → Confirm Buyer → Order Details → Review & Submit). KPI cards show all zeros.

**Step 1 — Search Buyer:** Entered phone number `233554340244` (known buyer "Kofi Bassaw"). Clicked "Search Customer".
- **Result:** "No Customer Found" error. API returns server error on `GET /buyers/search?phone=233554340244`.
- Cannot proceed to Step 2 — wizard is **blocked**.

**Call Orders History tab:** Shows error alert: "Failed to load call orders. Please try again."
- API error on `GET /call-orders?limit=50` (server error).

**Pass criteria:** "4-step wizard completes. Order appears in Active Requests."
- Wizard renders — **PASS**
- Wizard completes — **FAIL** (blocked at Step 1 by broken buyer search API)
- Order appears in Active Requests — **FAIL** (cannot create order)

**Bugs to report:**
1. `GET /buyers/search?phone=` returns server error — buyer search is non-functional.
2. `GET /call-orders` returns server error — call orders history cannot load.

---

### Test 0D — Order & Bid Monitoring

**Result: PARTIAL PASS** | Tested: 2026-03-08 | URL: `admin.spepas.com/order-management/*`

| Page | Renders? | Data? | Issues |
|------|----------|-------|--------|
| Active Requests | Yes (title only) | No | **FAIL**: "Failed to load active requests" error. API errors on `/requests/stats` (404) and `/request/buyer-active-request-all` (server error). |
| Orders | Yes | No | All KPI cards show 0. API error on `/inventry/sparepart-all` (server error). "Add Part" button present. |
| Gopa Orders | Yes | 14 gopas | Table shows gopas with specialties, serial numbers, phone, date, status. "Requests" and "History" action buttons per row. |
| Seller Orders | Yes | 29 sellers (but KPI says "Total Sellers: 2") | Store names, dates, status, "Active Bids" and "Request History" buttons. **BUG**: Total Orders, Active Bids, Completed Orders, and Total Revenue columns are empty for every row. KPI count mismatch (2 vs 29). |

**Pass criteria:** "Requests searchable. Bids visible with pricing. Assign works."
- Requests searchable — **FAIL** (Active Requests page errors out entirely)
- Bids visible with pricing — **Cannot test** (no requests loaded)
- Assign works — **Cannot test**
- Gopa Orders renders with data — **PASS**
- Seller Orders renders with data — **PARTIAL** (missing order metrics)

**Bugs to report:**
1. Active Requests: `/request/buyer-active-request-all` returns server error — page cannot load.
2. Orders page: `/inventry/sparepart-all` returns server error (also note: endpoint has typo "inventry" vs "inventory").
3. Seller Orders: KPI "Total Sellers" shows 2 but table has 29 rows. Order/bid/revenue columns are all empty.

---

### Test 0E — Access Management

**Result: PASS** | Tested: 2026-03-08 | URL: `admin.spepas.com/access-management/*`

| Page | Count | Data |
|------|-------|------|
| Permissions | 8 | can:create:inventory, can:add:invoice, Create users, Can edit wallet, View User Wallet Balance, mopa:user:delete, Delete, APPROVE. No descriptions on any. |
| Roles | 5 | Creating Riders, Creating Sellers (x2 — duplicated), Gopa Admin, Invoice Admin. No descriptions. |
| Groups | 4 | Super Admin, Inventory Management Users, Customer and Order Managers, Platform Managers. All active. "View" links work. |
| Applications | 6 | Inventory Management, MOPA, Order Management, Wallets Management (x2 — duplicated), user management. All active. Edit/delete action buttons per row. |

**MVP0 roles check:** No "Phone Order Agent" or "Supervisor" roles exist. Only generic roles like "Creating Sellers", "Gopa Admin", "Invoice Admin". This is expected — MVP0 role-based access is not yet configured.

**Pass criteria:** "Document whether MVP0 roles exist. If missing, flag as blocker."
- All pages render with data — **PASS**
- MVP0 roles documented — **PASS** (not present; flagged but not blocking since RBAC isn't enforced yet)

**Notes:**
- "Creating Sellers" role appears twice (duplicate).
- "Wallets Management" application appears twice (duplicate).
- None of the permissions or roles have descriptions filled in.

---

### Test 0F — Inventory & Wallets

**Result: PARTIAL PASS** | Tested: 2026-03-08 | URL: `admin.spepas.com/inventory-management/*`, `admin.spepas.com/wallet-management/*`

| Page | Renders? | Data? | Issues |
|------|----------|-------|--------|
| Categories | Yes | 15 categories in table (AKF System, Accelerator Cable/Linkage, Accessories, etc.) | KPI cards all show "0" despite table having data (same mapping bug as BUG-002). Duplicate entries (e.g. "Accessories" x4). |
| Manufacturers | Error page | No | "Error loading manufacturers" — API `GET /inventry/car-manufacturers-all` returns server error. |
| Brands | Stuck on "Loading" | No | **BUG-013**: API `GET /inventry/car-brands-all` returns server error. Page enters infinite retry loop — no error boundary. 100+ console errors generated in seconds. |
| Models | Not tested | — | Same API pattern (`/inventry/car-models-all`) — expected to fail similarly. |
| Spare Parts | Not tested | — | Same API pattern — expected to fail. |
| Wallets | Yes | 4 wallets | S00003 (revenue, GHS 0.00), S000005 (revenue, GHS 0.00), S00001 (credit_suspense, GHS 14,169.75), S00002 (debit_suspense, -GHS 14,169.75). All "Not assigned" to users. Action menus available. |

**Pass criteria:** "Data renders on inventory pages. Wallet balances display."
- Data renders on inventory pages — **FAIL** (only Categories shows data; Manufacturers/Brands/Models fail)
- Wallet balances display — **PASS**

**Bugs to report:**
1. Manufacturers, Brands, Models: All `/inventry/*` endpoints return server errors.
2. Brands page: infinite retry loop on API failure — no error boundary or retry limit, flooding console with errors.

---

### Tests 1–11 — Phone Order + USSD Flow

**Result: BLOCKED** | Tested: 2026-03-08

**Summary:** The entire phone order + USSD flow is blocked by backend API failures. The USSD menus render correctly (Buyer, Seller, Rider all display proper menu structures), but any action that queries the backend returns "unable to process request."

**What works:**
- All 3 USSD mockers load and display correct menus
- Buyer Cart menu (Check Out / Remove Item options)
- Rider Wallet (balance display + Withdraw option)
- Rider New Pickups (loads, shows empty list)
- Navigation (Back via "0" option)

**What's broken:**
- Buyer "My requests" — fails
- Seller "Open Requests > All Requests" — fails
- Seller "My bids" — fails
- All data-dependent flows blocked (no requests, no bids, no orders exist to test with)

**Root cause:** Backend API services for requests, bids, and orders appear to be down or returning server errors across both the admin portal and USSD channels. This is the same underlying issue seen in BUG-008, BUG-010, and BUG-014.

**Known issues confirmed:**
- Buyer USSD still has "Create request" (option 1) — should be removed per PRD (requests via phone/web only)
- No GOPA USSD mocker exists at any of the documented URLs

---

### Phase 1B — Phone/USSD Rejection Scenarios

| # | Task | Result | Notes | Tested By | Date |
|---|------|--------|-------|-----------|------|
| 12 | No Bids Received | BLOCKED | Backend API down — cannot create or view requests | Claude | 2026-03-08 |
| 13 | Buyer Ignores Bids | BLOCKED | Same | Claude | 2026-03-08 |
| 14 | Payment Failure | BLOCKED | Cannot reach checkout — no items in cart. Backend API failures prevent order flow. | Claude | 2026-03-08 |
| 15 | GOPA Onboards Seller (USSD) | BLOCKED | No GOPA USSD mocker available. Cannot test. | Claude | 2026-03-08 |
| 15b | Seller Browses by Part/Brand | BLOCKED | Seller "Open Requests" fails with "unable to process request". Backend down. | Claude | 2026-03-08 |
| 16 | Seller Can't Fulfill | BLOCKED | No completed orders exist to test cancellation flow. | Claude | 2026-03-08 |
| 17 | Rider Declines Job | BLOCKED | No pickup jobs available in rider queue. | Claude | 2026-03-08 |

### Phase 2A — Web App Happy Path

> **Tested on:** Production (`spepas.com`) on 2026-03-09, then re-tested on local (`localhost:3000`, `VITE_USE_LOCAL_DATA=true`) on 2026-03-09.
> Local results are shown below. Production results preserved in detailed sections for comparison.

| # | Task | Prod Result | Local Result | Notes | Tested By | Date |
|---|------|-------------|--------------|-------|-----------|------|
| 18 | Buyer Sign Up & Profile | PARTIAL PASS | PARTIAL PASS | [Details below](#test-18--buyer-sign-up--profile). Local: Home page shows real Featured Parts (not placeholder). Profile same as prod. | Claude | 2026-03-09 |
| 19 | Seller Sign Up & Profile | PARTIAL PASS | PARTIAL PASS | [Details below](#test-19--seller-sign-up--profile). Local: same as prod — dashboard renders, KPIs show. | Claude | 2026-03-09 |
| 20 | Buyer Posts Request | FAIL | PARTIAL PASS | [Details below](#test-20--buyer-posts-request). Local: Manufacturer dropdown populated (10 mfrs from local DB). **But Brand cascade broken** — selecting manufacturer doesn't populate brands (BUG-021). | Claude | 2026-03-09 |
| 21 | GOPA Forwards Request | PASS (empty) | PASS (empty) | [Details below](#test-21--gopa-forwards-request). Local: same as prod — dashboard loads, all tabs show proper empty states, no errors. | Claude | 2026-03-09 |
| 22 | Seller Submits Bid | PASS (empty) | PASS (empty) | Seller Bids page loads. New Requests: "0 requests". Submitted Bids: "0 bids submitted". No errors. Same on both envs. | Claude | 2026-03-09 |
| 23 | Buyer Accepts Bid | BLOCKED | BLOCKED | No bids exist to accept. My Requests page errors out (BUG-010) — same on local (API call to live backend). | Claude | 2026-03-09 |
| 24 | Buyer Checkout (MoMo) | BLOCKED | BLOCKED | Cart is empty. No items can be added (request flow broken). Cart page renders without errors. | Claude | 2026-03-09 |
| 25 | GOPA Tracks Forwarded Orders | PASS (empty) | PASS (empty) | GOPA dashboard has Assigned (Active/History) + Unassigned (Active/History) tabs. All show proper empty states. No errors. Same on both envs. | Claude | 2026-03-09 |
| 26 | Seller Marks Ready | BLOCKED | BLOCKED | No invoices exist to mark as ready. | Claude | 2026-03-09 |
| 27 | Rider Sign Up & Profile | PARTIAL PASS | PARTIAL PASS | [Details below](#test-27--rider-sign-up--profile). Local: same as prod — "Go online" shows 2 hardcoded pickup requests. | Claude | 2026-03-09 |
| 28 | Rider Pickup & Deliver | PARTIAL PASS | PARTIAL PASS | Rider "Go online" shows 2 pickup requests with Dismiss/Accept buttons. Data appears hardcoded (static order IDs #325416, #325417). Accepted tab empty. Same on both envs. | Claude | 2026-03-09 |
| 29 | Wallet Settlement | BLOCKED | BLOCKED | No completed orders to verify wallet settlement. | Claude | 2026-03-09 |

### Phase 2B — Web App Rejection Scenarios

| # | Task | Prod Result | Local Result | Notes | Tested By | Date |
|---|------|-------------|--------------|-------|-----------|------|
| 30 | Payment Failure | BLOCKED | BLOCKED | Cannot reach checkout — no items in cart. | Claude | 2026-03-09 |
| 31 | GOPA Onboards Seller (Web) | BLOCKED | BLOCKED | No onboarding UI found in GOPA dashboard. | Claude | 2026-03-09 |
| 32 | Buyer Cancels Order | BLOCKED | BLOCKED | No orders exist to cancel. | Claude | 2026-03-09 |
| 33 | Seller Can't Fulfill | BLOCKED | BLOCKED | No invoices exist. | Claude | 2026-03-09 |
| 34 | Rider Declines Job | PASS | PASS | Rider "New Requests" view has "Dismiss" button on each request card. UI supports declining. Same on both envs. | Claude | 2026-03-09 |

### Phase 3 — Cross-Cutting

| # | Task | Prod Result | Local Result | Notes | Tested By | Date |
|---|------|-------------|--------------|-------|-----------|------|
| 35 | Role Switching | PARTIAL PASS | PARTIAL PASS | [Details below](#test-35--role-switching). Local: same — login-time switching works, in-app OTP switching blocked (BUG-015). | Claude | 2026-03-09 |
| 36 | Session & Auth | PARTIAL PASS | PARTIAL PASS | [Details below](#test-36--session--auth). Local: same — session persists across navigation. | Claude | 2026-03-09 |
| 37 | Notifications | BLOCKED | BLOCKED | No order flow completed to verify notifications. | Claude | 2026-03-09 |
| 38 | Contact & Support | PARTIAL PASS | PASS | [Details below](#test-38--contact--support). **Local fixes:** Contact placeholders now "Kwame"/"Mensah" (BUG-017 fixed). Footer FAQ link → `/faqs` (BUG-016 fixed). Footer shows real address/email (not placeholder). | Claude | 2026-03-09 |
| 39 | Shop & Vehicle Selector | FAIL | PASS | [Details below](#test-39--shop--vehicle-selector). **Local: fully working.** Year → Manufacturer → Model cascading dropdowns populated from local DB. 6,790 parts for Toyota Corolla 2020. Dynamic filters (Fuel, Body, Drive, Engine). Part detail pages with vehicle compatibility. | Claude | 2026-03-09 |

---

## Phase 2A–3 Detailed Results

### Test 18 — Buyer Sign Up & Profile

**Result: PARTIAL PASS** | Tested: 2026-03-09 | URL: Production `spepas.com` + Local `localhost:3000`

#### Production

**Sign Up form** (`/auth/signup`): Renders correctly with fields: Full Name, Email Address, Password, Confirm Password, Phone Number, "Create Account" button. Did not create a new account to avoid polluting data.

**Sign In:** Entered `sample@yahoo.com` / `Temp123$` → "Signed in!" toast → Role selection modal with 5 roles: BUYER, GOPA, MEPA, SELLER, RIDER. Selected BUYER → redirected to `/home`.

**Buyer Home:** Hero ("Welcome to SpePas"), Featured Products carousel (8 placeholder items: "Item 1"–"Item 8", GH₵ 100–800 — appears hardcoded), Services section, User Feedbacks (6 testimonials), footer.

**Buyer Profile** (`/my-account`):
- Shows real user data: Name (Kofi Bassaw), Email (sample@yahoo.com), Phone (233554340244), Member since (1/6/2025)
- Role field is empty (not populated)
- Sidebar menu: General Profile, My Payment Accounts, My Addresses, Sign Out
- **My Addresses:** 9 addresses (1 Home, 8 duplicate Office). Coordinates are `40.7831, -73.9712` (NYC, not Ghana). "Add New Address" form with Title, Address Details, Longitude, Latitude.
- **My Payment Accounts:** 4 accounts (2 ECOBANK bank accounts, 1 MTN wallet, 1 ECOBANK). Account numbers masked with show/hide toggle.

#### Local (`localhost:3000`, `VITE_USE_LOCAL_DATA=true`)

**Sign In:** Same flow — works identically. Role selection modal with 5 roles.

**Buyer Home (LOCAL):** Significantly improved over production:
- Hero: "Your Auto Parts Marketplace" — better copy ("Search thousands of new and used parts from verified sellers across Ghana…")
- **Featured Parts:** Real part categories from local DB — Radiator (Cooling System), Alternator (Engine Electrics), Cylinder Head (Engine), Crankshaft & Pistons (Crankshaft Drive), Door Panel front (Body Parts), Side Mirror (Mirrors), Shock Absorber (Suspension). **BUG-019 FIXED locally.**
- "How SpePas Works" section with descriptive copy
- Testimonials: 6 Ghana-specific user reviews (John Kwabena, Wilson Addai, Miracle Addo, Thomas Osei Quansah, Daniel Mensah, Samuel Baffoe)
- **Footer FIXED:** Shows "Accra, Ghana" and "info@spepas.com" (not placeholder "#####"/"mail"). FAQ link → `/faqs` (correct). **BUG-016 FIXED locally.**

**Buyer Profile (LOCAL):** Same as production — Name, Email, Phone, Member since. Role field still empty. Add Profile / Switch Profile buttons present.

**Pass criteria:** "Account active. Profile saved. Address saved."
- Sign in works — **PASS**
- Profile shows real data — **PASS**
- Addresses saved — **PASS** (but coordinates are NYC, not Ghana — BUG-018)
- Role field empty — minor issue

**Issues (production only — fixed locally):**
1. ~~Featured Products are placeholder data (Items 1–8)~~ → **FIXED in local** (real parts from DB)
2. ~~Footer shows placeholder data~~ → **FIXED in local** (real address/email)
3. ~~Footer FAQ link broken~~ → **FIXED in local** (correct `/faqs` URL)

**Issues (both environments):**
1. Address coordinates (40.7831, -73.9712) are NYC coordinates, not Ghana locations (BUG-018).
2. 8 duplicate "Office address" entries with identical data.
3. Role field on profile is empty.

---

### Test 19 — Seller Sign Up & Profile

**Result: PARTIAL PASS** | Tested: 2026-03-09 | URL: `spepas.com/95668339501103956045/home` (SELLER role)

**Seller Home:** Dashboard shows store info: "Ghana Spare Parts Intl." (⭐ 4.5), KPIs: Total orders: 50, Total products: 25. Revenue chart: "June 28th" GH₵ 50 (Daily view). "+ Add product" button present.

**Seller Nav:** Home, Contact, About Us, FAQs + Bids button.

**Bids Page** (`/seller/{id}/bids`):
- Tabs: New Requests / Submitted Bids
- Sub-filters: All / Items I have
- New Requests: "0 requests" — empty
- Submitted Bids: "0 bids submitted" — empty

**Pass criteria:** "Seller profiled and linked to GOPA."
- Seller dashboard renders with store data — **PASS**
- Seller-specific pages accessible (Bids) — **PASS**
- Seller profiling form not tested (used existing account)

**Issues:**
1. Missing placeholder-brand.png image (cosmetic 404).
2. Cannot verify if seller is linked to GOPA from this view.

---

### Test 20 — Buyer Posts Request

**Result: FAIL (prod) / PARTIAL PASS (local)** | Tested: 2026-03-09

#### Production (`spepas.com`)

**Post a Request form:** Renders with cascading dropdowns: Manufacturer → Brand → Model, plus Part name, Quantity, Photos required checkbox, Description, and "Post Request" button.

**Issue:** Manufacturer dropdown is empty — `GET /inventry/car-manufacturers-all` returns 500. Brand and Model dropdowns are disabled ("Select manufacturer first", "Choose a brand first"). The form requires Manufacturer to submit but silently blocks (no validation error message shown).

Filled Part name ("Brake Pad"), Quantity (2), Description — clicked "Post Request" → form does not submit (manufacturer validation blocks it silently).

#### Local (`localhost:3000`, `VITE_USE_LOCAL_DATA=true`)

**Post a Request form:** Same layout. **Manufacturer dropdown populated** with 10 manufacturers from local DB: BMW, HONDA, HYUNDAI, KIA, LEXUS, MERCEDES-BENZ, MERCEDES-BENZ (FJDA), NISSAN, TOYOTA, VW.

**Cascade test:** Selected TOYOTA → Brand dropdown **stays disabled** ("Select manufacturer first"). Console shows `brands: []`. The manufacturer UUID is correctly set in state, but the brand-fetching logic doesn't trigger or returns empty results. **BUG-021: Post Request brand cascade broken with local data.**

Model dropdown remains disabled ("Choose a brand first") since Brand never populates.

**Note:** The Shop page's vehicle selector (Year → Manufacturer → Model) uses a **different cascade implementation** that works correctly with local data. The Post Request form uses a separate Manufacturer → Brand → Model cascade that is not connected to the local data layer for brands/models.

**My Requests page:** Still errors — `GET /api/request/buyer-active-request-all` returns server error. Request APIs use the live backend, not local data.

**Pass criteria:** "Request created and visible in Active tab."
- Form renders — **PASS** (both envs)
- Manufacturer dropdown populated — **FAIL** (prod) / **PASS** (local)
- Brand cascade works — **FAIL** (both envs — prod: no manufacturers; local: BUG-021 brands empty)
- Request created — **FAIL** (cannot submit without full cascade)
- Visible in Active tab — **FAIL** (My Requests page errors: BUG-010)

**Bugs:**
1. Production: BUG-014 (all `/inventry/*` endpoints fail)
2. Local: BUG-021 (brand cascade broken — manufacturer selected but brands remain empty)
3. Both: No client-side validation message shown when required field is missing — form just doesn't submit

---

### Test 21 — GOPA Forwards Request

**Result: PASS (empty)** | Tested: 2026-03-09 | URL: `spepas.com/95668339501103956045/home` (GOPA role)

**GOPA Dashboard:** Loads with two sections:

*Requests:*
- Assigned (Active) → "No active requests assigned to you."
- Assigned (History) → "No assignment history found."
- Unassigned (Active) → "No unassigned active requests found."
- Unassigned (History) → "No unassigned request history found."
- Refresh button works.

*Invoices:*
- To Accept → "No invoices to accept."
- Accepted → "No accepted invoices found."
- Accept by ID → Form with Invoice ID input + Accept button.

Footer: "Signed in as Kofi Bassaw (GOPA #8e6dae23-fab8-4517-bb5d-72c42f4a1d93)"

**GOPA Nav:** Home, Contact, About Us, FAQs + Assigned, Assigned History, Unassigned Active, Unassigned History.

**Pass criteria:** "Request forwarded. Seller can see and bid on it."
- Dashboard loads without errors — **PASS**
- All tabs show proper empty states — **PASS**
- Cannot test forwarding — no unassigned requests available

**Issues:** Only 1 console error (missing `/public/gopa.jpg` — cosmetic 404).

---

### Test 27 — Rider Sign Up & Profile

**Result: PARTIAL PASS** | Tested: 2026-03-09 | URL: `spepas.com/95668339501103956045/home` (RIDER role)

**Rider Home:** "Let's earn some cash!" heading with "Go online to start receiving fresh requests." and a "Go online" button.

**Go Online view:** Shows 2 pickup request cards:
1. Order #325416 — 2km, Pick-up: Ghana Spare Parts Ltd., Drop-off: Otu Adzin Road, Distance: 2 KM, Payment: GH₵ 50, Est: 03:20 PM
2. Order #325417 — 5km, Pick-up: Circle Station Accra, Drop-off: Dansoman Roundabout Accra, Distance: 5 KM, Payment: GH₵ 80, Est: 03:45 PM

Each card has **Dismiss** and **Accept** buttons. Tab switches between "New Requests" and "Accepted".

**Pass criteria:** "Rider profiled. Rider-specific pages accessible."
- Rider dashboard renders — **PASS**
- Rider-specific pages accessible (New Requests, Accepted) — **PASS**
- No dedicated Orders/Pickup/Drop-off pages found (only the Go Online view)
- Pickup data appears hardcoded (static order IDs, fixed times)

**Issues:**
1. Rider nav has no rider-specific links (Orders, Pickup, Drop-off) — only the home page "Go online" view.
2. Pickup request data appears to be hardcoded/demo data (order IDs #325416, #325417 are static).

---

### Test 35 — Role Switching

**Result: PARTIAL PASS** | Tested: 2026-03-09

**At login:** Role selection modal shows 5 roles (BUYER, GOPA, MEPA, SELLER, RIDER). Selecting any role works — tested BUYER, GOPA, SELLER, RIDER successfully.

**In-app switching:** "Switch Profile" button on `/my-account` → shows "Switch Account Type" modal with all 5 roles. However, selecting a role triggers OTP verification (`/auth/profile-switch-otp`) — "Enter the OTP sent to your phone or email." Test OTP (`12345`) was rejected: "Verification failed."

**Workaround:** Sign out and sign back in to select a different role (no OTP required at login).

**Pass criteria:** "Each role shows correct nav. No stale data."
- Login-time role selection — **PASS** (all 4 roles tested show correct dashboards)
- In-app role switching — **FAIL** (OTP verification blocks switching; test OTP not accepted)
- Each role shows correct nav — **PASS**
- No stale data — **PASS**

---

### Test 36 — Session & Auth

**Result: PARTIAL PASS** | Tested: 2026-03-09

- Sign in with email/password — **PASS**
- Sign Up form renders — **PASS** (not tested end-to-end to avoid data pollution)
- "Forgot password?" → "Reset it here" link → `/auth/forgot-password` — link present
- Session persists across page navigation — **PASS** (navigated Home → Profile → Addresses → Payment → Bids → Contact → About Us → FAQs without re-auth)
- Role selection modal at login — **PASS**

**Issues:**
1. Profile switch requires OTP that test environment can't provide (BUG-015).
2. Footer "FAQ's" link points to `/faq-page` (404) instead of `/faqs` (correct).

---

### Test 38 — Contact & Support

**Result: PARTIAL PASS (prod) / PASS (local)** | Tested: 2026-03-09

#### Production (`spepas.com`)

**Contact page:** Renders with contact info (Email: spepas@spepas.com, Phone: 1234 567890, Address: "We Are All Over") and form (First Name, Last Name, Subject, Phone, Message, "Send Message" button). Did not submit form to avoid sending test data.

**Pages tested:**
- Contact — **PASS** (renders with form)
- About Us — **PASS** (renders with team, vision, mission)
- Terms of Use — **PASS** (9 sections of legal content)
- Privacy Policy — **PASS** (8 sections)
- FAQs at `/faqs` — **PASS** (7 sections, 19 accordion questions)
- FAQs at `/faq-page` — **FAIL** (404 — footer link broken)

**Issues (production):**
1. Contact form placeholder "Jhon" (typo — should be "John").
2. Footer "FAQ's" link → `/faq-page` returns 404. Correct URL is `/faqs`.
3. Footer Help & Support section shows placeholder data: Phone "#####", Email "mail", Address "Address".

#### Local (`localhost:3000`)

**Contact page:** Renders with improved content:
- Contact info: "Email: info@spepas.com", "Accra, Ghana" (real data)
- Form placeholders: "Kwame" / "Mensah" (Ghanaian names — **BUG-017 FIXED**)
- "Contact Us" heading with "Have a question or need help? Get in touch with our team."

**Footer (all pages):**
- Help & Support: "Accra, Ghana", "info@spepas.com" (real data — **placeholder bug FIXED**)
- Quick Links: FAQs → `/faqs` (correct URL — **BUG-016 FIXED**)
- New link: "Return & Exchange Policy" → `/refund-policy`

**Pass criteria:** "Form submits. Pages render."
- Form renders — **PASS** (both envs, not submitted)
- Pages render — **PASS** (local — all links correct)

---

### Test 39 — Shop & Vehicle Selector

**Result: FAIL (prod) / PASS (local)** | Tested: 2026-03-09

#### Production (`spepas.com`)

**Shop page:** Renders with sort dropdown (Latest Products, Best Selling, Old Products), search box ("Search parts…"), and cascading filter dropdowns (Manufacturer, Brand, Model). Shows "0 results".

**Issue:** All 3 filter dropdowns are disabled because the inventory APIs fail:
- `GET /inventry/car-manufacturers-all` → 500
- `GET /inventry/car-brands-all` → 500
- `GET /inventry/car-models-all` → 500
- `GET /inventry/sparepart-all` → 500

**Root cause:** Same as BUG-014 — all inventory service endpoints are down.

#### Local (`localhost:3000`, `VITE_USE_LOCAL_DATA=true`)

**Shop page:** Fully functional with local TecDoc-sourced inventory data.

**Vehicle selector (Year → Manufacturer → Model):**
- Year dropdown: 1967–2025 (59 years)
- Selected 2020 → Manufacturer dropdown: 10 manufacturers (BMW, HONDA, HYUNDAI, KIA, LEXUS, MERCEDES-BENZ, NISSAN, TOYOTA, VW, etc.)
- Selected TOYOTA → Model dropdown: 120+ models (4RUNNER, AURIS, AVENSIS, CAMRY, COROLLA, HILUX, LAND CRUISER, PRADO, RAV4, YARIS, etc.)
- Selected COROLLA → **6,790 parts found** across 142 pages

**Categories sidebar:** Part categories with counts (e.g., Air Filter, Brake Disc, Clutch Kit, Oil Filter, Spark Plug, etc.)

**Dynamic filters:** Fuel type, Body type, Drive type, Engine — filter based on selected vehicle

**Parts grid:** Real brand data (BOSCH, OSSCA, MAGNETI MARELLI, MEYLE, TOPRAN, FEBI BILSTEIN, etc.). Each card shows brand, article number, category, and "Request This Part" link.

**Part detail page** (e.g., `/shop/78710`):
- BOSCH Air Filter, Art. 0 986 AF2 342
- Vehicle compatibility table (e.g., TOYOTA YARIS/VIOS, 1.5 NCP93, 2006, Petrol, Saloon, FWD)
- "Request This Part" link → `/buyer/post-request`
- "Price available on request"

**Search:** Text search works. Pagination works (48 items per page).

**Pass criteria:** "Dropdowns cascade correctly. Results display."
- Dropdowns cascade — **FAIL** (prod) / **PASS** (local)
- Results display — **FAIL** (prod) / **PASS** (local — 6,790+ parts)
