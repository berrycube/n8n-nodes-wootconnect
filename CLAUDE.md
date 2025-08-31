# CLAUDE.md — Suite overview (open this at repo root)

This workspace contains a **multi-repo n8n suite** organized for *public plugins* + *private integration* + *private commercial* development, ready for Claude Code to operate across all parts.

## Layout
```
n8n-suite/
  public/                        # 3 public plugin repos (MIT) — each is a GitHub Template + Release workflow
    n8n-nodes-oauth2-enhanced/
    n8n-nodes-evoguard/
    n8n-nodes-wootconnect/
  private/
    n8n-suite-integration/       # private integration/validation repo
      .gitmodules                # submodules -> github.com/berrycube/... (branch=main)
      compose/                   # docker compose for mocks + n8n
      workflows/                 # compose-friendly flows (Webhook → node)
      scripts/e2e-n8n/import-and-run.js  # Public API import + activate + trigger via webhook
      .github/workflows/{ci,nightly}.yml
    n8n-pro-extensions/          # private commercial monorepo (pnpm workspaces)
      packages/*                 # placeholder packages
      .github/workflows/release-private.yml  # publish to GH Packages + SBOM + SLSA
```

## What Claude can do here
- Work inside each public plugin repo (add features, tests, docs).
- Adjust the **integration E2E** (import/activate/trigger via webhook) or extend with n8n Public API.
- Develop **pro** packages in the private monorepo and ship to GitHub Packages.

## Notes
- Public API execution of arbitrary workflows isn't officially exposed; the E2E runner triggers flows via **Webhook production URL** after activating them. (See n8n API auth docs and Webhook docs.)
- Submodules track `main` by default; Nightly workflow refreshes them and runs the E2E.
