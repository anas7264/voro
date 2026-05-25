import React, { memo } from 'react';

/**
 * ⚡ OPTIMIZATION: Memoized VoroLogo component to prevent unnecessary re-renders.
 * This component contains SVG path data. Memoizing it ensures that it doesn't
 * re-calculate or re-render unless its size or className changes.
 */
const VoroLogo = memo(({ size = 80, className = '' }) => {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="48" fill="#7C3AED" opacity="0.15" />
        <circle cx="50" cy="50" r="38" fill="#7C3AED" opacity="0.25" />
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fontSize="36"
          fontWeight="800"
          fontFamily="Inter, sans-serif"
          fill="#7C3AED"
        >
          V
        </text>
      </svg>
    </div>
  );
});

VoroLogo.displayName = 'VoroLogo';

export default VoroLogo;
