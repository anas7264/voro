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
