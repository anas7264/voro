## 2025-05-15 - [Unified Design System Animation Naming]
**Learning:** Inconsistent casing in Tailwind animation classes (camelCase vs kebab-case) can silently break UI transitions. The `NotificationContainer` was using `animate-slideUp` while the config only defined `animate-slide-up`.
**Action:** Always verify custom animation keys against `tailwind.config.js` before implementation.

## 2025-05-15 - [Security Utility Dependency Blocker]
**Learning:** Core frontend components may have hard dependencies on complex security/RASP utilities (`security.js`) for sanitization and redaction. If these utilities are corrupted or have missing exports, the entire build pipeline fails even for minor UI changes.
**Action:** When a build fails due to missing security exports, prioritize restoring the Zero Trust infrastructure to unblock verification.
