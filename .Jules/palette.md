## 2025-05-18 - Defensive Handlers and Proper Native Attribute Forwarding in Form Primitives
**Learning:** Adding redundant `aria-disabled` or generic role names as fallback `aria-label` (e.g. `aria-label="Checkbox"`) on native inputs is an accessibility anti-pattern because screen readers already announce the role and native state. Instead, focus on defensive optional callbacks (`onChange?.()`), clear tooltips (`title`) for disabled interactive elements, and proper prop order so consumer overrides take precedence.
**Action:** When refining form primitive components, avoid adding redundant ARIA attributes that duplicate native input semantics, and ensure prop spreading occurs prior to explicit component attributes or defaults.

## 2025-05-19 - Accessible Dynamic Icon Toggle Controls in Spatial Navigation Sidebars
**Learning:** Collapsible sidebars and spatial navigation frames require clear, accessible icon toggles on desktop viewports. Using dynamic `aria-label`s and `title` tooltips matching current state ("Collapse sidebar" / "Expand sidebar") ensures screen readers and keyboard users immediately understand the action.
**Action:** When adding or updating collapse/expand buttons on navigation sidebars, provide dynamic, state-aware `aria-label` and `title` attributes that adapt seamlessly to the expanded/collapsed state.
