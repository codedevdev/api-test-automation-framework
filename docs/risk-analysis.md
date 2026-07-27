# Risk Analysis

| Risk | Impact | Likelihood | Mitigation |
| ---- | ------ | ---------- | ---------- |
| Unstable public demo environments | Failed CI / flaky runs | High | Health preflight, CI retries, scheduled monitoring, document outages |
| Shared Restful Booker data and periodic reset | Cross-talk between users | High | Unique Faker data, create-own-data pattern, cleanup deletes |
| Fake REST API non-persistent writes | False confidence about CRUD | High | Assert response echo only; document simulator behavior |
| No database access | Limited verification of persistence internals | Medium | Prefer GET-after-write checks where API supports them |
| Flaky network / timeouts | Intermittent failures | Medium | Configurable timeout, retries in CI only, response-time smoke threshold |
| Parallel execution conflicts | Occasional filter noise | Medium | Unique names/markers, no shared booking IDs across files |
| Known application defects / loose validation | Misleading "green" or brittle assertions | High | Assert observed behavior, keep bug reports, avoid fake strictness |
| Secret leakage in logs/reports | Security / compliance issue | Low | Sanitizer for tokens/passwords; never attach secrets to Allure |
| Dependency on third-party hosts | Suite blocked if Azure/Heroku down | High | Fail fast with clear healthcheck errors; optional URL overrides in regression workflow |
