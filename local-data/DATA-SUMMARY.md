# Local Inventory — Data Summary

> **Generated:** 2026-03-08
> **Import rules:** [IMPORT-RULES.md](./IMPORT-RULES.md) · **Schema:** [SCHEMA.md](./SCHEMA.md)

---

## Row Counts

| Data | CSV File | CSV Rows | DB Table | DB Rows |
|------|----------|----------|----------|---------|
| Manufacturers | `manufacturers.csv` | 10 | `manufacturers` | 10 |
| Car brands (model lines) | `models_by_manufacturer.csv` | 1,065 | `car_brands` | 1,065 |
| Car models (vehicle variants) | `vehicles_detailed.csv` | 11,184 | `car_models` | 11,184 |
| Categories | `part_categories.csv` | 1,323 | `categories` | 1,323 |
| Parts (unique articles) | — | — | `parts` | 337,293 |
| Part-vehicle pairs | `detailed parts/complete/*.csv` | 12,727,773 | `part_vehicles` | 12,628,694 |

### Notes

- **Parts:** The CSV files contain part-vehicle rows (one row per part-vehicle pair), not unique parts. The 337,293 unique parts are deduplicated during import by `articleId`.
- **Part-vehicle pairs:** The CSV total (12,727,773) is higher than the DB (12,628,694) because the DB deduplicates exact `(part_id, vehicle_id)` pairs via `INSERT OR IGNORE`.
- **Categories:** Full TecDoc category tree imported (2-level hierarchy: 36 top-level + 1,287 children).

## Retained Manufacturers

| ID | Name |
|----|------|
| 16 | BMW |
| 45 | HONDA |
| 74 | MERCEDES-BENZ |
| 80 | NISSAN |
| 111 | TOYOTA |
| 121 | VW |
| 183 | HYUNDAI |
| 184 | KIA |
| 842 | LEXUS |
| 3522 | MERCEDES-BENZ FJDA |
