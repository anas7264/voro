import React from "react";
import { ChevronRight } from "lucide-react";

export const Breadcrumb = ({ items = [], className = "" }) => {
  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight size={16} className="text-gray-600" />}
          {item.href ? (
            <a href={item.href} className="text-primary hover:text-opacity-80">
              {item.label}
            </a>
          ) : (
            <span className="text-gray-400">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
