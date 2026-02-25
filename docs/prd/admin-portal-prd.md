# SpePas — Admin Portal PRD

> **Last updated:** 2026-02-25
> **URL:** https://admin.spepas.com
> **Status:** Live — separate codebase (`spepas-web-admin`)
> **Source of truth:** Playwright inspection of live portal (2026-02-25)

---

## 1. Overview

The SpePas Admin Portal is the back-office management tool for the SpePas marketplace. It serves two critical roles:

1. **Platform administration** — Manage users (all roles), inventory, orders, wallets, access controls
2. **Phone Order Agent workspace (MVP0)** — The Call-In Order Management module is where agents create orders on behalf of phone callers

The portal is a React SPA deployed at `admin.spepas.com`, authenticating via `api.spepas.com`.

---

## 2. Authentication

### Login
- **URL:** `/auth/login`
- **Fields:** Email, Password
- **Actions:** Sign In button, "Forgot password?" link → `/auth/forgot-password`
- **Post-login:** Redirect to Dashboard (`/`)
- **Session:** Cookie-based; session expires on direct URL navigation (SPA routing only)

### Logged-in user
- Display name shown as initials avatar (e.g., "KA" for Kofi Admin)
- Top-right nav bar shows notification, message, and settings icons

---

## 3. Dashboard (`/`)

**Heading:** "Welcome Back, {Name}!"

### KPI Cards (4)
| Metric | Sample Value | Description |
|--------|-------------|-------------|
| Total Users | 2,345 | Active platform users |
| Active Riders | 856 | Registered riders |
| Registered Vehicles | 1,204 | Fleet size |
| Payment Methods | 3,678 | Active accounts |

*Note: These appear to be hardcoded/placeholder values — not live API data.*

### Quick Actions (4 cards)
| Card | Description | Likely Target |
|------|-------------|---------------|
| User Management | Manage users, roles, and permissions | `/user-management` |
| Vehicle Registry | Register and manage vehicles | `/inventory-management` |
| Rider Operations | Monitor rider activities and routes | `/user-management/riders` |
| Payment Records | Handle payment records | `/wallet-management/wallets` |

### Recent Activity
- Static/placeholder entries: "New Rider Registration" (2 min ago), "Vehicle Added" (15 min ago), "Payment Method Updated" (1 hr ago)

### Platform Performance
- Placeholder: "Chart Component Goes Here"

**Gaps:**
- Dashboard KPIs appear hardcoded, not from live API
- No phone order metrics (calls today, orders placed, avg call duration) — these exist on the Call-In page instead
- Performance chart not implemented
- Recent activity appears static

---

## 4. Sidebar Navigation Structure

```
Access Management
  ├── Permissions          /access-management/permissions
  ├── Roles                /access-management/roles
  ├── Applications         /access-management/applications
  ├── Menus                /access-management/menus
  └── Groups               /access-management/groups

User Management
  ├── Users (Admin)        /user-management
  ├── Sellers              /user-management/sellers
  ├── Buyers               /user-management/buyers
  ├── Riders               /user-management/riders
  ├── Mepa                 /user-management/mepa
  └── Gopa                 /user-management/gopa

Call In Management
  └── Calls Orders         /call-in-management/calls-orders

Order Management
  ├── Requests             /order-management/requests/active-requests
  ├── Orders               /order-management/orders
  ├── Gopa Orders          /order-management/orders/gopas
  └── Seller Orders        /order-management/orders/sellers

Wallet Management
  └── Wallets              /wallet-management/wallets

Inventory Management
  ├── Categories           /inventory-management/cars/categories
  ├── Manufacturers        /inventory-management/cars/manufacturers
  ├── Brands               /inventory-management/cars/brands
  ├── Models               /inventory-management/cars/models
  └── Spare Parts          /inventory-management/cars/spare-parts

Settings
  └── Settings             /settings
```

---

## 5. Access Management

