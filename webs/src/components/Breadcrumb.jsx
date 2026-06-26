import React, { memo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * ⚡ REFINEMENT: Luxury Spatial Navigation Sequence (Breadcrumb).
 * Re-engineered with the Forge design system: editorial typography,
 * glassmorphic hover nodes, and industrial telemetry markers.
 *
 * DESIGN PHILOSOPHY:
 * 1. Authority: Playfair Display serif for the active terminal node.
 * 2. Precision: JetBrains Mono for system path segments.
 * 3. Motion: Kinetic hover states with glassmorphic depth.
 * 4. Atmosphere: Subtle system markers indicating node depth.
 */
export const Breadcrumb = memo(({ items = [], className = "" }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 md:gap-3 ${className}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const segmentId = `NAV_0${index + 1}`;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight
                size={14}
                className="text-gray-700/50 flex-shrink-0"
              />
            )}

            <div className="flex items-center group/breadcrumb-node">
              {!isLast ? (
                <Link
                  to={item.href || "#"}
                  className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-500 hover:bg-white/[0.03] hover:backdrop-blur-md group/link"
                >
                  {/* System Telemetry Marker */}
                  <span className="text-[0.45rem] font-mono font-bold text-gray-700 group-hover/link:text-voro-primary transition-colors duration-500">
                    {segmentId}
                  </span>

                  {/* Path Segment */}
                  <span className="text-[0.65rem] font-mono font-black uppercase tracking-[0.2em] text-gray-500 group-hover/link:text-gray-200 transition-colors duration-500">
                    {item.label}
                  </span>

                  {/* Kinetic Underline */}
                  <div className="absolute bottom-0 left-3 right-3 h-[1px] bg-voro-primary scale-x-0 group-hover/link:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
                </Link>
              ) : (
                <div className="flex items-center gap-3 px-3 py-1.5">
                  {/* Active Segment Marker */}
                  <div className="w-1.5 h-1.5 rounded-full bg-voro-primary shadow-[0_0_10px_rgba(124,58,237,0.6)] animate-pulse" />

                  {/* Editorial Terminal Node */}
                  <span className="text-xl md:text-2xl font-serif italic font-medium text-white tracking-tight">
                    {item.label}
                  </span>

                  {/* Tactical End Marker */}
                  <div className="h-px w-6 bg-gradient-to-r from-voro-primary/40 to-transparent" />
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </nav>
  );
});

Breadcrumb.displayName = "Breadcrumb";

export default Breadcrumb;
