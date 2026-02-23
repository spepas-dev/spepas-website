# Changes Since Last Commit (`31d21f4`)

This document records every change made after the last commit so they can be selectively re-applied after a revert.

---

## 1. Parts Catalogue — Local SQLite Dev Mock

The largest body of work. Lets the front-end run fully offline against real TecDoc/RapidAPI CSV data served from a local SQLite database, without hitting the live API.

### New files

| File | Purpose |
|---|---|
| `vite-plugin-local-inventory.ts` | Vite dev-server plugin — intercepts `/inventry/*` API calls and serves them from SQLite |
| `scripts/import-local-inventory.mjs` | One-time import script: reads TecDoc CSVs → writes SQLite DB |

### `vite-plugin-local-inventory.ts` — key features

- **`cleanBrandName(name)`** — strips TecDoc chassis code suffixes (`(_E15_)`, `(F30, F80)`) **and** body-type suffixes (`Saloon`, `Hatchback`, `Estate`, `Van`, `Bus`, `Coupe`, `Convertible`, `Pickup`, etc.) so "COROLLA Saloon" and "COROLLA Hatchback" merge into a single "COROLLA" entry.
- **Brand merging** — same-name brands across chassis generations are grouped; the `CarBrand_ID` field returns all generation UUIDs pipe-separated (e.g. `"uuid1|uuid2|uuid3"`). Part counts therefore reflect all generations.
- **`brandUuidCondition()`** — splits pipe-separated UUIDs into a SQL `IN (?,?,?)` condition, used in every query that filters by brand.
- **Junction-table queries** — all part lookups go through the `part_vehicles` many-to-many table (not a single `vehicle_id` column on `parts`), so a part that fits many vehicles is found for all of them.
- **`COUNT(DISTINCT p.id)`** — used in paginated counts and category counts to avoid double-counting the same part across multiple vehicle matches.
- **Endpoints served:**
  - `GET /inventry/car-years-all`
  - `GET /inventry/car-manufacturers-all[?year=N]`
  - `GET /inventry/car-brands-all[?year=N&manufacturerId=UUID]`
  - `GET /inventry/car-models-all[?year=N&brandId=UUID]`
  - `GET /inventry/category-all[?brandId=&fuelType=&bodyType=]` — category counts filtered per vehicle
  - `GET /inventry/sparepart-all[?brandId=&categoryId=&fuelType=&bodyType=&search=&limit=&offset=]` — paginated parts with server-side filtering
  - `GET /inventry/sparepart-detail/:code`
- **`MIN_YEAR = 2010`** — only vehicles from 2010 onwards are served (cuts noise from older data)

### `scripts/import-local-inventory.mjs` — key features

