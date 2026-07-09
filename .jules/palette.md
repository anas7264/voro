## 2025-05-22 - Skip to Content for Sidebar Layouts
**Learning:** In applications with extensive sidebar navigation (like Voro's Matrix), keyboard and screen reader users must tab through every navigation item before reaching the main content. A 'Skip to Content' link is a critical accessibility requirement for such layouts.
**Action:** Always implement a visually hidden (sr-only) skip link at the top of the main layout that targets the unique ID of the main content container. Ensure the target has `tabIndex="-1"` to properly handle focus move in all browsers.

## 2025-05-23 - Robust ARIA Tab Pattern Implementation
**Learning:** Generic tab implementations often lack proper ARIA relationships (`aria-controls`, `aria-labelledby`) and localized focus management. When multiple tab components exist on a page, using global selectors for focus management causes navigation conflicts.
**Action:** Utilize `useId` to create unique, stable relationships between tab triggers and panels. Scope keyboard navigation logic (Arrow keys) to the specific component instance using refs (e.g., `tabListRef`) to ensure reliable focus shifts without side effects.

## 2025-06-29 - Accessible Gauge and Progress Pattern
**Learning:** Custom SVG-based progress indicators (like the Metabolic Ring) are often invisible to screen readers without explicit ARIA roles. While visually impressive, they fail to communicate state changes to assistive technology.
**Action:** Always apply `role="progressbar"` and include `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` to the main container of custom gauge components. Ensure decorative SVG elements and technical complications are marked with `aria-hidden="true"`.

## 2025-06-29 - Integrated Shortcut Hints in Telemetry
**Learning:** In a system with a 'telemetry' aesthetic, keyboard shortcuts can be elegantly integrated into the technical metadata overlays. This provides a clear visual hint for power users without cluttering the primary UI.
**Action:** Utilize the `shortcut` prop in `Button` components to inject shortcut keys (e.g., `[Q]`) into the technical telemetry div. Ensure the telemetry overlay is `aria-hidden="true"` to prevent screen reader noise from coordinate data.

## 2025-06-30 - Standardized Accessible Accordion Pattern
**Learning:** Complex interactive components like accordions require a combination of stable ID associations (`useId`), semantic roles (`region`), and manual keyboard focus management (Arrow keys, Home/End) to be truly accessible. Relying on native focus flow is often insufficient for high-fidelity custom UI components.
**Action:** Always wrap the accordion items in a container with a keydown handler that manages focus between header buttons. Use `aria-controls` and `aria-labelledby` with stable `useId` hooks to ensure screen readers can navigate and announce relationships correctly.

## 2025-05-15 - Forge Standard Character Telemetry
**Learning:** For inputs with character limits, providing real-time visual and accessible feedback is crucial for UX. Passive limits (like maxLength without counters) can be frustrating for users who reach the limit without warning.
**Action:** Always implement the Forge-standard character telemetry (`// current/max`) in `Input` and `Textarea` components when `maxLength` is provided. Use `aria-live="polite"` and `aria-atomic="true"` to ensure screen readers announce updates, and apply visual red indicators when the limit is reached.
