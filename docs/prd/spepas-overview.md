# SpePas — Product Overview & Requirements

> Last updated: 2026-02-25

---

## What is SpePas?

SpePas is a one-stop online marketplace for car parts in Ghana. It connects buyers who need car parts with sellers in markets like Abossey Okai, coordinating delivery through a network of riders.

The platform addresses a real gap: Ghana's high frequency of car repairs (due to traffic and road conditions) combined with a fragmented, offline-only spare parts market where buyers have to travel to physical markets, prices are opaque, and there is no reliable delivery infrastructure.

The platform is accessible through three channels, in priority order:

1. **MVP0 — Phone Call + USSD** (primary): Buyers call a SpePas phone line to place orders with a human agent. All tracking, bid review, cart, checkout, and delivery happen via USSD (`*773727#`) on any mobile phone — no data or smartphone required. See [USSD & Phone Orders PRD](ussd-and-phone-orders-prd.md) for full specification.
2. **MVP1 — Web App**: Full self-service experience at spepas.com for smartphone users with data access.
3. No mobile app is planned for MVP.

---

## Problems Being Solved

- High transportation cost and time to purchase car parts
- Inefficient, manual process of buying car parts
- High frequency of car repairs due to collisions and road conditions
- No platform for used car part sellers to reach customers online
- Buyers paying inflated prices for parts sourced through mechanics

## Challenges to Overcome

- Lack of standardized inventory systems among sellers
- Difficulty in identifying part details by sellers
- Risk of buyers bypassing the platform to deal with sellers directly
- Need for competitive delivery prices to make online purchases attractive
- Order tagging and fulfillment process management for sellers
- Connectivity gaps — portions of the user base rely on USSD/SMS for access

---

## User Roles

SpePas has six distinct user roles, each with their own app experience:

| Role | Description |
|---|---|
| **Buyer** | Individuals or mechanics searching for and purchasing car parts |
| **Seller** | Used parts store owners (e.g. Abossey Okai market vendors) listing inventory and fulfilling orders |
| **GOPA** | Wholesale partners who onboard sellers and broker requests between buyers and their seller network |
| **MEPA** | Mechanic partners who search and order parts on behalf of their customers |
| **Rider** | Delivery agents who pick up parts from sellers and deliver to buyers |
| **Admin** | SpePas staff who manage users, orders, analytics, and platform configuration |

A single user account can hold **multiple roles**. Switching between active roles requires OTP verification.

---

## User Research

Survey of 100 car part buyers across commercial drivers, mechanics, and private car owners:

| How often do you buy new car parts? | Commercial | Mechanic | Private | Total |
|---|---|---|---|---|
| Never | 2 | 1 | 10 | 13 |
| Rarely | 4 | 8 | 7 | 19 |
| Occasionally | 13 | 12 | 22 | 47 |
| Always | 11 | 8 | 2 | 21 |

| How often do you buy used car parts? | Commercial | Mechanic | Private | Total |
|---|---|---|---|---|
| Never | 4 | 3 | 7 | 14 |
| Rarely | 3 | 1 | 2 | 6 |
| Occasionally | 13 | 11 | 30 | 54 |
| Always | 10 | 14 | 2 | 26 |

---

## Access Channels

### Phone Call (MVP0 — Primary)
Buyers place orders by calling a SpePas phone line staffed by human agents (up to 5–6 concurrent lines via 3CX). The agent captures vehicle details and parts, creates the request in the Admin Portal, and sends the buyer an SMS with a tracking code + USSD instructions. **PIN is never collected on phone calls** — bid acceptance and checkout happen exclusively in USSD.

### USSD / SMS (MVP0 — Primary)
Accessible from any mobile phone by dialling `*773727#` — no data, no app, no smartphone required. The USSD interface handles bid review, cart, checkout (with PIN + MoMo), delivery tracking, and wallet management via sequential numbered menus. Each session is stateful: the system remembers where a user is in a flow across menu selections. Delivery confirmation uses a **numeric delivery code** (given to buyer at checkout) instead of QR scanning.

USSD access is available for: **Buyer, Seller, Rider, GoPa, MePa**.

### Web App (MVP1)
Full-featured React web app at spepas.com. Requires a smartphone with internet access. Supports all roles and all flows. Uses QR code scanning for delivery confirmation.

---

## Key User Flows