### 5.1 Permissions (`/access-management/permissions`)
- **Stats:** Total Permissions (8), User Groups (8), Access Levels (8), Modules (12)
- **Table columns:** Permission Name, Description, Status, Created On
- **Data:** 8 permissions — `can:create:inventory`, `can:add:invoice`, `Create users`, `Can edit wallet`, `View User Wallet Balance`, `mopa:user:delete`, `Delete`, `APPROVE`
- **Actions:** Add Permission, Search, Export (disabled), View toggle
- **Status:** All Active

### 5.2 Roles (`/access-management/roles`)
- **Stats:** Total Roles (5), Access Levels (5), Permissions (12)
- **Table columns:** Role Name, Description, Permissions, Status, Created On
- **Data:** Creating Riders, Creating Sellers (×2 — duplicate), Gopa Admin, Invoice Admin
- **Actions:** Add Role, Search, Export (disabled)
- **Issue:** Duplicate "Creating Sellers" role entries

### 5.3 Applications (`/access-management/applications`)
- **Stats:** Total (6), Pending (0), Approved (6), Rejected (0)
- **Table columns:** Serial, Name, Description, Status, Actions (edit/delete icons)
- **Data:** Inventory Management, MOPA, Order Management, Wallets Management (×2 — duplicate), user management
- **Issue:** Duplicate "Wallets Management" entry; inconsistent casing ("user management" vs others)

### 5.4 Menus (`/access-management/menus`)
- **Heading:** Menu Configuration
- **Stats:** Active groups (3), Total items (0), Protected Routes (0)
- **Table columns:** Name, Permissions, Status
- **Data:** Empty ("No results")
- **API Error:** `GET /auth/menus` returns 500
- **Issue:** Menu items not loading; API endpoint failing

### 5.5 Groups (`/access-management/groups`)
- **Stats:** Total Groups (0 — mismatch with 4 rows), Menu Access (0), Permissions (0), Menu Groups (0)
- **Table columns:** Group Name, Description, Status, Created On, Actions (View link)
- **Data:** Super Admin, Inventory Management Users, Customer and Order Managers, Platform Managers
- **Actions:** Add Group; View links to group detail pages
- **Issue:** Stats all show 0 despite 4 groups existing

---

## 6. User Management

All user management pages share a common pattern: KPI cards at top, searchable/paginated data table, and (for some) a Google Maps view showing user locations.

### 6.1 Users / Admin Users (`/user-management`)
- **Stats:** Total Users (6), New Users (24), Verified Users (6), Admin Users (6)
- **Table columns:** Name, Email, Phone Number, User Type, Status
- **Data:** 6 admin users, all type ADMIN, all Active
- **Actions:** Add User, Search, Export (disabled)

### 6.2 Sellers (`/user-management/sellers`)
- **Stats:** Total Sellers (29), Active Locations (29), Assigned Gopas (1), Total Products (156)
- **Table columns:** Name, Email, Phone, User Type, Status, Verified
- **Data:** 29 sellers across 3 pages; mix of BUYER and SELLER user types shown
- **Actions:** Add Seller, Search, Export (disabled)
- **Map:** Google Maps integration (Accra area, lat 5.6037, lng -0.187) — billing error shown
- **Issue:** Some entries show User Type as "BUYER" in the sellers list — data integrity issue

### 6.3 Buyers (`/user-management/buyers`)
- **Stats:** Total Buyers (124), Active Locations (124), Assigned Gopas (11), Total Products (156)
- **Table columns:** Name, Email, Phone, Status, Date Added
- **Data:** 124 buyers across 13 pages
- **Actions:** Search, Export (disabled)
- **Map:** Google Maps integration (same billing error)
- **Note:** No "Add Buyer" button — buyers self-register

### 6.4 Riders (`/user-management/riders`)
- **Heading:** Delivery Riders
- **Stats:** Total Riders (14), Active Locations (14), License Types (0), Service Areas (8)
- **Table columns:** Name, Phone Number, Status, Verification Status, Date Added
- **Data:** 14 riders across 2 pages, all Active + Verified
- **Actions:** Add Rider, Search, Export (disabled)

