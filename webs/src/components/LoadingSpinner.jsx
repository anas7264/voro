import React from "react";

export const LoadingSpinner = ({ fullscreen = false, message = "Loading..." }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-transparent rounded-full animate-spin" />
      <p className="text-gray-300">{message}</p>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
