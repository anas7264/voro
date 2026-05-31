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
        className="fixed inset-0 bg-[#020408]/90 backdrop-blur-md z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-6" {...props}>
        <div
          className={`bg-[#0A0C14] border border-white/5 rounded-sm shadow-2xl w-full mx-4 overflow-hidden ${sizes[size]}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="flex items-center justify-between px-10 py-8 border-b border-white/5">
            <h2 id={titleId} className="text-xs font-mono font-bold uppercase tracking-[0.4em] text-gray-400">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-white transition-all transform hover:rotate-90"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
          <div className="px-10 py-10">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
