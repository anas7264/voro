import React, { memo } from "react";
import { Input } from "./Input";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Memoized FormInput wrapper component.
 * Prevents unnecessary re-renders when parent form state updates (e.g., during
 * high-frequency typing in sibling form fields), eliminating virtual DOM churn.
 */
export const FormInput = memo(({ name, label, type = "text", error, required, ...props }) => {
  return (
    <div className="mb-4">
      <Input
        id={name}
        name={name}
        type={type}
        label={label}
        required={required}
        error={error}
        {...props}
      />
    </div>
  );
});

FormInput.displayName = "FormInput";

export default FormInput;