### 6.5 Mepa (`/user-management/mepa`)
- **Heading:** Mepas
- **Stats:** Total Mechanics (12), Active Locations (12), Shop Types (12), Service Areas (1)
- **Table columns:** Name, Email, Phone, User Type, Status, Date Added
- **Data:** 12 entries across 2 pages; some show User Type as BUYER or ADMIN
- **Actions:** Add Mechanic Shop, Search, Export (disabled)
- **Map:** Google Maps integration (billing error; also many `InvalidValueError: setPosition` errors — bad lat/lng data)
- **Issue:** User type column shows BUYER/ADMIN for some MePa entries — data integrity issue

### 6.6 Gopa (`/user-management/gopa`)
- **Heading:** Gopa (breadcrumb shows "Goro" — typo)
- **Stats:** Total gopa (14), Specialties (10), Average Skills (10), Pending Approvals (5)
- **Table columns:** Name, Email, Specialties, Status, Date Added, Actions (View button)
- **Data:** 14 entries across 2 pages; Specialties column is empty for all
- **Actions:** Add Gopa, View (per-row), Search, Export (disabled)
- **Issue:** Breadcrumb says "Goro" instead of "Gopa"; Specialties not populated

---

## 7. Call-In Order Management (`/call-in-management/calls-orders`)

**This is the MVP0-critical module** — where Phone Order Agents create requests on behalf of callers.

### KPI Cards (5)
| Metric | Value | Description |
|--------|-------|-------------|
| Total Calls Today | 0 | Calls received today |
| Phone Orders | 0 | Orders placed via phone |
| USSD Orders | 0 | Orders placed via USSD |
| Completed Orders | 0 | Successfully completed |
| Avg Call Duration | 0 min | Average call time |

### Tabs
1. **Search & Place Order** (active by default)
2. **Call Orders History**

### Search & Place Order — 4-Step Wizard

```
Step 1: Search Customer
  → Enter customer phone number (+233 format)
  → "Search Customer" button

Step 2: Confirm Buyer
  → Verify customer details

Step 3: Order Details
  → Enter spare part information

Step 4: Review & Submit
  → Confirm and place order
```

**Current state:** Step 1 is visible with phone number search field. Steps 2-4 are rendered as a stepper UI but content not yet explored (requires live customer data).

**Gap analysis vs USSD PRD requirements:**
- ❌ No Code Builder widget (YYMMMT-PPPP) visible
- ❌ No buyer profile lookup beyond phone search
- ❌ No call ID / agent ID fields
- ❌ No SMS notification trigger button
- ❌ No vehicle year/brand/model/trim entry flow
- ❌ No read-back confirmation step
- ❓ Call Orders History tab not explored

---

## 8. Order Management

### 8.1 Active Requests (`/order-management/requests/active-requests`)
- **Heading:** Active Requests
- **Subtitle:** Manage and assign active spare part requests to sellers
- **Filter:** Search by request ID, spare part name, or car model
- **Table columns:** Request ID, Spare Part, Quantity, Image Required, Status, Bids, Created, Actions
- **Data:** 1 active request (Caburator Lexus CRV 2020, qty 1, Pending, 0 bids)
- **Actions:** View, Assign (per request), Export
- **API Error:** `GET /requests/stats` returns error

### 8.2 Orders / Spare Parts (`/order-management/orders`)
- **Heading:** Spare Parts Orders
- **Subtitle:** View and manage spare parts available for bidding
- **Stats:** Total Parts (15), Active Bids (0), Categories (1), Manufacturers (2)
- **Display:** Card grid layout (not table)
- **Data:** 15 parts displayed as cards — all "Actuator, transfer case" (×11) + "Air Filter" (×4), all Mercedes-Benz/Nissan, all GHS 0.00, all 10 units stock, all New condition, all 0 bids
- **Actions:** Add Part, Search
- **Issue:** Appears to be test data; prices all GHS 0.00

### 8.3 Gopa Orders (`/order-management/orders/gopas`)
- **Stats:** Total Gopas (14), Assigned Requests (156), Unassigned Requests (43), Completed Requests (89)
- **Table columns:** Serial Number, Gopa Name, Phone Number, Specialties, Date Added, Verification Status, Status, Actions
- **Data:** 14 gopas with specialties (TYRES, FAN BELT, ENGINE, AC_SYSTEM, ELECTRICAL, Body parts)
- **Actions:** Requests button, History button (per row), Search, Export (disabled)

