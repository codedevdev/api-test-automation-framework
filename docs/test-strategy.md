# Test Strategy

## Project purpose

This repository is a production-like REST API test automation framework used as a portfolio project. It validates two public APIs through a shared TypeScript + Playwright stack:

- Restful Booker (`https://restful-booker.herokuapp.com`)
- Fake REST API (`https://fakerestapi.azurewebsites.net`)

## Scope

In scope:

- Functional API testing (smoke, regression, negative)
- Contract validation with JSON Schema (AJV)
- End-to-end API workflows
- Complementary Postman/Newman smoke collections (portfolio layer)
- CI execution with GitHub Actions
- Reporting with Allure, Playwright HTML, and Newman HTML Extra
- Logging with secret sanitization

Out of scope:

- UI / browser end-to-end testing
- Performance / load testing at scale
- Security penetration testing
- Hosting or modifying the upstream demo applications
- BDD / Cucumber / Gherkin
- Full Postman parity with Playwright regression/negative suites

## Test levels

| Level | Description |
| ----- | ----------- |
| Smoke | Fast readiness checks for critical endpoints |
| Newman smoke | Postman collections run via Newman (Booker CRUD chain + Fake list smoke) |
| Contract | Schema and header validation |
| Regression | Broader functional coverage for CRUD and filters |
| Negative | Auth failures, invalid payloads, unsupported methods |
| E2E API | Multi-step workflows across related operations |

Playwright is the primary automation stack. Newman is a complementary smoke gate that demonstrates Postman collection design and CLI CI execution.

## Test types

- Positive functional tests
- Negative / boundary tests
- Schema contract tests
- Response-time checks in smoke only
- Workflow tests

## Environments

| Name | Base URLs | Notes |
| ---- | --------- | ----- |
| Remote Booker | `BOOKER_BASE_URL` | Public Heroku demo, shared data, periodic reset |
| Remote Fake API | `FAKE_API_BASE_URL` | Azure simulator, non-persistent writes |
| CI | Same remotes | Health preflight before suites |

## Test data strategy

- Factories generate unique payloads with Faker.
- Overrides are used for predictable assertions.
- Restful Booker tests create and delete their own bookings when possible.
- Fake REST API write operations are treated as simulated responses; tests do not assume persistence.

## Entry criteria

- Dependencies installed (`npm ci`)
- Environment variables present
- Both APIs pass health preflight
- Quality gates pass when required by the workflow

## Exit criteria

- Targeted suite(s) completed
- Failures triaged as product defect, flaky remote, or automation bug
- Known limitations documented
- Artifacts uploaded in CI

## Defect management

1. Capture status, body (sanitized), and headers.
2. Compare against documented API behavior.
3. File or update `docs/bug-reports.md` for reproducible quirks.
4. Keep CI green by asserting actual behavior for known demo limitations.

## Risks

See [risk-analysis.md](./risk-analysis.md).

## CI execution strategy

- Pull requests: typecheck, lint, format, Playwright smoke + contract (job 1); Newman smoke in parallel (job 2)
- Manual regression workflow: full Playwright suite
- Scheduled runs (Mon/Thu 02:00 UTC): full Playwright suite
- Allure Pages publish runs separately and does not block PR checks
