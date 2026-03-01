# SpePas Issue Tracking

## Open Issues

### 1. Browse Parts page doesn't load parts for unauthenticated users
**Priority:** High
**Area:** Shop / API / Auth

**Problem:**
The shop page route (`/shop`) is publicly accessible — no auth guard blocks it. However, the inventory API endpoints (`/inventry/car-years-all`, `/inventry/sparepart-all`, etc.) require a valid session cookie. When an unauthenticated user visits the shop page:
- API calls return 401
- The global axios interceptor catches the 401 and redirects to the sign-in page
- Even if the API didn't require auth, the parts query only runs after selecting Year > Make > Model — but the dropdown data itself fails to load

**Expected behavior:**
Unauthenticated users should be able to browse parts. Either:
- The backend inventory endpoints should allow unauthenticated read access, OR
- The frontend should show a graceful fallback (e.g. "Sign in to browse parts") instead of silently redirecting

**Key files:**
- `src/components/marketing/ShopWithoutSidebar/index.tsx` — shop page component, parts query has `enabled: vehicleSelected`
- `src/lib/axios.ts` — global 401 interceptor redirects to sign-in
- `src/lib/inventoryApis.ts` — inventory API calls
- `src/routes/website.routes.tsx` — shop route (public, no auth guard)

---

### 2. Authenticated users should land on Browse Parts by default
**Priority:** Medium
**Area:** Routing

**Problem:**
Both authenticated and unauthenticated users land on the same root page (`/` → `AltHomePage` splash page). Authenticated users have to manually navigate to the shop page.

**Expected behavior:**
When an authenticated user visits `/` or logs in, they should be redirected to the browse parts page (`/shop`) as their default landing page. The splash/marketing home page should only be the default for unauthenticated users.

**Key files:**
- `src/routes/index.tsx` — main router, root path renders `AltHomePage` for everyone
- `src/features/auth/index.ts` — auth context with `useAuth()` hook providing `isAuthenticated`

---

### 3. `getCarManufacturers` API returns flat list — brand/model pre-fill broken
**Priority:** Medium
**Area:** API

**Problem:**
The `getCarManufacturers()` endpoint returns manufacturers without nested `brands` arrays (each manufacturer's `brands` is `[]`). This means the PostRequestForm cannot auto-select the brand dropdown when pre-filling from the part detail page's navigation state.

When a user clicks "Request This Part" on the detail page, the form correctly receives `partName`, `manufacturerName`, and `brandName` via React Router state. The part name pre-fills correctly, and the manufacturer dropdown selects the right value, but the brand dropdown shows "Select manufacturer first" because `mfr.brands` is empty.

**Expected behavior:**
The `getCarManufacturers()` response should include nested `brands` (and ideally `models`) so the cascading dropdowns can be pre-filled programmatically.

**Key files:**
- `src/components/buyer/PostRequestForm.tsx` — pre-fill logic in `useEffect` (lines 55-73)
- `src/lib/inventoryApis.ts` — `getCarManufacturers()` call
- `src/components/marketing/ShopDetails/index.tsx` — passes state via `<Link>` (lines 160-166)

---
