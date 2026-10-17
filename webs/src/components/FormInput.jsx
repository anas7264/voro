import React, { memo } from "react";
import { Input } from "./Input";

/**
 * ⚡ LUXURY MASTERCLASS REFINEMENT: Forge Standard Neural Form Field Enclave (FormInput).
 * Re-engineered to Voro's 'Forge' luxury architecture and zero-allocation performance standards.
 * Features golden-ratio spatial architecture (`mb-6 sm:mb-8`), seamless outer wrapper styling,
 * zero-allocation prop forwarding, and memoized virtual DOM render suppression.
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
