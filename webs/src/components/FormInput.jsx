import React from "react";
import { Input } from "./Input";

export const FormInput = ({ name, label, type = "text", error, required, ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <Input
        id={name}
        name={name}
        type={type}
        error={error}
        {...props}
      />
    </div>
  );
};

export default FormInput;
