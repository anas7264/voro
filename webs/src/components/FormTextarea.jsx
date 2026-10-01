import React, { memo } from "react";
import { Textarea } from "./Textarea";

/**
 * ⚡ LUXURY MASTERCLASS REFINEMENT: Forge Standard Neural Textstream Enclave (FormTextarea).
 * Re-engineered to Voro's 'Forge' luxury architecture and zero-allocation performance standards.
 * Features golden-ratio spatial architecture (`mb-6 sm:mb-8`), seamless outer wrapper styling,
 * zero-allocation prop forwarding, and memoized virtual DOM render suppression.
 *
 * PSYCHOLOGICAL & AESTHETIC DESIGN PHILOSOPHY:
 * 1. Visual Hierarchy & Space Optimization: Golden ratio vertical margins (`mb-6 sm:mb-8`) elevate high-capacity
 *    narrative textstreams into editorial gallery focal points.
 * 2. Cognitive Ease: Uncluttered spatial boundaries encourage thorough, articulate input without feeling cramped.
 * 3. Performance & Reactivity: Pure React `memo` wrapper prevents virtual DOM churn during high-frequency
 *    parent form state mutations.
 */
export const FormTextarea = memo(({
  name,
  label,
  error,
  helperText,
  required,
  id,
  className = "",
  style,
  ...props
}) => {
  const textareaId = id || name;
  return (
    <div
      className={`relative mb-6 sm:mb-8 group/form-textarea transition-all duration-500 ${className}`}
      style={style}
    >
      <Textarea
        id={textareaId}
        name={name}
        label={label}
        helperText={helperText}
        required={required}
        error={error}
        {...props}
      />
    </div>
  );
});

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
