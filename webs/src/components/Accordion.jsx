import React from "react";
import { ChevronDown } from "lucide-react";

export const Accordion = ({ items = [], className = "" }) => {
  const [openIndex, setOpenIndex] = React.useState(null);

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-4 py-3 flex items-center justify-between bg-card hover:bg-gray-800 transition-colors"
          >
            <span className="font-semibold text-white">{item.title}</span>
            <ChevronDown
              size={20}
              className={`text-gray-400 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
            />
          </button>
          {openIndex === index && (
            <div className="px-4 py-3 bg-gray-900 border-t border-border text-gray-300">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
