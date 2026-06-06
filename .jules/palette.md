## 2026-06-06 - [AI Coach UX Enhancements]
**Learning:** In chat-based interfaces, the lack of auto-scrolling is a significant UX friction point as users lose context of the latest responses. Additionally, icon-only buttons (like a "send" arrow) are inaccessible without explicit ARIA labels.
**Action:** Always implement auto-scroll logic using `useRef` and `useEffect` in chat UIs, and ensure all icon-only interactive elements have descriptive `aria-label` attributes.
