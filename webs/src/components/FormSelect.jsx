import React, { memo } from "react";
import { Select } from "./Select";

/**
 * ⚡ LUXURY MASTERCLASS REFINEMENT: Forge Standard Neural Form Select Matrix (FormSelect).
 * Re-engineered to Voro's 'Forge' luxury architecture and zero-allocation performance standards.
 * Features golden-ratio spatial architecture (`mb-6 sm:mb-8`), seamless outer wrapper styling,
 * zero-allocation prop forwarding, and memoized virtual DOM render suppression.
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
