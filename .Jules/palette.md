## 2025-05-18 - Defensive Handlers and Proper Native Attribute Forwarding in Form Primitives
**Learning:** Adding redundant `aria-disabled` or generic role names as fallback `aria-label` (e.g. `aria-label="Checkbox"`) on native inputs is an accessibility anti-pattern because screen readers already announce the role and native state. Instead, focus on defensive optional callbacks (`onChange?.()`), clear tooltips (`title`) for disabled interactive elements, and proper prop order so consumer overrides take precedence.
**Action:** When refining form primitive components, avoid adding redundant ARIA attributes that duplicate native input semantics, and ensure prop spreading occurs prior to explicit component attributes or defaults.

## 2025-05-19 - Accessible Dynamic Icon Toggle Controls in Spatial Navigation Sidebars
**Learning:** Collapsible sidebars and spatial navigation frames require clear, accessible icon toggles on desktop viewports. Using dynamic `aria-label`s and `title` tooltips matching current state ("Collapse sidebar" / "Expand sidebar") ensures screen readers and keyboard users immediately understand the action.
**Action:** When adding or updating collapse/expand buttons on navigation sidebars, provide dynamic, state-aware `aria-label` and `title` attributes that adapt seamlessly to the expanded/collapsed state.

## 2025-05-20 - Explicit Accessibility Hiding for CSS Grid Transition Accordions
**Learning:** Accordion components utilizing CSS grid transitions (`grid-rows-[0fr]`) and opacity changes to animate expansion keep collapsed panel content present in the DOM without hiding it from screen readers (unlike `display: none` or `visibility: hidden`). Adding `aria-hidden={!isOpen}` to the accordion panel region ensures screen reader virtual cursors ignore collapsed panel content.
**Action:** When implementing smooth CSS grid or scale/opacity transitions for expandable panels, explicitly apply `aria-hidden={!isOpen}` to the collapsible region so screen reader users do not encounter collapsed hidden content.

## 2025-05-21 - Synchronized DOM Presence for `aria-describedby` Helper Elements
**Learning:** Linking helper text or description elements to input controls via `aria-describedby` requires strict synchronization between the computed `aria-describedby` value and actual DOM element existence. If `helperText` is hidden when an `error` is present (`{helperText && !error && ...}`), including `helperId` in `aria-describedby` creates a broken ARIA reference to a non-existent DOM node. Always guard `aria-describedby` entries (`helperText && !error ? helperId : null`) so screen readers never receive dangling element references.
**Action:** When computing multi-source `aria-describedby` strings (combining error, helper text, and custom descriptions), verify that every ID included in the string is conditionally rendered in the DOM under the exact same conditions.
