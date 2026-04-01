# Security Policy

## Supported Usage

This repository is intended for local development, portfolio review, and controlled deployment workflows.

## Reporting a Vulnerability

If you discover a security issue, do not publish it in a public issue.

Instead:

1. Document the issue clearly
2. Include reproduction steps, impact, and the affected files
3. Share it privately with the repository owner

## Security Checklist Before Publishing

- Verify that `.env` files are not tracked
- Remove local database dumps, tokens, and API keys
- Keep any seeded admin credentials in local `.env` files only
- Confirm CORS, auth, and file upload behavior are appropriate for the target environment
- Do not reuse development secrets in production
