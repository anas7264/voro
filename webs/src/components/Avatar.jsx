import React from "react";

export const Avatar = ({ src, alt = "Avatar", size = "md", className = "" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover border border-border ${className}`}
    />
  );
};

export default Avatar;
