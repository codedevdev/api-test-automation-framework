# Branch ruleset: Protect main

Reference configuration for the `main` branch ruleset. Apply in GitHub:

**Settings → Rules → Rulesets → New ruleset → Import a ruleset** (use [protect-main.json](./protect-main.json)).

`bypass_actors` is empty on purpose: this is a personal repository, so `OrganizationAdmin` is invalid and causes `Error importing ruleset: The ruleset you are importing contains an invalid actor`. If you later move the repo into an organization, you can add org-admin bypass in the UI.

## Required status checks

These names must match the job `name` fields in CI workflows:

| Check context | Workflow | Job |
| --- | --- | --- |
| `Quality gates and smoke/contract` | [pull-request.yml](../workflows/pull-request.yml) | `quality-and-smoke` |
| `Newman Postman smoke` | [pull-request.yml](../workflows/pull-request.yml) | `newman-smoke` |
| `PR Title` | [pr-title.yml](../workflows/pr-title.yml) | `semantic-pr-title` |

If GitHub shows a different format (for example `Pull Request Checks / Quality gates and smoke/contract`), use the exact strings from the dropdown after the first PR with these workflows runs.

Verified against existing PR checks on `codedevdev/api-test-automation-framework` (job `name` fields, not `workflow / job`):

- `Quality gates and smoke/contract`
- `Newman Postman smoke`

## Apply / update checklist

1. Set **Required approvals** to `0` (solo maintainer).
2. Disable **Require approval of the most recent push**.
3. Enable **Require conversation resolution before merging**.
4. Add the three status checks above under **Require status checks to pass**.
5. Enable **Require branches to be up to date before merging** (`update` rule).
6. Update **Commit message pattern** to the regex in [protect-main.json](./protect-main.json).

## Verification after merge

Open a test PR and confirm:

- Bad PR title (e.g. `update stuff`) → `PR Title` check fails, merge blocked.
- Failing tests → merge blocked once status checks are required.
- Good PR title (`chore: test branch protection`) + green CI → merge allowed.
- Squash merge commit on `main` follows conventional commits format.
