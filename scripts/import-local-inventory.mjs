#!/usr/bin/env node
// scripts/import-local-inventory.mjs
// Reads TecDoc CSVs → filters per IMPORT-RULES.md → writes SQLite DB + cleaned CSVs
//
// Usage:
//   node scripts/import-local-inventory.mjs
//   node scripts/import-local-inventory.mjs --skip-cleaned   (skip writing cleaned CSVs)

import Database from 'better-sqlite3';
import { createReadStream, createWriteStream, mkdirSync } from 'fs';
import { createInterface } from 'readline';
import { resolve, join } from 'path';
import { glob } from 'fs/promises';
import { randomUUID } from 'crypto';

// ── Config ───────────────────────────────────────────────────────────────────

const SRC_ROOT =
  process.env.LOCAL_INVENTORY_SRC ??
  '/Users/gaiacarini/Library/CloudStorage/OneDrive-Spepas/SPEPAS GLOBAL/SPEPAS PRODUCT/Scraping Results/rapidapi';

const DB_PATH =
  process.env.LOCAL_INVENTORY_DB ?? resolve(process.cwd(), 'local-data/inventory.db');

const CLEANED_ROOT =
  process.env.LOCAL_INVENTORY_CLEANED ?? join(SRC_ROOT, 'cleaned');

const SKIP_CLEANED = process.argv.includes('--skip-cleaned');

// Import rules (see local-data/IMPORT-RULES.md)
const KEPT_MANUFACTURER_IDS = new Set([16, 45, 183, 184, 842, 74, 3522, 80, 111, 121]);
const MODEL_YEAR_CUTOFF = 2010; // remove models discontinued before this year

// ── Helpers ──────────────────────────────────────────────────────────────────

function log(msg) {
  process.stdout.write(`[import] ${msg}\n`);
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

/** Stream-process a large CSV file row by row without loading into memory */
async function streamCsv(filepath, callback) {
  let headers = null;
  let count = 0;
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
    callback(obj, line);
    count++;
  }
  return count;
}

async function globFiles(pattern) {
  const results = [];
  for await (const f of glob(pattern)) results.push(f);
  return results.sort();
}

function extractYear(dateStr) {
  if (!dateStr) return null;
  const y = parseInt(dateStr);
  return (y && y > 1900 && y < 2100) ? y : null;
}

