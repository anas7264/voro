import React, { memo } from "react";
import { Textarea } from "./Textarea";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Memoized FormTextarea wrapper component.
 * Prevents unnecessary re-renders when parent form state updates (e.g., during
 * high-frequency typing in sibling form fields), eliminating virtual DOM churn.
 */
export const FormTextarea = memo(({ name, label, error, required, ...props }) => {
  return (
    <div className="mb-4">
      <Textarea
        id={name}
        name={name}
        label={label}
        required={required}
        error={error}
        {...props}
      />
    </div>
  );
});

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
