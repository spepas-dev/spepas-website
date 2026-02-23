# Parts Catalogue — Product Requirements Document

**Status:** Draft
**Last updated:** 2026-02-22
**Scope:** Buyer-facing parts catalogue on the SpePas web platform

---

## 1. Overview

The SpePas Parts Catalogue is a browse-and-search interface that lets buyers find compatible spare parts for their vehicle and convert discovery into a bid request. It is not a transactional storefront — there are no fixed prices or checkout. Pricing is determined by sellers after a buyer posts a request.

**Goal:** Make it fast and confident for a buyer to go from "I need a brake pad for my 2015 Toyota Corolla" to posting a request and receiving seller quotes.

---

## 2. Target Users

**Primary: Ghanaian vehicle owners and mechanics**
- Fleet is predominantly Japanese (Toyota, Honda, Nissan, Suzuki) and Korean (Hyundai, Kia), with German brands (BMW, Mercedes, VW) among higher-end owners
- Vehicle years: 2010–present (older vehicles filtered out of the catalogue)
- Mechanics commonly know part numbers (OEM or aftermarket), while regular owners search by vehicle + category
- Mobile-first: most users access on Android smartphones
- Prices and availability are conversational — buyers expect to negotiate, not buy at a fixed price

**Secondary: Workshop owners / fleet managers**
- May be searching for multiple parts across different vehicles
- Higher chance of knowing part numbers / OEM references

---

## 3. Data Schema Reference

The catalogue is built on TecDoc-style data with the following hierarchy:

```
Manufacturer  (e.g. TOYOTA)
  └─ Model Line  (e.g. "COROLLA Saloon E15" — car_brands table)
       └─ Engine Variant  (e.g. "1.5 (NZE141)" — car_models table)
            └─ Parts  (parts table — linked to one engine variant)
```

**Key part attributes:**
- `product_name` — part name (e.g. "Brake Pad Set, disc brake")
- `article_no` — OEM or aftermarket part number (searchable)
- `category` — hierarchical (27 leaf categories, each with a parent)
- `image_url` — product image (may be absent)
- `supplier_id` — the data supplier (not the seller)

**Vehicle attributes available for filtering:**
- `fuel_type` — Petrol, Diesel, Petrol/Electric, etc.
- `body_type` — Saloon, Hatchback, Estate, SUV, Van, etc.
- `construction_start` / `construction_end` — production date range
- `power_ps` — engine power in PS

**Catalogue size:** ~337,000 unique parts across 698 manufacturers, 2,022 model lines, 11,184 engine variants

---

## 4. Vehicle Selection (Primary Filter)

### 4.1 Required Flow: Year → Make → Model

Three-step cascading selector. Parts appear after all three are selected.

| Step | Data source | Display format |
|---|---|---|
| **Year** | `car_models.construction_start` | 2010–2024, descending |
| **Make** | `manufacturers.name` | Alphabetical (HONDA, HYUNDAI, KIA, TOYOTA…) |
| **Model** | `car_brands.name` (chassis code stripped) | Clean name + year range if ambiguous |

**Chassis code handling:** The raw model name includes technical chassis codes (e.g. "COROLLA Saloon (_E15_)"). These are stripped from the display label. When two models share the same clean name in the same year range (e.g. BMW 1-series 3-door vs 5-door), they are merged into a single dropdown option — the parts overlap is ~95%+.

### 4.2 Secondary Attribute Filters (sidebar, shown after model selected)

| Filter | Source | Values |
|---|---|---|
| **Fuel Type** | `car_models.fuel_type` | Petrol, Diesel, Petrol/Electric, etc. — only values available for selected model |
| **Body Type** | `car_models.body_type` | Saloon, Hatchback, SUV, etc. — only values available for selected model |

These are sidebar toggles, not required steps. They narrow results within the already-selected model line.

### 4.3 My Garage (saved vehicles)

After a user selects a vehicle, save it to `localStorage` under their profile key. Show a "My Garage" pill in the header that restores the selection on next visit.

**Requirements:**
- Persist: year, make UUID, model UUID, display labels
- Allow saving up to 3 vehicles
- Show as chips in the header: "2015 Toyota Corolla [×]"
- Clicking a saved vehicle pre-fills the vehicle selector and immediately loads parts
- Garage persists across sessions; cleared on logout

**MVP scope:** Single saved vehicle in localStorage. Multi-vehicle is Phase 2.

---

## 5. Category Navigation (Left Sidebar)

### 5.1 Structure

27 leaf categories organised under parent groups. Display as a two-level tree in the sidebar:

```
All parts
─────────────────
AIR CONDITIONING
  Hoses/Pipe
AIR SUPPLY
  Charging (supercharged/turbocharged)
ALTERNATOR/PARTS
  Alternator
DISC BRAKE
  Brake Pad
FILTERS
  Air Filter
  Oil Filter
...
```

Parent headers are non-clickable labels. Leaf categories are clickable filters. Show part counts next to each category.

### 5.2 Behaviour

- Default state: "All parts" selected, full results shown
- Clicking a category filters results to that category only
- Clicking the active category deselects it (back to all)
- Selected category shows as an active filter chip above the results

### 5.3 Phase 2: Top-level category landing page

