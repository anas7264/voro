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

## 2025-05-26 - Context-Aware ARIA Labels for List Items
**Learning:** When implementing list items with multiple interactive fields (e.g., reps and weight for a workout set), generic labels are insufficient. Providing context-aware 'aria-label' attributes that include parent item identifiers (e.g., exercise name and set number) significantly improves the experience for screen reader users.
**Action:** Always include identifying context in ARIA labels for repetitive form elements within a list.

## 2025-05-27 - Systemic Component Reuse for Accessibility
**Learning:** Utilizing systemic components like 'Modal' instead of manual 'div' overlays ensures that accessibility features (Escape key handling, scroll management, focus trapping) are consistently applied throughout the application.
**Action:** Prioritize refactoring manual overlays to use established UI components to maintain a high accessibility standard.

## 2025-05-20 - [Context-Aware Security Notifications]
**UX Improvement:** While technically a security fix, the AI Privacy Shield includes a user-facing context note in AI messages: "(Note: PII has been redacted for privacy)".
**Learning:** Security measures shouldn't be silent; informing the user that their privacy is actively protected builds trust and transparency in data-heavy applications.
**Prevention:** When implementing automated data protection layers, provide subtle UI or message-level feedback to confirm to the user that the action was taken on their behalf.
