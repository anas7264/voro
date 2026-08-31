import React, { memo } from "react";
import { Select } from "./Select";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Memoized FormSelect wrapper component.
 * Prevents unnecessary re-renders when parent form state updates (e.g., during
 * high-frequency typing in sibling form fields), eliminating virtual DOM churn.
 */
export const FormSelect = memo(({ name, label, options = [], error, required, id, ...props }) => {
  const selectId = id || name;
  return (
    <div className="mb-4">
      <Select
        id={selectId}
        name={name}
        label={label}
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
