# Test Cases

High-level coverage map. Automation status reflects the suites in this repository.

| ID | Endpoint | Scenario | Preconditions | Expected Result | Priority | Automation Status |
| -- | -------- | -------- | ------------- | --------------- | -------- | ----------------- |
| RB-S01 | GET /booking | Health / list IDs | API up | 200, JSON array | High | Automated |
| RB-S02 | POST /auth | Valid credentials | Demo user | 200 + token | High | Automated |
| RB-S03 | POST /booking | Create booking | Valid payload | 200 + bookingid | High | Automated |
| RB-S04 | GET /booking/{id} | Get by id | Booking exists | 200 + booking body | High | Automated |
| RB-S05 | GET /booking | Response time | API up | Duration within smoke threshold | Medium | Automated |
| RB-R01 | PUT /booking/{id} | Full update | Token + booking | 200 updated body | High | Automated |
| RB-R02 | PATCH /booking/{id} | Partial update | Token + booking | Changed field updated | High | Automated |
| RB-R03 | DELETE /booking/{id} | Delete booking | Token + booking | 201 then 404 on GET | High | Automated |
| RB-R04 | GET /booking | Filter by firstname | Created booking | Matching id returned | Medium | Automated |
| RB-R05 | GET /booking | Filter by lastname | Created booking | Matching id returned | Medium | Automated |
| RB-R06 | GET /booking | Filter by checkin/checkout | Created booking | 200 array | Medium | Automated |
| RB-R07 | POST /booking | Price / needs variants | Valid payload | 200 persisted values | Medium | Automated |
| RB-N01 | POST /auth | Invalid credentials | None | 200 + Bad credentials | High | Automated |
| RB-N02 | GET /booking/{id} | Missing id | None | 404 | High | Automated |
| RB-N03 | PUT/PATCH/DELETE | Missing/invalid token | Booking exists | 403 | High | Automated |
| RB-N04 | POST /booking | Malformed / missing fields | None | 400 or 500 | Medium | Automated |
| RB-N05 | POST /booking | Reversed dates | None | Accepted (known limitation) | Low | Automated |
| RB-C01 | multiple | Schema contracts | API up | Schema valid | High | Automated |
| RB-E01 | workflow | Booking lifecycle | Auth | Create-read-update-patch-delete | High | Automated |
| RB-E02 | workflow | Multi booking filter | Auth | Filter hits + cleanup | High | Automated |
| FA-S01 | GET /api/v1/Books | List books | API up | 200 non-empty | High | Automated |
| FA-S02 | GET /api/v1/Books/{id} | Get book | Seeded id | 200 book | High | Automated |
| FA-S03 | POST /api/v1/Books | Simulated create | Valid payload | 200 echo | High | Automated |
| FA-R01 | PUT/DELETE Books | Update/delete echo | Valid id | 200 | Medium | Automated |
| FA-R02 | GET Authors | List / by book | API up | 200 arrays | Medium | Automated |
| FA-N01 | Books/Authors | Invalid id formats | None | 400/404 | Medium | Automated |
| FA-C01 | Books/Authors | Schema contracts | API up | Schema valid | High | Automated |
| FA-E01 | workflow | Simulated CRUD + related reads | API up | Status + body checks | High | Automated |
