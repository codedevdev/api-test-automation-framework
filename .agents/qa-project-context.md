# QA Project Context

Single source of truth for QA skills and agents working in this repository.

## Product

- **Name:** API Test Automation Framework (portfolio project)
- **Type:** Public demo / portfolio repository for REST API test automation
- **Purpose:** Demonstrate production-like API automation against two public demo APIs with layered architecture, CI gates, and reporting.

**Key flows (critical paths):**

1. Restful Booker: authenticate with username/password, receive token cookie
2. Restful Booker: create booking with JSON payload, receive `bookingid`
3. Restful Booker: retrieve booking by ID and verify fields
4. Restful Booker: update booking with auth token
5. Restful Booker: delete booking with auth token (observed status `201`)
6. Fake REST API: list books and authors (read smoke)
7. Fake REST API: create book POST returns simulated echo (non-persistent)
8. Contract: JSON Schema validation on Booker and Fake API responses
9. Negative: invalid auth, bad payloads, unsupported methods
10. Newman smoke: chained Booker CRUD + Fake list endpoints via Postman CLI

**URLs:**

| Environment | Restful Booker | Fake REST API |
| ----------- | -------------- | ------------- |
| Production (demo) | https://restful-booker.herokuapp.com | https://fakerestapi.azurewebsites.net |
| Local / CI | Same remotes via `.env` | Same remotes via `.env` |

## Tech Stack

| Layer | Technology | Version (approx.) |
| ----- | ---------- | ----------------- |
| Language | TypeScript | 5.x (strict) |
| Runtime | Node.js | 20+ |
| API test runner | Playwright `@playwright/test` | APIRequestContext |
| Schema validation | AJV + ajv-formats | — |
| Test data | @faker-js/faker | — |
| Config | dotenv | — |
| CLI smoke | Newman + Postman Collection v2.1 | — |
| Reporting | allure-playwright, Playwright HTML, Newman HTML Extra | — |
| Quality | ESLint, Prettier, `tsc --noEmit` | — |
| Container | Docker / Docker Compose (test runner only) | — |
| CI | GitHub Actions | 4 workflows |

**Monorepo:** No — single package at repository root.

## Test Stack

### E2E / API (Playwright)

- **Framework:** Playwright Test with APIRequestContext
- **Config:** `playwright.config.ts`
- **Test directory:** `tests/restful-booker/`, `tests/fake-rest-api/`
- **Projects:** `restful-booker`, `fake-rest-api` (separate base URLs)
- **Suites:** smoke, contract, regression, negative, e2e (tagged `@smoke`, `@contract`, etc.)
- **Count:** 65 automated Playwright tests

### Newman / Postman

- **Framework:** Newman CLI
- **Collections:** `postman/restful-booker.postman_collection.json`, `postman/fake-rest-api.postman_collection.json`
- **Environments:** `postman/*.postman_environment.json`
- **Count:** 7 requests (5 Booker chain + 2 Fake list)

### Unit / Component

- **Framework:** None — API integration focus; business logic tested via API layers and validators in integration suites.

### Visual / Performance

- None — out of scope for this portfolio repo.

## CI/CD

| Workflow | Trigger | Blocks merge / deploy | Artifacts |
| -------- | ------- | --------------------- | --------- |
| `pull-request.yml` job `quality-and-smoke` | PR + push to `main` | Yes (quality + Playwright smoke/contract) | Allure results, Playwright HTML |
| `pull-request.yml` job `newman-smoke` | PR + push to `main` | Yes (parallel) | Newman HTML Extra |
| `regression.yml` | Manual | No (portfolio monitoring) | Allure, Playwright report |
| `scheduled-tests.yml` | Cron Mon/Thu 02:00 UTC | No | Allure, Playwright report |
| `allure-pages.yml` | After scheduled/regression | No | GitHub Pages Allure site |

**Parallelism:** Playwright workers default; Newman single-threaded per collection.

**PR requirements:** `npm run quality:check` + smoke/contract + Newman smoke in CI.

## Environments

| Name | URLs | Parity notes |
| ---- | ---- | ------------ |
| Remote Booker | `BOOKER_BASE_URL` | Public Heroku demo; shared data; periodic reset |
| Remote Fake API | `FAKE_API_BASE_URL` | Azure simulator; writes non-persistent |
| CI | Same as remote | Health preflight before suites; no local SUT |

**Third-party integrations:** None beyond the two public HTTP APIs.

**Mocks:** No service virtualization — tests hit real public endpoints.

## Quality Goals

| Metric | Target |
| ------ | ------ |
| Playwright automated tests | 65 total across both APIs |
| Newman smoke requests | 7 |
| PR CI duration | Under 15 minutes (both jobs) |
| Flake rate | Under 2% over rolling window (public API instability) |
| PR gate suites | Playwright smoke + contract + Newman smoke |
| Full regression | Manual or scheduled; not required on every PR |
| Secret leakage | Zero — sanitizer on logs; no `.env` in repo |

**Coverage:** Endpoint-level matrix in `docs/api-coverage.md`; contract schemas in `src/schemas/`.

## Risk Areas

| Area | Risk Level | Business Impact | Notes |
| ---- | ---------- | --------------- | ----- |
| Public demo API outages (Heroku/Azure) | Critical | CI blocked, false reds | Health preflight; document outages; optional URL override in regression |
| Restful Booker shared data / reset | Critical | Flaky or conflicting tests | Unique Faker data; create-own-data; delete cleanup |
| Fake REST API non-persistent writes | Critical | False confidence in CRUD | Assert echo only; documented in bug-reports |
| Known API quirks (DELETE 201, bad auth 200) | Important | Wrong assertions if ignored | Assert observed behavior; `docs/bug-reports.md` |
| Parallel test interference | Important | Occasional filter noise | Unique markers; no shared booking IDs |
| Secret leakage in logs/reports | Monitor | Security / compliance | Sanitizer; never attach tokens to Allure |

## Team

- **QA engineers:** Solo maintainer (portfolio project)
- **Dev:QA ratio:** Solo — developer owns all automation, strategy, and docs
- **Methodology:** Portfolio / demonstration repo; CI models shift-left gates
- **QA engagement:** Tests and framework co-developed; no separate manual regression suite

## Conventions

### Test file naming

- Pattern: `tests/<api>/<suite>/<suite>.spec.ts` (e.g. `tests/restful-booker/smoke/smoke.spec.ts`)
- Tests live in `tests/`; framework code in `src/`

### Structure

- No raw HTTP in test bodies — use `src/apis/**` and fixtures
- Tags: `@smoke`, `@contract`, `@regression`, `@negative`, `@e2e` via Playwright grep
- Describe blocks: `Restful Booker smoke @smoke`, etc.

### Branching and PRs

- Default branch: `main`
- PR template: `.github/pull_request_template.md`
- Required local check: `npm run quality:check` before PR

### Selectors

- API automation only — no UI selectors
- REST paths and headers defined in API classes

### Test data

- Factories in `src/factories/` with Faker + override objects
- Booker: unique names per run; cleanup via delete with auth token
- Fake API: simulated writes; no persistence assumptions
- Postman: environment variables `token`, `bookingId` chained in collection scripts

### Assertions

- Prefer specific assertions (status, body fields, schema)
- Document demo quirks rather than fighting them
- Response time smoke checks use `durationMs` from `ApiClient`
