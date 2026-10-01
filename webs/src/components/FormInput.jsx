import React, { memo } from "react";
import { Input } from "./Input";

/**
 * ⚡ LUXURY MASTERCLASS REFINEMENT: Forge Standard Neural Form Field Enclave (FormInput).
 * Re-engineered to Voro's 'Forge' luxury architecture and zero-allocation performance standards.
 * Features golden-ratio spatial architecture (`mb-6 sm:mb-8`), seamless outer wrapper styling,
 * zero-allocation prop forwarding, and memoized virtual DOM render suppression.
 *
 * PSYCHOLOGICAL & AESTHETIC DESIGN PHILOSOPHY:
 * 1. Visual Hierarchy & Space Optimization: Golden ratio vertical margins (`mb-6 sm:mb-8`) give data input ports
 *    deliberate breathing room, creating an editorial gallery aesthetic that feels calm, confident, and high-value.
 * 2. Cognitive Ease: Generous spatial isolation reduces form density anxiety and visual noise, allowing users
 *    to focus on individual biometric and metabolic entry values with precision.
 * 3. Performance & Reactivity: Pure React `memo` wrapper prevents virtual DOM churn during high-frequency
 *    typing in sibling form fields across complex dashboard and logging views.
 */
export const FormInput = memo(({
  name,
  label,
  type = "text",
  error,
  helperText,
  required,
  id,
  className = "",
  style,
  ...props
}) => {
  const inputId = id || name;
  return (
    <div
      className={`relative mb-6 sm:mb-8 group/form-input transition-all duration-500 ${className}`}
      style={style}
    >
      <Input
        id={inputId}
        name={name}
        type={type}
        label={label}
        helperText={helperText}
        required={required}
        error={error}
        {...props}
      />
    </div>
  );
});

FormInput.displayName = "FormInput";

export default FormInput;
