# Inventory Database Schema

SQLite database (`inventory.db`) containing the TecDoc-sourced parts catalog.

## Entity-Relationship Diagram

```mermaid
erDiagram
    manufacturers {
        INTEGER id PK "AUTOINCREMENT"
        TEXT name "NOT NULL"
        TEXT uuid "UNIQUE"
    }

    car_brands {
        INTEGER id PK "AUTOINCREMENT"
        TEXT name "NOT NULL"
        INTEGER year_from
        INTEGER year_to
        INTEGER manufacturer_id FK
        TEXT uuid "UNIQUE"
    }

    car_models {
        INTEGER id PK "AUTOINCREMENT"
        TEXT type_name "NOT NULL"
        INTEGER construction_start
        INTEGER construction_end
        TEXT fuel_type
        TEXT body_type
        TEXT drive_type
        INTEGER power_ps
        INTEGER car_brand_id FK
        TEXT uuid "UNIQUE"
    }

    categories {
        INTEGER id PK "AUTOINCREMENT"
        TEXT name "NOT NULL"
        INTEGER parent_id FK "self-ref"
        INTEGER level "0 or 1"
        TEXT uuid "UNIQUE"
    }

    parts {
        INTEGER id PK "AUTOINCREMENT"
        TEXT product_name "NOT NULL"
        TEXT image_url
        INTEGER category_id FK
        TEXT article_no
        TEXT supplier_name
        TEXT supplier_id
        TEXT uuid "UNIQUE"
    }

    part_vehicles {
        INTEGER part_id PK, FK
        INTEGER vehicle_id PK, FK
    }

    manufacturers ||--o{ car_brands : "has"
    car_brands ||--o{ car_models : "has"
    categories ||--o{ categories : "parent"
    categories ||--o{ parts : "contains"
    parts ||--o{ part_vehicles : ""
    car_models ||--o{ part_vehicles : ""
```

## Row Counts

| Table          | Rows        |
|----------------|-------------|
| manufacturers  | ~698        |
| car_brands     | ~2,022      |
| car_models     | ~11,178     |
| categories     | ~1,323      |
| parts          | ~337,288    |
| part_vehicles  | ~12,620,921 |

## Indexes

| Index                      | Table          | Column(s)          |
|----------------------------|----------------|--------------------|
| idx_pv_part_id             | part_vehicles  | part_id            |
| idx_pv_vehicle_id          | part_vehicles  | vehicle_id         |
| idx_parts_category_id      | parts          | category_id        |
| idx_parts_product_name     | parts          | product_name       |
| idx_car_models_brand       | car_models     | car_brand_id       |
| idx_car_brands_mfr         | car_brands     | manufacturer_id    |
| idx_car_models_year        | car_models     | construction_start |

## Notes

- **Source**: TecDoc automotive parts catalog
- **part_vehicles** is the junction table for the many-to-many between parts and car_models (~12.6M associations)
- **categories** uses a 2-level adjacency list (top-level `level=0`, children `level=1`)
- All domain tables carry a `uuid` column for external API correlation
