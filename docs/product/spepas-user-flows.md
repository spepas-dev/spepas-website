# SpePas — Detailed User Flows

> Extracted from `spepas-overview.md`
> Last updated: 2026-03-01

---

## Buyer — Phone Order (MVP0 Primary Flow)
1. Buyer calls SpePas phone line (via 3CX)
2. Agent identifies caller (existing profile or creates minimal profile)
3. Agent collects vehicle details: year, brand, model, drivetrain/fuel
4. Agent maps parts to catalog codes using Code Builder widget in Admin Portal
5. Agent reads back order summary: "You requested [Year Brand Model], parts: [list]"
6. Agent creates request in Admin Portal (one per part type, source = Phone)
7. System sends SMS to buyer: "Request R48291 created. Review bids via `*887*9#` → My requests." + link to part images
8. GOPA forwards request to specific sellers in their network
9. Sellers receive the request and submit bids via USSD (Open Requests → All / By part / By brand) or web
10. Buyer receives SMS when bids arrive: "New bids for R48291. Dial `*887*9#` → My requests"
11. Buyer accepts bid via USSD (My requests → select → accept) or web → item added to Cart
12. Buyer checks out via USSD (Cart → Check Out → MoMo payment) or web
13. Seller marks order ready (USSD: My bids → mark ready) → Rider picks up (USSD: New pickups) → Rider delivers using delivery code

---

## Buyer — Purchasing a Listed Part (Direct / Inventory)
1. Buyer searches for a part by car make/model/year (e.g. "2014 Toyota Vitz spark plug")
2. Part is found in the catalogue → buyer sees available sellers and prices
3. Buyer selects a seller, adds to cart
4. Buyer enters delivery address and payment details, checks out
5. Mobile money payment notification sent to buyer for approval
6. Seller fulfils the order
7. Rider accepts pickup job and navigates to seller location
8. Buyer receives status updates: order fulfilled → rider en route with ETA
9. Rider arrives at buyer; buyer scans rider's QR code in app to confirm delivery
10. Buyer rates the delivery experience and later rates the seller

**USSD channel:** Requests are created by phone (call-in) or on the website — not via USSD. Once a request exists, buyers use USSD to accept bids, check out (MoMo payment), and track orders.

---

## Buyer — Requesting a Non-Listed Part (Bidding)
1. Buyer submits a request for a part not in the catalogue (car make/model/year + part description + quantity)
2. Request is broadcast to relevant sellers (via GOPA network or directly)
3. Sellers submit bids with price, delivery date, and optionally photos
4. Buyer receives notification and reviews bids
5. Buyer selects a bid, adds to cart, checks out
6. Rider picks up and delivers; buyer confirms with QR scan
7. Buyer rates delivery and seller

**Note**: Quantity is locked after bid acceptance — buyers cannot change quantity to game discounts. A new request must be submitted for a different quantity.

**USSD channel:** Request creation is phone/web only. Buyers use USSD to view bids (`*887*9#` → My requests), accept a bid, check out (Cart → Check Out), and track delivery.

---

## Buyer — GOPA-Brokered Request
1. Buyer submits a part request (via phone call-in or website)
2. GOPA forwards the request to specific sellers in their network
3. Sellers submit bids; buyer receives notification and selects an offer
4. Checkout, delivery, and QR confirmation follow the standard flow

---

## MEPA — Purchasing on Behalf of a Customer
1. Mechanic (MEPA) searches for the required part and submits a request
2. MEPA receives offers and selects one
3. MEPA creates an invoice and forwards it to the customer's SpePas account (MEPA = "Buyer Pro Max" — creates invoices for others to pay)
4. Customer retrieves invoice via USSD menu and pays manually (push-to-pay avoided for security)
5. MEPA tracks order fulfilment and delivery on behalf of the customer
6. Delivery confirmed by buyer via QR code scan
7. MEPA earns referral commission tracked via unique MEPA ID

---

## Seller — Submitting a Bid (Web)
1. Seller views requests assigned by their GOPA (or unassigned requests)
2. Seller confirms stock availability
3. Seller submits a bid: unit price, max quantity, optional discount, expected delivery date, optional photos
4. Seller monitors bid status (pending, accepted, rejected)
5. Bid expires after 2–5 days (early rollout; shorter expiry possible later)

## Seller — Submitting a Bid (USSD)
USSD shortcode: `*887*9#` | Mocker: `mocker.spepas.com/seller`

```
Seller Main Menu:
  1. Open Requests → 1. All Requests | 2. By part | 3. By brand
  2. My bids
  3. Contact us
```