- Reads vehicle/category CSVs from `LOCAL_INVENTORY_SRC` (defaults to the OneDrive rapidapi folder on Gaia's machine)
- Reads **simplified** parts CSVs from `LOCAL_INVENTORY_SRC/simplified/`
- Writes to `LOCAL_INVENTORY_DB` (default: `local-data/inventory.db`)
- `--vehicles=N` flag for quick smoke tests

#### Data source: simplified parts

Parts come from `rapidapi/simplified/*.csv` — a pre-processed dataset that collapses all supplier-specific SKUs (different brands selling the same part) into one **generic product concept** per (vehicle, part type) combination.

| Metric | Raw detailed data | Simplified data (current) |
|---|---|---|
| CSV rows | 12.7 M | 500,419 |
| Unique parts | 337,293 | **320** |
| Part-vehicle pairs | 12.6 M | 500,419 |
| DB size | ~840 MB | **~28 MB** |
| Import time | ~5 min | ~30 sec |

The 320 generic parts are concepts like "Oil Filter", "Alternator", "Brake Pad" — no supplier name or article number. A typical vehicle (e.g. a Toyota Corolla variant) has ~15–60 matching parts.

#### Simplified CSV columns
```
vehicleId, productId, articleProductName, categoryId,
image_url_1, image_url_2, image_url_3, image_url_4, image_url_5, total_images
```

#### DB schema
```sql
manufacturers (id, name, uuid)
car_brands    (id, name, year_from, year_to, manufacturer_id, uuid)
car_models    (id, type_name, construction_start, construction_end, fuel_type, body_type, power_ps, car_brand_id, uuid)
categories    (id, name, parent_id, level, uuid)
parts         (id, product_name, image_url, category_id, uuid)
part_vehicles (part_id, vehicle_id)   -- many-to-many junction table
```

No `article_no`, `supplier_name`, or `supplier_id` columns — removed because the simplified data does not carry supplier information. `image_url` is the first non-empty value from `image_url_1..5`.

### Config wiring

**`package.json`** — two new scripts:
```json
"local-data:import":       "node scripts/import-local-inventory.mjs",
"local-data:import:quick": "node scripts/import-local-inventory.mjs --vehicles=500"
```
Added `better-sqlite3` + `@types/better-sqlite3` as dev dependencies.

**`vite.config.ts`** — loads `localInventoryPlugin` when `VITE_USE_LOCAL_DATA=true`.

**`.env`** — added `VITE_USE_LOCAL_DATA=false` (default off; override in `.env.local`).

**`.gitignore`** — added `local-data/*.db`.

**`tsconfig.node.json`** — added `vite-plugin-local-inventory.ts` to `include`.

---

## 2. Shop Page (`src/components/marketing/ShopWithoutSidebar/index.tsx`)

Complete rewrite. Previously a placeholder; now a fully functional parts catalogue.

### Vehicle selector (cascading)
- Year → Make → Model dropdowns, each enabled only after the parent is selected
- React Query fetches from the new inventory endpoints
- Resets child selections when a parent changes

### Category sidebar
- Grouped by parent category
- Shows per-vehicle part counts (filtered by selected brand/fuel type/body type)
- "All parts" button at top

### Sidebar filters (below categories)
- **Fuel Type** — derived from engine variants of the selected model line
- **Body Type** — same source

### Active filter chips
- One chip per active filter (category, fuel type, body type, search query)
- Individual ✕ on each; "Clear all" when more than one active

### Pagination
- 48 parts per page
- Smart page number display (ellipsis for large ranges)

### Grid / list view
- `SingleGridItem` and `SingleListItem` used

---

## 3. Inventory API Layer (`src/lib/inventoryApis.ts`)

Previously only had live-API functions. Added:

- `SparePartsFilter.fuelType`, `bodyType` — wired through to query params
- `CategoryFilter` interface (`brandId?`, `fuelType?`, `bodyType?`)
- `getSparePartCategories(filters)` — passes vehicle context to category endpoint

---

## 4. Zod Validation (`src/lib/inventoryZodValidation.ts`)

- `carBrandSchema.CarBrand_ID` — changed from `z.string().uuid()` to `z.string()` (accepts pipe-separated UUIDs)
- `carModelSchema` — added `fuelType` and `bodyType` fields

> **Note:** `article_no`, `supplier_name`, and `supplierNamesResponseSchema` were added then removed when the data source switched to simplified CSVs.

---

## 5. Shop Cards

### `src/components/marketing/Shop/shopTypes.ts`
`ProductVM` type — no supplier/article fields (not in simplified data).

### `src/components/marketing/Shop/SingleGridItem.tsx`
Displays part name, image, "Price on request" label.

### `src/components/marketing/Shop/SingleListItem.tsx`
Same in list layout.

---

## 6. Product Detail Page (`src/components/marketing/ShopDetails/index.tsx`)

- Vehicle info labels renamed: Make / Model / Variant (was Manufacturer / Brand / Model)
- Graceful fallback when product not found (no thrown errors)
- Loading skeleton

---

## 7. Branding / Visual Polish

### `src/index.css`
- Primary colour tokens updated to SpePas Blue `#4A36EC` (was `#3C50E0`)
- Secondary colour tokens updated to SpePas Yellow `#F5B127`
- Full palette custom properties added (primary 50–900, secondary 50–900, error, success, neutral)
- Font family updated to Plus Jakarta Sans (Figma spec)

### `src/components/layout/marketing/Footer.tsx`
- Icon fill colours updated to `#4A36EC`

### `src/components/layout/marketing/Header/menuData.ts`
- Route paths audited and corrected
- Cart moved to right rail (icon, not text nav item)

### `src/components/layout/marketing/Header/Dropdown.tsx`
- Minor route / string fix

### `src/components/marketing/Footer/index.tsx`
- Colour / branding string updates

### `src/components/marketing/Contact/index.tsx`
- Minor string / layout updates

### `src/components/marketing/Home/Categories/index.tsx`
- Branding colour update

### `src/components/marketing/Home/NewArrivals/index.tsx`
- Branding / string update

### `src/pages/NotFound.tsx`
- Updated 404 page copy/layout

---

## 8. Documentation (`docs/`)

New directory (untracked):

| File | Content |
|---|---|
| `docs/branding-guidelines.md` | Full SpePas brand guidelines (colours, typography, palettes) extracted from Figma |
| `docs/architecture.md` | Website architecture overview |
| `docs/prd/parts-catalogue-prd.md` | Parts catalogue product requirements document |
| `docs/prd/spepas-overview.md` | Product overview |
| `docs/clickuptasks.md` | Task tracking notes |

---

## How to re-apply selectively after revert

After running `git checkout .` to revert tracked files, each feature above can be re-applied independently:

1. **Local SQLite mock** — copy back `vite-plugin-local-inventory.ts`, `scripts/import-local-inventory.mjs`, and the `package.json` / `vite.config.ts` / `.env` / `.gitignore` / `tsconfig.node.json` changes. Then run `pnpm local-data:import` to rebuild the DB.
2. **Shop page** — copy back `src/components/marketing/ShopWithoutSidebar/index.tsx`.
3. **Inventory API + validation** — copy back `src/lib/inventoryApis.ts` and `src/lib/inventoryZodValidation.ts`.
4. **Shop cards** — copy back `shopTypes.ts`, `SingleGridItem.tsx`, `SingleListItem.tsx`.
5. **Product detail** — copy back `src/components/marketing/ShopDetails/index.tsx`.
6. **Branding** — copy back `src/index.css` and the Header/Footer component changes.
