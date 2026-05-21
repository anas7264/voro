import React from "react";

export const Container = ({ children, maxWidth = "max-w-7xl", className = "", ...props }) => {
  return (
    <div className={`w-full ${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Container;
