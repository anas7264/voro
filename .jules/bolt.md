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

## 2026-06-01 - Streak Calculation Optimization
**Learning:** Consolidating multiple O(N) loops into a single pass significantly reduces `Date` object churn and string conversions (by ~66%). However, early-exit logic must account for "pending" states (e.g., today's task not being done yet) to avoid resetting streaks prematurely. Skipping leading empty days before starting the break-condition is critical for parity with original behavior.

**Action:**
1. Use a single loop with multiple active flags for parallel streak processing.
2. Implement specific 'active' transition logic: only break a streak once it has actually started and then encounters a gap.

## 2026-06-05 - Incremental Loading for Large Datasets
**Learning:** Rendering 2000+ complex React components (Cards) in a single pass causes severe "Time to Interactive" (TTI) lag and memory pressure, especially on mobile. Slicing the data array and using a "Load More" pattern reduces the initial DOM node count by ~99%, drastically improving mount performance.

**Action:**
1. Implement `visibleCount` state with a small `PAGE_SIZE` (e.g., 20-24) for any list exceeding 100 items.
2. Ensure `visibleCount` resets when filters change via `useEffect` to keep the interface snappy and relevant.
3. Use `.slice(0, visibleCount)` on the memoized filtered dataset for rendering.

## 2025-05-14 - Reactive Express Log & Biometric Synchronicity
**Learning:** Legacy pages often suffer from the "fetch-on-mount" anti-pattern (`useEffect` + `useState`), leading to visible layout shifts and redundant re-renders. Standardizing on synchronous `useMemo` for data derivation from the `StorageContext` creates a single-render lifecycle and ensures the UI is a pure function of the global state. Additionally, missing `getItem` destructuring in core trackers (`FoodDiary.jsx`) highlighted the need for strict linting or runtime verification during refactors.

**Action:**
1. Refactor `QuickLog.jsx`, `PerformanceMetrics.jsx`, and `DailyStreak.jsx` to synchronous `useMemo` derivation.
2. Standardize all express-entry keys under the encrypted `quick_log` domain.
3. Implement functional logging logic for express manifestations (Nutrition, Kinetic, Hydration) to ensure true data persistence across trackers.

## 2026-06-12 - Layout State Initialization & Context Reactivity
**Learning:** Initializing layout states (like `collapsed`) to a static default and then correcting them via `useEffect` based on environment (e.g., `isMobile`) causes a mandatory double-render on mount and visible flickering. Directly initializing state from its source of truth (the media query match) eliminates this transition. Furthermore, providing un-memoized values to a Context Provider causes all consumers to re-render whenever the provider component re-renders, even if the value hasn't logically changed.

**Action:**
1. Initialize layout states directly from their source of truth (e.g., `useMediaQuery`) in the `useState` initializer.
2. Always memoize Context Provider values using `useMemo` to protect the consumer tree from redundant re-renders.

## 2026-06-12 - Media Query Hook Optimization
**Learning:** Initializing 'useMediaQuery' state to 'false' and updating in 'useEffect' causes a mandatory double-render on mount for matched queries. Additionally, including 'matches' in the dependency array causes redundant effect re-runs whenever the breakpoint is crossed. Functional updates 'setMatches(prev => ...)' allow removing 'matches' from dependencies while maintaining logical correctness.

**Action:**
1. Use lazy state initialization with 'window.matchMedia(query).matches' for 'useMediaQuery'.
2. Remove 'matches' from 'useEffect' dependency array to prevent redundant listener re-attachments.
3. Use functional updates in 'setMatches' to keep the effect body lean and avoid unnecessary lint suppressions.

## 2025-05-18 - Surgical Reactivity Pattern
**Learning:** Using broad dependencies like `getItem` (a function redefined on every context update) or the entire `storageData` object in `useMemo` hooks causes redundant re-computations whenever ANY key in the global storage changes. Narrowing dependencies to the specific key (e.g., `storageData['water_log']`) ensures the hook only re-calculates when relevant data actually changes.

**Action:**
1. Avoid using `getItem` as a dependency in `useMemo` or `useEffect`.
2. Destructure `storageData` from `useStorage` and use the specific data slice (e.g., `storageData['key']`) in dependency arrays.
3. Apply this "Surgical Reactivity" pattern to all trackers and hooks derived from global state.

## 2026-06-14 - Surgical Reactivity for Interaction Nodes
**Learning:** Tracking mouse coordinates in React state (`useState`) at the page or high-level component level causes the entire component tree to re-render at 60fps. For purely visual interactions like 3D tilts and light lenses, this is a massive waste of CPU. Direct DOM manipulation via `useRef` and `style.setProperty` with CSS variables allows the browser's style engine to handle the updates without involving React's reconciliation, resulting in zero re-renders and perfectly fluid interaction.

**Action:** Replace high-frequency event state tracking (mouse, scroll) with CSS variables and refs to bypass React's render loop for visual effects. Use `innerText` on refs for real-time numeric display if needed.

## 2025-05-18 - Snapshot Stability & Infinite Loops
**Learning:** `useSyncExternalStore` (used by `useStorageKey`) relies on referential equality of the `getSnapshot` result. If `getSnapshot` returns a new object literal (e.g., a fallback or decoy) on every call, React assumes a state change and triggers a re-render, leading to an infinite loop. This is critical in 'deception' or 'security lockdown' modes where static fallback data must be referentially stable.

**Action:**
1. Always return a stable reference (e.g., a frozen module-level constant like `EMPTY_OBJ` or `DEFAULT_DECOY`) for fallbacks.
2. Hoist fallback objects outside component/hook bodies to ensure stability.
3. Ensure `getSnapshot` logic never instantiates new objects/arrays unless the underlying data has fundamentally changed.

## 2025-05-18 - Surgical Reactivity for Biometric Composition
**Learning:** This codebase uses a centralized `StorageContext` that, if accessed via the broad `useStorage()` hook, exposes the entire global state (`storageData`). This causes components to re-render whenever ANY storage key is updated (e.g., a simple water log entry). Transitioning to `useStorageKey('key')` creates a targeted subscription using `useSyncExternalStore`, isolating the component from unrelated state churn.

**Action:** Prefer `useStorageKey(key)` for data subscriptions and `useStorageMethods()` for write-only operations to minimize the re-render surface area in pages and complex components.

## 2025-05-18 - Native Primitive Capture & Binding
**Learning:** Capturing native browser primitives (like `performance.now`) for security attestation or RASP enforcement can trigger `Illegal invocation` errors if they are not bound to their parent context. This occurs because these methods often rely on internal state tied to the `this` value (the original object).
**Action:** Always use `.bind(parent)` when capturing native methods (e.g., `performance.now.bind(performance)`) to ensure stability when called within redirected execution contexts.

## 2025-05-18 - Surgical Reactivity for Action-Only Components
**Learning:** Components that only perform write operations (like 'QuickLog.jsx') should not subscribe to global storage state. Using 'useStorage()' (which includes 'storageData') triggers a re-render on every storage update, even if the component doesn't display any of that data. Switching to 'useStorageMethods()' provides the same action references (setItem, getItem) without the performance cost of a global subscription.
**Action:** Use 'useStorageMethods()' for components that only need to perform storage actions and do not need to reactively display storage data.

## 2026-07-08 - Parallel Storage & Crypto Collapsing
**Learning:** The application's encrypted storage layer forced sequential 'await' cycles during boot in 'ensureInitialized', creating an O(N) startup bottleneck where N is the number of storage keys. Furthermore, concurrent parallel requests to 'init()' in 'crypto.js' could trigger race conditions or redundant IndexedDB operations. Using 'Promise.all' for storage loading and an 'initPromise' singleton for crypto collapsing reduces startup latency to O(1) decryption cycles.

**Action:**
1. Use 'Promise.all' when initializing or fetching multiple keys from 'StorageManager'.
2. Implement 'initPromise' patterns in singleton utility modules to collapse concurrent async initialization calls.