function writeCsvLine(stream, values) {
  const escaped = values.map(v => {
    const s = String(v ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  });
  stream.write(escaped.join(',') + '\n');
}

// ── Schema ───────────────────────────────────────────────────────────────────

function createSchema(db) {
  db.exec(`
    DROP TABLE IF EXISTS part_vehicles;
    DROP TABLE IF EXISTS parts;
    DROP TABLE IF EXISTS car_models;
    DROP TABLE IF EXISTS car_brands;
    DROP TABLE IF EXISTS manufacturers;
    DROP TABLE IF EXISTS categories;

    CREATE TABLE manufacturers (
      id   INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      uuid TEXT NOT NULL UNIQUE
    );

    CREATE TABLE car_brands (
      id              INTEGER PRIMARY KEY,
      name            TEXT NOT NULL,
      year_from       INTEGER,
      year_to         INTEGER,
      manufacturer_id INTEGER NOT NULL REFERENCES manufacturers(id),
      uuid            TEXT NOT NULL UNIQUE
    );

    CREATE TABLE car_models (
      id                 INTEGER PRIMARY KEY,
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

    CREATE TABLE categories (
      id        INTEGER PRIMARY KEY,
      name      TEXT NOT NULL,
      parent_id INTEGER REFERENCES categories(id),
      level     INTEGER DEFAULT 0,
      uuid      TEXT NOT NULL UNIQUE
    );

    CREATE TABLE parts (
      id             INTEGER PRIMARY KEY,
      product_name   TEXT NOT NULL,
      image_url      TEXT,
      category_id    INTEGER REFERENCES categories(id),
      uuid           TEXT NOT NULL UNIQUE,
      article_no     TEXT,
      supplier_name  TEXT,
      supplier_id    TEXT
    );

    CREATE TABLE part_vehicles (
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

  log(`Source:  ${SRC_ROOT}`);
  log(`Output:  ${DB_PATH}`);
  if (!SKIP_CLEANED) {
    mkdirSync(CLEANED_ROOT, { recursive: true });
    mkdirSync(join(CLEANED_ROOT, 'detailed parts', 'complete'), { recursive: true });
    log(`Cleaned: ${CLEANED_ROOT}`);
  }

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('foreign_keys = OFF');

  createSchema(db);

  // ── 1. Manufacturers ──────────────────────────────────────────────────────
  log('Importing manufacturers…');
  const mfrRows = await readCsv(join(SRC_ROOT, 'manufacturers.csv'));

  const insertMfr = db.prepare(
    `INSERT INTO manufacturers (id, name, uuid) VALUES (?, ?, ?)`
  );

  let cleanedMfrStream = null;
  if (!SKIP_CLEANED) {
    cleanedMfrStream = createWriteStream(join(CLEANED_ROOT, 'manufacturers.csv'));
    cleanedMfrStream.write('manufacturerId,manufacturerName\n');
  }

  let mfrCount = 0;
  const keptMfrIds = new Set();

  const mfrTx = db.transaction(() => {
    for (const row of mfrRows) {
      const id = parseInt(row.manufacturerId);
      const name = (row.manufacturerName || '').trim();
      if (!id || !name) continue;

      // Rule 1: keep only manufacturers with parts
      if (!KEPT_MANUFACTURER_IDS.has(id)) continue;

      insertMfr.run(id, name, randomUUID());
      keptMfrIds.add(id);
      mfrCount++;

      if (cleanedMfrStream) writeCsvLine(cleanedMfrStream, [id, name]);
    }
  });
  mfrTx();
  cleanedMfrStream?.end();
  log(`  ${mfrCount} manufacturers kept`);

  // ── 2. Car Brands (model lines) ───────────────────────────────────────────
  log('Importing car brands…');
  const brandRows = await readCsv(join(SRC_ROOT, 'models_by_manufacturer.csv'));

  const insertBrand = db.prepare(
    `INSERT INTO car_brands (id, name, year_from, year_to, manufacturer_id, uuid) VALUES (?, ?, ?, ?, ?, ?)`
  );

  let cleanedBrandStream = null;
  if (!SKIP_CLEANED) {
    cleanedBrandStream = createWriteStream(join(CLEANED_ROOT, 'models_by_manufacturer.csv'));
    cleanedBrandStream.write('manufacturer,manufacturerId,modelId,modelName,modelYearFrom,modelYearTo\n');
  }

  let brandCount = 0;
  let brandSkipped = 0;
  const keptBrandIds = new Set();

  const brandTx = db.transaction(() => {
    for (const row of brandRows) {
      const mfrId = parseInt(row.manufacturerId);
      const modelId = parseInt(row.modelId);
      const name = (row.modelName || '').trim();
      const mfrName = (row.manufacturer || '').trim();
      const yearFromRaw = row.modelYearFrom || '';
      const yearToRaw = row.modelYearTo || '';
      const yearFrom = extractYear(yearFromRaw);
      const yearTo = extractYear(yearToRaw);

      if (!modelId || !name || !mfrId) continue;

      // Filter: manufacturer must be kept
      if (!keptMfrIds.has(mfrId)) { brandSkipped++; continue; }

      // Rule 2: remove models discontinued before 2010
      // If yearTo exists and is before cutoff, skip. No yearTo = still in production = keep.
      if (yearTo && yearTo < MODEL_YEAR_CUTOFF) { brandSkipped++; continue; }

      insertBrand.run(modelId, name, yearFrom, yearTo, mfrId, randomUUID());
      keptBrandIds.add(modelId);
      brandCount++;

      if (cleanedBrandStream) {
        writeCsvLine(cleanedBrandStream, [mfrName, mfrId, modelId, name, yearFromRaw, yearToRaw]);
      }
    }
  });
  brandTx();
  cleanedBrandStream?.end();
  log(`  ${brandCount} brands kept, ${brandSkipped} filtered out`);

  // ── 3. Car Models (vehicle variants) ──────────────────────────────────────
  log('Importing car models (vehicle variants)…');

  const insertModel = db.prepare(
    `INSERT INTO car_models
       (id, type_name, construction_start, construction_end, fuel_type, body_type, drive_type, power_ps, car_brand_id, uuid)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  let cleanedVehicleStream = null;
  if (!SKIP_CLEANED) {
    cleanedVehicleStream = createWriteStream(join(CLEANED_ROOT, 'vehicles_detailed.csv'));
    cleanedVehicleStream.write('vehicleId,modelId,modelName,manufacturer,manufacturerId,typeEngineName,constructionStart,constructionEnd,powerKw,powerPs,capacityLt,capacityTech,numberOfCylinders,numberOfValves,bodyType,engineType,fuelType,fuelMixture,driveType,engCodes,abs,asr\n');
  }

  const vehicleFile = join(SRC_ROOT, 'vehicles_detailed.csv');
  let vehicleCount = 0;
  let vehicleSkipped = 0;
  const keptVehicleIds = new Set();

  const vehicleRows = await readCsv(vehicleFile);
  const vehicleTx = db.transaction(() => {
    for (const row of vehicleRows) {
      const vehicleId = parseInt(row.vehicleId);
      const brandId = parseInt(row.modelId);

      if (!vehicleId) continue;

      // Rule 3: vehicle must belong to a kept model/brand
      if (!keptBrandIds.has(brandId)) { vehicleSkipped++; continue; }

      const typeName = (row.typeEngineName || '').trim();
      const startYear = extractYear(row.constructionStart);
      const endYear = extractYear(row.constructionEnd);
      const fuelType = (row.fuelType || '').trim() || null;
      const bodyType = (row.bodyType || '').trim() || null;
      const driveType = (row.driveType || '').trim() || null;
      const powerPs = parseInt(row.powerPs) || null;

      insertModel.run(vehicleId, typeName, startYear, endYear, fuelType, bodyType, driveType, powerPs, brandId, randomUUID());
      keptVehicleIds.add(vehicleId);
      vehicleCount++;

      if (cleanedVehicleStream) {
        writeCsvLine(cleanedVehicleStream, [
          row.vehicleId, row.modelId, row.modelName, row.manufacturer, row.manufacturerId,
          row.typeEngineName, row.constructionStart, row.constructionEnd,
          row.powerKw, row.powerPs, row.capacityLt, row.capacityTech,
          row.numberOfCylinders, row.numberOfValves, row.bodyType, row.engineType,
          row.fuelType, row.fuelMixture, row.driveType, row.engCodes, row.abs, row.asr,
        ]);
      }
    }
  });
  vehicleTx();
  cleanedVehicleStream?.end();
  log(`  ${vehicleCount} vehicles kept, ${vehicleSkipped} filtered out`);

  // ── 4. Categories ─────────────────────────────────────────────────────────
  // Rule 5: import full tree
  log('Importing categories…');
  const catRows = await readCsv(join(SRC_ROOT, 'part_categories.csv'));

  const insertCatNoParent = db.prepare(
    `INSERT INTO categories (id, name, parent_id, level, uuid) VALUES (?, ?, NULL, ?, ?)`
  );
  const updateCatParent = db.prepare(
    `UPDATE categories SET parent_id = ? WHERE id = ?`
  );

  // Pass 1: insert all without parent links
  const catTx1 = db.transaction(() => {
    for (const row of catRows) {
      const id = parseInt(row.categoryId);
      const name = (row.categoryName || '').trim();
      const level = parseInt(row.level) || 0;
      if (!id || !name) continue;
      insertCatNoParent.run(id, name, level, randomUUID());
    }
  });
  catTx1();

  // Pass 2: link parents
  let parentLinked = 0;
  const catTx2 = db.transaction(() => {
    for (const row of catRows) {
      const id = parseInt(row.categoryId);
      const parentId = parseInt(row.parentCategoryId);
      if (!id || !parentId) continue;
      updateCatParent.run(parentId, id);
      parentLinked++;
    }
  });
  catTx2();

  const catCount = db.prepare('SELECT COUNT(*) AS n FROM categories').get().n;
  log(`  ${catCount} categories (${parentLinked} linked to parents)`);

  if (!SKIP_CLEANED) {
    // Copy categories as-is
    const catSrc = join(SRC_ROOT, 'part_categories.csv');
    const catDst = join(CLEANED_ROOT, 'part_categories.csv');
    const { copyFileSync } = await import('fs');
    copyFileSync(catSrc, catDst);
  }

  // ── 5. Parts ──────────────────────────────────────────────────────────────
  log('Importing parts…');

  const insertPart = db.prepare(
    `INSERT OR IGNORE INTO parts (id, product_name, image_url, category_id, uuid, article_no, supplier_name, supplier_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertPartVehicle = db.prepare(
    `INSERT OR IGNORE INTO part_vehicles (part_id, vehicle_id) VALUES (?, ?)`
  );

  const partFiles = await globFiles(
    join(SRC_ROOT, 'detailed parts', 'complete', 'parts_complete_vehicles_*.csv')
  );

  if (partFiles.length === 0) {
    log('  WARNING: No part files found — skipping parts import');
  }

  let totalPartRows = 0;
  let partsInserted = 0;
  let pairsInserted = 0;
  let pairsSkipped = 0;
  const seenArticleIds = new Set();

  // Pre-load category IDs for validation
  const validCatIds = new Set(
    db.prepare('SELECT id FROM categories').all().map(c => c.id)
  );

  for (const file of partFiles) {
    const fname = file.split('/').pop();
    log(`  Processing ${fname}…`);

    const rows = await readCsv(file);

    let cleanedPartStream = null;
    if (!SKIP_CLEANED) {
      cleanedPartStream = createWriteStream(join(CLEANED_ROOT, 'detailed parts', 'complete', fname));
      cleanedPartStream.write('articleId,articleNo,supplierName,supplierId,articleProductName,productId,articleMediaType,articleMediaFileName,s3image,vehicleId,categoryId\n');
    }

    const partTx = db.transaction(() => {
      for (const row of rows) {
        const vehicleId = parseInt(row.vehicleId);
        const articleId = parseInt(row.articleId);
        const productName = (row.articleProductName || '').trim();

        if (!vehicleId || !articleId || !productName) continue;
        totalPartRows++;

        // Rule 4: vehicle must be kept
        if (!keptVehicleIds.has(vehicleId)) { pairsSkipped++; continue; }

        // Insert part if not seen
        if (!seenArticleIds.has(articleId)) {
          const catId = parseInt(row.categoryId) || null;
          const validCatId = (catId && validCatIds.has(catId)) ? catId : null;
          const imageUrl = (row.s3image || '').trim() || null;
          const articleNo = (row.articleNo || '').trim() || null;
          const supplierName = (row.supplierName || '').trim() || null;
          const supplierId = (row.supplierId || '').trim() || null;

          insertPart.run(articleId, productName, imageUrl, validCatId, randomUUID(), articleNo, supplierName, supplierId);
          seenArticleIds.add(articleId);
          partsInserted++;
        }

        // Insert part-vehicle link
        insertPartVehicle.run(articleId, vehicleId);
        pairsInserted++;

        // Write to cleaned CSV
        if (cleanedPartStream) {
          writeCsvLine(cleanedPartStream, [
            row.articleId, row.articleNo, row.supplierName, row.supplierId,
            row.articleProductName, row.productId, row.articleMediaType,
            row.articleMediaFileName, row.s3image, row.vehicleId, row.categoryId,
          ]);
        }
      }
    });
    partTx();
    cleanedPartStream?.end();
  }

  log(`  ${partsInserted} unique parts, ${pairsInserted} part-vehicle pairs`);
  log(`  ${pairsSkipped} rows skipped (vehicle not kept)`);

  // Remove orphan parts (no vehicle links)
  const orphanResult = db.prepare(
    `DELETE FROM parts WHERE id NOT IN (SELECT DISTINCT part_id FROM part_vehicles)`
  ).run();
  if (orphanResult.changes > 0) {
    log(`  Removed ${orphanResult.changes} orphan parts (no vehicle links)`);
  }

  // ── 6. Indexes ────────────────────────────────────────────────────────────
  createIndexes(db);

  // ── 7. FK validation ──────────────────────────────────────────────────────
  db.pragma('foreign_keys = ON');
  const fkErrors = db.pragma('foreign_key_check');
  if (fkErrors.length > 0) {
    log(`  WARNING: ${fkErrors.length} foreign key violations`);
    for (const err of fkErrors.slice(0, 5)) {
      log(`    table=${err.table} rowid=${err.rowid} parent=${err.parent}`);
    }
  } else {
    log('  Foreign key check passed');
  }

  // ── 8. Summary ────────────────────────────────────────────────────────────
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
  if (!SKIP_CLEANED) log(`  Cleaned CSVs  : ${CLEANED_ROOT}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
