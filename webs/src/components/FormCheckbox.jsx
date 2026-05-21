import React from "react";
import { Checkbox } from "./Checkbox";

export const FormCheckbox = ({ name, label, error, required, ...props }) => {
  return (
    <div className="mb-4">
      <Checkbox
        id={name}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default FormCheckbox;
