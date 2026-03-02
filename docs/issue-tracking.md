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

## Live API Gaps (Inventory Endpoints)

The following issues were discovered testing the browse parts page against the live API (`https://api.spepas.com/api/gateway/v1/inventry/*`) on 2026-03-02. Each blocks feature parity with the local TecDoc-sourced database.

### INV-4. `car-years-all` endpoint does not exist
**Priority:** Low
**Endpoint:** `GET /inventry/car-years-all`

Returns 404. The frontend gracefully degrades (hides Year dropdown, allows Make selection immediately), so this is non-blocking but limits filtering.

**Expected:** Return distinct `yearOfMake` values from car models, descending.

---

### INV-5. `car-brands-all` ignores `manufacturerId` filter
**Priority:** High
**Endpoint:** `GET /inventry/car-brands-all?manufacturerId=<UUID>`

The `manufacturerId` param is ignored — returns all 702 brands instead of filtering to the selected manufacturer.

**Workaround applied:** Frontend extracts brands from the `manufacturers-all` response's nested `brands[]` array.

**Expected:** Return only car brands belonging to the specified manufacturer.

---

### INV-6. `car-models-all` missing vehicle attribute fields
**Priority:** Medium
**Endpoint:** `GET /inventry/car-models-all`

Car model objects do not include `fuelType`, `bodyType`, or `driveType`. These are needed for the "Refine by vehicle attributes" filter dropdowns.

**Returned:** `id, CarModel_ID, name, yearOfMake, carBrand_ID, externalID, status, createdAt, spareParts, carBrand`
**Missing:** `fuelType`, `bodyType`, `driveType`

---

### INV-7. `sparepart-all` ignores `brandId`, `categoryId`, and attribute filters — CRITICAL
**Priority:** Critical
**Endpoint:** `GET /inventry/sparepart-all`

The following query params are silently ignored — every request returns the full 237,946 parts:

| Param | Expected behavior |
|-------|-------------------|
| `brandId` | Only parts linked to car models under this brand |
| `categoryId` | Only parts in this category |
| `fuelType` | Only parts linked to models with this fuel type |
| `bodyType` | Only parts linked to models with this body type |
| `driveType` | Only parts linked to models with this drive type |

The `search` param **does work** (e.g. `?search=V30-86` returns 9 results).

**Impact:** Selecting a make/model shows all 237k parts instead of parts for that vehicle. This is the single most critical API gap.

---

### INV-8. `sparepart-all` pagination broken
**Priority:** High
**Endpoint:** `GET /inventry/sparepart-all`

- `offset` param: not recognized (no `offset` in meta response)
- `page` param: meta shows correct page number but **returns identical data** for page 1 and page 2
- `limit` param: works correctly

**Expected:** `page=2&limit=48` should return items 49–96, not items 1–48 again.

---

### INV-9. `sparepart-all` field naming differences
**Priority:** Low
**Endpoint:** `GET /inventry/sparepart-all`

| Field | Local mock | Live API | Notes |
|-------|-----------|----------|-------|
| Article number | `article_no` | `articleNo` | camelCase vs snake_case |
| Supplier name | `supplier_name` | *(missing)* | Not returned by live API |
| Engine type | *(N/A)* | `typeEngineName` | New field, not in local mock |
| External ID | *(N/A)* | `externalID` | New field, not in local mock |

Frontend Zod schema expects `article_no`/`supplier_name`. Either normalize API field names or update frontend to handle both.

---

### INV-10. `sparepart-all` total count location differs
**Priority:** Low
**Endpoint:** `GET /inventry/sparepart-all`

Local mock: `{ status, message, total: 123, data: [...] }` — `total` at root.
Live API: `{ status, message, data: [...], meta: { total: 237946, page, limit, totalPages } }` — inside `meta`.

Frontend currently reads `partsData?.total` which misses the live API's value. Pagination count shows wrong number.

---

### INV-11. `category-all` returns empty data
**Priority:** High
**Endpoint:** `GET /inventry/category-all`

Returns `{ data: [] }` (empty array) both with and without `brandId` filter. The categories sidebar shows nothing on the live API.

**Expected:** Return categories with `count` (when `brandId` provided) and `parent_ID` for hierarchy.

---

### INV-12. All list endpoints default to `limit=15`
**Priority:** Medium
**Endpoints:** `car-manufacturers-all`, `car-brands-all`, `car-models-all`, `sparepart-all`

All default to 15 items/page. The `limit` param works but max varies:
- `limit=100`: reliable
- `limit=150`: works
- `limit=200+`: sometimes returns 500 errors

For `car-manufacturers-all` (712 records), makes after letter ~C are missing from the combobox.

**Ideal fix:** Support `limit=500+` or add server-side `search`/`name` param for filtering.

---

### Summary — Priority Order

| # | Issue | Priority | Impact |
|---|-------|----------|--------|
| INV-7 | `sparepart-all` ignores all filters except `search` | Critical | Browse page shows all 237k parts regardless of vehicle selection |
| INV-8 | `sparepart-all` pagination broken | High | Can't page through results |
| INV-5 | `car-brands-all` ignores `manufacturerId` | High | Workaround applied (use inline brands) |
| INV-11 | `category-all` returns empty data | High | No category sidebar |
| INV-6 | `car-models-all` missing fuelType/bodyType/driveType | Medium | No vehicle attribute filters |
| INV-12 | All endpoints default to limit=15 | Medium | Only first ~100 makes visible |
| INV-9 | Field naming mismatch (articleNo vs article_no) | Low | Article number not displayed |
| INV-10 | Total count in meta vs root | Low | Pagination count inaccurate |
| INV-4 | `car-years-all` doesn't exist | Low | Year filter unavailable (graceful fallback) |
