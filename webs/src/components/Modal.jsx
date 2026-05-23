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
    "2xl": "max-w-2xl"
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center z-50" {...props}>
        <div
          className={`bg-card border border-border rounded-lg shadow-xl w-full mx-4 ${sizes[size]}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 id={titleId} className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
