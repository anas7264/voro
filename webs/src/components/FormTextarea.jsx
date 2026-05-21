import React from "react";
import { Textarea } from "./Textarea";

export const FormTextarea = ({ name, label, error, required, ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <Textarea
        id={name}
        name={name}
        error={error}
        {...props}
      />
    </div>
  );
};

export default FormTextarea;
