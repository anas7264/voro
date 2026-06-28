import React from "react";
import { Input } from "./Input";

export const FormInput = ({ name, label, type = "text", error, required, ...props }) => {
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
};

export default FormInput;
