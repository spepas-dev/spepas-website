#!/usr/bin/env node
// scripts/import-local-inventory.mjs
// Reads TecDoc vehicle/category CSVs + parts CSVs → writes SQLite DB
//
// Usage:
//   node scripts/import-local-inventory.mjs                (full import)
//   node scripts/import-local-inventory.mjs --vehicles=500 (quick smoke test)
//   node scripts/import-local-inventory.mjs --clean        (drop all tables first)

import Database from 'better-sqlite3';
import { createReadStream, mkdirSync } from 'fs';
import { createInterface } from 'readline';
import { resolve } from 'path';
import { glob } from 'fs/promises';
import { randomUUID } from 'crypto';

// ── Config ───────────────────────────────────────────────────────────────────

const SRC_ROOT =
  process.env.LOCAL_INVENTORY_SRC ??
  '/Users/gaiacarini/Library/CloudStorage/OneDrive-Spepas/SPEPAS GLOBAL/SPEPAS PRODUCT/Scraping Results/rapidapi';

const DB_PATH =
  process.env.LOCAL_INVENTORY_DB ?? resolve(process.cwd(), 'local-data/inventory.db');

const MAX_VEHICLES = (() => {
  const flag = process.argv.find(a => a.startsWith('--vehicles='));
  return flag ? parseInt(flag.split('=')[1]) : Infinity;
})();

const CLEAN = process.argv.includes('--clean');

// ── Helpers ──────────────────────────────────────────────────────────────────

function log(msg) {
  process.stdout.write(`[import] ${msg}\n`);
}

