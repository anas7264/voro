# VORO Production Readiness Plan

> Status: audit in progress. This document records the release-readiness workstream and its acceptance criteria. It does not claim that the application has passed any gate.

## Mission

Prepare VORO as a maintainable, testable, secure, and demonstrable software product. The objective is both a reliable public release and an engineering portfolio artifact that can be reviewed by hiring teams.

## Baseline observations

The initial repository review on the `main` branch found:

- The repository is public and the application is located under `webs/`.
- The frontend uses React 18 and Vite 6. The package manifest currently exposes `dev`, `build`, and `preview` scripts; it does not yet expose standard `test`, `lint`, or `typecheck` scripts.
- The inspected root and application README paths were not found. Confirm the complete repository tree before concluding that no documentation exists elsewhere.
- The application has a broad route surface and lazy-loaded pages. Route count alone is not evidence of functional completeness.
- A custom security module captures many browser and JavaScript primitives at module load. Its threat model, compatibility impact, measurable value, and bypass resistance require independent review before it is treated as a security control.
- `index.html` contains a CSP meta element. Some directives, notably `frame-ancestors`, are not enforced when delivered through a meta element; production response headers must be configured at the hosting/CDN layer. The CSP also needs validation against actual runtime network and asset requirements.
- `vite.config.js` configures headers for Vite dev and preview servers. This does not establish that production hosting sends the same headers.
- PRs #899 and #901 both modify `webs/src/utils/formatters.js` and `webs/verify_formatters_hardening_v2.js`. They overlap and must be compared and reconciled before either is merged.
- This baseline was based on GitHub file inspection. No local install, build, browser test, penetration test, or production deployment has been executed as part of this review.

## Workstreams and acceptance criteria

### 0. Repository control and change hygiene

- Keep all readiness work on a dedicated branch and use focused pull requests.
- Reconcile overlapping open PRs before merging; inspect diffs and CI results rather than relying on titles.
- Establish branch protection / rulesets so required checks pass before merge.
- Require PR descriptions to include problem, root cause, scope, regression coverage, risk, and verification evidence.
- Keep generated artifacts, secrets, local environment files, and dependency directories out of Git.

**Exit criteria:** no unresolved duplicate changes in the release path; a documented contribution and review process; required CI checks enforced on the default branch.

### 1. Reproducible build and dependency hygiene

- Confirm the supported Node.js and package-manager versions and document them.
- Verify the lockfile is current and that a clean `npm ci` succeeds.
- Add explicit scripts for build, tests, lint, and any static checks that are actually configured.
- Audit direct and transitive dependencies for vulnerabilities, abandoned packages, and unnecessary dependencies.
- Add automated dependency update policy with controlled review.
- Confirm environment variables and runtime configuration are documented without committing secrets.

**Exit criteria:** a clean checkout installs deterministically; documented commands work; dependency and secret scans have no untriaged critical/high findings.

### 2. Test strategy and regression protection

- Inventory existing verification scripts and classify them as unit, integration, browser, or ad-hoc checks.
- Adopt a consistent test runner and test conventions; avoid adding a second framework without a clear reason.
- Prioritize pure business logic: nutrition calculations, training volume, body metrics, formatters, date handling, gamification, import/export, and storage.
- Add integration tests for storage initialization, persistence, backup validation, migration, and failure handling.
- Add Playwright smoke and critical-path tests for onboarding, navigation, logging a meal/workout, settings, and backup flows.
- Test invalid, missing, null, string-numeric, non-finite, and boundary inputs.
- Ensure tests fail when the underlying behavior is wrong; avoid tests that only assert implementation details or encode current bugs.

**Exit criteria:** CI runs deterministic tests; critical user journeys have browser coverage; regressions are tied to specific defects; flaky tests are tracked rather than silently retried.

### 3. Architecture and maintainability

- Produce a verified architecture map: entry points, routes, providers, storage, domain utilities, integrations, and data flow.
- Identify duplicate pages, overlapping utilities, oversized modules, circular dependencies, and dead code.
- Separate domain logic from React components and browser-specific concerns where doing so reduces coupling.
- Define stable contracts for storage and error handling. Distinguish “not found” from “storage unavailable” and “operation failed”.
- Review initialization and async lifecycle behavior, including React Strict Mode and component unmounting.
- Avoid broad rewrites. Refactor only when a concrete defect, measurable complexity reduction, or testability improvement justifies it.

