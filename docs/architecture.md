# Architecture and Design Decisions

This document explains why the framework is structured the way it is. It complements the high-level diagram in the README and the operational details in [test-strategy.md](./test-strategy.md).

## Goals

- Look and behave like a small production API automation stack, not a tutorial script collection.
- Support two real public APIs with one shared core and per-service layers.
- Keep tests readable: no raw HTTP calls scattered in spec files.
- Run reliably in CI against remote demo hosts with known limitations.

## Layered structure

```text
tests/          → assertions, tags, scenarios
fixtures/       → Playwright fixtures (API instances, cleanup hooks)
apis/           → service-specific methods (BookingApi, BooksApi, …)
clients/        → shared ApiClient (GET/POST, logging, timing)
config/         → environment and timeouts
factories/      → Faker-based test data with overrides
schemas/        → JSON Schema contracts for AJV
utils/          → validators, logger, secret sanitizer
```

**Why not raw `request` in tests?**

- HTTP details (headers, paths, cookie auth) live in one place per endpoint.
- When an endpoint changes, you update the API class—not dozens of tests.
- The client adds correlation IDs, duration tracking, and sanitized logging consistently.

## Why Playwright `APIRequestContext`

Playwright is often associated with browser automation, but its API testing mode fits this project well:

| Benefit | How we use it |
| ------- | ------------- |
| Single test runner | Same config, projects, reporters, and CI commands for all suites |
| Fixtures | `bookingApi`, `authApi`, cleanup hooks without custom harness code |
| Projects | Independent `baseURL` per API (`restful-booker`, `fake-rest-api`) |
| Reporting | Allure + HTML reporters plug into `playwright.config.ts` |
| Traces / artifacts | Available when debugging flaky remote failures |

Alternatives such as Axios + Jest or Supertest + Mocha work, but would require assembling fixtures, parallel projects, and reporters ourselves.

## Why Newman is complementary, not a replacement

| Layer | Role |
| ----- | ---- |
| Playwright | Primary stack: 65 tests across smoke, contract, regression, negative, e2e |
| Newman | Portfolio smoke: 7 chained Postman requests, CLI-friendly, familiar to teams using Postman |

Newman demonstrates Postman collection design and Newman-in-CI skills without duplicating the full negative and contract matrix. Collections live in `postman/` as versioned JSON.

## Remote APIs vs local SUT

We target hosted demo APIs instead of building Restful Booker from source:

- **Pros:** No SUT maintenance, realistic network latency, portfolio repo stays focused on automation craft.
- **Cons:** Shared data on Booker, periodic resets, Azure/Heroku outages block CI.

Mitigations: health preflight (`npm run healthcheck`), documented quirks in [bug-reports.md](./bug-reports.md), optional URL overrides in the regression workflow, unique Faker data, and create-own-data + delete cleanup on Booker.

## Parallel execution and cleanup

- Playwright runs files in parallel by default; tests must not depend on execution order.
- Booker: each test creates bookings with unique names; deletes use auth token when possible.
- Fake REST API: write tests assert response echo only—no assumption of persistence.
- Filters and list endpoints may return shared demo data; assertions use markers or created IDs.

## Contract validation

JSON Schemas in `src/schemas/` are validated with AJV in contract suites. Schemas are maintained manually today; Fake REST API OpenAPI sync is on the [roadmap](../README.md#roadmap).

We assert **observed behavior** for known demo quirks (for example Booker DELETE returns `201`, bad auth returns `200` with a reason body). Strict “ideal REST” assertions would produce false reds on purpose.

## Security and logging

- Tokens and passwords are redacted in logs via `secret-sanitizer`.
- Demo Booker credentials (`admin` / `password123`) are public by design.
- Never commit `.env` or attach secrets to Allure attachments.

## CI architecture

Pull request pipeline (two parallel jobs):

1. **quality-and-smoke** — typecheck, lint, format, health preflight, Playwright smoke + contract.
2. **newman-smoke** — Postman collections via Newman CLI.

Full suite runs on schedule and manual regression; Allure is published to GitHub Pages from those workflows.

## Related documentation

- [Test strategy](./test-strategy.md)
- [Risk analysis](./risk-analysis.md)
- [Bug reports / limitations](./bug-reports.md)
- [API coverage](./api-coverage.md)
