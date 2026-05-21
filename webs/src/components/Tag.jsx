import React from "react";

export const Tag = ({ children, variant = "primary", className = "", onRemove, ...props }) => {
  const variants = {
    primary: "bg-primary bg-opacity-20 text-primary",
    secondary: "bg-secondary bg-opacity-20 text-secondary",
    gray: "bg-gray-500 bg-opacity-20 text-gray-300"
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${variants[variant]} ${className}`} {...props}>
      <span>{children}</span>
      {onRemove && (
        <button onClick={onRemove} className="hover:opacity-75 transition-opacity">
          ✕
        </button>
      )}
    </div>
  );
};

export default Tag;
