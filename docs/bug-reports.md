# Bug Reports and Known Limitations

Findings below are based on observed behavior of the public demo APIs. They are not defects in this test framework.

---

## BUG-001 - Restful Booker accepts reversed booking dates

**Title:** Checkout earlier than checkin is accepted

**Environment:** `https://restful-booker.herokuapp.com`

**Preconditions:** Valid JSON booking payload

**Steps to Reproduce:**

1. POST `/booking` with `bookingdates.checkin = 2026-05-10` and `checkout = 2026-05-01`
2. Observe response status and persisted dates via GET

**Actual Result:** HTTP 200. Booking is created with reversed dates.

**Expected Result:** HTTP 400 (or equivalent) with a validation error.

**Severity:** Major

**Priority:** Medium

**Evidence:** Covered by negative test `checkout earlier than checkin is accepted by API (known limitation)`.

**Notes:** Treated as a known demo limitation. CI asserts the actual permissive behavior.

---

## BUG-002 - Restful Booker returns HTTP 200 for bad credentials

**Title:** Invalid authentication returns 200 with reason payload

**Environment:** `https://restful-booker.herokuapp.com`

**Preconditions:** None

**Steps to Reproduce:**

1. POST `/auth` with invalid username or password
2. Inspect status code and body

**Actual Result:** HTTP 200 and body similar to `{ "reason": "Bad credentials" }`.

**Expected Result:** HTTP 401 Unauthorized.

**Severity:** Major

**Priority:** Medium

**Evidence:** Negative auth tests assert status 200 + reason message.

**Notes:** Common Restful Booker teaching quirk. Token is absent when credentials are wrong.

---

## BUG-003 - Restful Booker DELETE succeeds with HTTP 201

**Title:** Successful delete returns 201 Created

**Environment:** `https://restful-booker.herokuapp.com`

**Preconditions:** Existing booking and valid token cookie

**Steps to Reproduce:**

1. Create a booking
2. DELETE `/booking/{id}` with `Cookie: token=...`

**Actual Result:** HTTP 201

**Expected Result:** HTTP 200 or 204 for a successful delete

**Severity:** Minor

**Priority:** Low

**Evidence:** Regression and e2e delete assertions expect 201.

**Notes:** Documented API behavior; automation follows the live contract.

---

## LIMIT-001 - Fake REST API write operations are non-persistent

**Title:** POST/PUT/DELETE simulate responses without durable state changes

**Environment:** `https://fakerestapi.azurewebsites.net`

**Preconditions:** None

**Steps to Reproduce:**

1. POST a new book with a unique id
2. GET the same id (if not part of seed data)
3. Observe that durable persistence is not guaranteed

**Actual Result:** Write endpoints return success payloads, but seeded data remains the source of truth for reads.

**Expected Result:** For a real service, writes would persist.

**Severity:** Major (product limitation for testing persistence)

**Priority:** High (for test design)

**Evidence:** E2E Fake API workflow documents simulator semantics.

**Notes:** Tests validate response contracts and echo behavior, not database persistence.
