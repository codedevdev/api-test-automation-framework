# API Coverage

## Restful Booker

| Endpoint | Positive | Negative | Authentication | Schema | E2E |
| -------- | -------: | -------: | -------------: | -----: | --: |
| POST /auth | 1 | 3 | 4 | 1 | 1 |
| GET /booking | 5 | 0 | 0 | 1 | 1 |
| POST /booking | 6 | 4 | 0 | 1 | 1 |
| GET /booking/{id} | 2 | 1 | 0 | 1 | 1 |
| PUT /booking/{id} | 2 | 2 | 2 | 0 | 1 |
| PATCH /booking/{id} | 1 | 1 | 1 | 0 | 1 |
| DELETE /booking/{id} | 2 | 1 | 1 | 0 | 1 |

## Fake REST API

| Endpoint | Positive | Negative | Authentication | Schema | E2E |
| -------- | -------: | -------: | -------------: | -----: | --: |
| GET /api/v1/Books | 2 | 0 | n/a | 1 | 1 |
| GET /api/v1/Books/{id} | 1 | 2 | n/a | 1 | 1 |
| POST /api/v1/Books | 3 | 2 | n/a | 1 | 1 |
| PUT /api/v1/Books/{id} | 1 | 1 | n/a | 0 | 1 |
| DELETE /api/v1/Books/{id} | 1 | 1 | n/a | 0 | 1 |
| GET /api/v1/Authors | 1 | 0 | n/a | 1 | 0 |
| GET /api/v1/Authors/{id} | 1 | 1 | n/a | 1 | 0 |
| GET /api/v1/Authors/authors/books/{idBook} | 1 | 0 | n/a | 0 | 1 |
| POST /api/v1/Authors | 1 | 0 | n/a | 0 | 0 |

Counts are approximate and map to automated scenarios rather than raw assertion volume.

## Newman / Postman complementary smoke

| Collection | Requests | Focus |
| ---------- | -------: | ----- |
| Restful Booker | 5 | Health, auth, create, get, delete (chained) |
| Fake REST API | 2 | Books list, Authors list |
| **Total** | **7** | Portfolio CLI smoke via Newman |
