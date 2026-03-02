# SpePas — E2E Test Results & Environment

> **Last updated:** 2026-03-01
> **Test plan:** [e2e-test-plan.md](./e2e-test-plan.md)

---

## Test Accounts & Credentials

| Account | Env Var | Used For |
|---------|---------|----------|
| Multi-role (Web + USSD) | `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` | All buyer/seller/gopa/rider/mepa flows |
| Admin Portal | `TEST_ADMIN_EMAIL` / `TEST_ADMIN_PASSWORD` | Admin portal testing |
| USSD test phone | `TEST_USSD_PHONE` | All USSD flows via mockers |
| USSD test OTP | `TEST_USSD_OTP` | OTP verification in USSD |
| MoMo sandbox | CalBank test wallet | Payment testing |

All credentials stored in `.env.test.local` (not checked into git).

---

## USSD Mockers

The USSD shortcode is `*887*9#`. Use the web-based mockers to simulate USSD sessions:

| Role | Mocker URL | Env Var |
|------|-----------|---------|
| Buyer | https://mocker.spepas.com/ | `USSD_MOCKER_BUYER_URL` |
| Seller | https://mocker.spepas.com/seller | `USSD_MOCKER_SELLER_URL` |
| Rider | https://mocker.spepas.com/rider | `USSD_MOCKER_RIDER_URL` |

**How to use:** Enter the test phone number → dial `*887*9#` → interact with menu options.

### USSD Menu Structure (verified 2026-03-01)

```
BUYER
├── 1. Create request        ⚠️ SHOULD BE REMOVED — requests via phone/web only
├── 2. My requests           → view active requests, bids, accept bids
├── 3. Cart                  → 1. Check Out  |  2. Remove Item
└── 4. Contact us            → (not yet implemented)

SELLER
├── 1. Open Requests         → 1. All Requests  |  2. By part  |  3. By brand
├── 2. My bids               → view/manage submitted bids, mark ready
└── 3. Contact us            → (not yet implemented)

RIDER
├── 1. New pickups            → accept available pickup jobs
├── 2. In progress deliveries → track active deliveries
├── 3. Completed deliveries   → view delivery history
├── 4. Wallet                 → balance + lifetime earnings + 1. Withdraw (PIN)
└── 5. Contact us             → (not yet implemented)
```

---

## Known Issues & Discrepancies

| Issue | Where | Status |
|-------|-------|--------|
| Buyer USSD still has "Create request" (option 1) | `mocker.spepas.com/` | Should be removed — requests are phone/web only. Flag with backend. |
| "Contact us" not implemented | All 3 USSD mockers | Returns error. Low priority. |
| Buyer "My requests" shows main menu again when selected with no data | `mocker.spepas.com/` | Possible bug — should show empty list, not re-render main menu. |

---

## Test Results

> Record results here as tests are executed. Use: **PASS**, **FAIL**, **BLOCKED**, or **SKIPPED**.

### Phase 1A — Admin Portal + Phone + USSD

| # | Task | Result | Notes | Tested By | Date |
|---|------|--------|-------|-----------|------|
| 0A | Login & Dashboard | | | | |
| 0B | User Management | | | | |
| 0C | Call-In Order Wizard | | | | |
| 0D | Order & Bid Monitoring | | | | |
| 0E | Access Management | | | | |
| 0F | Inventory & Wallets | | | | |
| 1 | Agent Creates Phone Order | | | | |
| 2 | Seller Bids (USSD) | | | | |
| 3 | Buyer Accepts Bid (USSD) | | | | |
| 4 | Buyer Checkout (USSD) | | | | |
| 5 | GOPA Forwards Request | | | | |
| 5b | GOPA Tracks Forwarded Order | | | | |
| 6 | Seller Marks Ready (USSD) | | | | |
| 7 | Rider Accepts Pickup (USSD) | | | | |
| 8 | Rider Picks Up | | | | |
| 9 | Rider Delivers | | | | |
| 10 | Rider Wallet (USSD) | | | | |
| 11 | Wallet Settlement | | | | |

### Phase 1B — Phone/USSD Rejection Scenarios

| # | Task | Result | Notes | Tested By | Date |
|---|------|--------|-------|-----------|------|
| 12 | No Bids Received | | | | |
| 13 | Buyer Ignores Bids | | | | |
| 14 | Payment Failure | | | | |
| 15 | GOPA Onboards Seller (USSD) | | | | |
| 15b | Seller Browses by Part/Brand | | | | |
| 16 | Seller Can't Fulfill | | | | |
| 17 | Rider Declines Job | | | | |

### Phase 2A — Web App Happy Path

| # | Task | Result | Notes | Tested By | Date |
|---|------|--------|-------|-----------|------|
| 18 | Buyer Sign Up & Profile | | | | |
| 19 | Seller Sign Up & Profile | | | | |
| 20 | Buyer Posts Request | | | | |
| 21 | GOPA Forwards Request | | | | |
| 22 | Seller Submits Bid | | | | |
| 23 | Buyer Accepts Bid | | | | |
| 24 | Buyer Checkout (MoMo) | | | | |
| 25 | GOPA Tracks Forwarded Orders | | | | |
| 26 | Seller Marks Ready | | | | |
| 27 | Rider Sign Up & Profile | | | | |
| 28 | Rider Pickup & Deliver | | | | |
| 29 | Wallet Settlement | | | | |

### Phase 2B — Web App Rejection Scenarios

| # | Task | Result | Notes | Tested By | Date |
|---|------|--------|-------|-----------|------|
| 30 | Payment Failure | | | | |
| 31 | GOPA Onboards Seller (Web) | | | | |
| 32 | Buyer Cancels Order | | | | |
| 33 | Seller Can't Fulfill | | | | |
| 34 | Rider Declines Job | | | | |

### Phase 3 — Cross-Cutting

| # | Task | Result | Notes | Tested By | Date |
|---|------|--------|-------|-----------|------|
| 35 | Role Switching | | | | |
| 36 | Session & Auth | | | | |
| 37 | Notifications | | | | |
| 38 | Contact & Support | | | | |
| 39 | Shop & Vehicle Selector | | | | |