### Buyer — Phone Order (MVP0 Primary Flow)
1. Buyer calls SpePas phone line
2. Agent identifies caller (existing profile or creates minimal profile)
3. Agent collects vehicle details: year, brand, model, drivetrain/fuel
4. Agent maps parts to catalog codes using Code Builder widget in Admin Portal
5. Agent reads back order summary: "You requested [Year Brand Model], parts: [list]"
6. Agent creates request in Admin Portal (one per part type, source = Phone)
7. System sends SMS to buyer: "Request R48291 created. Review bids via `*773727#` → My requests." + link to part images
8. Sellers receive the request and submit bids via USSD or web
9. Buyer receives SMS when bids arrive: "New bids for R48291. Dial `*773727#` → My bids"
10. Buyer reviews bids, accepts, checks out, and pays via USSD (PIN + MoMo)
11. Seller marks order ready → Rider picks up → Rider delivers using delivery code

---

### Buyer — Purchasing a Listed Part (Direct / Inventory)
1. Buyer searches for a part by car make/model/year (e.g. "2014 Toyota Vitz spark plug")
2. Part is found in the catalogue → buyer sees available sellers and prices
3. Buyer selects a seller, adds to cart
4. Buyer enters delivery address and payment details, checks out
5. Mobile money payment notification sent to buyer for approval
6. Seller fulfils the order; GOPA (if applicable) approves the invoice
7. Rider accepts pickup job and navigates to seller location
8. Buyer receives status updates: order fulfilled → rider en route with ETA
9. Rider arrives at buyer; buyer scans rider's QR code in app to confirm delivery
10. Buyer rates the delivery experience and later rates the seller

**Also available via USSD:** steps 1–5 (enter part code → quantity → confirm with PIN)

---

### Buyer — Requesting a Non-Listed Part (Bidding)
1. Buyer submits a request for a part not in the catalogue (car make/model/year + part description + quantity)
2. Request is broadcast to relevant sellers (via GOPA network or directly)
3. Sellers submit bids with price, delivery date, and optionally photos
4. Buyer receives notification and reviews bids
5. Buyer selects a bid, adds to cart, checks out
6. Rider picks up and delivers; buyer confirms with QR scan
7. Buyer rates delivery and seller

**Also available via USSD:** all steps (request by part code → view bids → select bid → add to cart → checkout)

---

### Buyer — GOPA-Brokered Request
1. Buyer submits a part request
2. Request is routed to GOPAs as well as self-onboarded sellers
3. GOPA broadcasts the request to their seller network
4. Sellers submit bids; buyer receives notification and selects an offer
5. Checkout, GOPA invoice acceptance, delivery, and QR confirmation follow the standard flow

---

### MEPA — Purchasing on Behalf of a Customer
1. Mechanic (MEPA) searches for the required part and submits a request
2. MEPA receives offers and selects one
3. MEPA redirects the order to the customer's SpePas account
4. Customer pays via mobile money
5. MEPA tracks order fulfilment and delivery on behalf of the customer
6. Delivery confirmed by buyer via QR code scan

---

### Seller — Submitting a Bid (Web)
1. Seller views requests assigned by their GOPA (or unassigned requests)
2. Seller confirms stock availability
3. Seller submits a bid: unit price, expected delivery date, optional photos
4. Seller monitors bid status (pending, accepted, rejected)

### Seller — Submitting a Bid (USSD)
1. Dial USSD → Seller menu
2. Browse requests: all requests, by car brand, or by part type
3. Select a request → enter unit price → enter expected delivery date → confirm
4. Bid submitted; seller can view active bids list

### Seller — Marking an Item Ready for Pickup
1. After a buyer checks out (invoice created and accepted by GOPA), seller receives notification
2. Seller prepares the part and packages it in a SpePas bag
3. Seller marks the item as "ready for pickup" via app or USSD
4. Item becomes visible to riders for pickup acceptance
5. Seller verifies the rider's credentials before handoff
6. Payment released to seller's wallet 24 hours after delivery is confirmed

**Via USSD:** Seller menu → Active bids → Select item → Mark as ready for pickup (PIN confirmation)

---

### GOPA — Brokering an Order
1. GOPA receives notification for a new buyer request
2. GOPA views unassigned requests and assigns them to one or more sellers in their network
3. GOPA monitors bid submissions from their sellers
4. When a buyer checks out, GOPA receives the invoice for acceptance
5. GOPA reviews invoice details (items, quantities, prices, charges) and accepts or rejects
6. On acceptance, order proceeds to fulfilment and rider pickup
7. GOPA tracks assigned request history

---

### Invoice Flow (Cross-Role)
The invoice is the central document that links checkout to fulfilment:

```
Buyer checks out
  → Invoice created (PENDING)
  → GOPA reviews invoice (if applicable)
  → GOPA accepts invoice
  → Seller marks items ready (READY_TO_BE_PICKED)
  → Rider accepts pickup job
  → Rider picks up from seller (QR scan at seller)
  → In transit (SHIPPED)
  → Rider delivers to buyer (QR scan by buyer)
  → Invoice closed (DELIVERED)
  → Seller and rider wallets credited
```

Status lifecycle: `PENDING → RECEIVED → WARE_HOUSE → READY_TO_BE_SHIPPED → READY_TO_BE_PICKED → SHIPPED → DELIVERED` (or `CANCELLED / FAILED`)

---

### Rider — Pickup and Delivery (Web)
1. Rider views available pickup jobs (items marked ready by sellers)
2. Rider accepts a job; pickup address shown on Google Maps
3. Rider navigates to seller location
4. Seller verifies rider identity; rider scans QR code at seller location to confirm pickup
5. Rider navigates to buyer address (shown on map)
6. Rider delivers; buyer scans rider's QR code to confirm delivery
7. Rider uploads a photo as proof of delivery
8. Rider's wallet is credited after delivery is confirmed

### Rider — Pickup and Delivery (USSD)
1. Dial USSD → Rider menu
2. **Pickups:** Browse paginated list of sellers with items ready → select seller → select item → confirm
3. **In-progress deliveries:** View invoices in transit → select order → select item
4. **Completed deliveries:** View history of past deliveries
5. **Wallet:** View balance/earnings → request withdrawal → enter amount → confirm with PIN

---

### Rider — Wallet Withdrawal (USSD)
1. Rider dials USSD → Wallet
2. Screen shows: current balance, available balance, total earnings
3. Rider selects "Withdraw" → sees available balance
4. Enters withdrawal amount
5. Confirms with PIN → withdrawal processed to registered payment account

---

### OTP Flows
OTP verification is required for:
- Account activation after signup (email/phone code)
- Role switching (switching active profile between Buyer/Seller/GOPA/Rider)
- Sensitive USSD operations (bid confirmation, checkout, withdrawal)
- Password reset

---

### Onboarding / Profiling
After signup, users complete role-specific registration:

| Role | Data collected |
|---|---|
| **Buyer** | Name, email, phone; optional: ID document |
| **Seller** | Store name, location, product categories, bank account details, referring GOPA ID |
| **GOPA** | Organisation name, licence info, service area, commission terms |
| **MEPA** | Shop name, address, location |
| **Rider** | Full name, vehicle type (motorcycle/car/truck/bicycle), licence number, insurance |

Payment accounts (bank account, mobile wallet, PayPal) are added during or after profiling.

---

## MVP Requirements

### Buyer

| Feature | Priority |
|---|---|
| Set up account and log in with phone number + OTP | 1 |
| Add email to account | 1 |
| Search for car parts by type, make/model/year (unauthenticated) | 1 |
| Filter search results by category, brand, model | 1 |
| Browse sellers with available inventory | 1 |
| Request a non-inventory part (bidding flow) | 1 |
| View and compare bids from sellers | 1 |
| Add a bid or inventory part to cart | 1 |
| Checkout with delivery address and mobile money payment | 1 |
| Submit delivery address (existing or new) | 1 |
| Track purchase and delivery status | 1 |
| Confirm delivery via QR code scan | 1 |
| Receive push notifications for order and delivery updates | 1 |
| Message seller about available parts | 1 |
| Rate the seller | 1 |
| Rate the delivery rider | 2 |
| Report an issue with an order | 1 |
| Access core flows via USSD (no data required) | 1 |
| Pay via credit card | 2 |
| Browse tutorial content (videos/articles) | 2 |

### MEPA

| Feature | Priority |
|---|---|
| Set up account and log in with phone number + OTP | 1 |
| Add email to account | 1 |
| Search for car parts by type, make/model/year | 1 |
| Filter search results | 1 |
| Request a non-inventory part | 1 |
| Redirect an order to a buyer's account | 1 |
| Track orders and deliveries for referred orders | 1 |
| Earn bonus points for referred purchases | 1 |
| Refer buyers to the SpePas platform (referral bonus) | 1 |

### Seller

