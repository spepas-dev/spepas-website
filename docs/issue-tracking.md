# SpePas Issue Tracking

## Summary — Priority Order

| # | Issue | Priority | Root cause | Fix location | Impact |
|---|-------|----------|------------|--------------|--------|
| INV-7 | `sparepart-all` ignores all filters except `search` | Critical | All 3 layers only forward 5 standard params; DB query has no filter `where` clauses | All 3 services | Browse page shows all 237k parts regardless of vehicle |
| INV-8 | `sparepart-all` pagination broken | High | DB pagination logic is correct; bug likely in param forwarding between layers | Debug across layers | Can't page through results |
| INV-5 | `car-brands-all` ignores `manufacturerId` | High | All 3 layers don't forward param; also typo `/all-brandes` in product service | All 3 services | Manufacturer→Brand cascade broken |
| INV-5b | `car-models-all` ignores `brandId` | High | All 3 layers don't forward param | All 3 services | Brand→Model cascade broken |
| INV-11 | `category-all` returns empty data | High | Categories likely never seeded on live DB; response structure mismatch | Run seed script + fix response | No category sidebar |
| 1 | Browse Parts page doesn't load for unauthenticated users | High | All inventory list endpoints require auth in gateway | Move to unauth routes | No browsing without sign-in |
| 3 | Manufacturer API returns empty `brands[]` | Medium | Downstream product service doesn't populate nested brands | Product service DB query | Can't pre-fill brand dropdown |
| INV-6 | `car-models-all` missing fuelType/bodyType/driveType | Medium | Fields don't exist in Prisma schema | Schema migration + data re-import | No vehicle attribute filters |
| INV-12 | All endpoints default to limit=15, large limits 500 | Medium | No limit cap in any layer; DB can't handle large result sets | DB service optimization | Frontend must paginate (workaround applied) |
| 2 | Authenticated users should land on Browse Parts by default | Medium | Root route renders splash page for everyone | Frontend routing | Users must navigate manually |
| INV-9 | Field naming mismatch (articleNo vs article_no) | Low | DB schema uses `articleNo` (camelCase) | Align frontend | Workaround applied (read both fields) |
| INV-10 | Total count in meta vs root | Low | DB service returns `meta.total`; local mock uses root `total` | Align frontend | Pagination count inaccurate |
| INV-4 | `car-years-all` doesn't exist | Low | No route in any layer; years only in model `yearOfMake` | Add endpoint or extract client-side | Year filter unavailable (graceful fallback) |

---

## Backend Architecture Notes

```
┌─────────────────┐      ┌──────────────────────┐      ┌─────────────────────────┐
│  API Gateway     │ ───→ │  Product Service      │ ───→ │  Database Service        │
│  (gateway/)      │      │  (spproductservices/) │      │  (spdatabaseservices/)   │
│  Express + TS    │      │  Express + JS         │      │  Express + JS + Prisma   │
│  Port: ?         │      │  Port: ?              │      │  Port: 9006              │
│                  │      │                       │      │  PostgreSQL              │
│  Auth middleware  │      │  Proxy layer only     │      │  Actual DB queries       │
└─────────────────┘      └──────────────────────┘      └─────────────────────────┘
         │
         │  (categories only — skips product service)
         └──────────────────────────────────────────────→ Database Service
```

**Repos:**
- `gateway/` — Express+TS API gateway, auth middleware, request routing
- `spproductservices/` — Express+JS proxy, forwards to DB service (no business logic)
- `spdatabaseservices/` — Express+JS + Prisma ORM, PostgreSQL. All actual queries here.
- `spauthservices/` — Auth/user management only, no inventory role

**Common pattern across all inventory endpoints:** Only `page`, `limit`, `search`, `startDate`, `endDate` are forwarded through all 3 layers. Entity-specific filters (`manufacturerId`, `brandId`, `categoryId`, etc.) are never passed. Fixes need to be applied at all 3 layers: gateway TypeScript interfaces, product service controllers, and database service Prisma queries.

**Key DB files:**
- `spdatabaseservices/DBFunctions/ProductDb.js` — All Prisma queries
- `spdatabaseservices/prisma/schema.prisma` — Database models
- `spdatabaseservices/Data/part_categories.json` — Category seed data
- `spdatabaseservices/controllers/ScriptController.js` — Data loading scripts

