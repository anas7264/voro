import React from "react";
import { Select } from "./Select";

export const FormSelect = ({ name, label, options = [], error, required, ...props }) => {
  return (
    <div className="mb-4">
      <Select
        id={name}
        name={name}
        label={label}
        required={required}
        options={options}
        error={error}
        {...props}
      />
    </div>
  );
};

export default FormSelect;
