# SpePas — ClickUp Tasks Status

> **Last updated:** 2026-02-22
> **Source:** ClickUp workspace `9012356075`
> **Codebase audit:** Cross-referenced against `spepas-website` and `spepas-web-admin` repos

---

## Summary

| Portal | Total | Completed | Open | In Progress |
|--------|-------|-----------|------|-------------|
| Web APP Portal | 27 | 17 | 6 | 4 |
| Admin APP Portal | 22+ | 14 | 6 | 2 |
| USSD | 2 | 0 | 2 | 0 |

---

## Web APP Portal — Open Tasks

| # | Task | Status | Assignee | Notes | Link |
|---|------|--------|----------|-------|------|
| 1 | Fix filtering pills on shop page | **in progress** | Gaia Carini | Being worked on current branch | [open](https://app.clickup.com/t/869c7tztn) |
| 2 | Show subcategories for parts on shop page | **in progress** | Gaia Carini | Being worked on current branch | [open](https://app.clickup.com/t/869c7tzu5) |
| 3 | Photo Upload for Request | in progress | Joseph Addai | Partial — checkbox exists but no file picker in request form | [open](https://app.clickup.com/t/869afjp8u) |
| 4 | Broken Images | in progress | Joseph Addai | Some fallbacks added, needs comprehensive global handler | [open](https://app.clickup.com/t/869a2dnug) |
| 5 | Reset Password | in progress | Joseph Addai | Flow exists, may need final polish | [open](https://app.clickup.com/t/869a2dnrd) |
| 6 | Post a request Quantity | in review | Joseph Addai | Quantity input implemented with validation — should be closed | [open](https://app.clickup.com/t/869afjmwu) |
| 7 | User Name at Login | in review ussd | Joseph Addai | Shows post-login, not during login — needs clarification | [open](https://app.clickup.com/t/869acu6qz) |
| 8 | Rider Registration Failed | to do: web | Joseph Addai | Rider registration form exists — needs QA retest | [open](https://app.clickup.com/t/869afjhqn) |
| 9 | Seller Onboarding | to do: web | Joseph Addai | Full flow implemented — should be closed | [open](https://app.clickup.com/t/869acv7ym) |
| 10 | Chat screens and api consumption | to do: web | Joseph Addai, Andrea | UI exists with mock data only, no backend integration | [open](https://app.clickup.com/t/869aeed3d) |
| 11 | Contact Form API | to do: ussd | Kofi Bassaw, Andrea | Form exists, submission handler commented out — backend needed | [open](https://app.clickup.com/t/8699vz2a3) |
| 12 | USSD Aggregation | to do: ussd | Kofi Bassaw | Separate USSD system | [open](https://app.clickup.com/t/869a2dned) |

### Recently Completed (this session)
- Maps integration → **complete**
- File Uploads → **complete**
- Add to Cart → **complete**
- View cart → **complete**
- User type at Registration → **complete**
- Redirection of GOPA, MEPA etc → **complete**
- Clickable Options → **complete**
- Hardcoded Products Removal → **complete**
- Rider invoice flow screens and api consumption → **complete**

---

## Admin APP Portal — Open Tasks

| # | Task | Status | Assignee | Notes | Link |
|---|------|--------|----------|-------|------|
| 1 | Remove notification/message button for Super admin | to do | — | Components exist but no role-based conditional rendering | [open](https://app.clickup.com/t/869a04bae) |
| 2 | Change Gopo to GOPA everywhere | to do | — | Mixed naming in codebase, needs standardization | [open](https://app.clickup.com/t/869a04n5u) |
| 3 | Make Password for admin = phone number | to do | — | Likely backend task, not in UI | [open](https://app.clickup.com/t/869a03w0r) |
| 4 | Images for spare parts | to do | Stephen O-B | No image upload UI in spare parts form | [open](https://app.clickup.com/t/869acu7u3) |
| 5 | MEPA Profile | to do | Stephen O-B | List/create done, detail/profile route not active | [open](https://app.clickup.com/t/869aatv7a) |
| 6 | Seller profile | in progress | Stephen O-B | List/create done, detail route partially implemented | [open](https://app.clickup.com/t/869a04dg6) |
| 7 | Email Services Provider | in progress | Ben Kwame, Joseph Boadi, Jeremiah, Kofi | Not found in admin UI — likely backend config | [open](https://app.clickup.com/t/869a03xud) |
| 8 | DVLA | api requests | — | Not implemented in admin app | [open](https://app.clickup.com/t/869a2r9z4) |
| 9 | Add Users (subtask of Group Details) | to do | — | Group details page done, add users within it may need work | [open](https://app.clickup.com/t/869a31z9t) |

### Recently Completed (this session)
- Admin Logout → **completed**
- Add Admin user → **completed**
- Resetting admin user password → **completed**
- Get all Admin user types → **completed**
- Get app menu of groups → **completed**
- Dashboard → **completed**
- Category Management → **completed**
- Group Details → **completed**
- Groups View → **completed**
- Menu for Application → **completed**
- Spare Parts Addition → **completed**
- MEPA → **completed**
- Applications → **completed**
- Collapsing Options → **completed**

---

## USSD — Open Tasks

| # | Task | Status | Assignee | Link |
|---|------|--------|----------|------|
| 1 | Review Feature | backlog | Joseph Boadi | [open](https://app.clickup.com/t/869a8w66j) |
| 2 | Chat Feature | backlog | Joseph Boadi | [open](https://app.clickup.com/t/869a8w5kf) |

---

## Blockers & Risks

| Issue | Impact | Action Needed |
|-------|--------|---------------|
| Chat has no backend API | Web chat is UI-only with mock data | Backend team must deliver chat APIs |
| Contact Form API missing | Form submission disabled | Backend endpoint needed |
| DVLA not implemented | Admin portal feature gap | Needs requirements + implementation |
| Email Services Provider unclear | Marked in progress but no UI exists | Clarify if this is backend-only |
| All due dates are 5-9+ months past | Makes due dates meaningless | Re-baseline all due dates |
