import React from "react";
import { Checkbox } from "./Checkbox";

export const FormCheckbox = ({ name, label, error, ...props }) => {
  return (
    <div className="mb-4">
      <Checkbox
        id={name}
        label={label}
        error={error}
        {...props}
      />
    </div>
  );
};

export default FormCheckbox;
