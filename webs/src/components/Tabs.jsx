import React from "react";

export const Tabs = ({ tabs = [], activeTab, onTabChange, className = "" }) => {
  return (
    <div className={className}>
      <div className="flex gap-2 border-b border-border mb-4 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 font-semibold text-sm whitespace-nowrap transition-all duration-200 border-b-2 ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {tabs.map(tab => (
          <div key={tab.id} className={activeTab === tab.id ? "block" : "hidden"}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
