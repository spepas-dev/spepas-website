#!/usr/bin/env node
// scripts/import-local-inventory.mjs
// Reads TecDoc vehicle/category CSVs + simplified parts CSVs → writes SQLite DB
//
// Usage:
//   node scripts/import-local-inventory.mjs
//   node scripts/import-local-inventory.mjs --vehicles=500   (quick smoke test)

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

const MIN_YEAR = 2010;

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
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      product_name TEXT NOT NULL,
      image_url    TEXT,
      category_id  INTEGER REFERENCES categories(id),
      uuid         TEXT NOT NULL UNIQUE
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

  createSchema(db);

  // ── 1. Manufacturers ──────────────────────────────────────────────────────
  log('Importing manufacturers…');
  const mfrFiles = await globFiles(`${SRC_ROOT}/manufacturers*.csv`);
  const insertMfr = db.prepare(
    `INSERT OR IGNORE INTO manufacturers (name, uuid) VALUES (?, ?)`
  );
  const mfrNameToId = new Map();
  let mfrCount = 0;

  for (const file of mfrFiles) {
    const rows = await readCsv(file);
    const run = db.transaction(() => {
      for (const row of rows) {
        const name = (row.mfa_brand || row.name || '').trim();
        const uuid = row.mfa_id ? String(row.mfa_id) : randomUUID();
        if (!name) continue;
        insertMfr.run(name, uuid);
        const existing = db.prepare('SELECT id FROM manufacturers WHERE name = ?').get(name);
        if (existing) mfrNameToId.set(name, existing.id);
        mfrCount++;
      }
    });
    run();
  }
  log(`  ${mfrNameToId.size} manufacturers`);

  // Re-build full map from DB
  const allMfrs = db.prepare('SELECT id, name, uuid FROM manufacturers').all();
  const mfrUuidToId = new Map(allMfrs.map(m => [m.uuid, m.id]));
  const mfrNameToIdFull = new Map(allMfrs.map(m => [m.name, m.id]));

  // ── 2. Car Brands (model lines) ───────────────────────────────────────────
  log('Importing car brands…');
  const brandFiles = await globFiles(`${SRC_ROOT}/models*.csv`);
  const insertBrand = db.prepare(
    `INSERT OR IGNORE INTO car_brands (name, year_from, year_to, manufacturer_id, uuid) VALUES (?, ?, ?, ?, ?)`
  );
  let brandCount = 0;

  for (const file of brandFiles) {
    const rows = await readCsv(file);
    const run = db.transaction(() => {
      for (const row of rows) {
        const name = (row.mmo_name || row.name || '').trim();
        const uuid = row.mmo_id ? String(row.mmo_id) : randomUUID();
        const yearFrom = parseInt(row.mmo_pcon_start) || null;
        const yearTo = parseInt(row.mmo_pcon_end) || null;
        const mfrUuid = String(row.mfa_id || '');
        const mfrId = mfrUuidToId.get(mfrUuid) ?? mfrNameToIdFull.get(row.mfa_brand) ?? null;
        if (!name || !mfrId) continue;
        insertBrand.run(name, yearFrom, yearTo, mfrId, uuid);
        brandCount++;
      }
    });
    run();
  }
  log(`  ${brandCount} brand rows`);

  const allBrands = db.prepare('SELECT id, uuid FROM car_brands').all();
  const brandUuidToId = new Map(allBrands.map(b => [b.uuid, b.id]));

  // ── 3. Car Models (engine variants) ──────────────────────────────────────
  log('Importing car models (vehicle variants)…');
  const vehicleFiles = await globFiles(`${SRC_ROOT}/vehicles*.csv`);
  const insertModel = db.prepare(
    `INSERT OR IGNORE INTO car_models
       (type_name, construction_start, construction_end, fuel_type, body_type, power_ps, car_brand_id, uuid)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  let vehicleCount = 0;
  let skipped = 0;

  for (const file of vehicleFiles) {
    if (vehicleCount >= MAX_VEHICLES) break;
    const rows = await readCsv(file);
    const run = db.transaction(() => {
      for (const row of rows) {
        if (vehicleCount >= MAX_VEHICLES) return;
        const uuid = String(row.passanger_car_id || row.typ_id || randomUUID());
        const yearStart = parseInt(row.typ_pcon_start) || null;
        if (!yearStart || yearStart < MIN_YEAR) { skipped++; continue; }
        const brandUuid = String(row.mmo_id || '');
        const brandId = brandUuidToId.get(brandUuid) ?? null;
        if (!brandId) { skipped++; continue; }
        const typeName = (row.typ_name || row.type_name || '').trim();
        const yearEnd = parseInt(row.typ_pcon_end) || null;
        const fuelType = (row.typ_motor || row.fuel_type || '').trim();
        const bodyType = (row.typ_karosserieform || row.body_type || '').trim();
        const powerPs = parseInt(row.typ_kw_von) || 0;
        insertModel.run(typeName, yearStart, yearEnd, fuelType, bodyType, powerPs, brandId, uuid);
        vehicleCount++;
      }
    });
    run();
  }
  log(`  ${vehicleCount} vehicle variants (${skipped} skipped — pre-${MIN_YEAR} or missing brand)`);

  const allModels = db.prepare('SELECT id, uuid FROM car_models').all();
  const modelUuidToId = new Map(allModels.map(m => [m.uuid, m.id]));

  // ── 4. Categories ─────────────────────────────────────────────────────────
  log('Importing categories…');
  const catFiles = await globFiles(`${SRC_ROOT}/categories*.csv`);
  const insertCat = db.prepare(
    `INSERT OR IGNORE INTO categories (name, parent_id, level, uuid) VALUES (?, ?, ?, ?)`
  );

  for (const file of catFiles) {
    const rows = await readCsv(file);
    // First pass: insert parent categories
    const run1 = db.transaction(() => {
      for (const row of rows) {
        const name = (row.str_node_des || row.name || '').trim();
        const uuid = String(row.str_id || randomUUID());
        const parentUuid = String(row.str_id_parent || '');
        if (!parentUuid || parentUuid === '0' || parentUuid === '') {
          insertCat.run(name, null, 0, uuid);
        }
      }
    });
    run1();

    const catUuidToId = new Map(
      (db.prepare('SELECT id, uuid FROM categories').all()).map(c => [c.uuid, c.id])
    );

    // Second pass: insert child categories
    const run2 = db.transaction(() => {
      for (const row of rows) {
        const name = (row.str_node_des || row.name || '').trim();
        const uuid = String(row.str_id || randomUUID());
        const parentUuid = String(row.str_id_parent || '');
        if (parentUuid && parentUuid !== '0') {
          const parentId = catUuidToId.get(parentUuid) ?? null;
          insertCat.run(name, parentId, 1, uuid);
        }
      }
    });
    run2();
  }
  const catCount = db.prepare('SELECT COUNT(*) AS n FROM categories').get().n;
  log(`  ${catCount} categories`);

  const allCats = db.prepare('SELECT id, uuid FROM categories').all();
  const catUuidToId = new Map(allCats.map(c => [c.uuid, c.id]));

  // ── 5. Simplified Parts ───────────────────────────────────────────────────
  log('Importing simplified parts…');
  const partFiles = await globFiles(`${SRC_ROOT}/simplified/*.csv`);
  if (partFiles.length === 0) {
    log('  WARNING: No files found in simplified/ — skipping parts import');
    log(`  Expected: ${SRC_ROOT}/simplified/*.csv`);
  }

  const insertPart = db.prepare(
    `INSERT OR IGNORE INTO parts (product_name, image_url, category_id, uuid) VALUES (?, ?, ?, ?)`
  );
  const insertPartVehicle = db.prepare(
    `INSERT OR IGNORE INTO part_vehicles (part_id, vehicle_id) VALUES (?, ?)`
  );

  // product concept → DB id map (productId from CSV → parts.id)
  const productUuidToId = new Map();
  let partRows = 0;
  let pairsInserted = 0;

  for (const file of partFiles) {
    log(`  Processing ${file.split('/').pop()}…`);
    const rows = await readCsv(file);

    const run = db.transaction(() => {
      for (const row of rows) {
        const vehicleUuid = String(row.vehicleId || '');
        const productUuid = String(row.productId || '');
        const productName = (row.articleProductName || '').trim();
        const catUuid = String(row.categoryId || '');

        if (!vehicleUuid || !productUuid || !productName) continue;

        const vehicleId = modelUuidToId.get(vehicleUuid) ?? null;
        if (!vehicleId) continue; // vehicle not imported (pre-2010 or missing)

        // Get or create part record
        if (!productUuidToId.has(productUuid)) {
          const catId = catUuidToId.get(catUuid) ?? null;
          // Pick first non-empty image URL
          const imageUrl =
            [row.image_url_1, row.image_url_2, row.image_url_3, row.image_url_4, row.image_url_5]
              .find(u => u && u.trim()) ?? null;

          insertPart.run(productName, imageUrl, catId, productUuid);
          const inserted = db.prepare('SELECT id FROM parts WHERE uuid = ?').get(productUuid);
          if (inserted) {
            productUuidToId.set(productUuid, inserted.id);
            partRows++;
          }
        }

        const partId = productUuidToId.get(productUuid);
        if (!partId) continue;

        insertPartVehicle.run(partId, vehicleId);
        pairsInserted++;
      }
    });
    run();
  }

  log(`  ${productUuidToId.size} unique parts, ${pairsInserted} part-vehicle pairs`);

  // ── 6. Indexes ────────────────────────────────────────────────────────────
  createIndexes(db);

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
