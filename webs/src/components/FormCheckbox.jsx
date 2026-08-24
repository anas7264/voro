import React, { memo } from "react";
import { Checkbox } from "./Checkbox";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Memoized FormCheckbox wrapper component.
 * Prevents unnecessary re-renders when parent form state updates (e.g., during
 * high-frequency typing in sibling form fields), eliminating virtual DOM churn.
 */
export const FormCheckbox = memo(({ name, label, error, required, ...props }) => {
  return (
    <div className="mb-4">
      <Checkbox
        id={name}
        label={label}
        required={required}
        error={error}
        {...props}
      />
    </div>
  );
});

FormCheckbox.displayName = "FormCheckbox";

export default FormCheckbox;
