import React from "react";

export const Table = ({ headers = [], rows = [], className = "" }) => {
  return (
    <div className={`overflow-x-auto border border-border rounded-lg ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-800 border-b border-border">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border hover:bg-gray-800 hover:bg-opacity-50 transition-colors">
              {Array.isArray(row) ? (
                row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 text-sm text-gray-300">
                    {cell}
                  </td>
                ))
              ) : (
                <td className="px-4 py-3 text-sm text-gray-300">{row}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
