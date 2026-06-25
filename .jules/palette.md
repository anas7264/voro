## 2025-05-22 - Skip to Content for Sidebar Layouts
**Learning:** In applications with extensive sidebar navigation (like Voro's Matrix), keyboard and screen reader users must tab through every navigation item before reaching the main content. A 'Skip to Content' link is a critical accessibility requirement for such layouts.
**Action:** Always implement a visually hidden (sr-only) skip link at the top of the main layout that targets the unique ID of the main content container. Ensure the target has `tabIndex="-1"` to properly handle focus move in all browsers.

## 2025-05-23 - Robust ARIA Tab Pattern Implementation
**Learning:** Generic tab implementations often lack proper ARIA relationships (`aria-controls`, `aria-labelledby`) and localized focus management. When multiple tab components exist on a page, using global selectors for focus management causes navigation conflicts.
**Action:** Utilize `useId` to create unique, stable relationships between tab triggers and panels. Scope keyboard navigation logic (Arrow keys) to the specific component instance using refs (e.g., `tabListRef`) to ensure reliable focus shifts without side effects.
