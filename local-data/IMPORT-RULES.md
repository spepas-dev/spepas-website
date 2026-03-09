# Local Inventory Import Rules

> **Source:** TecDoc CSV files in `OneDrive > SPEPAS PRODUCT > Scraping Results > rapidapi/`
> **Target:** `local-data/inventory.db` (SQLite)

---

## Source CSV Files

| File | Key Columns | Description |
|------|-------------|-------------|
| `manufacturers.csv` | manufacturerId, manufacturerName | All car manufacturers |
| `models_by_manufacturer.csv` | manufacturer, manufacturerId, modelId, modelName, yearFrom, yearTo | Car models (= "brands" in DB) per manufacturer |
| `vehicles_detailed.csv` | vehicleId, modelId, typeEngineName, constructionStart, bodyType, engineType, fuelType, driveType, ... | Specific vehicle variants (engine/trim) |
| `part_categories.csv` | categoryId, categoryName, parentCategoryId, level | 2-level category taxonomy |
| `detailed parts/complete/*.csv` | articleId, articleNo, supplierName, supplierId, articleProductName, productId, s3image, vehicleId, categoryId | Parts linked to vehicles |

### Data hierarchy

```
manufacturer
  └── model / "brand"                 ← models_by_manufacturer.csv
        └── vehicle                   ← vehicles_detailed.csv
              └── part (via junction) ← detailed parts CSVs
```

---

## Filtering Rules

### 1. Manufacturers — keep only those with parts

Keep only manufacturers that have at least one part linked through the full chain (model → vehicle → part). All other manufacturers are empty shells — remove them.

### 2. Models — remove discontinued before 2010

Remove any model (from `models_by_manufacturer.csv`) where `modelYearTo` is before 2010-01-01. Models with no `modelYearTo` (still in production) are always kept. Only models explicitly discontinued before 2010 are removed.

### 3. Vehicles — keep only those belonging to kept models

Remove any vehicle (from `vehicles_detailed.csv`) whose `modelId` doesn't reference a kept model from rule 2.

### 4. Parts — keep only those linked to kept vehicles

Remove any part row (from `detailed parts/complete/*.csv`) whose `vehicleId` doesn't reference a kept vehicle from rule 3. After import, also remove any part that has zero vehicle links.

### 5. Categories — import full tree

Import all categories from `part_categories.csv`. Keep the entire taxonomy regardless of whether categories have parts linked — the full tree is useful for reference and future data expansion.

---

## Schema Rules

### Use TecDoc IDs as primary keys

Use the original TecDoc IDs (`manufacturerId`, `modelId`, `vehicleId`, `articleId`, `categoryId`) as primary keys in the DB instead of autoincrement IDs. This allows direct cross-referencing between the DB and CSV source files.

### Keep combined chassis codes as-is

TecDoc model names sometimes combine multiple chassis codes: e.g. `3 (F30, F80)`. These should remain as-is (single entry) since that's how TecDoc identifies them — one `modelId` maps to the combined name. Do NOT split into separate entries.

### Column mapping

| CSV Source | DB Table | CSV Column → DB Column |
|------------|----------|----------------------|
| manufacturers.csv | manufacturers | manufacturerId → id, manufacturerName → name |
| models_by_manufacturer.csv | car_brands | modelId → id, modelName → name, manufacturerId → manufacturer_id, modelYearFrom → year_from (extract year), modelYearTo → year_to (extract year) |
| vehicles_detailed.csv | car_models | vehicleId → id, typeEngineName → type_name, constructionStart → construction_start (extract year), constructionEnd → construction_end (extract year), fuelType → fuel_type, bodyType → body_type, driveType → drive_type, powerPs → power_ps, modelId → car_brand_id (FK to car_brands) |
| part_categories.csv | categories | categoryId → id, categoryName → name, parentCategoryId → parent_id, level → level |
| detailed parts CSVs | parts | articleId → id, articleProductName → product_name, s3image → image_url, categoryId → category_id, articleNo → article_no, supplierName → supplier_name, supplierId → supplier_id |
| detailed parts CSVs | part_vehicles | articleId → part_id, vehicleId → vehicle_id |

### UUID column

The `uuid` column on each table is for external API correlation. Generate a UUID v4 for each row during import.
