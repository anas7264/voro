import React, { useEffect, useId } from "react";
import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, children, size = "md", ...props }) => {
  const titleId = useId();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      const originalOverflow = window.getComputedStyle(document.body).overflow;
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      return () => {
        window.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-4xl"
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-[#080B14]/80 backdrop-blur-xl animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`
          relative w-full h-full sm:h-auto sm:rounded-[2.5rem] bg-[#0A0C14] border-l sm:border border-white/5
          shadow-2xl shadow-black flex flex-col overflow-hidden animate-slide-up
          ${sizes[size]}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        {...props}
      >
        <div className="flex items-center justify-between p-8 sm:p-10 border-b border-white/5">
          <div className="space-y-1">
            <h2 id={titleId} className="text-2xl sm:text-3xl font-serif italic font-medium text-white tracking-tight">
              {title}
            </h2>
            <div className="h-0.5 w-12 bg-voro-primary rounded-full" />
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all duration-300 active:scale-90"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 sm:p-10 no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