| Feature | Priority |
|---|---|
| Set up account and log in with phone number + OTP | 1 |
| Add email to account | 1 |
| Create store profile with location | 1 |
| Input referring GOPA ID | 1 |
| List inventory items with title, description, photo, price | 1 |
| Respond to non-inventory part requests (bidding) via web and USSD | 1 |
| Set unit price and expected delivery date on bids | 1 |
| Filter requests by car brand or part type (USSD) | 1 |
| Mark an order as fulfilled and ready for rider pickup | 1 |
| Verify rider identity before handoff | 1 |
| Receive payment to wallet 24 hours after confirmed delivery | 1 |
| Message buyers about available parts | 1 |
| View sales statistics | 2 |

### GOPA

| Feature | Priority |
|---|---|
| Set up account and log in with phone number + OTP | 1 |
| Add email to account | 1 |
| View unassigned buyer requests | 1 |
| Assign requests to one or more sellers in network | 1 |
| View list of referred sellers | 1 |
| Accept or reject invoices after buyer checkout | 1 |
| Track orders and deliveries for referred sellers | 1 |
| View assigned and unassigned request history | 1 |
| Respond to messages from SpePas admin/support | 1 |
| View referral statistics | 2 |

### Rider

| Feature | Priority |
|---|---|
| Set up account and log in with phone number + OTP | 1 |
| Register vehicle type and licence details | 1 |
| View available pickup jobs (items ready for collection) | 1 |
| Accept a pickup job | 1 |
| Navigate to seller pickup address (map) | 1 |
| Scan QR code at seller to confirm pickup | 1 |
| Navigate to buyer delivery address (map) | 1 |
| Buyer scans QR code to confirm delivery | 1 |
| Upload proof of delivery photo | 1 |
| View wallet balance and earnings | 1 |
| Request wallet withdrawal | 1 |
| Manage pickup, delivery, and completed jobs via USSD | 1 |
| Log in with Google or Facebook | 2 |

### SpePas Admin

| Feature | Priority |
|---|---|
| View aggregated analytics on sales | 1 |
| View aggregated analytics on signups and usage | 1 |
| View aggregated analytics on reviews | 1 |
| Search and view user profiles by ID, phone, or email | 1 |
| View status and details of all active and past orders (with filters) | 1 |
| View wallet details for sellers, riders, GOPAs, MEPAs | 1 |
| View, approve, or deny seller and rider applications | 1 |
| Suspend, review, and ban user accounts | 1 |
| View active and past support chat conversations | 1 |
| View active and past bids for non-inventory parts | 1 |
| View seller inventory details | 1 |
| Update car part attributes and categories | 1 |
| Configure service charges, delivery fees, and taxes | 1 |
| Upload and post educational content (videos, articles) | 2 |
| Create and manage promotional sliders and ads | 2 |

---

## Feature × Channel Matrix

Which flows are available on which access channel:

| Flow | Web App | USSD |
|---|---|---|
| Sign up / log in | ✓ | — |
| Browse parts catalogue | ✓ | — |
| Post a request (by part code) | ✓ | ✓ (Buyer) |
| View bids on a request | ✓ | ✓ (Buyer) |
| Add bid to cart | ✓ | ✓ (Buyer) |
| Checkout | ✓ | ✓ (Buyer) |
| Remove item from cart | ✓ | ✓ (Buyer) |
| Submit a bid (Seller) | ✓ | ✓ (Seller) |
| Browse requests by brand/part | ✓ | ✓ (Seller) |
| Mark item ready for pickup | ✓ | ✓ (Seller) |
| View / accept invoices (GOPA) | ✓ | — |
| View pickup jobs | ✓ | ✓ (Rider) |
| Confirm pickup (QR scan) | ✓ | — |
| Confirm delivery (QR scan) | ✓ | — |
| View delivery history | ✓ | ✓ (Rider) |
| View wallet balance | ✓ | ✓ (Rider) |
| Request wallet withdrawal | ✓ | ✓ (Rider) |
| Profiling / onboarding | ✓ | — |
| Chat / messaging | ✓ | — |

---

## USSD Flow Detail

The USSD interface is a **state-machine menu system** — each screen is an activity with numbered options. Users navigate by entering a number and pressing send. Sessions are stateful; a user can exit and resume.

### Navigation conventions
- Enter a display number (e.g. `1`, `2`, `3`) to select an option
- Enter `0#` to return to the main menu
- Enter `1#` to go back to the previous screen
- Enter `#` to advance to the next page of a paginated list

### Buyer USSD main menu
1. **Post Request** — Enter part code → confirm part details → enter quantity → confirm with PIN
2. **My Bids** — View requests with active bids → select a request → view bids → select a bid → add to cart with PIN
3. **Cart** — View cart / checkout / remove items
   - Checkout: view items → choose aggregation mode → confirm

