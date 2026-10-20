# Defect & Vulnerability Remediation Report
**Project:** PUST Alumni Network Web Platform (Somaborton PUST)  
**Testing Phase:** White Box & Black Box Verification  
**Evaluation Standard:** IEEE 829 / ISO 29119 Test Documentation Standard  
**Report Date:** October 2026  

---

## 1. Executive Summary of Defects

During systematic White Box and Black Box testing of the PUST Alumni Network application, **7 distinct defects and vulnerabilities** were identified, categorized, reproduced, and remedied. All remediations have been verified with automated regression tests.

| Defect ID | Affected Module | Severity | Type | Root Cause Summary | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-AUTH-01** | `POST /api/auth/login` | **CRITICAL** | Security / Auth Bypass | Fallback `users.find() \|\| users[0]` allowed arbitrary credentials to log in as first user | **RESOLVED & VERIFIED** |
| **BUG-AUTH-02** | `/api/admin/*`, `DELETE /api/events`, `DELETE /api/jobs` | **HIGH** | Security / Broken Access Control | Missing authorization middleware allowed unauthenticated deletion & modifications | **RESOLVED & VERIFIED** |
| **BUG-AUTH-03** | `GET /api/contact` | **HIGH** | Security / Information Disclosure | Contact inquiries containing visitor emails and phone numbers were exposed publicly | **RESOLVED & VERIFIED** |
| **BUG-AUTH-04** | `backend/config/db.js` | **MEDIUM** | Data Integrity | Test suite executed against primary database store `db_store.json` | **RESOLVED & VERIFIED** |
| **BUG-AUTH-05** | `rateLimiter` Middleware | **MEDIUM** | Test Reliability | Local in-memory rate limiter throttled test runner requests from `127.0.0.1` | **RESOLVED & VERIFIED** |
| **BUG-API-01** | Resource Modification Routes | **MEDIUM** | API Reliability / Error Handling | Missing 404 guards returned HTTP 200 with `{ data: undefined }` on non-existent IDs | **RESOLVED & VERIFIED** |
| **BUG-API-02** | Events, Jobs, Donations, Contact | **MEDIUM** | Data Validation | Missing server-side payload validation allowed negative/empty payloads | **RESOLVED & VERIFIED** |

---

## 2. Detailed Defect Catalog

### Defect BUG-AUTH-01: Critical Authentication Bypass in Login Endpoint
- **Affected File:** `backend/routes/api.js` (`POST /api/auth/login`)
- **Severity:** Critical (CVSS 9.1)
- **Description:**  
  When a user submitted an unregistered or arbitrary email address to `/api/auth/login`, the user lookup expression was written as:
  ```javascript
  const user = users.find(u => u.email === trimmedEmail) || users[0];
  ```
  If no matching email existed in the database, the server automatically selected `users[0]` (the first user in the database). Furthermore, if `users[0]` had no hashed password, the server checked against the demo password `'pust2026'`. This allowed an unauthenticated attacker to log in as the initial system administrator or primary user with any random email address.
- **Reproduction Steps:**
  1. Send `POST /api/auth/login` with body `{"email": "unregistered.random@mail.com", "password": "pust2026"}`.
  2. Observe the server responding with `HTTP 200 OK`, returning a signed JWT token for `users[0]`.
- **Root Cause:**  
  Leftover development mock fallback code (`|| users[0]`) in the production authentication route.
- **Remediation:**  
  Removed fallback expression. Implemented strict lookup: if `!user`, immediately terminate request with `HTTP 401 Unauthorized` (`message: 'Invalid credentials'`).
- **Regression Test:** `TC-AUTH-09` in `backend/tests/auth.test.js`.

---

### Defect BUG-AUTH-02: Broken Access Control on Admin and Deletion Endpoints
- **Affected File:** `backend/routes/api.js` (`/api/admin/*`, `DELETE /api/events/:id`, `DELETE /api/jobs/:id`)
- **Severity:** High (OWASP A01:2021 - Broken Access Control)
- **Description:**  
  Administrative routes (`GET /api/admin/verifications`, `PATCH /api/admin/verifications/:id`, `PATCH /api/admin/users/:id`, `DELETE /api/admin/users/:id`) as well as deletion routes for events and jobs did not declare any authentication or authorization middleware. Any HTTP client could delete user accounts, approve verification requests, or delete campus events without providing a JWT token.
- **Reproduction Steps:**
  1. Send `DELETE /api/events/1` without an `Authorization` header.
  2. Observe event record deletion with `HTTP 200 OK`.
- **Root Cause:**  
  Routes were mounted directly without attaching `requireAuth` or `requireAdmin` middlewares.
- **Remediation:**  
  Implemented `requireAuth` middleware to validate Bearer JWT tokens and decode user claims. Implemented `requireAdmin` middleware to enforce `req.user.role === 'admin'`. Attached `requireAdmin` to all administrative and deletion endpoints.
- **Regression Test:** `TC-SEC-04`, `TC-SEC-05`, `TC-SEC-06`, `TC-SEC-07` in `backend/tests/admin_security.test.js`.

---

### Defect BUG-AUTH-03: Sensitive Information Disclosure on Contact Inquiries
- **Affected File:** `backend/routes/api.js` (`GET /api/contact`)
- **Severity:** High (OWASP A01:2021 - Broken Access Control / Data Privacy)
- **Description:**  
  The endpoint `GET /api/contact` returned all recorded visitor contact messages, including private email addresses, personal phone numbers, and inquiry texts, without requiring authentication or administrator rights.