### 8.4 Seller Orders (`/order-management/orders/sellers`)
- **Stats:** Total Sellers (2), Active Bids (20), Completed Orders (57), Total Revenue (GHS 10,000.40)
- **Table columns:** Serial Number, Store Name, Date Added, Total Orders, Active Bids, Completed Orders, Total Revenue, Status, Actions
- **Data:** 29 sellers across 3 pages (store names: A and A Ventures, Seller By Gopa, B and B Ventures, Sample Store 2, etc.)
- **Actions:** Active Bids button, Request History button (per row), Search, Export (disabled)
- **Note:** Total Orders/Active Bids/Completed Orders/Total Revenue columns are empty for all rows

---

## 9. Wallet Management (`/wallet-management/wallets`)

- **Stats:** Total Wallets (4), Total Balance (GHS 0.00), Revenue Wallets (2), Expense Wallets (0)
- **Table columns:** Wallet Number, Wallet Type, Balance, User ID, Status, Created On, Actions
- **Data:**
  | Wallet | Type | Balance | User |
  |--------|------|---------|------|
  | S00003 | revenue | GHS 0.00 | Not assigned |
  | S000005 | revenue | GHS 0.00 | Not assigned |
  | S00001 | credit_suspense | GHS 14,169.75 | Not assigned |
  | S00002 | debit_suspense | -GHS 14,169.75 | Not assigned |
- **Actions:** Add Wallet, Search, "Open menu" per row
- **Note:** All wallets unassigned to users; suspense accounts have matching debit/credit

---

## 10. Inventory Management

### 10.1 Categories (`/inventory-management/cars/categories`)
- **Stats:** Total Categories (0), Car Models Categories (0), Spare Parts Categories (0)
- **Table columns:** Name
- **Data:** Empty ("No results") — despite console log showing 15 categories returned by API
- **Actions:** Add Category, Search, Export (disabled)
- **Issue:** API returns data but table shows empty — rendering bug

### 10.2 Manufacturers (`/inventory-management/cars/manufacturers`)
- **Stats:** Total Manufacturers (15), Countries (1), Vehicle Models (234), Parts Categories (56)
- **Table columns:** Name, Country, Status, Created On
- **Data:** 15 entries (first page: 212, ABARTH, AC, ACURA, ACURA (GAC), ADDAX, AEOLUS, AGRALE, AITO, AIWAYS)
- **Actions:** Add Manufacturer, Search, Export (disabled)
- **Note:** Country column empty for all; first entry "212" appears to be bad data

### 10.3 Brands (`/inventory-management/cars/brands`)
- Not explored in detail but accessible via sidebar

### 10.4 Models (`/inventory-management/cars/models`)
- Not explored in detail but accessible via sidebar

### 10.5 Spare Parts (`/inventory-management/cars/spare-parts`)
- **Stats:** Total Parts (15), Car Models (4), Categories (12), In Stock (15)
- **Table columns:** Name of Part, Description, Status, Price, Created At
- **Data:** 15 parts — all "Actuator, transfer case" (×11) + "Air Filter" (×4), all GHS 0.00, all Active
- **Actions:** Add Spare Part, Search, Export (disabled)
- **Issue:** No descriptions; all prices GHS 0.00 — test data only

---

## 11. Settings (`/settings`)

### Tabs
1. **Profile** (default)
2. **Security**

### Profile Tab
- Fields: First Name, Last Name, Email Address, Phone Number
- Pre-filled with placeholder data (John Doe, john.doe@example.com, +1 (555) 123-4567)
- **Actions:** Update Profile button
- **Issue:** Shows placeholder data instead of logged-in user's actual data

---

## 12. Cross-Cutting UI Patterns

### Common table features
- Search (text input with icon)
- View toggle button
- Export button (disabled on all pages)
- Pagination: First/Prev/Next/Last buttons, rows per page selector (default 10), row count display
- Row selection count display