---

## Frontend Issues

### 1. Browse Parts page doesn't load parts for unauthenticated users
**Priority:** High
**Area:** Shop / API / Auth

**Problem:**
The shop page route (`/shop`) is publicly accessible — no auth guard blocks it. However, the inventory API endpoints (`/inventry/car-manufacturers-all`, `/inventry/sparepart-all`, etc.) require a valid session cookie. When an unauthenticated user visits the shop page:
- API calls return 401
- The global axios interceptor catches the 401 and redirects to the sign-in page
- Even if the API didn't require auth, the parts query only runs after selecting Manufacturer > Model — but the dropdown data itself fails to load

**Root cause (confirmed in gateway repo):** All inventory list endpoints (`car-manufacturers-all`, `car-brands-all`, `car-models-all`, `sparepart-all`, `category-all`) are behind `authMiddleware.checkAuthentication` in `src/routes/product.routes.ts`. Only `sparepart-detail/:code` is in the unauthenticated routes (`src/routes/unauth.routes.ts`).

**Workaround applied:** Frontend axios interceptor skips 401 redirect for `/inventry/` URLs so the page doesn't force-redirect to sign-in.

**Expected behavior:**
Unauthenticated users should be able to browse parts. Either:
- Move the read-only inventory endpoints to the unauthenticated routes in the gateway, OR
- The frontend should show a graceful fallback (e.g. "Sign in to browse parts") instead of silently redirecting

**Key files:**
- Gateway: `src/routes/product.routes.ts` — all endpoints require `authMiddleware.checkAuthentication`
- Gateway: `src/routes/unauth.routes.ts` — only `sparepart-detail` is public
- Frontend: `src/lib/axios.ts` — global 401 interceptor (workaround applied)
- Frontend: `src/components/marketing/ShopWithoutSidebar/index.tsx` — shop page component

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
**Area:** API (downstream product service)