### Seller USSD main menu
1. **Browse Requests** — View all open requests, filter by car brand, or filter by part type
   - Select a request → enter unit price → enter delivery date → confirm (creates bid)
2. **My Active Bids** — View items awaiting pickup marking → select item → mark as ready for pickup (PIN)

### Rider USSD main menu
1. **Pickups** — Paginated list of sellers with items ready → select seller → select item → confirm
2. **Deliveries** — Invoices in transit → select order → select item
3. **Completed** — History of past deliveries
4. **Wallet** — View balance / earnings → withdraw (enter amount + PIN)

---

## Payment & Wallet

- **Primary payment method:** Mobile money (MTN, Vodafone, AirtelTigo)
- **Checkout flow:** Buyer enters wallet number and network at checkout; mobile money prompt sent for approval
- **Seller/Rider payouts:** Credited to in-app wallet after delivery confirmation (24-hour hold for sellers)
- **Withdrawal:** Users request a withdrawal from their wallet to a registered bank account or mobile money number

---

## QR Code System

QR codes are used at two points in every delivery:

| Point | Who scans | What it confirms |
|---|---|---|
| **Seller handoff** | Rider scans seller's QR in app | Correct items collected from correct seller |
| **Buyer delivery** | Buyer scans rider's QR in app | Correct items delivered to correct buyer |

QR codes are linked to invoices in the database. Scanning resolves the invoice/item and updates its status.

---

## Gap Analysis

Gaps are organized by layer. Status key: ✓ Done · ⚠ Partial · — Not started.

---

### Authentication & Onboarding

| Feature | Web | USSD | Backend | Notes |
|---|---|---|---|---|
| Sign up | ✓ | — | ✓ | USSD sign-up not supported; must register on web first |
| Login with phone + OTP | ✓ | — | ✓ | USSD sessions identified by MSISDN, no explicit login step |
| Role switching (OTP) | ✓ | — | ✓ | |
| Password reset | ✓ | — | ✓ | |
| Buyer profiling | ✓ | — | ✓ | |
| Seller profiling | ✓ | — | ✓ | |
| GOPA profiling | ✓ | — | ✓ | |
| MEPA profiling | ✓ | — | ✓ | |
| Rider profiling | ✓ | — | ✓ | |
| Admin account management | — | — | ⚠ | No admin UI; backend roles exist in schema |
| Social login (Google / Facebook) | — | — | — | Listed as priority 2; not implemented |

---

### Buyer Flows

| Feature | Web | USSD | Backend | Notes |
|---|---|---|---|---|
| Browse parts catalogue | ✓ | — | ✓ | |
| Search by make/model/year | ✓ | — | ✓ | USSD only supports direct part-code entry |
| Post a part request (bidding) | ✓ | ✓ | ✓ | |
| View bids on a request | ✓ | ✓ | ✓ | |
| Add bid / part to cart | ✓ | ✓ | ✓ | |
| Remove item from cart | ✓ | ✓ | ✓ | |
| Checkout (mobile money) | ✓ | ✓ | ⚠ | UI complete; live MoMo API not connected |
| Track order status | ✓ | — | ✓ | Real-time push not wired (see Cross-cutting) |
| Confirm delivery via QR scan | ⚠ | — | ✓ | Placeholder UI; camera/QR integration not done |
| Rate seller | — | — | ⚠ | Described in flows; no UI or endpoint wired |
| Rate rider | — | — | — | Not yet designed or implemented |
| Report an issue | — | — | — | Flow described; no implementation |
| View order history | ✓ | — | ✓ | |

---

### Seller Flows

| Feature | Web | USSD | Backend | Notes |
|---|---|---|---|---|
| View unassigned requests | ✓ | ✓ | ✓ | |
| Submit a bid | ✓ | ✓ | ✓ | |
| Filter requests by brand / part type | ✓ | ✓ | ✓ | |
| View active / historical bids | ✓ | ✓ | ✓ | |
| Mark item ready for pickup | ✓ | ✓ | ✓ | |
| Verify rider identity at handoff | — | — | — | Flow described; no UI built |
| Manage listed inventory | ⚠ | — | ✓ | Bidding flow complete; inventory CRUD listing UI incomplete |
| View wallet balance | — | — | ✓ | Wallet in DB; no web UI for sellers |
| Request wallet withdrawal | — | — | ✓ | Same as above |
| View sales statistics | — | — | ⚠ | Priority 2; no implementation |
| Message buyers | ⚠ | — | ⚠ | Chat scaffolded; not fully implemented |

