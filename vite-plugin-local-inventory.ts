// vite-plugin-local-inventory.ts
// Vite dev-server plugin — intercepts /inventry/* API calls and serves them from a local SQLite DB.
// Activate by setting VITE_USE_LOCAL_DATA=true in .env.local

import type { Plugin } from 'vite';
import type { ServerResponse } from 'http';
import Database from 'better-sqlite3';
import { resolve } from 'path';

const MIN_YEAR = 0; // no year filter — show all vehicles

// Strips TecDoc chassis codes like "(_E15_)" or "(F30, F80)" from brand names
const CHASSIS_RE = /\s*\([A-Z0-9,\s/_-]+\)\s*$/;
// Strips body-type suffixes so "COROLLA Saloon" and "COROLLA Hatchback" merge into "COROLLA"
const BODY_TYPE_RE =
  /\s+(Saloon|Hatchback|Estate|Coup[eé]|Convertible|Cabriolet|Van|Bus|MPV|SUV|Pick-?[Uu]p|Roadster|Liftback|Platform(?:\/Chassis)?|Variant|Touring|T-Model|Targa|Fastback|Box\s+Body|Combi)\s*$/i;

function cleanBrandName(name: string): string {
  let clean = name.replace(CHASSIS_RE, '').trim();
  clean = clean.replace(BODY_TYPE_RE, '').trim();
  return clean || name;
}

/** Splits pipe-separated UUIDs → SQL `IN (?,?,?)` condition + param array */
function brandUuidCondition(pipeUUIDs: string): { condition: string; params: string[] } {
  const uuids = pipeUUIDs.split('|').filter(Boolean);
  if (uuids.length === 0) return { condition: '1=0', params: [] };
  const placeholders = uuids.map(() => '?').join(',');
  return { condition: `IN (${placeholders})`, params: uuids };
}

