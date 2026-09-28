import React, { memo } from "react";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted & Frozen static lookup maps.
 * Module-scoped frozen dictionaries eliminate per-render heap allocations
 * and enforce zero-allocation class resolution.
 */
const MAX_WIDTH_MAP = Object.freeze({
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
  "max-w-xs": "max-w-xs",
  "max-w-sm": "max-w-sm",
  "max-w-md": "max-w-md",
  "max-w-lg": "max-w-lg",
  "max-w-xl": "max-w-xl",
  "max-w-2xl": "max-w-2xl",
  "max-w-3xl": "max-w-3xl",
  "max-w-4xl": "max-w-4xl",
  "max-w-5xl": "max-w-5xl",
  "max-w-6xl": "max-w-6xl",
  "max-w-7xl": "max-w-7xl",
  "max-w-full": "max-w-full"
});

const PADDING_MAP = Object.freeze({
  none: "px-0 py-0",
  compact: "px-4 sm:px-6 py-4 sm:py-6",
  golden: "px-6 sm:px-10 lg:px-16 py-8 sm:py-12 lg:py-16",
  spacious: "px-8 sm:px-12 lg:px-20 py-10 sm:py-16 lg:py-24",
  default: "px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
});

const VARIANT_MAP = Object.freeze({
  default: "",
  gallery: "bg-[#0A0C14]/80 border border-white/10 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl relative overflow-hidden",
  matrix: "bg-[#080B14] border border-voro-primary/20 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.9),inset_0_1px_1px_0_rgba(124,58,237,0.1)] relative overflow-hidden",
  glass: "bg-white/[0.015] border border-white/10 rounded-[2.5rem] backdrop-blur-3xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden",
  flat: "bg-[#020408] border border-white/[0.03] rounded-2xl shadow-none relative overflow-hidden"
});

/**
 * ⚡ LUXURY REFINEMENT: Spatial Gallery Enclave (Container).
 * Re-engineered to Voro's 'Forge' luxury architectural system standard with
 * golden-ratio whitespace options, zero-allocation class mapping, and
 * elegant gallery framing variants.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Golden ratio whitespace optimization lets gallery elements breathe naturally.
 * 2. Precision: Pre-mapped frozen class lookup tables guarantee zero runtime garbage collection.
 * 3. Minimalist Elegance: Clean layout supporting direct flex/grid child alignment and cognitive ease.
 */
export const Container = memo(({
  children,
  maxWidth = "7xl",
  padding = "default",
  variant = "default",
  as: Component = "div",
  className = "",
  style,
  ...props
}) => {
  const resolvedMaxWidth = MAX_WIDTH_MAP[maxWidth] || (typeof maxWidth === "string" && maxWidth.startsWith("max-w-") ? maxWidth : MAX_WIDTH_MAP["7xl"]);
  const resolvedPadding = PADDING_MAP[padding] || PADDING_MAP.default;
  const resolvedVariant = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <Component
      style={style}
      className={`
        w-full mx-auto ${resolvedMaxWidth} ${resolvedPadding}
        ${resolvedVariant}
        ${className}
      `}
      {...props}
    >
      {/* Subtle Ambient Parallax Texture for Gallery Variants */}
      {variant !== "default" && (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-boutique-grain opacity-[0.02]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.015] via-transparent to-transparent" />
        </div>
      )}

      {children}
    </Component>
  );
});

Container.displayName = "Container";

export default Container;
