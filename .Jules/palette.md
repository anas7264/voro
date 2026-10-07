## 2025-05-18 - Defensive Handlers and Proper Native Attribute Forwarding in Form Primitives
**Learning:** Adding redundant `aria-disabled` or generic role names as fallback `aria-label` (e.g. `aria-label="Checkbox"`) on native inputs is an accessibility anti-pattern because screen readers already announce the role and native state. Instead, focus on defensive optional callbacks (`onChange?.()`), clear tooltips (`title`) for disabled interactive elements, and proper prop order so consumer overrides take precedence.
**Action:** When refining form primitive components, avoid adding redundant ARIA attributes that duplicate native input semantics, and ensure prop spreading occurs prior to explicit component attributes or defaults.

## 2025-05-19 - Accessible Dynamic Icon Toggle Controls in Spatial Navigation Sidebars
**Learning:** Collapsible sidebars and spatial navigation frames require clear, accessible icon toggles on desktop viewports. Using dynamic `aria-label`s and `title` tooltips matching current state ("Collapse sidebar" / "Expand sidebar") ensures screen readers and keyboard users immediately understand the action.
**Action:** When adding or updating collapse/expand buttons on navigation sidebars, provide dynamic, state-aware `aria-label` and `title` attributes that adapt seamlessly to the expanded/collapsed state.

## 2025-05-20 - Explicit Accessibility Hiding for CSS Grid Transition Accordions
**Learning:** Accordion components utilizing CSS grid transitions (`grid-rows-[0fr]`) and opacity changes to animate expansion keep collapsed panel content present in the DOM without hiding it from screen readers (unlike `display: none` or `visibility: hidden`). Adding `aria-hidden={!isOpen}` to the accordion panel region ensures screen reader virtual cursors ignore collapsed panel content.
**Action:** When implementing smooth CSS grid or scale/opacity transitions for expandable panels, explicitly apply `aria-hidden={!isOpen}` to the collapsible region so screen reader users do not encounter collapsed hidden content.

## 2025-05-22 - Action-Oriented Accessibility Semantics for Interactive Brand Logos
**Learning:** Generic component names (like `Voro Brand Signature Node`) as `aria-label`s on interactive brand logos fail to inform screen reader users of the destination action when activated. Providing action-oriented default accessible names (e.g. `Navigate to Dashboard`) and visible `title` tooltips when `onClick` handlers are attached ensures both visual and assistive technology users understand the navigation behavior.
**Action:** When making brand logos or signature nodes interactive, default `aria-label` and `title` to action-oriented descriptions (such as `Navigate to Dashboard`) while respecting consumer prop overrides.

## 2025-05-21 - Synchronized DOM Presence for `aria-describedby` Helper Elements
**Learning:** Linking helper text or description elements to input controls via `aria-describedby` requires strict synchronization between the computed `aria-describedby` value and actual DOM element existence. If `helperText` is hidden when an `error` is present (`{helperText && !error && ...}`), including `helperId` in `aria-describedby` creates a broken ARIA reference to a non-existent DOM node. Always guard `aria-describedby` entries (`helperText && !error ? helperId : null`) so screen readers never receive dangling element references.
**Action:** When computing multi-source `aria-describedby` strings (combining error, helper text, and custom descriptions), verify that every ID included in the string is conditionally rendered in the DOM under the exact same conditions.

## 2025-05-23 - Avoiding `aria-label` and `role="button"` Overrides on Table Rows
**Learning:** Setting `aria-label` or `role="button"` directly on `<tr>` elements in an HTML `<table>` overrides all child `<td>` text nodes for screen readers and breaks native table navigation. Interactive table rows should instead use `tabIndex={0}`, `onKeyDown` (`Enter` and `Space` activation), hover `title` tooltips, and focus-visible rings without altering the `<tr>` element's native ARIA semantics or masking cell text.
**Action:** When making table rows interactive, provide keyboard navigation (`tabIndex={0}` and `onKeyDown`) and hover `title` tooltips without adding `role="button"` or `aria-label` to `<tr>` nodes.

## 2025-05-24 - Action-Oriented Fallback Accessible Names for Unlabelled Form Controls
**Learning:** Form input primitives (`Input`, `Select`, `Textarea`) rendered without visual `label` props often leave screen reader users with unlabelled inputs. Providing fallback `aria-label` resolution (`props['aria-label'] || props.ariaLabel || placeholder || defaultFallback`) when `!label` ensures assistive technologies always announce an accessible name while allowing native `<label>` association when `label` is present.
**Action:** When designing form input primitives that support optional visual labels, conditionally supply `aria-label` only when no visible label is rendered, prioritizing explicit ARIA props and placeholders before falling back to generic type descriptions.

## 2025-05-25 - Avoiding Redundant ARIA Attributes on Visible Tab Lists and Text Buttons
**Learning:** Adding `aria-label` or native `title` tooltips to visible text buttons or tabs that already render human-readable labels can create unwanted native desktop tooltip popups and introduce broken `[object Object]` announcements if labels contain React nodes. Additionally, elements with CSS `visibility: hidden` are already excluded from the accessibility tree, making extra `aria-hidden` attributes redundant.
**Action:** Reserve `aria-label` and `title` tooltips for icon-only controls, locked/disabled overlay indicators, or unlabelled controls, and rely on native `visibility: hidden` or `display: none` for screen reader hiding.