On the home/shop entry, show the ~10 top-level category groups as large tiles (icon + label). Clicking a tile pre-selects the category group and opens the vehicle selector. This matches the pattern used on AutoZone and AutoParts.com.

---

## 6. Search

### 6.1 Free-text search (current)

Searches across `product_name` and `article_no` (LIKE query, case-insensitive). Shown as a search bar in the parts area. Results update on 350ms debounce.

### 6.2 Part number / OEM reference search (required — Phase 1)

Buyers who know their part number should be able to search without selecting a vehicle first. A part number search should:

1. Accept the input in the main search bar (same UI, no separate page)
2. Detect if input looks like a part number (alphanumeric, 4+ chars, no spaces) and hint "Search by part number"
3. Return results regardless of selected vehicle — the part number is the identity
4. Show which vehicle(s) the part fits on the result card

**Decision:** Part number search is unrestricted — results are returned regardless of whether a vehicle is selected. Vehicle selection is not required to use this search path.

**Technical:** `article_no` column is indexed. The SQL query already includes `LOWER(p.article_no) LIKE ?`. When no vehicle filter is active, the query runs across the full parts table.

---

## 7. Results Listing

### 7.1 Layout

- **Default view:** 4-column grid on desktop, 2-column on mobile
- **List view toggle:** Optional, secondary

### 7.2 Part card (grid)

Each card shows:
- Part image (or placeholder)
- Part name
- Part number (`article_no`) — shown in small text below name
- "Price on request" label — no prices shown
- "View details" link

No star ratings, no prices, no cart button.

### 7.3 Sort options

| Option | Default |
|---|---|
| Relevance | ✓ (default) |
| Name A–Z | — |
| Name Z–A | — |

### 7.4 Result count + pagination

- Show total count: "1,234 parts"
- Page size: 48 items
- Numbered pagination with prev/next
- Show "Page X of Y · N total" below pagination

### 7.5 Active filter chips

Shown above the results when any optional filter is active (category, fuel type, body type, search term). Each chip has an × to remove. "Clear all" when 2+ chips active.

---

## 8. Part Detail Page

### 8.1 Information displayed

- Part image (full-width on mobile, left panel on desktop)
- Part name (large heading)
- Part number (OEM/aftermarket reference)
- Category
- Vehicle compatibility: Make · Model line · Year range
- Fuel type / Body type (from linked vehicle variant)
- Informational note: "Price is set by sellers. Post a request to receive quotes."

No price, no stock indicator, no ratings.

### 8.2 Primary CTA: Post a Request

A prominent "Post a Request for this Part" button that:
1. Navigates to the buyer post-request flow at `/95668339501103956045/buyer/post-request`
2. Pre-fills all relevant fields from the catalogue context:
   - Part name
   - Part number (`article_no`)
   - Vehicle: year, make, model line, fuel type, body type
   - Category
3. If the user is not authenticated, redirect to sign-in first, then back to the request form

This is the key conversion point from catalogue to the SpePas marketplace.

### 8.3 Related parts (Phase 2)

Show other parts in the same category for the same vehicle: "Other Brake Pads for your 2015 Toyota Corolla."

---

## 9. Mobile Considerations

- Vehicle selector: Stacked vertically on mobile (full-width selects)
- Sidebar: Collapsed by default on mobile behind a "Filter" button / bottom sheet
- Part cards: 2-column grid on mobile
- Active chips: Horizontally scrollable row on mobile
- "My Garage": Accessible from the mobile hamburger menu

---

## 10. Gaps vs. Reference Sites

| Feature | AutoParts.com / RockAuto | SpePas Current | Priority |
|---|---|---|---|
| Part number search | Yes | Partial (vehicle required) | P0 — Phase 1 |
| Saved vehicles (My Garage) | Yes | No | P0 — Phase 1 |
| Pre-fill request from catalogue | N/A | Partially wired | P0 — Phase 1 |
| Category tile homepage | Yes | No | P1 |
| Fitment badge ("Fits your car") | Yes | No | P1 |
| Mobile sidebar drawer | Yes | No | P1 |
| VIN / plate lookup | Yes | Out of scope | — |
| Multi-vehicle garage | Yes | No | P2 |
| Brand filter (Bosch, NGK, etc.) | Yes | No | P2 |
| Price comparison | Yes | N/A (no fixed prices) | Out of scope |

---

## 11. Out of Scope

- Price display or checkout (prices set by sellers per bid)
- Inventory / stock levels
- OEM cross-reference database beyond existing `article_no`
- Review / ratings system
- Comparison tool
- Wishlist / favourites beyond My Garage

---

## 12. Decisions Log

| # | Question | Decision |
|---|---|---|
| 1 | Part number search without vehicle — unrestricted or vehicle-assisted? | **Unrestricted** — return results across all vehicles when no vehicle is selected |
| 2 | Which fields pre-fill the post-request form from the catalogue? | **All relevant fields** — part name, part number, year, make, model, fuel type, body type, category |
| 3 | Category icons for Phase 2 landing tiles? | **Not available** — skip icon tiles; use text-based category cards instead |
| 4 | "Does this fit my saved vehicle?" badge on parts? | **Deferred** — skip for now |
