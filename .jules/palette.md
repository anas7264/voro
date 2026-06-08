## 2026-06-06 - [AI Coach UX Enhancements]
**Learning:** In chat-based interfaces, the lack of auto-scrolling is a significant UX friction point as users lose context of the latest responses. Additionally, icon-only buttons (like a "send" arrow) are inaccessible without explicit ARIA labels.
**Action:** Always implement auto-scroll logic using `useRef` and `useEffect` in chat UIs, and ensure all icon-only interactive elements have descriptive `aria-label` attributes.

## 2026-06-07 - [Tracker Accessibility & Feedback]
**Learning:** Custom-styled range inputs (`type="range"`) are frequently overlooked in standard accessibility passes. They require explicit `htmlFor`/`id` linkage using `useId` and customized `focus-visible` ring offsets (e.g., `ring-offset-4`) to remain visible against dark, complex backgrounds.
**Action:** When implementing sliders or non-standard form controls, prioritize `useId` for label association and ensure focus rings are high-contrast with sufficient offsets.