### Breadcrumb navigation
- Present on all pages: Dashboard > Section > Page

### KPI stat cards
- Every section has 3-4 KPI cards at top
- Cards show: metric name, value, icon, description, percentage change
- Many values appear hardcoded/placeholder

---

## 13. Known Issues & Bugs

| # | Section | Issue | Severity |
|---|---------|-------|----------|
| 1 | Menus | API `GET /auth/menus` returns 500 — table empty | High |
| 2 | Categories | API returns 15 categories but table shows "No results" — rendering bug | High |
| 3 | Groups | Stats all show 0 despite 4 groups existing | Medium |
| 4 | Sellers | Some entries show User Type as "BUYER" | Medium |
| 5 | Mepa | Some entries show User Type as "BUYER" or "ADMIN" | Medium |
| 6 | Gopa | Breadcrumb says "Goro" instead of "Gopa" | Low |
| 7 | Gopa | Specialties column empty for all rows | Medium |
| 8 | Applications | Duplicate "Wallets Management" entry | Low |
| 9 | Roles | Duplicate "Creating Sellers" role entries | Low |
| 10 | Applications | Inconsistent casing ("user management" vs "Inventory Management") | Low |
| 11 | Settings | Profile shows placeholder data (John Doe) instead of actual user | High |
| 12 | Google Maps | Billing error on all map-enabled pages (Sellers, Buyers, Mepa) | Medium |
| 13 | Google Maps | `InvalidValueError: setPosition` errors — bad lat/lng for many users | Medium |
| 14 | Orders | All spare parts have GHS 0.00 price — test data | Low |
| 15 | Manufacturers | First entry "212" appears to be bad data | Low |
| 16 | Seller Orders | Total Orders/Bids/Revenue columns empty for all sellers | Medium |
| 17 | Export | Export button disabled on all pages | Medium |
| 18 | Dashboard | KPIs appear hardcoded, performance chart placeholder | Medium |
| 19 | Call-In | Missing Code Builder, vehicle entry, SMS trigger (vs USSD PRD requirements) | Critical |
| 20 | Naming | "Gopo" vs "Gopa" inconsistency (referenced in ClickUp tasks) | Low |

---

## 14. MVP0 Requirements vs Current State

For the phone call ordering system to work, the Call-In Order Management module needs:

| Requirement (from USSD PRD) | Current State | Gap |
|------------------------------|---------------|-----|
| Buyer lookup by phone | ✅ Phone search field exists | Needs testing |
| Buyer profile display | ❓ Step 2 exists but untested | Needs testing |
| Code Builder widget (YYMMMT-PPPP) | ❌ Not visible | **Must build** |
| Vehicle year/brand/model entry | ❌ Not visible | **Must build** |
| Trim/drivetrain derivation (T code) | ❌ Not visible | **Must build** |
| Part search by PPPP code | ❌ Not visible | **Must build** |
| Request composer (part + qty) | ❓ Step 3 exists but untested | Needs testing |
| source = Phone, call_id, agent_id fields | ❌ Not visible | **Must build** |
| SMS notification trigger | ❌ Not visible | **Must build** |
| Read-back summary | ❓ Step 4 exists but untested | Needs testing |
| Call Orders History | ❓ Tab exists but unexplored | Needs testing |
| Bid monitoring (read-only) | ✅ Active Requests page exists | Needs testing |
| Assign request to seller | ✅ Assign button on requests | Needs testing |

---

## 15. Roles & Permissions (Current vs Required)

### Current admin roles
All 6 users are type "ADMIN" with no differentiation.

### Required roles (from USSD PRD)
| Role | Capabilities |
|------|-------------|
| **Phone Order Agent** | Create requests, view bids, send buyer SMS; no payouts or buyer PIN actions |
| **Supervisor** | All agent capabilities + reporting, QA access to call recordings |
| **Super Admin** | Full platform access |

**Gap:** No role-based access control for admin users — all have the same access. The existing Roles/Permissions/Groups infrastructure exists but is not applied to differentiate Phone Order Agent vs Supervisor vs Super Admin.