---

### GOPA Flows

| Feature | Web | USSD | Backend | Notes |
|---|---|---|---|---|
| View unassigned requests | ✓ | — | ✓ | GOPA has no USSD interface |
| Assign requests to sellers | ✓ | — | ✓ | |
| View seller network | ✓ | — | ✓ | |
| Accept / reject invoices | ✓ | — | ✓ | |
| View assigned request history | ✓ | — | ✓ | |
| View referral statistics | — | — | ⚠ | Priority 2; not implemented |
| Wallet / commission payouts | — | — | ⚠ | Schema exists; no payout flow built |

---

### MEPA Flows

| Feature | Web | USSD | Backend | Notes |
|---|---|---|---|---|
| Search / request parts | ✓ | — | ✓ | Same flow as buyer |
| Redirect order to buyer account | ⚠ | — | ⚠ | Partially designed; not fully implemented end-to-end |
| Track order on buyer's behalf | ⚠ | — | ⚠ | Partially designed |
| Earn referral / bonus points | — | — | — | Listed in requirements; no implementation |
| Platform referral (invite buyer) | — | — | — | Not yet designed |

---

### Rider Flows

| Feature | Web | USSD | Backend | Notes |
|---|---|---|---|---|
| View available pickup jobs | ✓ | ✓ | ✓ | |
| Accept a pickup job | ✓ | ✓ | ✓ | |
| Navigate to seller (map) | ✓ | — | ✓ | Map renders; turn-by-turn navigation not integrated |
| Scan QR at seller to confirm pickup | ⚠ | — | ✓ | Camera/QR integration not done |
| Navigate to buyer (map) | ✓ | — | ✓ | Same as above |
| Buyer scans QR to confirm delivery | ⚠ | — | ✓ | Camera/QR integration not done |
| Upload delivery proof photo | ⚠ | — | ✓ | Upload UI exists; not wired to backend |
| View completed deliveries | ✓ | ✓ | ✓ | |
| View wallet balance / earnings | ✓ | ✓ | ✓ | |
| Request wallet withdrawal | ✓ | ✓ | ✓ | |

---

### Admin Flows

| Feature | Web | USSD | Backend | Notes |
|---|---|---|---|---|
| Analytics dashboard (sales, signups, reviews) | — | — | ✓ | No frontend built |
| Search / view user profiles | — | — | ✓ | No frontend built |
| View / filter all orders | — | — | ✓ | No frontend built |
| View wallet details (all roles) | — | — | ✓ | No frontend built |
| Approve / deny seller & rider applications | — | — | ✓ | No frontend built |
| Suspend / ban accounts | — | — | ✓ | No frontend built |
| View support chat history | — | — | ⚠ | Partially wired |
| View all bids | — | — | ✓ | No frontend built |
| Update part attributes & categories | — | — | ✓ | No frontend built |
| Configure charges, fees, taxes | — | — | ✓ | No frontend built |
| Upload educational content | — | — | — | Priority 2; not started |
| Manage promo sliders / ads | — | — | — | Priority 2; not started |

---

### Cross-cutting & Infrastructure

| Area | Status | Notes |
|---|---|---|
| Real-time order updates (WebSocket) | ⚠ | Socket.IO in gateway; frontend not connected |
| Push notifications | — | Described in flows; no end-to-end implementation |
| Mobile money payment API (live) | ⚠ | UI scaffolded; live MoMo gateway not connected |
| QR code scanning (camera) | — | Placeholder UI only; no camera/QR library integrated |
| SMS delivery for USSD OTP | ✓ | Handled by telco via USSD session |
| Email notifications | ⚠ | Nodemailer wired; transactional emails not all implemented |
| Error monitoring / APM | ⚠ | Elastic APM SDK in frontend; backend agents not confirmed |
| Rate limiting | ⚠ | Gateway has basic middleware; not hardened |
| File/image uploads (CDN) | ⚠ | Upload endpoints exist; CDN storage not confirmed |
| Logging / audit trail | ⚠ | RabbitMQ activity logging in gateway; consumers not confirmed |
| Automated tests (frontend) | — | No test files in frontend repo |
| Automated tests (backend) | — | No test files in service repos |
| CI/CD pipeline | — | No pipeline config found in any repo |
| USSD sign-up flow | — | Users must onboard on web before using USSD |
