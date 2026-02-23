# Issue Tracking

Issues that require backend changes before the frontend can fully use them.
Frontend code has been written defensively (optional fields, loosened schemas)
to work with the local mock in the meantime.

---

## Inventory API

### [INV-1] Add `fuelType` and `bodyType` to car model responses

**Endpoint:** `GET /inventry/car-models-all`

The frontend shop page uses `fuelType` and `bodyType` to power sidebar filter
checkboxes. The local mock already returns these fields from the TecDoc CSV data.
The real API currently omits them.

**Required change:** include `fuelType` (e.g. `"Petrol"`, `"Diesel"`) and
`bodyType` (e.g. `"Saloon"`, `"Hatchback"`) in each car model object.

---

### [INV-2] Add `GET /inventry/car-years-all` endpoint

The shop page Year dropdown needs a list of distinct manufacture years to show
the user. The local mock serves this from the SQLite DB.

**Required change:** add endpoint returning:
```json
{ "status": 200, "message": "success", "data": [2024, 2023, 2022, ...] }
```
Years should be ≥ 2010, sorted descending.

---

### [INV-3] Support filter query params on `GET /inventry/sparepart-all`

The frontend passes these as query params to narrow results server-side:

| Param | Type | Description |
|---|---|---|
| `brandId` | string (UUID) | Filter parts compatible with this car brand |
| `categoryId` | string (UUID) | Filter by part category |
| `fuelType` | string | Filter by vehicle fuel type |
| `bodyType` | string | Filter by vehicle body type |
| `search` | string | Full-text search on part name |
| `limit` | number | Page size (default 48) |
| `offset` | number | Pagination offset |

**Required change:** apply these filters in the query and return a `total` count
alongside the paginated `data` array:
```json
{ "status": 200, "message": "success", "total": 312, "data": [...] }
```

---

### [INV-4] Support filter query params on `GET /inventry/category-all`

The sidebar shows a part count next to each category, scoped to the selected
vehicle. Without server-side filtering the counts are unscoped (all vehicles).

| Param | Type | Description |
|---|---|---|
| `brandId` | string (UUID) | Scope counts to this car brand |
| `fuelType` | string | Further scope by fuel type |
| `bodyType` | string | Further scope by body type |

**Required change:** when params are present, return `COUNT(DISTINCT part_id)`
per category for the matching vehicle set, not the global count.

---

### [INV-5] Support `year` and `manufacturerId` query params on brand/model endpoints

The Year → Make → Model cascade in the shop selector needs scoped lists:

- `GET /inventry/car-manufacturers-all?year=2022` — only manufacturers with
  models from that year
- `GET /inventry/car-brands-all?year=2022&manufacturerId=<uuid>` — only brands
  for that manufacturer + year

**Required change:** add optional `year` and `manufacturerId` params to these
endpoints and apply them as filters.
