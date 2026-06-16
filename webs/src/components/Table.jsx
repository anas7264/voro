import React, { memo, useRef } from "react";

/**
 * ⚡ OPTIMIZATION: Refined luxury Table component ('Precision Data Matrix').
 * Architected with the Forge design system: deep charcoal palette (#0A0C14),
 * Playfair Display headers, and JetBrains Mono data cells.
 * Features 'Surgical Reactivity': mouse tracking is handled via
 * direct DOM manipulation of CSS variables to bypass React re-renders.
 */
export const Table = memo(({ headers = [], rows = [], className = "" }) => {
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty("--mouse-x", `${x}px`);
    containerRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`
        Table group/table relative overflow-hidden bg-[#0A0C14]/95 border border-white/5
        rounded-[2.5rem] shadow-2xl shadow-black/40 backdrop-blur-md
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${className}
      `}
    >
      {/* Precision Grid Background - Emerges on Table Hover */}
      <div className="absolute inset-0 bg-grid-white opacity-0 group-hover/table:opacity-100 pointer-events-none transition-opacity duration-1000" />

      {/* Dynamic Light Lens (Mouse Tracking) */}
      <div
        className="absolute inset-0 opacity-0 group-hover/table:opacity-100 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 40%)`,
        }}
      />

      <div className="overflow-x-auto no-scrollbar relative z-10">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-10 py-8 text-left text-[0.6rem] font-mono font-bold text-voro-primary uppercase tracking-[0.4em]"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-serif italic capitalize text-xl tracking-tight text-white/90">
                      {header}
                    </span>
                    <div className="h-px w-6 bg-gradient-to-r from-voro-primary/40 to-transparent" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="group/row border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-all duration-500 relative"
              >
                {Array.isArray(row) ? (
                  row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`
                        px-10 py-6 text-sm font-mono text-gray-500 group-hover/row:text-gray-200 transition-colors duration-500 relative
                        ${cellIndex === 0 ? "text-voro-primary/80 group-hover/row:text-voro-primary font-bold" : ""}
                      `}
                    >
                      {/* Liquid Light Indicator (Only on first cell) */}
                      {cellIndex === 0 && (
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-voro-primary scale-y-0 group-hover/row:scale-y-100 transition-transform duration-500 origin-center shadow-[0_0_15px_rgba(124,58,237,0.8)] rounded-r-full" />
                      )}
                      {cell}
                    </td>
                  ))
                ) : (
                  <td className="px-10 py-6 text-sm font-mono text-gray-500 group-hover/row:text-gray-200 transition-colors duration-500 relative">
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-voro-primary scale-y-0 group-hover/row:scale-y-100 transition-transform duration-500 origin-center shadow-[0_0_15px_rgba(124,58,237,0.8)] rounded-r-full" />
                    {row}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Boutique Footer Detail */}
      <div className="p-4 border-t border-white/[0.02] flex justify-between items-center bg-black/20">
        <div className="flex gap-2">
          <div className="w-1 h-1 rounded-full bg-voro-primary/40" />
          <div className="w-1 h-1 rounded-full bg-voro-primary/20" />
          <div className="w-1 h-1 rounded-full bg-voro-primary/10" />
        </div>
        <span className="text-[0.45rem] font-mono text-white/10 tracking-[0.6em] uppercase group-hover/table:text-white/30 transition-colors duration-1000">
          Precision_Data_Matrix_v2.0
        </span>
      </div>
    </div>
  );
});

Table.displayName = "Table";

export default Table;
