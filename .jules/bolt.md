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
