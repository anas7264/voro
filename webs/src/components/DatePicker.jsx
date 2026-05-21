import React, { useState } from "react";
import { Calendar } from "lucide-react";

export const DatePicker = ({ value, onChange, label, error, className = "", ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (e) => {
    const date = e.target.value;
    onChange(date);
    setIsOpen(false);
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>}
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={handleDateChange}
          className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-white focus:outline-none focus:ring-2 focus:ring-primary"
          {...props}
        />
        <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={20} />
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default DatePicker;