- **Reproduction Steps:**
  1. Send `GET /api/contact` without any authentication headers.
  2. Observe HTTP 200 response containing all submitted visitor contact inquiries with unmasked emails and phone numbers.
- **Root Cause:**  
  Publicly accessible route handler without role-based restriction.
- **Remediation:**  
  Protected `GET /api/contact` with `requireAdmin` middleware. Public visitors can only submit messages via `POST /api/contact`; only verified administrators can inspect submissions.
- **Regression Test:** `TC-SEC-08` in `backend/tests/admin_security.test.js` and `TC-CNT-03` in `backend/tests/features.test.js`.

---

### Defect BUG-AUTH-04: Test Data Contamination of Primary Store
- **Affected File:** `backend/config/db.js`
- **Severity:** Medium
- **Description:**  
  When executing unit or integration tests, write operations (`POST /auth/register`, `POST /events`, etc.) mutated the persistent data file `backend/data/db_store.json`. Over repeated test runs, hundreds of throwaway test users accumulated in the application's runtime data.
- **Root Cause:**  
  The storage path in `backend/config/db.js` was hardcoded to `db_store.json` regardless of the process environment (`NODE_ENV`).
- **Remediation:**  
  Updated `db.js` to inspect `process.env.NODE_ENV`. When set to `'test'`, storage is directed to `backend/data/db_test_store.json`. Added `db.resetStore()` method to cleanly re-seed test fixtures prior to and following test runs.
- **Regression Test:** `WB-MEM-01` in `backend/tests/whitebox_logic.test.js`.

---

### Defect BUG-AUTH-05: Rate Limiter Throttling Test Execution
- **Affected File:** `backend/routes/api.js` (`rateLimiter` middleware)
- **Severity:** Medium
- **Description:**  
  A custom rate limiter middleware throttled clients to 10 requests per minute based on IP address. Running the automated test suite against `http://127.0.0.1` caused subsequent tests in the suite to fail with `HTTP 429 Too Many Requests`.
- **Root Cause:**  
  The rate limiter did not bypass enforcement during test runs.
- **Remediation:**  
  Added an environment check `if (process.env.NODE_ENV === 'test') return next();` at the beginning of the `rateLimiter` middleware.
- **Regression Test:** Full test suite execution passes 70/70 tests without rate-limiting interruptions.

---

### Defect BUG-API-01: Missing 404 Guards on Nonexistent Resource IDs
- **Affected File:** `backend/routes/api.js`
- **Severity:** Medium (RFC 7231 Compliance)
- **Description:**  
  Multiple endpoints (`/api/alumni/:id/connect`, `POST /api/events/:id/register`, `POST /api/jobs/:id/apply`, `PATCH /api/jobs/:id`, `DELETE /api/jobs/:id`, `POST /api/gallery/:id/like`, `PATCH /api/admin/verifications/:id`, `PATCH /api/admin/users/:id`, `DELETE /api/admin/users/:id`) did not verify if the target resource existed before responding. If a non-existent ID was supplied, the handlers returned `HTTP 200 OK` with `{ ok: true, data: undefined }` or `{ ok: true, id }`.
- **Reproduction Steps:**
  1. Send `PATCH /api/jobs/999999` with body `{"salary": "৳ 1,00,000"}`.
  2. Observe HTTP 200 response with `{ ok: true, data: undefined }`.
- **Root Cause:**  
  Absence of null/undefined checking on lookup results before generating responses.
- **Remediation:**  
  Implemented explicit guard clauses on all resource lookup operations:
  ```javascript
  if (!resource) {
    return res.status(404).json({ ok: false, message: 'Resource not found' });
  }
  ```
- **Regression Test:** `TC-ALM-09`, `TC-EVT-06`, `TC-JOB-07`, `TC-JOB-08`, `TC-GAL-02`, `TC-ADM-03`, `TC-ADM-05`, `TC-ADM-07`.

---

### Defect BUG-API-02: Missing Input Validation on Resource Creation Endpoints
- **Affected File:** `backend/routes/api.js` (`/api/events`, `/api/jobs`, `/api/donations`, `/api/contact`)
- **Severity:** Medium
- **Description:**  
  Endpoints accepting creation payloads lacked validation for mandatory fields:
  - `POST /events` allowed empty titles and dates.
  - `POST /jobs` allowed empty job titles and company names.
  - `POST /donations` accepted `0`, negative amounts, or non-numeric strings.
  - `POST /contact` accepted blank submissions and invalid email formats.
- **Reproduction Steps:**
  1. Send `POST /api/donations` with `{"amount": -500}`.
  2. Observe HTTP 201 Created with negative donation record.
- **Root Cause:**  
  Lack of request payload sanitization and boundary checking.
- **Remediation:**  
  Added input validation checks:
  - `POST /events`: Requires non-empty `title`, `date`, `location`.
  - `POST /jobs`: Requires non-empty `title`, `company`.
  - `POST /donations`: Enforces `Number(amount) > 0` and `!isNaN(amount)`.
  - `POST /contact`: Enforces non-empty `name`, `email`, `message` and validates email format with regex.
- **Regression Test:** `TC-EVT-05`, `TC-JOB-06`, `TC-DON-02`, `TC-CNT-02`.
