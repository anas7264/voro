import React from "react";
import { AlertCircle } from "lucide-react";

export const ErrorBoundary = ({ error, reset }) => {
  if (!error) return null;

  return (
    <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
      <div className="flex gap-3">
        <AlertCircle className="text-red-400" size={20} />
        <div className="flex-1">
          <h4 className="font-semibold text-red-400">Something went wrong</h4>
          <p className="text-sm text-red-300 mt-1">{error.message || "An unexpected error occurred"}</p>
          {reset && (
            <button onClick={reset} className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:opacity-90 text-sm">
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
