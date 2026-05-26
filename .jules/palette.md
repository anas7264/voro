# Palette's Journal - UX & Accessibility Learnings

## 2025-05-23 - Modal Accessibility and Scroll Management
**Learning:** For a truly accessible modal, just adding ARIA roles and labels is not enough; managing the "Escape" key for dismissal and preventing background scrolling is essential for a polished user experience.
**Action:** When implementing overlays (modals, drawers), always include keyboard listeners for "Escape" and ensure body scroll is locked to prevent layout shifts or confusing navigation.

## 2025-05-24 - Semantic Switches and Interactive Labels
**Learning:** A truly accessible toggle should not only have semantic roles (role="switch") and state (aria-checked), but also interactive labels that increase the clickable hit area, improving UX for both mouse and touch users.
**Action:** When creating toggle or checkbox components, wrap them with a label or use aria-labelledby to associate text, and ensure clicking the text also triggers the input.

## 2025-05-25 - The "Gold Standard" for Accessible Custom Checkboxes
**Learning:** While ARIA roles (role="checkbox") can make a button act like a checkbox, the "Gold Standard" for accessibility is using a hidden native <input type="checkbox">. This ensures all native behaviors (tabbing, spacebar to toggle, screen reader integration) are handled automatically.
**Action:** When creating custom form controls, use a hidden native input as the state manager and use Tailwind's "peer" utility to style the custom visual element based on the native input's state (focus, checked, disabled).
