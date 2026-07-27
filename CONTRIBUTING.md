# Contributing

Thanks for your interest in improving this portfolio framework.

## Development setup

1. Use Node.js 20+.
2. Copy `.env.example` to `.env`.
3. Run `npm ci`.
4. Run `npm run healthcheck` to verify both public APIs are reachable.
5. Run `npm run quality:check` before opening a PR.

## Guidelines

- Keep HTTP calls inside the API layer (`src/apis/**`), not in test bodies.
- Prefer composition over inheritance.
- Do not commit secrets, tokens, or generated reports.
- Assert observed API behavior. If a public demo API is quirky, document it in `docs/bug-reports.md`.
- Keep tests independent and safe for parallel runs.
- Write code and docs in English.

## Pull requests

Use the PR template. Include the commands you ran and a short note about risk.
