import React, { memo } from "react";
import { Checkbox } from "./Checkbox";

/**
 * ⚡ LUXURY MASTERCLASS REFINEMENT: Forge Standard Binary Switch Matrix (FormCheckbox).
 * Re-engineered to Voro's 'Forge' luxury architecture and zero-allocation performance standards.
 * Features golden-ratio spatial architecture (`mb-6 sm:mb-8`), seamless outer wrapper styling,
 * zero-allocation prop forwarding, description resolution, and memoized virtual DOM render suppression.
 *
 * PSYCHOLOGICAL & AESTHETIC DESIGN PHILOSOPHY:
 * 1. Visual Hierarchy & Space Optimization: Golden ratio vertical margins (`mb-6 sm:mb-8`) give interactive
 *    boolean toggle nodes deliberate, uncrowded spatial presence.
 * 2. Cognitive Ease: High-contrast description rendering paired with clear spatial separation enhances decision speed.
 * 3. Performance & Reactivity: Pure React `memo` wrapper prevents virtual DOM churn during form interactions.
 */
export const FormCheckbox = memo(({
  name,
  label,
  description,
  helperText,
  error,
  required,
  id,
  className = "",
  style,
  ...props
}) => {
  const checkboxId = id || name;
  const resolvedDescription = description || helperText;
  return (
    <div
      className={`relative mb-6 sm:mb-8 group/form-checkbox transition-all duration-500 ${className}`}
      style={style}
    >
      <Checkbox
        id={checkboxId}
        name={name}
        label={label}
        description={resolvedDescription}
        required={required}
        error={error}
        {...props}
      />
    </div>
  );
});

FormCheckbox.displayName = "FormCheckbox";

export default FormCheckbox;