1. Dial `*887*9#` → 1. Open Requests
2. Browse requests: 1. All Requests, 2. By part, or 3. By brand
3. Select a request → enter unit price → enter expected delivery date → confirm with PIN
4. Bid submitted; seller can view active bids under 2. My bids

## Seller — Marking an Item Ready for Pickup
1. After a buyer checks out (invoice created), seller receives notification
2. Seller prepares the part and packages it in a SpePas bag
3. Seller marks the item as "ready for pickup" via app or USSD
4. Item becomes visible to riders for pickup acceptance
5. Seller verifies the rider's credentials before handoff
6. Payment released to seller's wallet 24 hours after delivery is confirmed

**Via USSD:** `*887*9#` → 2. My bids → select accepted bid → mark as ready for pickup (PIN confirmation)

---

## GOPA — Onboarding Sellers, Forwarding Requests & Tracking Orders
1. GOPA onboards new sellers into their network (name, phone, store, location, payment details)
2. GOPA receives notification for a new buyer request
3. GOPA forwards the request to specific sellers in their network
4. GOPA monitors bid submissions from their sellers
5. After buyer checks out, order proceeds to fulfilment and rider pickup
6. GOPA tracks the status of forwarded orders (bid received → accepted → shipped → delivered)

*GOPA does not have a USSD flow — web only.*

---

## Invoice Flow (Cross-Role)
The invoice is the central document that links checkout to fulfilment:

```
Buyer checks out (web or USSD Cart → Check Out)
  → Invoice created (PENDING)
  → Seller marks items ready (READY_TO_BE_PICKED)
  → Rider accepts pickup job (USSD: New pickups)
  → Rider picks up from seller (QR scan at seller)
  → In transit (SHIPPED)
  → Rider delivers to buyer (delivery code or QR scan)
  → Invoice closed (DELIVERED)
  → Seller and rider wallets credited
```

Status lifecycle: `PENDING → RECEIVED → WARE_HOUSE → READY_TO_BE_SHIPPED → READY_TO_BE_PICKED → SHIPPED → DELIVERED` (or `CANCELLED / FAILED`)

---

## Rider — Pickup and Delivery (Web)
1. Rider views available pickup jobs (items marked ready by sellers)
2. Rider accepts a job; pickup address shown on Google Maps
3. Rider navigates to seller location
4. Seller verifies rider identity; rider scans QR code at seller location to confirm pickup
5. Rider navigates to buyer address (shown on map)
6. Rider delivers; buyer scans rider's QR code to confirm delivery
7. Rider uploads a photo as proof of delivery
8. Rider's wallet is credited after delivery is confirmed

## Rider — Pickup and Delivery (USSD)
USSD shortcode: `*887*9#` | Mocker: `mocker.spepas.com/rider`

```
Rider Main Menu:
  1. New pickups           → accept available pickup jobs
  2. In progress deliveries → track active deliveries, enter delivery code
  3. Completed deliveries   → view delivery history
  4. Wallet                 → total balance / available to withdraw / lifetime earnings
     └── 1. Withdraw → enter 4-digit PIN
  5. Contact us
```

1. Dial `*887*9#` → 1. New pickups → browse available jobs → select → confirm
2. After pickup: 2. In progress deliveries → select delivery → update status
3. On delivery: enter buyer's delivery code to confirm → moves to 3. Completed deliveries
4. Check earnings: 4. Wallet → view balances → 1. Withdraw → enter PIN

---

## Rider — Wallet Withdrawal (USSD)
1. Rider dials `*887*9#` → 4. Wallet
2. Screen shows: total balance, available to withdraw, lifetime earnings
3. Rider selects 1. Withdraw
4. Enters 4-digit PIN to confirm
5. Withdrawal processed to registered payment account

---

## OTP Flows
OTP verification is required for:
- Account activation after signup (email/phone code)
- Role switching (switching active profile between Buyer/Seller/GOPA/Rider)
- Sensitive USSD operations (bid confirmation, checkout, withdrawal)
- Password reset

---

## Onboarding / Profiling
After signup, users complete role-specific registration:

| Role | Data collected |
|---|---|
| **Buyer** | Name, email, phone; optional: ID document |
| **Seller** | Store name, location, product categories, bank account details, referring GOPA ID |
| **GOPA** | Organisation name, licence info, service area, commission terms |
| **MEPA** | Shop name, address, location, unique MEPA ID (assigned for referral tracking) |
| **Rider** | Full name, vehicle type (motorcycle/car/truck/bicycle), licence number, insurance |

Payment accounts (bank account, mobile wallet, PayPal) are added during or after profiling.