**Problem:**
The `getCarManufacturers()` endpoint returns manufacturers without nested `brands` arrays (each manufacturer's `brands` is `[]`). This means the PostRequestForm cannot auto-select the brand dropdown when pre-filling from the part detail page's navigation state.

When a user clicks "Request This Part" on the detail page, the form correctly receives `partName`, `manufacturerName`, and `brandName` via React Router state. The part name pre-fills correctly, and the manufacturer dropdown selects the right value, but the brand dropdown shows "Select manufacturer first" because `mfr.brands` is empty.

**Root cause (confirmed in gateway repo):** The gateway controller (`src/controllers/product/manufacturer.ts`) passes the downstream response through without transformation. The `brands: []` empty array is coming from the downstream product service at `GET /spproductservices/api/v1/manufacturer/all` — the gateway is not stripping it.

**Expected behavior:**
The downstream product service should include nested `brands` (and ideally `models`) in the manufacturer response so the cascading dropdowns can be pre-filled programmatically.

**Key files:**
- Gateway: `src/controllers/product/manufacturer.ts` — passes response through as-is
- Gateway: `src/services/api/product.service.ts` (lines 19-33) — calls `/manufacturer/all`
- Frontend: `src/components/buyer/PostRequestForm.tsx` — pre-fill logic in `useEffect`
- Frontend: `src/components/marketing/ShopDetails/index.tsx` — passes state via `<Link>`

---

## Live API Gaps (Inventory Endpoints)

The following issues were discovered testing the browse parts page against the live API (`https://api.spepas.com/api/gateway/v1/inventry/*`) on 2026-03-02. Root causes confirmed by reading the full backend stack (2026-03-08).

### INV-4. `car-years-all` endpoint does not exist
**Priority:** Low
**Endpoint:** `GET /inventry/car-years-all`

Returns 404. No route for this endpoint exists in the gateway (`src/routes/product.routes.ts` or `src/routes/unauth.routes.ts`). Year information is only available as the `yearOfMake` field on individual car model objects from `car-models-all`.

The frontend gracefully degrades (hides Year dropdown, allows Manufacturer selection immediately), so this is non-blocking but limits filtering.

**Expected:** Either add a dedicated endpoint that returns distinct `yearOfMake` values descending, or extract years client-side from the models response.

---

### INV-5. `car-brands-all` ignores `manufacturerId` filter
**Priority:** High
**Endpoint:** `GET /inventry/car-brands-all?manufacturerId=<UUID>`

The `manufacturerId` param is ignored — returns all 702 brands instead of filtering to the selected manufacturer.

**Root cause (confirmed across all 3 services):** None of the three layers pass `manufacturerId` through:
1. Gateway (`gateway/src/services/api/product.service.ts`, lines 40-51) → only forwards 5 standard params
2. Product service (`spproductservices/controllers/BrandController.js`, line 68) → forwards to DB service. **Note: typo in URL** — calls `/all-brandes` instead of `/all-brands`
3. Database service (`spdatabaseservices/DBFunctions/ProductDb.js`, lines 308-405) → Prisma query has no `manufacturer_ID` filter in `where` clause

**Fix required at all 3 layers:**
- Gateway: forward `manufacturerId` param
- Product service: forward `manufacturerId` param (also fix `/all-brandes` typo)
- Database service: add `where.manufacturer_ID = manufacturerId` to the Prisma query

**Workaround applied:** Frontend extracts brands from the `manufacturers-all` response's nested `brands[]` array (but these are currently empty — see issue #3 above).

**Expected:** Return only car brands belonging to the specified manufacturer.

---

### INV-5b. `car-models-all` ignores `brandId` filter
**Priority:** High
**Endpoint:** `GET /inventry/car-models-all?brandId=<UUID>`

The `brandId` param is ignored — returns all 1,070 models instead of filtering to the selected brand. This causes the model dropdown to show models for all brands.

**Root cause (confirmed across all 3 services):** Same pattern as INV-5. None of the three layers pass `brandId`:
1. Gateway (`gateway/src/services/api/product.service.ts`, lines 58-69)
2. Product service (`spproductservices/controllers/ModelController.js`)
3. Database service (`spdatabaseservices/DBFunctions/ProductDb.js`, lines 216-306) — Prisma query has no `carBrand_ID` filter

**Fix required at all 3 layers:** Forward `brandId` and add `where.carBrand_ID = brandId` to the Prisma query.

**Expected:** Return only car models belonging to the specified brand.

---

### INV-6. `car-models-all` missing vehicle attribute fields
**Priority:** Medium
**Endpoint:** `GET /inventry/car-models-all`

Car model objects do not include `fuelType`, `bodyType`, or `driveType`. These are needed for the "Refine by vehicle attributes" filter dropdowns.

**Root cause (confirmed in schema):** These fields **do not exist** in the Prisma schema (`spdatabaseservices/prisma/schema.prisma`, lines 527-538). The `CarModel` model only has: `CarModel_ID`, `name`, `yearOfMake`, `carBrand_ID`, `externalID`, `status`, `createdAt`. The TecDoc source data has these attributes but they were never added to the database schema.

**Returned:** `id, CarModel_ID, name, yearOfMake, carBrand_ID, externalID, status, createdAt, spareParts, carBrand`
**Missing:** `fuelType`, `bodyType`, `driveType` — need schema migration + data re-import

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

**Root cause (confirmed across all 3 services):** None of the three layers support these filters:
1. Gateway (`gateway/src/services/api/product.service.ts`, lines 101-112) — only forwards 5 standard params
2. Product service (`spproductservices/controllers/SparePartController.js`, lines 103-168) — same pattern
3. Database service (`spdatabaseservices/DBFunctions/ProductDb.js`, lines 585-670) — Prisma `where` only filters by `status=1` and `search` (name, articleNo, typeEngineName). No `brandId`, `categoryId`, or attribute filters.

The `SparePart` schema **does** have `category_ID` and `carModel_ID` foreign keys, so filtering by category or model/brand (via join) is possible at the DB level. `fuelType`/`bodyType`/`driveType` would require schema changes (see INV-6).

**Fix required at all 3 layers:** Forward filter params and add Prisma `where` conditions:
- `category_ID` for category filter
- `carModel.carBrand_ID` for brand filter (relation filter)
- `carModel_ID` for direct model filter

**Impact:** Selecting a make/model shows all 237k parts instead of parts for that vehicle. This is the single most critical API gap.

---

### INV-8. `sparepart-all` pagination broken
**Priority:** High
**Endpoint:** `GET /inventry/sparepart-all`

- `offset` param: not recognized (no `offset` in meta response)
- `page` param: meta shows correct page number but **returns identical data** for page 1 and page 2
- `limit` param: works correctly

**Root cause analysis:** The gateway and product service both forward `page` correctly. The database service pagination logic (`spdatabaseservices/DBFunctions/ProductDb.js`, lines 585-670) uses correct math: `skip = (page-1) * limit`, `take = limit`. The Prisma query itself is correct.

**Possible causes:**
- The `page` param may not be reaching the DB service (lost in one of the proxy layers)
- The ordering (`orderBy: { name: "asc" }`) combined with duplicate names could cause apparent duplicates
- Needs further debugging with request logging across all 3 services

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

**Workaround applied:** Frontend now reads both `article_no` and `articleNo` (`sp.article_no ?? sp.articleNo`).

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

**Root cause (confirmed across all services):** Multiple issues compound:

1. **Gateway routing is actually correct** — the gateway calls `authService.GetAllProductCategories()` which hits the Database Service directly. This is consistent because ALL other endpoints also ultimately call the same Database Service (the Product Service is just another proxy layer).

2. **The DB service endpoint exists** — `GET /spdatbaseservice/api/v1/product/all-categories` is defined in `spdatabaseservices/routes/setup.js` (line 439) and calls `ProductDb.AllCategories()`.

3. **Most likely cause: categories were never seeded.** The category data must be loaded by calling `GET /spdatbaseservice/api/v1/script/load-category`, which reads from `spdatabaseservices/Data/part_categories.json` and populates the `Category` table. If this script was never run on the live database, the table is empty.

4. **Response structure mismatch:** The DB service returns `{ categories: [...], meta: {...} }` but the gateway expects `data` to be the array directly. The controller wraps it as `{ data: { categories: [], meta: {} } }` — the frontend may need to read `data.categories` not `data` directly.

5. **No `count` field:** The `Category` schema has no `count` field. Counts would need to be computed via a `_count` relation or aggregation query.

**Gateway files:**
- `gateway/src/controllers/product/category.ts` (line 37)
- `gateway/src/services/api/auth.service.ts` (lines 171-183)

**DB service files:**
- `spdatabaseservices/DBFunctions/ProductDb.js` (lines 407-480) — AllCategories query
- `spdatabaseservices/controllers/ScriptController.js` (lines 15-83) — category seed script
- `spdatabaseservices/Data/part_categories.json` — seed data file
- `spdatabaseservices/prisma/schema.prisma` (lines 818-827) — Category model

**Fix required:**
1. Run the seed script on the live database: `GET /script/load-category`
2. Add `count` computation (e.g., Prisma `_count: { spareParts: true }`)
3. Fix response structure to return `data: [...]` not `data: { categories: [...] }`

**Expected:** Return categories with `count` and `parent_ID` for hierarchy.

---

### INV-12. All list endpoints default to `limit=15`, large limits cause 500 errors
**Priority:** Medium
**Endpoints:** `car-manufacturers-all`, `car-brands-all`, `car-models-all`, `sparepart-all`

All default to 15 items/page. The `limit` param works but max varies:
- `limit=100`: reliable
- `limit=150`: works
- `limit=200+`: sometimes returns 500 errors

**Root cause (confirmed in gateway repo):** The gateway has **no limit validation or cap** — it passes the client's `limit` value directly to the downstream service (`limit=${query.limit ?? 15}`). The 500 errors on large limits are from the downstream product service, not the gateway.

For `car-manufacturers-all` (712 records), the frontend must fetch all 8 pages (100 per page) to populate the combobox. The `search` param is forwarded and works for filtering.

**Workaround applied:** Frontend fetches all pages in parallel using `meta.totalPages` from the first response.

**Ideal fix:** The downstream product service should support `limit=500+` reliably, or the gateway should implement server-side result caching for dropdown data.
