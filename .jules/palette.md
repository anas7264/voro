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

## 2025-05-28 - Prioritizing Semantic Labels over Placeholders
**Learning:** While placeholders provide a hint, they are not a substitute for semantic labels. Using the 'label' prop in base components ensures a permanent, screen-reader-accessible association between the description and the input, which remains visible even after the field is filled.
**Action:** Always utilize the 'label' prop on 'Input', 'Select', and 'Textarea' components instead of relying solely on 'placeholder' text for form fields.

## 2026-06-01 - Context-Aware ARIA Labels for Dynamic Logs
**Learning:** For dynamic logs where items have similar actions (like 'Delete'), generic aria-labels are insufficient for screen reader users. Including the specific item values (e.g., amount and timestamp) in the label provides the necessary context to safely perform destructive actions.
**Action:** When implementing list actions in logs, construct aria-labels that include unique identifiers or values from the specific log entry to aid non-visual navigation.

## 2026-06-01 - Luminous Biometric Nodes and High-Contrast Serif Typography
**Learning:** Luxury UI isn't just about dark mode; it's about the interplay of mathematical whitespace, high-contrast serif typography (Playfair Display) for metrics, and kinetic feedback. Using italics for data strings creates a 'boutique gallery' feel that humanizes technical biometric data.
**Action:** When designing data-heavy dashboards, use serif italics for primary metrics and monospaced fonts (JetBrains Mono) for units to create a sophisticated, high-end visual hierarchy.

## 2026-06-01 - Keyboard Visibility for Hover-Only Actions
**Learning:** Destructive or secondary actions often use `opacity-0 group-hover:opacity-100` for a cleaner UI, but this makes them invisible and inaccessible to keyboard users. Using `focus-visible:opacity-100` ensures that these elements become visible when they receive focus via 'Tab', maintaining both aesthetic intent and accessibility.
**Action:** When hiding interactive elements until hover, always include focus-visible states to ensure they are discoverable and usable via keyboard navigation.

## 2026-06-02 - Luxury Data Visualization and Floating Aesthetics
**Learning:** High-end data visualization requires moving beyond standard grid-and-axis layouts. Removing distracting axis lines and tick marks while implementing glassmorphic tooltips with high-contrast typography (Serif/Mono) creates a "floating" data aesthetic that feels more premium and intentional.
**Action:** When implementing charts, prioritize atmospheric depth (SVG glow/filters) and minimalist layouts (axis-free) to align with a luxury boutique aesthetic, ensuring that data is the primary focal point.

## 2026-06-02 - Neural Oracle: Editorial AI Experience
**Learning:** High-end AI interfaces benefit from an "Editorial" aesthetic. By contrasting sophisticated serif italics (Playfair Display) for AI insights with technical monospaced fonts (JetBrains Mono) for user data, we create a clear cognitive distinction between 'Oracle' wisdom and 'User' input.
**Action:** Transformed AICoach into the 'Neural Oracle', implementing glassmorphic 'Insight Artifacts' and 'Inquiry Prisms' to elevate the standard chat bubble into a luxury specimen holder.

## 2026-06-05 - Micro-Delight as Positive Reinforcement in High-Friction Logs
**Learning:** For high-friction activities like manual workout logging, visual "micro-delights" (e.g., confetti on save) serve as immediate positive reinforcement. Combining these delightful moments with robust accessibility (like focus-visible states for destructive actions) ensures that the UI is both emotionally rewarding and inclusive.
**Action:** When a user completes a significant data entry milestone, trigger a celebration component to reinforce the behavior, ensuring all interaction points remain fully accessible to keyboard and screen reader users.