**Exit criteria:** architecture documentation matches the code; high-risk coupling is reduced in focused changes; critical modules have explicit contracts and tests.

### 4. Security and privacy

- Write a realistic threat model covering local device access, XSS, malicious imports, dependency compromise, browser extensions, exposed API credentials, and sensitive health/body data.
- Trace every external API call and ensure privileged API keys never ship in browser bundles.
- Validate and constrain imported backup files (schema, size, version, type, parsing, and failure atomicity).
- Review storage confidentiality, integrity, retention, deletion, and backup encryption claims. Do not describe local encryption as protection against a compromised running browser.
- Review XSS sinks, URL handling, HTML rendering, unsafe deserialization, and untrusted prompt/data boundaries.
- Replace security theater with controls that have a documented threat, enforcement point, and test.
- Configure CSP and security headers at the actual production edge/server; validate with browser reports and deployment response inspection.
- Add secret scanning and dependency vulnerability scanning to CI.

**Exit criteria:** threat model and data-flow inventory reviewed; no known critical/high security issues remain untriaged; production headers are verified from deployed responses; security claims match actual guarantees.

### 5. UX, accessibility, and reliability

- Test every top-level route on desktop and mobile, including direct URL refresh and unknown routes.
- Standardize loading, empty, error, offline, and retry states.
- Verify forms, validation, keyboard navigation, focus management, semantic labels, contrast, and reduced-motion behavior.
- Check layout overflow, responsive navigation, chart readability, and touch target sizes.
- Add error reporting that avoids collecting sensitive health data or secrets.
- Verify storage quota errors, corrupted data, interrupted writes, and recovery behavior.

**Exit criteria:** no release-blocking navigation or data-loss bugs; key flows are keyboard usable; major mobile layouts and failure states are verified.

### 6. Performance and production deployment

- Measure rather than guess: bundle composition, route chunk sizes, Core Web Vitals, memory use, and expensive render paths.
- Remove premature micro-optimizations unless benchmarks demonstrate value; prefer clear code and targeted profiling.
- Validate lazy-loaded route chunks, caching, compression, asset paths, and SPA fallback behavior.
- Confirm production environment configuration, HTTPS, headers, source-map policy, and deployment rollback.
- Run a production build and smoke test the built artifact, not only the development server.

**Exit criteria:** production build is reproducible; critical routes load correctly from the deployed host; performance regressions have defined budgets; rollback is documented.

### 7. Portfolio and release presentation

- Create an English root README with product overview, screenshots, architecture, stack, local setup, scripts, testing, security model, limitations, and roadmap.
- Add architecture and threat-model documents, contribution guidelines, and a concise changelog.
- Provide screenshots or a short demo using realistic non-sensitive sample data.
- Publish a tagged release with release notes and known limitations.
- Write truthful resume bullets backed by measurable evidence (tests, performance, reliability, architecture); do not claim scale, security certification, production users, or AI capabilities that have not been verified.

**Exit criteria:** a reviewer can understand the product in two minutes, run it from a clean checkout, inspect engineering decisions, and reproduce the published checks.

## Release gates

A release candidate is not ready until all applicable gates are green:

1. Clean install and production build.
2. Unit/integration/browser test suite passes.
3. Lint and static checks pass with no unexplained suppressions.
4. No unresolved critical/high dependency or security findings.
5. Production headers and CSP verified from the deployed origin.
6. Core flows pass on desktop and mobile.
7. No known release-blocking data-loss, navigation, or privacy defects.
8. README, setup, architecture, threat model, release notes, and limitations are accurate.
9. Rollback and issue-reporting paths are documented.

## Execution order

1. Complete repository inventory and resolve overlapping PRs.
2. Establish reproducible install/build and CI baseline.
3. Build the regression suite around critical domain and storage behavior.
4. Fix verified correctness and data-integrity defects.
5. Complete security/privacy review and enforce production controls.
6. Complete UX/accessibility and performance passes.
7. Publish documentation, demo assets, and a tagged release.

Each implementation batch should be a small pull request with evidence. No release gate is considered passed solely because a change was committed.
