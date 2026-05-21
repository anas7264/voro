import React from "react";

export const Header = ({ title, subtitle, action, className = "" }) => {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex gap-2">{action}</div>}
    </div>
  );
};

export default Header;
