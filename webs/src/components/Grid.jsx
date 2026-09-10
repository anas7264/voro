import React, { memo } from "react";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static lookup maps.
 * Pre-constructed frozen dictionaries eliminate object allocations on every render cycle
 * and prevent Tailwind CSS Purge truncation by explicitly writing full class names.
 */
const GRID_COLS_RESPONSIVE = Object.freeze({
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
  6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  7: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7",
  8: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8",
  9: "grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9",
  10: "grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-10",
  11: "grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-11",
  12: "grid-cols-1 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-12"
});

const GRID_COLS_STATIC = Object.freeze({
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12"
});

const GRID_GAPS = Object.freeze({
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  7: "gap-7",
  8: "gap-8",
  9: "gap-9",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16"
});

/**
 * ⚡ LUXURY REFINEMENT: Kinetic Structural Grid Matrix (Grid).
 * Re-engineered to Voro's 'Forge' luxury architectural system standard.
 * Features zero-allocation class resolution, safe static class strings for PurgeCSS,
 * flexible semantic element rendering, and mathematical spatial rhythm.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Structural grid alignment ensures visual rhythm and balance across all device viewports.
 * 2. Precision: Pure constant dictionary lookups eliminate virtual DOM heap allocations.
 * 3. Flexibility: Supports polymorphic `as` tags for semantic HTML (`ul`, `section`, `form`, etc.).
 */
export const Grid = memo(({
  children,
  columns = 3,
  gap = 4,
  responsive = true,
  as: Component = "div",
  className = "",
  ...props
}) => {
  const colsMap = responsive ? GRID_COLS_RESPONSIVE : GRID_COLS_STATIC;
  const resolvedCols = colsMap[columns] || colsMap[3];
  const resolvedGap = GRID_GAPS[gap] || (typeof gap === "string" && gap.startsWith("gap-") ? gap : GRID_GAPS[4]);

  return (
    <Component
      className={`grid ${resolvedCols} ${resolvedGap} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

Grid.displayName = "Grid";

export default Grid;
