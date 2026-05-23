# Palette's Journal - UX & Accessibility Learnings

## 2025-05-23 - Modal Accessibility and Scroll Management
**Learning:** For a truly accessible modal, just adding ARIA roles and labels is not enough; managing the "Escape" key for dismissal and preventing background scrolling is essential for a polished user experience.
**Action:** When implementing overlays (modals, drawers), always include keyboard listeners for "Escape" and ensure body scroll is locked to prevent layout shifts or confusing navigation.
