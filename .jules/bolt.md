## 2025-05-14 - Canvas and Scroll Optimization
**Learning:** Found O(N²) particle connection loops in canvas animations and layout-triggering properties (height) being used for scroll progress. Squared distance checks can significantly reduce Math.sqrt overhead. transform: scaleY is much more efficient than height for progress bars as it avoids layout reflows.

**Action:**
1. Use squared distance for proximity checks in canvas loops.
2. Replace height-based animations with transform-based ones.
3. Use passive event listeners for high-frequency events like scroll and mousemove.

## 2025-05-15 - Systemic Component Memoization
**Learning:** Core presentational components (Card, Stat, Button, etc.) are used dozens of times in complex pages like the Dashboard. Without memoization, a single state update at the page level (e.g., an AI insight finishing loading) triggers a full-tree re-render. Systemic use of React.memo on these stable components significantly reduces reconciliation overhead.

**Action:**
1. Apply React.memo to stable presentational components in webs/src/components/.
2. Always add displayName to memoized components for better devtools debugging.

## 2025-05-16 - Progress Bar Optimization (Layout vs Composite)
**Learning:** Progress bars that animate 'width' trigger the Layout phase of the browser rendering pipeline on every frame, which is computationally expensive. Switching to 'transform: scaleX()' with 'origin-left' allows the browser to perform the animation in the Composite layer, resulting in smoother 60fps transitions and reduced main thread load.

**Action:**
1. Use 'transform: scaleX()' for progress and loading bars.
2. Move static configuration objects (like color mappings) outside the component to avoid redundant allocations during re-renders.

## 2026-05-29 - Derived Data Optimization (useMemo vs useEffect)
**Learning:** Using 'useEffect' + 'useState' to filter large datasets (Foods, Exercises) creates a double-render cycle: first render with old data, effect runs, state updates, then second render. Moving this to 'useMemo' calculates the derived data during the initial render, reducing the work by 50%. Additionally, lazy-evaluating these lists (e.g., skipping filtering when a search Modal is closed) prevents O(N) overhead during unrelated state updates like typing in form fields.

**Action:**
1. Prefer 'useMemo' for all derived data and filtering logic.
2. Add guard clauses in 'useMemo' to skip expensive computations when the relevant UI (like search modals) is inactive.

## 2026-05-30 - Chart Component Memoization
**Learning:** Recharts components (LineChart, BarChart) are highly complex and perform significant SVG/VML rendering logic. When these charts are part of a high-level page like the Dashboard or Statistics, any state update (e.g., a simple toggle or timer update) triggers a full re-reconcilation of the chart tree. Systemic memoization of these wrapper components prevents redundant "heavy" renders.

**Action:**
1. Wrap all Recharts wrapper components in React.memo.
2. Ensure displayName is set for memoized components.
3. Keep chart data structures stable or memoized at the page level to maximize the benefit of React.memo.

## 2026-06-01 - Static Configuration Hoisting
**Learning:** Found that common UI patterns like Dashboard macro grids often define their configuration (icons, colors, keys) inside the component body. This causes the array/object to be re-allocated on every render, adding garbage collection pressure and breaking memoization of children that might receive these objects as props.

**Action:**
1. Hoist all static configuration objects and arrays outside the component definition.
2. Use stable constants for color mappings and metadata.
