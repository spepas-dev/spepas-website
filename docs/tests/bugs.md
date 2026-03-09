# SpePas — Bugs Found During E2E Testing

> **Last updated:** 2026-03-08
> **Source:** [e2e-test-results.md](./e2e-test-results.md)

---

## Summary

| ID | Severity | Component | Owner | Bug | Found In |
|----|----------|-----------|-------|-----|----------|
| BUG-001 | Medium | Admin API | Backend team | `/requests/stats` endpoint returns 404 | Test 0A |
| BUG-002 | Medium | Admin Portal | Admin Portal team | Categories table shows 0 results despite API returning 15 | Test 0A |
| BUG-003 | Low | Admin Portal | Admin Portal team | Settings profile shows hardcoded dummy data instead of real user | Test 0A |

---

## Details

### BUG-001 — `/requests/stats` endpoint returns 404

- **Severity:** Medium
- **Component:** Admin API (gateway)
- **Owner:** Backend team
- **Found in:** Test 0A — Order Management > Requests
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Navigate to Order Management > Requests
- **Expected:** Stats endpoint returns request counts/metrics; no console errors
- **Actual:** `GET /api/gateway/v1/requests/stats` returns 404. The admin portal retries the request repeatedly, producing 24 console errors on page load.
- **Impact:** No stats displayed on the Order Management page. Console flooded with errors.
- **Root cause:** The `/requests/stats` route likely does not exist in the gateway or backend services.

---

### BUG-002 — Categories table shows 0 results despite API returning data

- **Severity:** Medium
- **Component:** Admin Portal (frontend)
- **Owner:** Admin Portal team
- **Found in:** Test 0A — Inventory Management > Categories
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com`
  2. Navigate to Inventory Management > Categories
- **Expected:** Table displays the 15 categories returned by the API
- **Actual:** KPI cards all show "0". Table shows "No results." Console log confirms `{categories: Array(15), meta: Object}` was received from the API.
- **Impact:** Admin cannot view or manage categories.
- **Root cause:** The admin portal frontend expects a different response shape (likely `data` array instead of `categories` array) from the categories API.

---

### BUG-003 — Settings profile shows hardcoded dummy data

- **Severity:** Low
- **Component:** Admin Portal (frontend)
- **Owner:** Admin Portal team
- **Found in:** Test 0A — Settings > Profile
- **Steps to reproduce:**
  1. Log in to `admin.spepas.com` as any user
  2. Navigate to Settings
- **Expected:** Profile form shows the authenticated user's actual info (e.g. "Kofi Admin", "adminuser@yahoo.com")
- **Actual:** Form fields show hardcoded values: First Name "John", Last Name "Doe", Email "john.doe@example.com", Phone "+1 (555) 123-4567"
- **Impact:** Admin cannot view or update their real profile information.
- **Root cause:** Profile form is populated with static placeholder values instead of fetching from the user/session API.
