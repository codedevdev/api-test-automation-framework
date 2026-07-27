# Security Policy

## Supported versions

This repository is a public portfolio project. Security fixes are applied on a best-effort basis on the `main` branch.

## Reporting a vulnerability

Do not open a public issue for sensitive security findings.

Email the maintainer through the contact details in the README Author section, or open a private security advisory if the repository has that feature enabled.

Include:

- affected files or workflows
- impact assessment
- reproduction steps
- suggested remediation if available

## Secrets

Never commit:

- real credentials
- private tokens
- `.env` files with non-demo secrets

Demo credentials for Restful Booker (`admin` / `password123`) are public by design.