async function readCsv(filepath) {
  const rows = [];
  let headers = null;
  const rl = createInterface({ input: createReadStream(filepath), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!headers) {
      headers = line.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      continue;
    }
    if (!line.trim()) continue;
    const vals = parseCsvLine(line);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
    rows.push(obj);
  }
  return rows;
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

async function globFiles(pattern) {
  const results = [];
  for await (const f of glob(pattern)) {
    results.push(f);
  }
  return results.sort();
}

// ── Schema ───────────────────────────────────────────────────────────────────

const TABLES = ['part_vehicles', 'parts', 'car_models', 'car_brands', 'manufacturers', 'categories'];

function dropAll(db) {
  log('Dropping all tables (--clean)…');
  for (const t of TABLES) {
    db.exec(`DROP TABLE IF EXISTS ${t}`);
  }
}

function createSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS manufacturers (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      uuid TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS car_brands (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      name            TEXT NOT NULL,
      year_from       INTEGER,
      year_to         INTEGER,
      manufacturer_id INTEGER NOT NULL REFERENCES manufacturers(id),
      uuid            TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS car_models (
      id                 INTEGER PRIMARY KEY AUTOINCREMENT,
      type_name          TEXT NOT NULL,
      construction_start INTEGER,
      construction_end   INTEGER,
      fuel_type          TEXT,
      body_type          TEXT,
      drive_type         TEXT,
      power_ps           INTEGER,
      car_brand_id       INTEGER NOT NULL REFERENCES car_brands(id),
      uuid               TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS categories (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT NOT NULL,
      parent_id INTEGER REFERENCES categories(id),
      level     INTEGER DEFAULT 0,
      uuid      TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS parts (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      product_name   TEXT NOT NULL,
      image_url      TEXT,
      category_id    INTEGER REFERENCES categories(id),
      uuid           TEXT NOT NULL UNIQUE,
      article_no     TEXT,
      supplier_name  TEXT,
      supplier_id    TEXT
    );

    CREATE TABLE IF NOT EXISTS part_vehicles (
      part_id    INTEGER NOT NULL REFERENCES parts(id),
      vehicle_id INTEGER NOT NULL REFERENCES car_models(id),
      PRIMARY KEY (part_id, vehicle_id)
    );
  `);
}

function createIndexes(db) {
  log('Creating indexes…');
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_pv_vehicle_id      ON part_vehicles(vehicle_id);
    CREATE INDEX IF NOT EXISTS idx_pv_part_id         ON part_vehicles(part_id);
    CREATE INDEX IF NOT EXISTS idx_parts_category_id  ON parts(category_id);
    CREATE INDEX IF NOT EXISTS idx_parts_product_name ON parts(product_name);
    CREATE INDEX IF NOT EXISTS idx_car_models_brand   ON car_models(car_brand_id);
    CREATE INDEX IF NOT EXISTS idx_car_brands_mfr     ON car_brands(manufacturer_id);
    CREATE INDEX IF NOT EXISTS idx_car_models_year    ON car_models(construction_start);
  `);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(resolve(DB_PATH, '..'), { recursive: true });

  log(`Source: ${SRC_ROOT}`);
  log(`Output: ${DB_PATH}`);
  if (MAX_VEHICLES < Infinity) log(`Limiting to ${MAX_VEHICLES} vehicles`);

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('foreign_keys = OFF'); // speed up bulk insert

  if (CLEAN) dropAll(db);
  createSchema(db);

  // Prepared statement for last_insert_rowid()
  const lastId = db.prepare('SELECT last_insert_rowid() AS id');

  // ── 1. Manufacturers ──────────────────────────────────────────────────────
  log('Importing manufacturers…');
  const mfrFiles = await globFiles(`${SRC_ROOT}/manufacturers*.csv`);

  // Use INSERT ... ON CONFLICT for idempotent upserts (fix #5: re-run updates data)
  const upsertMfr = db.prepare(
    `INSERT INTO manufacturers (name, uuid) VALUES (?, ?)
     ON CONFLICT(uuid) DO UPDATE SET name = excluded.name`
  );

  // Fix #7: use uuid-keyed map instead of name-keyed to avoid collisions
  const mfrUuidToId = new Map();
  let mfrInserted = 0;

  for (const file of mfrFiles) {
    const rows = await readCsv(file);
    const run = db.transaction(() => {
      for (const row of rows) {
        const name = (row.mfa_brand || row.manufacturerName || row.name || '').trim();
        const uuid = row.mfa_id ? String(row.mfa_id) : row.manufacturerId ? String(row.manufacturerId) : randomUUID();
        if (!name) continue;
        upsertMfr.run(name, uuid);
        mfrInserted++;
      }
    });
    run();
  }

  // Build uuid→id map from DB (accurate regardless of insert/update)
  const allMfrs = db.prepare('SELECT id, name, uuid FROM manufacturers').all();
  for (const m of allMfrs) mfrUuidToId.set(m.uuid, m.id);
  const mfrNameToId = new Map(allMfrs.map(m => [m.name, m.id]));
  // Fix #8: report actual DB count, not insert attempts
  log(`  ${allMfrs.length} manufacturers (${mfrInserted} rows processed)`);

  // ── 2. Car Brands (model lines) ───────────────────────────────────────────
  log('Importing car brands…');
  const brandFiles = await globFiles(`${SRC_ROOT}/models*.csv`);
  const upsertBrand = db.prepare(
    `INSERT INTO car_brands (name, year_from, year_to, manufacturer_id, uuid) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(uuid) DO UPDATE SET
       name = excluded.name,
       year_from = excluded.year_from,
       year_to = excluded.year_to,
       manufacturer_id = excluded.manufacturer_id`
  );
  let brandProcessed = 0;

  for (const file of brandFiles) {
    const rows = await readCsv(file);
    const run = db.transaction(() => {
      for (const row of rows) {
        const name = (row.mmo_name || row.modelName || row.name || '').trim();
        const uuid = row.mmo_id ? String(row.mmo_id) : row.modelId ? String(row.modelId) : randomUUID();
        const yearFromRaw = row.mmo_pcon_start || row.modelYearFrom || '';
        const yearToRaw = row.mmo_pcon_end || row.modelYearTo || '';
        const yearFrom = parseInt(yearFromRaw) || null;
        const yearTo = parseInt(yearToRaw) || null;
        const mfrUuid = String(row.mfa_id || row.manufacturerId || '');
        const mfrId = mfrUuidToId.get(mfrUuid) ?? mfrNameToId.get(row.mfa_brand || row.manufacturer) ?? null;
        if (!name || !mfrId) continue;
        upsertBrand.run(name, yearFrom, yearTo, mfrId, uuid);
        brandProcessed++;
      }
    });
    run();
  }

  const allBrands = db.prepare('SELECT id, uuid FROM car_brands').all();
  const brandUuidToId = new Map(allBrands.map(b => [b.uuid, b.id]));
  log(`  ${allBrands.length} brands (${brandProcessed} rows processed)`);

  // ── 3. Car Models (engine variants) ──────────────────────────────────────
  log('Importing car models (vehicle variants)…');
  const vehicleFiles = await globFiles(`${SRC_ROOT}/vehicles*.csv`);
  const upsertModel = db.prepare(
    `INSERT INTO car_models
       (type_name, construction_start, construction_end, fuel_type, body_type, drive_type, power_ps, car_brand_id, uuid)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(uuid) DO UPDATE SET
       type_name = excluded.type_name,
       construction_start = excluded.construction_start,
       construction_end = excluded.construction_end,
       fuel_type = excluded.fuel_type,
       body_type = excluded.body_type,
       drive_type = excluded.drive_type,
       power_ps = excluded.power_ps,
       car_brand_id = excluded.car_brand_id`
  );
  let vehicleCount = 0;
  let skipped = 0;

  // Fix #6: collect all imported vehicle UUIDs so we can validate part_vehicles later
  const importedVehicleUuids = new Set();

  for (const file of vehicleFiles) {
    if (vehicleCount >= MAX_VEHICLES) break;
    const rows = await readCsv(file);
    const run = db.transaction(() => {
      for (const row of rows) {
        if (vehicleCount >= MAX_VEHICLES) return;
        const uuid = String(row.passanger_car_id || row.vehicleId || row.typ_id || randomUUID());
        const yearStartRaw = row.typ_pcon_start || row.constructionStart || '';
        const yearStart = parseInt(yearStartRaw) || null;
        const brandUuid = String(row.mmo_id || row.modelId || '');
        const brandId = brandUuidToId.get(brandUuid) ?? null;
        if (!brandId) { skipped++; continue; }
        const typeName = (row.typ_name || row.typeEngineName || row.type_name || '').trim();
        const yearEndRaw = row.typ_pcon_end || row.constructionEnd || '';
        const yearEnd = parseInt(yearEndRaw) || null;
        const fuelType = (row.typ_motor || row.fuelType || row.fuel_type || '').trim();
        const bodyType = (row.typ_karosserieform || row.bodyType || row.body_type || '').trim();
        const driveType = (row.typ_antriebsart || row.driveType || row.drive_type || '').trim();
        const powerPs = parseInt(row.typ_kw_von || row.powerPs) || 0;
        upsertModel.run(typeName, yearStart, yearEnd, fuelType, bodyType, driveType, powerPs, brandId, uuid);
        importedVehicleUuids.add(uuid);
        vehicleCount++;
      }
    });
    run();
  }
  log(`  ${vehicleCount} vehicle variants (${skipped} skipped — missing brand)`);

  const allModels = db.prepare('SELECT id, uuid FROM car_models').all();
  const modelUuidToId = new Map(allModels.map(m => [m.uuid, m.id]));

  // Fix #6: warn if --vehicles limit is active and parts will be affected
  if (MAX_VEHICLES < Infinity) {
    log(`  WARNING: --vehicles=${MAX_VEHICLES} active — part_vehicles pairs referencing non-imported vehicles will be skipped`);
  }

  // ── 4. Categories ─────────────────────────────────────────────────────────
  log('Importing categories…');
  const catFiles = await globFiles(`${SRC_ROOT}/*categories*.csv`);

  // Fix #1 + #5: upsert categories and use a third pass to fix parent_id links
  const upsertCatNoParent = db.prepare(
    `INSERT INTO categories (name, parent_id, level, uuid) VALUES (?, NULL, ?, ?)
     ON CONFLICT(uuid) DO UPDATE SET name = excluded.name, level = excluded.level`
  );
  const updateCatParent = db.prepare(
    `UPDATE categories SET parent_id = ? WHERE uuid = ?`
  );

  // Collect all category rows across files for the linking pass
  const allCatRows = [];

  for (const file of catFiles) {
    const rows = await readCsv(file);

    // Pass 1: insert ALL categories without parent links
    const run1 = db.transaction(() => {
      for (const row of rows) {
        const name = (row.str_node_des || row.categoryName || row.name || '').trim();
        const uuid = String(row.str_id || row.categoryId || randomUUID());
        const parentUuid = String(row.str_id_parent || row.parentCategoryId || '');
        const isChild = parentUuid && parentUuid !== '0' && parentUuid !== '';
        const level = isChild ? 1 : (parseInt(row.level) || 0);

        upsertCatNoParent.run(name, level, uuid);
        allCatRows.push({ uuid, parentUuid: isChild ? parentUuid : null });
      }
    });
    run1();
  }

  // Pass 2: now all categories exist — link parent_id by UUID
  const catUuidToIdMap = new Map(
    db.prepare('SELECT id, uuid FROM categories').all().map(c => [c.uuid, c.id])
  );

  let parentLinked = 0;
  let parentMissing = 0;
  const linkParents = db.transaction(() => {
    for (const { uuid, parentUuid } of allCatRows) {
      if (!parentUuid) continue;
      const parentId = catUuidToIdMap.get(parentUuid);
      if (parentId != null) {
        updateCatParent.run(parentId, uuid);
        parentLinked++;
      } else {
        parentMissing++;
      }
    }
  });
  linkParents();

  const catCount = db.prepare('SELECT COUNT(*) AS n FROM categories').get().n;
  log(`  ${catCount} categories (${parentLinked} linked to parents, ${parentMissing} orphaned — parent UUID not found)`);

  // Refresh uuid→id map
  const catUuidToId = new Map(
    db.prepare('SELECT id, uuid FROM categories').all().map(c => [c.uuid, c.id])
  );

  // ── 5. Parts ─────────────────────────────────────────────────────────────
  log(`Importing parts…`);

  const insertPartVehicle = db.prepare(
    `INSERT OR IGNORE INTO part_vehicles (part_id, vehicle_id) VALUES (?, ?)`
  );

  let partRows = 0;
  let pairsInserted = 0;
  let pairsSkippedNoVehicle = 0;

  const partFiles = await globFiles(
    `${SRC_ROOT}/detailed parts/complete/parts_complete_vehicles_*.csv`
  );
  if (partFiles.length === 0) {
    log('  WARNING: No files found in detailed parts/complete/ — skipping parts import');
    log(`  Expected: ${SRC_ROOT}/detailed parts/complete/parts_complete_vehicles_*.csv`);
  }

  // Fix #5: upsert parts too
  const upsertPart = db.prepare(
    `INSERT INTO parts (product_name, image_url, category_id, uuid, article_no, supplier_name, supplier_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(uuid) DO UPDATE SET
       product_name = excluded.product_name,
       image_url = excluded.image_url,
       category_id = excluded.category_id,
       article_no = excluded.article_no,
       supplier_name = excluded.supplier_name,
       supplier_id = excluded.supplier_id`
  );

  // Fix #3: pre-build a lookup for parts we've seen, and use last_insert_rowid()
  // instead of per-row SELECT
  const articleUuidToId = new Map();

  // Pre-load existing parts from DB (for re-run support)
  for (const p of db.prepare('SELECT id, uuid FROM parts').all()) {
    articleUuidToId.set(p.uuid, p.id);
  }

  // Prepare a single lookup for getting the id after upsert
  const getPartId = db.prepare('SELECT id FROM parts WHERE uuid = ?');

  for (const file of partFiles) {
    log(`  Processing ${file.split('/').pop()}…`);
    const rows = await readCsv(file);

    const run = db.transaction(() => {
      for (const row of rows) {
        const vehicleUuid = String(row.vehicleId || '');
        const articleUuid = String(row.articleId || '');
        const productName = (row.articleProductName || '').trim();
        const catUuid = String(row.categoryId || '');

        if (!vehicleUuid || !articleUuid || !productName) continue;

        const vehicleId = modelUuidToId.get(vehicleUuid) ?? null;
        if (!vehicleId) {
          // Fix #6: count skipped pairs when vehicle wasn't imported
          pairsSkippedNoVehicle++;
          continue;
        }

        if (!articleUuidToId.has(articleUuid)) {
          const catId = catUuidToId.get(catUuid) ?? null;
          const imageUrl = (row.s3image || '').trim() || null;
          const articleNo = (row.articleNo || '').trim() || null;
          const supplierName = (row.supplierName || '').trim() || null;
          const supplierId = String(row.supplierId || '') || null;

          upsertPart.run(productName, imageUrl, catId, articleUuid, articleNo, supplierName, supplierId);
          // Fix #3: use a single lookup only for new inserts (not per-row inside hot loop)
          const partId = lastId.get().id;
          // Verify the id is for our row (handles upsert case where lastId may not update)
          if (partId) {
            const verified = getPartId.get(articleUuid);
            if (verified) {
              articleUuidToId.set(articleUuid, verified.id);
              partRows++;
            }
          }
        }

        const partId = articleUuidToId.get(articleUuid);
        if (!partId) continue;

        insertPartVehicle.run(partId, vehicleId);
        pairsInserted++;
      }
    });
    run();
  }

  log(`  ${articleUuidToId.size} unique articles, ${pairsInserted} part-vehicle pairs`);
  if (pairsSkippedNoVehicle > 0) {
    log(`  ${pairsSkippedNoVehicle} part-vehicle pairs skipped (vehicle not imported)`);
  }

  // ── 6. Indexes ────────────────────────────────────────────────────────────
  createIndexes(db);

  // Fix #4: re-enable foreign key checks and validate
  db.pragma('foreign_keys = ON');
  const fkErrors = db.pragma('foreign_key_check');
  if (fkErrors.length > 0) {
    log(`  WARNING: ${fkErrors.length} foreign key violations found`);
    // Show first few
    for (const err of fkErrors.slice(0, 10)) {
      log(`    table=${err.table} rowid=${err.rowid} parent=${err.parent} fkid=${err.fkid}`);
    }
    if (fkErrors.length > 10) log(`    … and ${fkErrors.length - 10} more`);
  } else {
    log('  Foreign key check passed');
  }

  // ── 7. Summary ────────────────────────────────────────────────────────────
  const stats = {
    manufacturers: db.prepare('SELECT COUNT(*) AS n FROM manufacturers').get().n,
    brands:        db.prepare('SELECT COUNT(*) AS n FROM car_brands').get().n,
    models:        db.prepare('SELECT COUNT(*) AS n FROM car_models').get().n,
    categories:    db.prepare('SELECT COUNT(*) AS n FROM categories').get().n,
    parts:         db.prepare('SELECT COUNT(*) AS n FROM parts').get().n,
    pairs:         db.prepare('SELECT COUNT(*) AS n FROM part_vehicles').get().n,
  };

  db.close();

  log('');
  log('Import complete:');
  log(`  Manufacturers : ${stats.manufacturers}`);
  log(`  Car brands    : ${stats.brands}`);
  log(`  Car models    : ${stats.models}`);
  log(`  Categories    : ${stats.categories}`);
  log(`  Parts         : ${stats.parts}`);
  log(`  Part-vehicle  : ${stats.pairs}`);
  log(`  DB written to : ${DB_PATH}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
