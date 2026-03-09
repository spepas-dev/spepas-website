# SpePas — Bugs Found During E2E Testing

> **Last updated:** 2026-03-09
> **Source:** [e2e-test-results.md](./e2e-test-results.md)

---

## Summary

| ID | Severity | Component | Owner | Bug | Found In |
|----|----------|-----------|-------|-----|----------|
| BUG-001 | Medium | Admin API | Backend team | `/requests/stats` endpoint returns 404 | Test 0A |
| BUG-002 | Medium | Admin Portal | Admin Portal team | Categories table shows 0 results despite API returning 15 | Test 0A |
| BUG-003 | Low | Admin Portal | Admin Portal team | Settings profile shows hardcoded dummy data instead of real user | Test 0A |
| BUG-004 | High | Admin Portal | Admin Portal team | Sellers & Mepa pages show all users (BUYER, ADMIN) instead of filtering by role | Test 0B |
| BUG-005 | Medium | Admin Portal | Admin Portal team | Mepa page: Google Maps `setPosition` errors from invalid LatLng coordinates | Test 0B |
| BUG-006 | Low | Admin Portal | Admin Portal team | Gopa breadcrumb shows "Goro" instead of "Gopa"; Specialties column always empty | Test 0B |
| BUG-007 | Medium | Admin Portal | Admin Portal team | Google Maps billing error on Sellers/Buyers/Mepa pages — API key issue | Test 0B |
| BUG-008 | High | Admin API | Backend team | `GET /buyers/search` returns server error — buyer search non-functional | Test 0C |
| BUG-009 | High | Admin API | Backend team | `GET /call-orders` returns server error — call orders history cannot load | Test 0C |
| BUG-010 | High | Admin API | Backend team | `GET /request/buyer-active-request-all` returns server error — Active Requests page broken | Test 0D |
| BUG-011 | Medium | Admin API | Backend team | `GET /inventry/sparepart-all` returns server error (also typo: "inventry") | Test 0D |
| BUG-012 | Medium | Admin Portal | Admin Portal team | Seller Orders: KPI shows "2" but table has 29 rows; order/bid/revenue columns empty | Test 0D |
| BUG-013 | High | Admin Portal | Admin Portal team | Brands page: infinite retry loop on API failure — no error boundary, floods console | Test 0F |
| BUG-014 | High | Admin API | Backend team | All `/inventry/*` endpoints return server errors (manufacturers, brands, models, spare parts) | Test 0F |
| BUG-015 | Medium | Web App | Frontend team | Profile switch OTP verification rejects test OTP — cannot switch roles in-app | Test 35 |
| BUG-016 | Low | Web App | Frontend team | Footer "FAQ's" link points to `/faq-page` (404) instead of `/faqs` | Test 38 |
| BUG-017 | Low | Web App | Frontend team | Contact form placeholder typo: "Jhon" instead of "John" | Test 38 |
| BUG-018 | Medium | Web App | Frontend team | Buyer addresses show NYC coordinates (40.7831, -73.9712) instead of Ghana locations | Test 18 |
| BUG-019 | Low | Web App | Frontend team | Featured Products are placeholder data (Items 1–8, GH₵ 100–800) — not real inventory | Test 18 |
| BUG-020 | Medium | Web App | Frontend team | Rider pickup requests appear hardcoded (static order IDs #325416, #325417) | Test 27 |
| BUG-021 | Medium | Web App | Frontend team | Post Request form: brand cascade broken with local data — selecting manufacturer doesn't populate brands | Test 20 |
| BUG-022 | High | Admin Portal | Admin Portal team | Dashboard KPI cards show hardcoded placeholder data (2,345 users, 856 riders, 1,204 vehicles, 3,678 payment methods) | Test 0A |
| BUG-023 | Medium | Admin Portal | Admin Portal team | Dashboard Recent Activity is hardcoded ("John Doe", "2 minutes ago", "15 minutes ago", "1 hour ago") | Test 0A |
| BUG-024 | Low | Admin Portal | Admin Portal team | Dashboard "Platform Performance" shows raw placeholder text "Chart Component Goes Here" | Test 0A |
| BUG-025 | Medium | Admin Portal | Admin Portal team | All KPI percentage changes are hardcoded across dashboard, call-in, and orders pages (+12.5%, +8.3%, etc.) | Test 0A |
| BUG-026 | Medium | Web App | Frontend team | Seller dashboard KPIs are hardcoded (Total orders: 50, Total products: 25, revenue chart "June 28th" GH₵ 50) | Test 19 |

---

## Details

### BUG-001 — `/requests/stats` endpoint returns 404

- **Severity:** Medium
- **Component:** Admin API (gateway)
- **Owner:** Backend team
- **Found in:** Test 0A — Order Management > Requests
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Navigate to Order Management > Requests
- **Expected:** Stats endpoint returns request counts/metrics; no console errors
- **Actual:** `GET /api/gateway/v1/requests/stats` returns 404. The admin portal retries the request repeatedly, producing 24 console errors on page load.
- **Impact:** No stats displayed on the Order Management page. Console flooded with errors.
- **Root cause:** The `/requests/stats` route likely does not exist in the gateway or backend services.

---

### BUG-002 — Categories table shows 0 results despite API returning data

- **Severity:** Medium
- **Component:** Admin Portal (frontend)
- **Owner:** Admin Portal team
- **Found in:** Test 0A — Inventory Management > Categories
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Navigate to Inventory Management > Categories
- **Expected:** Table displays the 15 categories returned by the API
- **Actual:** KPI cards all show "0". Table shows "No results." Console log confirms `{categories: Array(15), meta: Object}` was received from the API.
- **Impact:** Admin cannot view or manage categories.
- **Root cause:** The admin portal frontend expects a different response shape (likely `data` array instead of `categories` array) from the categories API.

---

### BUG-003 — Settings profile shows hardcoded dummy data

- **Severity:** Low
- **Component:** Admin Portal (frontend)
- **Owner:** Admin Portal team
- **Found in:** Test 0A — Settings > Profile
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com` as any user
  2. Navigate to Settings
- **Expected:** Profile form shows the authenticated user's actual info (e.g. "Kofi Admin", "adminuser@yahoo.com")
- **Actual:** Form fields show hardcoded values: First Name "John", Last Name "Doe", Email "john.doe@example.com", Phone "+1 (555) 123-4567"
- **Impact:** Admin cannot view or update their real profile information.
- **Root cause:** Profile form is populated with static placeholder values instead of fetching from the user/session API.

---

### BUG-004 — Sellers & Mepa pages show all users instead of filtering by role

- **Severity:** High
- **Component:** Admin Portal (frontend)
- **Owner:** Admin Portal team
- **Found in:** Test 0B — User Management > Sellers, User Management > Mepa
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Navigate to User Management > Sellers (or Mepa)
- **Expected:** Sellers page shows only users with role SELLER. Mepa page shows only MEPA users.
- **Actual:** Both pages show all users regardless of role. The "User Type" column reveals BUYER, ADMIN, and SELLER mixed together. Only 2–3 of 29 entries on the Sellers page are actually sellers.
- **Impact:** Admin cannot effectively manage sellers or mepas — the lists are polluted with irrelevant users.
- **Root cause:** The API endpoint or frontend query does not filter by user role/type when fetching data for these pages.

---

### BUG-005 — Mepa page: Google Maps setPosition errors from invalid coordinates

- **Severity:** Medium
- **Component:** Admin Portal (frontend)
- **Owner:** Admin Portal team
- **Found in:** Test 0B — User Management > Mepa
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Navigate to User Management > Mepa
- **Expected:** Map renders with valid markers for mechanic shop locations
- **Actual:** 36 console errors: `InvalidValueError: setPosition: not a LatLng`. Map markers fail to render.
- **Impact:** Map view of mechanic shops is broken. Console flooded with errors.
- **Root cause:** Some Mepa entries have null/invalid latitude/longitude values being passed to Google Maps `setPosition()`.

---

### BUG-006 — Gopa breadcrumb shows "Goro" instead of "Gopa"

- **Severity:** Low
- **Component:** Admin Portal (frontend)
- **Owner:** Admin Portal team
- **Found in:** Test 0B — User Management > Gopa
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Navigate to User Management > Gopa
  3. Check breadcrumb navigation
- **Expected:** Breadcrumb shows "Dashboard > User Management > Gopa"
- **Actual:** Breadcrumb shows "Dashboard > User Management > Goro"
- **Impact:** Minor UI text error. Additionally, the "Specialties" column is empty for all 14 Gopa entries.
- **Root cause:** Breadcrumb label is hardcoded incorrectly. Specialties data is either not stored or not fetched from the API.

---

### BUG-007 — Google Maps billing error on multiple admin pages

- **Severity:** Medium
- **Component:** Admin Portal (infrastructure)
- **Owner:** Admin Portal team
- **Found in:** Test 0B — Sellers, Buyers, Mepa pages
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Navigate to any User Management page with a map (Sellers, Buyers, Mepa)
- **Expected:** Google Maps renders correctly showing user/shop locations
- **Actual:** Map shows overlay: "This page can't load Google Maps correctly." Console error: `Google Maps JavaScript API error: BillingNotEnabled`
- **Impact:** Location maps non-functional across all user management pages.
- **Root cause:** Google Maps API key does not have billing enabled or the billing account is expired/misconfigured.

---

### BUG-008 — Buyer search API returns server error

- **Severity:** High
- **Component:** Admin API (gateway)
- **Owner:** Backend team
- **Found in:** Test 0C — Call-In Order Wizard, Step 1
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Navigate to Call In Management > Calls Orders
  3. Enter phone number `233554340244` and click "Search Customer"
- **Expected:** Buyer "Kofi Bassaw" found and displayed
- **Actual:** "No Customer Found" error. Console shows `GET /api/gateway/v1/buyers/search?phone=233554340244` returns server error.
- **Impact:** **Critical blocker for phone order flow.** Cannot search for buyers, so the call-in order wizard cannot proceed past Step 1.
- **Root cause:** The `/buyers/search` endpoint on the API gateway is returning a server error.

---

### BUG-009 — Call orders history API returns server error

- **Severity:** High
- **Component:** Admin API (gateway)
- **Owner:** Backend team
- **Found in:** Test 0C — Call Orders History tab
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Navigate to Call In Management > Calls Orders > "Call Orders History" tab
- **Expected:** Table of past call orders
- **Actual:** Error alert: "Failed to load call orders. Please try again." Console: `GET /api/gateway/v1/call-orders?limit=50` returns server error.
- **Impact:** Cannot view call order history.
- **Root cause:** `/call-orders` endpoint on the API gateway is returning a server error.

---

### BUG-010 — Active Requests API returns server error

- **Severity:** High
- **Component:** Admin API (gateway)
- **Owner:** Backend team
- **Found in:** Test 0D — Order Management > Active Requests
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Navigate to Order Management > Requests
- **Expected:** List of active spare part requests
- **Actual:** Error: "Failed to load active requests." Console: `GET /api/gateway/v1/request/buyer-active-request-all?limit=50` returns server error.
- **Impact:** **Critical blocker.** Cannot view, search, filter, or assign requests — the core admin function.
- **Root cause:** `/request/buyer-active-request-all` endpoint returns server error.

---

### BUG-011 — Spare parts API returns server error (with typo in endpoint)

- **Severity:** Medium
- **Component:** Admin API (gateway)
- **Owner:** Backend team
- **Found in:** Test 0D — Order Management > Orders
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Navigate to Order Management > Orders
- **Expected:** List of spare parts available for bidding
- **Actual:** All KPI cards show 0. Console: `GET /api/gateway/v1/inventry/sparepart-all` returns server error.
- **Impact:** Cannot view spare parts inventory from admin.
- **Root cause:** Endpoint returns server error. Also note the endpoint uses "inventry" (typo) instead of "inventory".

---

### BUG-012 — Seller Orders: KPI mismatch and empty order columns

- **Severity:** Medium
- **Component:** Admin Portal (frontend)
- **Owner:** Admin Portal team
- **Found in:** Test 0D — Order Management > Seller Orders
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Navigate to Order Management > Seller Orders
- **Expected:** KPI shows correct seller count. Table shows order metrics (total orders, active bids, completed orders, revenue) per seller.
- **Actual:** KPI "Total Sellers" shows "2" but table lists 29 sellers. The columns Total Orders, Active Bids, Completed Orders, and Total Revenue are empty for every row.
- **Impact:** Admin cannot see seller performance metrics.
- **Root cause:** KPI count likely uses a different (incorrect) data source. Order metric columns are not mapped from API response or the data doesn't exist.

---

### BUG-013 — Brands page: infinite retry loop on API failure

- **Severity:** High
- **Component:** Admin Portal (frontend)
- **Owner:** Admin Portal team
- **Found in:** Test 0F — Inventory Management > Brands
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Navigate to Inventory Management > Brands
- **Expected:** Error message displayed after API failure, with option to retry
- **Actual:** Page stays on "Loading" spinner and enters infinite retry loop. The page fires `GET /inventry/car-brands-all`, `GET /inventry/car-manufacturers-all`, and `GET /inventry/car-models-all` repeatedly. Over 100 console errors generated in under 10 seconds.
- **Impact:** Browser performance degrades significantly. Console is flooded. No way to recover without navigating away.
- **Root cause:** No error boundary or retry limit on the Brands page. When API calls fail, the component re-renders and retries indefinitely.

---

### BUG-014 — All `/inventry/*` endpoints return server errors

- **Severity:** High
- **Component:** Admin API (gateway)
- **Owner:** Backend team
- **Found in:** Test 0F — Inventory Management (Manufacturers, Brands, Models)
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Navigate to Inventory Management > Manufacturers (or Brands, or Models)
- **Expected:** Lists of manufacturers/brands/models displayed
- **Actual:** All endpoints return server errors:
  - `GET /api/gateway/v1/inventry/car-manufacturers-all` — server error
  - `GET /api/gateway/v1/inventry/car-brands-all` — server error
  - `GET /api/gateway/v1/inventry/car-models-all` — server error
  - `GET /api/gateway/v1/inventry/sparepart-all` — server error (also found in Test 0D)
- **Impact:** Entire inventory management section (except Categories) is non-functional.
- **Root cause:** The inventory service behind the API gateway appears to be down or misconfigured. Note: all endpoints use "inventry" (typo) instead of "inventory".

---

### BUG-015 — Profile switch OTP verification rejects test OTP

- **Severity:** Medium
- **Component:** Web App (frontend/backend)
- **Owner:** Frontend team
- **Found in:** Test 35 — Role Switching
- **Steps to reproduce:**
  1. Log in at `spepas.com/95668339501103956045/auth/signin`
  2. Navigate to My Account → click "Switch Profile"
  3. Select a different role (e.g. GOPA)
  4. Enter OTP `12345` and click "Verify & Continue"
- **Expected:** Profile switches to selected role
- **Actual:** "Verification failed. Please check your OTP and try again."
- **Impact:** Cannot switch roles without signing out and back in. Test environment has no way to receive real OTPs.
- **Root cause:** OTP verification endpoint does not accept the test OTP. No bypass for test/dev environments.

---

### BUG-016 — Footer FAQ link returns 404

- **Severity:** Low
- **Component:** Web App (frontend)
- **Owner:** Frontend team
- **Found in:** Test 38 — Contact & Support
- **Steps to reproduce:**
  1. On any page, scroll to footer
  2. Click "FAQ's" under Quick Link
- **Expected:** FAQs page loads
- **Actual:** 404 Page Not Found. Footer links to `/faq-page` but the actual route is `/faqs`.
- **Impact:** Users clicking the footer FAQ link get a dead page.
- **Root cause:** Route mismatch — footer hardcodes `/faq-page`, nav uses `/faqs`.

---

### BUG-017 — Contact form placeholder typo "Jhon"

- **Severity:** Low
- **Component:** Web App (frontend)
- **Owner:** Frontend team
- **Found in:** Test 38 — Contact page
- **Steps to reproduce:**
  1. Navigate to Contact page
  2. Check First Name field placeholder
- **Expected:** Placeholder says "John"
- **Actual:** Placeholder says "Jhon"
- **Impact:** Minor cosmetic typo.

---

### BUG-018 — Buyer addresses show NYC coordinates

- **Severity:** Medium
- **Component:** Web App (backend/data)
- **Owner:** Frontend team
- **Found in:** Test 18 — Buyer Profile > My Addresses
- **Steps to reproduce:**
  1. Log in as BUYER → My Account → My Addresses
- **Expected:** Addresses show coordinates in Ghana
- **Actual:** All addresses show coordinates `40.7831, -73.9712` (New York City)
- **Impact:** Delivery addresses point to wrong continent. Could affect delivery routing.
- **Root cause:** Test data was created with placeholder NYC coordinates.

---

### BUG-019 — Featured Products are placeholder data

- **Severity:** Low
- **Component:** Web App (frontend)
- **Owner:** Frontend team
- **Found in:** Test 18 — Buyer Home page
- **Steps to reproduce:**
  1. Log in as BUYER → Home page
  2. Check "Featured Products" carousel
- **Expected:** Real product listings from inventory
- **Actual:** 8 placeholder items ("Item 1" through "Item 8") with sequential prices (GH₵ 100–800)
- **Impact:** Home page shows dummy data instead of real products.
- **Root cause:** Featured products section is hardcoded with placeholder data, not fetching from API.

---

### BUG-020 — Rider pickup requests appear hardcoded

- **Severity:** Medium
- **Component:** Web App (frontend)
- **Owner:** Frontend team
- **Found in:** Test 27 — Rider dashboard
- **Steps to reproduce:**
  1. Log in as RIDER → Home → click "Go online"
- **Expected:** Real pickup requests from active orders
- **Actual:** 2 static pickup requests always shown: Order #325416 (2km, GH₵ 50) and Order #325417 (5km, GH₵ 80). Same data on every visit.
- **Impact:** Rider dashboard shows demo data, not real pickup jobs.
- **Root cause:** Pickup request data appears to be hardcoded in the frontend rather than fetched from the orders API.

---

### BUG-021 — Post Request form brand cascade broken with local data

- **Severity:** Medium
- **Component:** Web App (frontend)
- **Owner:** Frontend team
- **Found in:** Test 20 — Buyer Post Request (local env)
- **Steps to reproduce:**
  1. Run `pnpm dev` with `VITE_USE_LOCAL_DATA=true`
  2. Log in as BUYER → navigate to `/buyer/post-request`
  3. Select any manufacturer (e.g., TOYOTA) from dropdown
- **Expected:** Brand dropdown should populate with brands for that manufacturer (e.g., TOYOTA brand)
- **Actual:** Brand dropdown stays disabled, showing "Select manufacturer first". Console logs show `brands: []` even though `selectedManufacturer` has a valid UUID.
- **Impact:** Cannot complete the Post Request form even with local data — the Manufacturer → Brand → Model cascade is broken at the second step.
- **Root cause:** The `PostRequestForm.tsx` component's brand-fetching logic doesn't work with the local data layer. The Shop page's vehicle selector uses a different cascade implementation (Year → Manufacturer → Model via `useLocalInventory` hook) that works correctly. The Post Request form likely still calls the live API for brands rather than the local data source.
- **Note:** On production, this is masked by BUG-014 (manufacturer dropdown itself is empty), so the cascade failure is only visible with local data.

---

### BUG-022 — Dashboard KPI cards show hardcoded placeholder data

- **Severity:** High
- **Component:** Admin Portal (frontend)
- **Owner:** Admin Portal team
- **Found in:** Test 0A — Admin Dashboard
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. View dashboard KPI cards
- **Expected:** KPI values should be fetched from the API and reflect actual platform data
- **Actual:** All 4 KPI cards display hardcoded values that never change:
  - Total Users: **2,345** — "Active platform users"
  - Active Riders: **856** — "Registered riders"
  - Registered Vehicles: **1,204** — "Fleet size"
  - Payment Methods: **3,678** — "Active accounts"
- **Impact:** Dashboard gives a false impression of platform activity. Admins cannot see real metrics. The numbers don't match actual data (e.g., Buyers page shows 124 buyers, Riders page shows 14 riders — not 856).
- **Root cause:** Dashboard component uses hardcoded static values instead of API calls to aggregate real user/rider/vehicle/payment counts.

---

### BUG-023 — Dashboard Recent Activity is hardcoded

- **Severity:** Medium
- **Component:** Admin Portal (frontend)
- **Owner:** Admin Portal team
- **Found in:** Test 0A — Admin Dashboard
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Scroll to "Recent Activity" section
- **Expected:** Recent Activity should show actual recent platform events (new registrations, orders, etc.)
- **Actual:** Always shows the same 3 hardcoded entries:
  1. "New Rider Registration" — "2 minutes ago" — "John Doe completed registration process"
  2. "Vehicle Added" — "15 minutes ago" — "New vehicle registered to fleet"
  3. "Payment Method Updated" — "1 hour ago" — "Mobile money account added"
- **Impact:** Admins see fake activity data. Timestamps are static ("2 minutes ago" forever).
- **Root cause:** Recent Activity section is populated with hardcoded dummy data, not fetched from an activity/audit log API.

---

### BUG-024 — Platform Performance shows placeholder text

- **Severity:** Low
- **Component:** Admin Portal (frontend)
- **Owner:** Admin Portal team
- **Found in:** Test 0A — Admin Dashboard
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Scroll to "Platform Performance" section
- **Expected:** A chart or metrics visualization
- **Actual:** Raw placeholder text: "Chart Component Goes Here"
- **Impact:** Platform Performance section is non-functional — clearly an unfinished component.
- **Root cause:** Chart component was never implemented; placeholder text left in.

---

### BUG-025 — KPI percentage changes hardcoded across admin portal

- **Severity:** Medium
- **Component:** Admin Portal (frontend)
- **Owner:** Admin Portal team
- **Found in:** Tests 0A, 0C, 0D — Multiple admin pages
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Check KPI cards on Dashboard, Call-In Management, and Orders pages
- **Expected:** Percentage changes should reflect actual period-over-period comparisons
- **Actual:** All percentage badges are hardcoded static values that never change:
  - **Dashboard:** +12.5%, +8.2%, +15.3%, +10.8%
  - **Call-In Management:** +12.5%, +8.3%, +15.2%, +6.7%, -0.3 min
  - **Orders:** +12.5%, +8.3%, +5.2%, +3.7%
- **Impact:** Misleading — suggests positive growth trends that aren't real. Even when KPI counts are 0, percentage badges still show positive growth.
- **Root cause:** KPI card components have hardcoded percentage values instead of calculating from actual time-series data.

---

### BUG-026 — Seller dashboard KPIs are hardcoded

- **Severity:** Medium
- **Component:** Web App (frontend)
- **Owner:** Frontend team
- **Found in:** Test 19 — Seller dashboard (web app)
- **Steps to reproduce:**
  1. Log in to `spepas.com` or `localhost:3000` as SELLER
  2. View seller home/dashboard
- **Expected:** KPI values should reflect the actual seller's order/product data
- **Actual:** KPIs are hardcoded:
  - Total orders: **50**
  - Total products: **25**
  - Revenue chart: "June 28th" with GH₵ 50 (Daily view)
  - Store name: "Ghana Spare Parts Intl." (⭐ 4.5)
- **Impact:** Seller sees fake metrics. Same values shown for every seller account.
- **Root cause:** Seller dashboard uses hardcoded placeholder data instead of fetching from seller-specific API endpoints.
