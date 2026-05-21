## 2025-05-14 - Canvas and Scroll Optimization
**Learning:** Found O(N²) particle connection loops in canvas animations and layout-triggering properties (height) being used for scroll progress. Squared distance checks can significantly reduce Math.sqrt overhead. transform: scaleY is much more efficient than height for progress bars as it avoids layout reflows.

**Action:**
1. Use squared distance for proximity checks in canvas loops.
2. Replace height-based animations with transform-based ones.
3. Use passive event listeners for high-frequency events like scroll and mousemove.
