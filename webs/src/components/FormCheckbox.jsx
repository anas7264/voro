import React, { memo } from "react";
import { Checkbox } from "./Checkbox";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Memoized FormCheckbox wrapper component.
 * Prevents unnecessary re-renders when parent form state updates (e.g., during
 * high-frequency typing in sibling form fields), eliminating virtual DOM churn.
 */
export const FormCheckbox = memo(({ name, label, description, helperText, error, required, id, ...props }) => {
  const checkboxId = id || name;
  const resolvedDescription = description || helperText;
  return (
    <div className="mb-4">
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
