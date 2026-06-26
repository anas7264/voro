import React from "react";
import { Textarea } from "./Textarea";

export const FormTextarea = ({ name, label, error, required, ...props }) => {
  return (
    <div className="mb-4">
      <Textarea
        id={name}
        name={name}
        label={required ? `${label} *` : label}
        error={error}
        {...props}
      />
    </div>
  );
};

export default FormTextarea;
