## 2026-06-06 - [AI Coach UX Enhancements]
**Learning:** In chat-based interfaces, the lack of auto-scrolling is a significant UX friction point as users lose context of the latest responses. Additionally, icon-only buttons (like a "send" arrow) are inaccessible without explicit ARIA labels.
**Action:** Always implement auto-scroll logic using `useRef` and `useEffect` in chat UIs, and ensure all icon-only interactive elements have descriptive `aria-label` attributes.

## 2026-06-07 - [Tracker Accessibility & Feedback]
**Learning:** Custom-styled range inputs (`type="range"`) are frequently overlooked in standard accessibility passes. They require explicit `htmlFor`/`id` linkage using `useId` and customized `focus-visible` ring offsets (e.g., `ring-offset-4`) to remain visible against dark, complex backgrounds.
**Action:** When implementing sliders or non-standard form controls, prioritize `useId` for label association and ensure focus rings are high-contrast with sufficient offsets.

## 2026-06-08 - [Boutique Styling vs. Component Props]
**Learning:** In premium editorial layouts, standard component props (like `label` in an `Input` component) may not satisfy specific typographic or spatial requirements of the design system. Reverting to manual `<label>` elements linked via `useId` and `htmlFor` allows for more granular styling control while maintaining robust accessibility.
**Action:** When working with high-end boutique layouts, prefer explicit label-input linkage with `useId` to ensure both accessibility compliance and precise aesthetic execution.

## 2026-06-09 - [Icon-only Button Accessibility]
**Learning:** Icon-only buttons in dark-themed boutique layouts are frequently inaccessible to screen readers and invisible to keyboard users. To maintain visual polish without sacrificing accessibility, they require explicit `aria-label` attributes and high-contrast focus rings with `focus-visible:ring-offset-2`. The offset color must precisely match the container's background to preserve the "floating" gap aesthetic.
**Action:** Always audit icon-only interactive elements for `aria-label` and implement surgical `focus-visible` rings with container-matched offsets and `active:scale-90` tactile feedback.

## 2026-06-10 - [Luxury Editorial Dashboards]
**Learning:** Luxury 'Boutique Gallery' interfaces require more than just clean layout; they need atmospheric depth and sophisticated typographic hierarchy. Staggered spatial architecture (e.g., `mb-24`) and the use of 'Chronographic Complications' (monospace status nodes) create a premium expert-system feel. Subtle SVG noise filters (`bg-boutique-grain`) provide a physical texture that makes digital surfaces feel more expensive.
**Action:** Implement atmospheric textures and detailed monospace metadata nodes in high-priority dashboards to elevate the perceived value and sophistication of the interface.

## 2026-06-11 - [Tactile Component Interactivity]
**Learning:** Adding subtle `active:scale-95` (for larger elements like Tabs/Toggles) or `active:scale-90` (for smaller elements like Checkboxes) transitions creates a "physical" tactile response that enhances the premium feel of the UI. This kinetic feedback, combined with surgical `focus-visible:ring-offset-2` adjustments, bridges the gap between high-end aesthetics and intuitive usability.
**Action:** Incorporate kinetic scaling transitions on all interactive primitive components (Buttons, Toggles, Tabs, Checkboxes) to provide immediate, perceptible feedback for user actions.

## 2026-06-12 - [Express Log Accessibility & Flow]
**Learning:** For high-velocity "Quick Log" interactions, minimizing the distance between the trigger and data entry is critical. Implementing `autoFocus` on the primary modal input, associating labels with `useId`, and providing clear `disabled` validation states on action buttons transforms a simple form into a fluid, expert-grade interface. Semantically marking decorative icons with `aria-hidden` and selection states with `aria-pressed` ensures this speed is accessible to all users.
**Action:** Implement `autoFocus` and robust ARIA state management (hidden/pressed) in all quick-entry modalities to prioritize user momentum and inclusive efficiency.
