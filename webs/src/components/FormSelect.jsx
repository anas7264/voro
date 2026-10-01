import React, { memo } from "react";
import { Select } from "./Select";

/**
 * ⚡ LUXURY MASTERCLASS REFINEMENT: Forge Standard Neural Form Select Matrix (FormSelect).
 * Re-engineered to Voro's 'Forge' luxury architecture and zero-allocation performance standards.
 * Features golden-ratio spatial architecture (`mb-6 sm:mb-8`), seamless outer wrapper styling,
 * zero-allocation prop forwarding, and memoized virtual DOM render suppression.
 *
 * PSYCHOLOGICAL & AESTHETIC DESIGN PHILOSOPHY:
 * 1. Visual Hierarchy & Space Optimization: Golden ratio vertical margins (`mb-6 sm:mb-8`) grant decision ports
 *    commanding presence and structural authority within luxury gallery layouts.
 * 2. Cognitive Ease: Deliberate spatial isolation creates predictable rhythm across complex forms, lowering
 *    cognitive fatigue during option evaluation.
 * 3. Performance & Reactivity: Pure React `memo` wrapper prevents virtual DOM churn during high-frequency
 *    parent form updates and sibling field interactions.
 */
export const FormSelect = memo(({
  name,
  label,
  options = [],
  error,
  helperText,
  required,
  id,
  className = "",
  style,
  ...props
}) => {
  const selectId = id || name;
  return (
    <div
      className={`relative mb-6 sm:mb-8 group/form-select transition-all duration-500 ${className}`}
      style={style}
    >
      <Select
        id={selectId}
        name={name}
        label={label}
        helperText={helperText}
        required={required}
        options={options}
        error={error}
        {...props}
      />
    </div>
  );
});

FormSelect.displayName = "FormSelect";

export default FormSelect;
