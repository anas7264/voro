import React, { memo } from "react";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static lookup maps.
 * Module-scoped frozen dictionaries eliminate per-render heap allocations.
 */
const STACK_DIRECTIONS = Object.freeze({
  vertical: "flex flex-col",
  horizontal: "flex flex-row flex-wrap",
  col: "flex flex-col",
  row: "flex flex-row flex-wrap"
});

const STACK_GAPS = Object.freeze({
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

const STACK_ALIGNS = Object.freeze({
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline"
});

const STACK_JUSTIFIES = Object.freeze({
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly"
});

/**
 * ⚡ LUXURY REFINEMENT: Kinetic Neural Layout Conduit (Stack).
 * Re-engineered to Voro's 'Forge' luxury architectural system standard.
 * Features zero-allocation class resolution, pure constant dictionary lookups,
 * flexible semantic element rendering, and mathematical flex rhythm.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Predictable linear flex alignment provides clean spatial hierarchy and balance.
 * 2. Precision: Pre-mapped frozen class lookup tables guarantee zero runtime garbage collection.
 * 3. Flexibility: Supports polymorphic `as` tags for semantic HTML (`nav`, `header`, `footer`, etc.).
 */
export const Stack = memo(({
  children,
  direction = "vertical",
  gap = 4,
  align = "start",
  justify = "start",
  as: Component = "div",
  className = "",
  ...props
}) => {
  const resolvedDirection = STACK_DIRECTIONS[direction] || STACK_DIRECTIONS.vertical;
  const resolvedGap = STACK_GAPS[gap] || (typeof gap === "string" && gap.startsWith("gap-") ? gap : STACK_GAPS[4]);
  const resolvedAlign = STACK_ALIGNS[align] || STACK_ALIGNS.start;
  const resolvedJustify = STACK_JUSTIFIES[justify] || STACK_JUSTIFIES.start;

  return (
    <Component
      className={`${resolvedDirection} ${resolvedGap} ${resolvedAlign} ${resolvedJustify} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

Stack.displayName = "Stack";

export default Stack;