function sendJson(res: ServerResponse, data: unknown, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// ── Row types returned by better-sqlite3 ─────────────────────────────────────

interface ManufacturerRow { id: number; name: string; uuid: string }
interface BrandRow { id: number; name: string; uuid: string; manufacturer_id: number; mfr_uuid: string; mfr_name: string }
interface ModelRow { id: number; type_name: string; construction_start: number; construction_end: number; fuel_type: string; body_type: string; drive_type: string; power_ps: number; uuid: string; brand_uuid: string }
interface CategoryRow { id: number; name: string; parent_id: number | null; uuid: string; count?: number }
interface PartRow { id: number; product_name: string; image_url: string | null; uuid: string; category_id: number; cat_uuid: string | null; article_no: string | null; supplier_name: string | null }
interface CountRow { n: number }
interface VehicleModelRow { id: number; type_name: string; construction_start: number; uuid: string; fuel_type: string; body_type: string; drive_type: string; brand_id: number; brand_name: string; brand_uuid: string; mfr_id: number; mfr_name: string; mfr_uuid: string }

// ─────────────────────────────────────────────────────────────────────────────

export function localInventoryPlugin(): Plugin {
  const dbPath = resolve(process.cwd(), 'local-data/inventory.db');
  let db: Database.Database | null = null;

  function getDb(): Database.Database {
    if (!db) {
      console.log(`📦 Local inventory: using ${dbPath}`);
      db = new Database(dbPath, { readonly: true });
    }
    return db;
  }

  return {
    name: 'local-inventory',

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url ?? '';

        // Only handle /inventry/* paths (with or without /api prefix)
        if (!rawUrl.includes('/inventry/')) return next();

        const url = new URL(rawUrl.replace(/^\/api/, ''), 'http://localhost');
        const path = url.pathname;

        if (!path.startsWith('/inventry/')) return next();

        try {
          const d = getDb();

          // ── GET /inventry/car-years-all ───────────────────────────────────
          if (path === '/inventry/car-years-all') {
            const rows = d
              .prepare(
                `SELECT DISTINCT construction_start AS year
                 FROM car_models
                 WHERE construction_start >= ?
                 ORDER BY construction_start DESC`
              )
              .all(MIN_YEAR) as { year: number }[];
            return sendJson(res, { status: 1, message: 'OK', data: rows.map(r => r.year) });
          }

          // ── GET /inventry/car-manufacturers-all[?year=N] ─────────────────
          if (path === '/inventry/car-manufacturers-all') {
            const year = url.searchParams.get('year');
            let rows: ManufacturerRow[];
            if (year) {
              rows = d
                .prepare(
                  `SELECT DISTINCT m.id, m.name, m.uuid
                   FROM manufacturers m
                   JOIN car_brands cb ON cb.manufacturer_id = m.id
                   JOIN car_models cm ON cm.car_brand_id = cb.id
                   WHERE cm.construction_start >= ? AND cm.construction_start <= ?
                   ORDER BY m.name`
                )
                .all(MIN_YEAR, parseInt(year)) as ManufacturerRow[];
            } else {
              rows = d
                .prepare(`SELECT id, name, uuid FROM manufacturers ORDER BY name`)
                .all() as ManufacturerRow[];
            }
            const data = rows.map(m => ({
              id: m.id,
              Manufacturer_ID: m.uuid,
              name: m.name,
              country: '',
              status: 1,
              createdAt: '',
              brands: [],
            }));
            return sendJson(res, { status: 1, message: 'OK', data });
          }

          // ── GET /inventry/car-brands-all[?year=N&manufacturerId=UUID] ────
          if (path === '/inventry/car-brands-all') {
            const year = url.searchParams.get('year');
            const manufacturerId = url.searchParams.get('manufacturerId');

            const whereParts: string[] = ['cm.construction_start >= ?'];
            const params: (string | number)[] = [MIN_YEAR];

            if (year) {
              whereParts.push('cm.construction_start <= ?');
              params.push(parseInt(year));
            }
            if (manufacturerId) {
              whereParts.push('m.uuid = ?');
              params.push(manufacturerId);
            }

            const rows = d
              .prepare(
                `SELECT cb.id, cb.name, cb.uuid, cb.manufacturer_id,
                        m.uuid AS mfr_uuid, m.name AS mfr_name
                 FROM car_brands cb
                 JOIN manufacturers m ON m.id = cb.manufacturer_id
                 JOIN car_models cm ON cm.car_brand_id = cb.id
                 WHERE ${whereParts.join(' AND ')}
                 GROUP BY cb.id
                 ORDER BY cb.name`
              )
              .all(...params) as BrandRow[];

            // Group by (manufacturer_id, cleanName) so chassis/body variants merge
            const grouped = new Map<string, { id: number; uuids: string[]; name: string; mfr_uuid: string; mfr_name: string; mfr_id: number }>();
            for (const row of rows) {
              const clean = cleanBrandName(row.name);
              const key = `${row.manufacturer_id}::${clean}`;
              if (!grouped.has(key)) {
                grouped.set(key, { id: row.id, uuids: [], name: clean, mfr_uuid: row.mfr_uuid, mfr_name: row.mfr_name, mfr_id: row.manufacturer_id });
              }
              grouped.get(key)!.uuids.push(row.uuid);
            }

            const data = Array.from(grouped.values()).map(g => ({
              id: g.id,
              CarBrand_ID: g.uuids.join('|'),
              name: g.name,
              status: 1,
              manufacturer_ID: g.mfr_uuid,
              createdAt: '',
              type: '',
              models: [],
              manufacturer: {
                id: g.mfr_id,
                Manufacturer_ID: g.mfr_uuid,
                name: g.mfr_name,
                country: '',
                status: 1,
                createdAt: '',
              },
            }));
            return sendJson(res, { status: 1, message: 'OK', data });
          }

          // ── GET /inventry/car-models-all[?year=N&brandId=UUID] ───────────
          if (path === '/inventry/car-models-all') {
            const year = url.searchParams.get('year');
            const brandId = url.searchParams.get('brandId');

            const whereParts: string[] = ['cm.construction_start >= ?'];
            const params: (string | number)[] = [MIN_YEAR];

            if (year) {
              whereParts.push('cm.construction_start <= ?');
              params.push(parseInt(year));
            }
            if (brandId) {
              const { condition, params: uuidParams } = brandUuidCondition(brandId);
              whereParts.push(`cb.uuid ${condition}`);
              params.push(...uuidParams);
            }

            const rows = d
              .prepare(
                `SELECT cm.id, cm.type_name, cm.construction_start, cm.construction_end,
                        cm.fuel_type, cm.body_type, cm.drive_type, cm.power_ps, cm.uuid, cb.uuid AS brand_uuid
                 FROM car_models cm
                 JOIN car_brands cb ON cb.id = cm.car_brand_id
                 WHERE ${whereParts.join(' AND ')}
                 ORDER BY cm.type_name`
              )
              .all(...params) as ModelRow[];

            const data = rows.map(m => ({
              id: m.id,
              CarModel_ID: m.uuid,
              name: m.type_name,
              yearOfMake: m.construction_start,
              carBrand_ID: m.brand_uuid,
              status: 1,
              createdAt: '',
              fuelType: m.fuel_type ?? '',
              bodyType: m.body_type ?? '',
              driveType: m.drive_type ?? '',
              spareParts: [],
            }));
            return sendJson(res, { status: 1, message: 'OK', data });
          }

          // ── GET /inventry/category-all[?brandId=&fuelType=&bodyType=] ───
          if (path === '/inventry/category-all') {
            const brandId = url.searchParams.get('brandId');
            const fuelType = url.searchParams.get('fuelType');
            const bodyType = url.searchParams.get('bodyType');
            const driveType = url.searchParams.get('driveType');
            const engineType = url.searchParams.get('engineType');

            let rows: CategoryRow[];

            if (brandId) {
              const { condition, params: uuidParams } = brandUuidCondition(brandId);
              const modelParams: (string | number)[] = [...uuidParams];
              let modelFilter = `cb.uuid ${condition}`;
              if (fuelType) { modelFilter += ' AND cm.fuel_type = ?'; modelParams.push(fuelType); }
              if (bodyType) { modelFilter += ' AND cm.body_type = ?'; modelParams.push(bodyType); }
              if (driveType) { modelFilter += ' AND cm.drive_type = ?'; modelParams.push(driveType); }
              if (engineType) { modelFilter += ' AND cm.type_name = ?'; modelParams.push(engineType); }

              rows = d
                .prepare(
                  `SELECT c.id, c.name, c.parent_id, c.uuid,
                          COUNT(DISTINCT p.id) AS count
                   FROM categories c
                   JOIN parts p ON p.category_id = c.id
                   JOIN part_vehicles pv ON pv.part_id = p.id
                   JOIN car_models cm ON cm.id = pv.vehicle_id
                   JOIN car_brands cb ON cb.id = cm.car_brand_id
                   WHERE ${modelFilter}
                   GROUP BY c.id
                   ORDER BY c.name`
                )
                .all(...modelParams) as CategoryRow[];
            } else {
              rows = d
                .prepare(`SELECT id, name, parent_id, uuid FROM categories ORDER BY name`)
                .all() as CategoryRow[];
            }

            // Build id→uuid map for resolving parent_ID
            const allCats = d
              .prepare(`SELECT id, uuid FROM categories`)
              .all() as { id: number; uuid: string }[];
            const idToUuid = new Map(allCats.map(c => [c.id, c.uuid]));

            const data = rows.map(c => ({
              id: c.id,
              Category_ID: c.uuid,
              name: c.name,
              parent_ID: c.parent_id != null ? (idToUuid.get(c.parent_id) ?? null) : null,
              count: c.count ?? 0,
            }));
            return sendJson(res, { status: 1, message: 'OK', data });
          }

          // ── GET /inventry/sparepart-all ──────────────────────────────────
          if (path === '/inventry/sparepart-all') {
            const brandId = url.searchParams.get('brandId');
            const categoryId = url.searchParams.get('categoryId');
            const fuelType = url.searchParams.get('fuelType');
            const bodyType = url.searchParams.get('bodyType');
            const driveType = url.searchParams.get('driveType');
            const engineType = url.searchParams.get('engineType');
            const search = url.searchParams.get('search');
            const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '48'), 200);
            const offset = parseInt(url.searchParams.get('offset') ?? '0');

            const whereParts: string[] = [];
            const params: (string | number)[] = [];

            if (brandId) {
              const { condition, params: uuidParams } = brandUuidCondition(brandId);
              let subFilter = `cb.uuid ${condition}`;
              const subParams: (string | number)[] = [...uuidParams];
              if (fuelType) { subFilter += ' AND cm.fuel_type = ?'; subParams.push(fuelType); }
              if (bodyType) { subFilter += ' AND cm.body_type = ?'; subParams.push(bodyType); }
              if (driveType) { subFilter += ' AND cm.drive_type = ?'; subParams.push(driveType); }
              if (engineType) { subFilter += ' AND cm.type_name = ?'; subParams.push(engineType); }
              whereParts.push(
                `EXISTS (SELECT 1 FROM part_vehicles pv
                         JOIN car_models cm ON cm.id = pv.vehicle_id
                         JOIN car_brands cb ON cb.id = cm.car_brand_id
                         WHERE pv.part_id = p.id AND ${subFilter})`
              );
              params.push(...subParams);
            }

            if (categoryId) {
              const cat = d
                .prepare('SELECT id FROM categories WHERE uuid = ?')
                .get(categoryId) as { id: number } | undefined;
              if (cat) { whereParts.push('p.category_id = ?'); params.push(cat.id); }
            }

            if (search) {
              whereParts.push('(LOWER(p.product_name) LIKE ? OR LOWER(COALESCE(p.article_no,\'\')) LIKE ?)');
              const searchParam = `%${search.toLowerCase()}%`;
              params.push(searchParam, searchParam);
            }

            const where = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';

            const totalResult = d
              .prepare(`SELECT COUNT(DISTINCT p.id) AS n FROM parts p ${where}`)
              .get(...params) as CountRow;
            const total = totalResult.n;

            const rows = d
              .prepare(
                `SELECT DISTINCT p.id, p.product_name, p.image_url, p.uuid, p.category_id,
                        c.uuid AS cat_uuid, p.article_no, p.supplier_name
                 FROM parts p
                 LEFT JOIN categories c ON c.id = p.category_id
                 ${where}
                 ORDER BY p.product_name
                 LIMIT ? OFFSET ?`
              )
              .all(...params, limit, offset) as PartRow[];

            const data = rows.map(p => buildPart(p));
            return sendJson(res, { status: 1, message: 'OK', total, data });
          }

          // ── GET /inventry/sparepart-detail/:code ─────────────────────────
          const detailMatch = path.match(/^\/inventry\/sparepart-detail\/([^/]+)$/);
          if (detailMatch) {
            const code = decodeURIComponent(detailMatch[1]);
            const numericId = parseInt(code) || 0;

            const part = d
              .prepare(
                `SELECT p.id, p.product_name, p.image_url, p.uuid, p.category_id,
                        c.uuid AS cat_uuid, p.article_no, p.supplier_name,
                        (SELECT pv.vehicle_id FROM part_vehicles pv WHERE pv.part_id = p.id LIMIT 1) AS vehicle_id
                 FROM parts p
                 LEFT JOIN categories c ON c.id = p.category_id
                 WHERE p.uuid = ? OR p.id = ?`
              )
              .get(code, numericId) as (PartRow & { vehicle_id: number | null }) | undefined;

            if (!part) {
              return sendJson(res, { status: 404, message: 'Not found', data: null }, 404);
            }

            let carModel: Record<string, unknown> | undefined;
            if (part.vehicle_id) {
              const vm = d
                .prepare(
                  `SELECT cm.id, cm.type_name, cm.construction_start, cm.uuid,
                          cm.fuel_type, cm.body_type, cm.drive_type,
                          cb.id AS brand_id, cb.name AS brand_name, cb.uuid AS brand_uuid,
                          m.id AS mfr_id, m.name AS mfr_name, m.uuid AS mfr_uuid
                   FROM car_models cm
                   JOIN car_brands cb ON cb.id = cm.car_brand_id
                   JOIN manufacturers m ON m.id = cb.manufacturer_id
                   WHERE cm.id = ?`
                )
                .get(part.vehicle_id) as VehicleModelRow | undefined;

              if (vm) {
                carModel = {
                  id: vm.id,
                  CarModel_ID: vm.uuid,
                  name: vm.type_name,
                  yearOfMake: vm.construction_start,
                  carBrand_ID: vm.brand_uuid,
                  status: 1,
                  createdAt: '',
                  carBrand: {
                    id: vm.brand_id,
                    CarBrand_ID: vm.brand_uuid,
                    name: cleanBrandName(vm.brand_name),
                    status: 1,
                    manufacturer_ID: vm.mfr_uuid,
                    createdAt: '',
                    type: '',
                    manufacturer: {
                      id: vm.mfr_id,
                      Manufacturer_ID: vm.mfr_uuid,
                      name: vm.mfr_name,
                      country: '',
                      status: 1,
                      createdAt: '',
                    },
                  },
                };
              }
            }

            const data = {
              ...buildPart(part),
              ...(carModel ? { carModel } : {}),
            };
            return sendJson(res, { status: 1, message: 'OK', data });
          }

          return next();
        } catch (err) {
          console.error('[local-inventory]', err);
          return next();
        }
      });
    },
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildPart(p: PartRow & { vehicle_id?: number | null }) {
  return {
    id: p.id,
    SparePart_ID: p.uuid,
    name: p.product_name,
    description: '',
    price: 0,
    status: 1,
    discount_ID: null,
    category_ID: p.cat_uuid ?? null,
    carModel_ID: '00000000-0000-0000-0000-000000000000',
    seller_ID: null,
    createdAt: '',
    updatedAt: '',
    article_no: p.article_no ?? null,
    supplier_name: p.supplier_name ?? null,
    images: p.image_url
      ? [{ id: 0, image_ID: p.uuid, SparePart_ID: p.uuid, createdAt: '', status: 1, image_url: p.image_url, image_ob: null }]
      : [],
  };
}
