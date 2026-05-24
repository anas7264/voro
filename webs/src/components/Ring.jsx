import React, { memo } from 'react';

/**
 * ⚡ OPTIMIZATION: Memoized Ring component to prevent unnecessary re-renders.
 * Since this component performs calculations for SVG paths and is used in the
 * Dashboard (which may re-render frequently), memoization helps avoid
 * redundant work when values haven't changed.
 */
const Ring = memo(({ value, max, size = 180, unit = 'kcal', color = '#7C3AED', label }) => {
  const safeMax = max > 0 ? max : 1;
  const percentage = Math.min((value / safeMax) * 100, 100);
  const radius = size / 2 - 15;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 absolute inset-0"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(107, 114, 128, 0.2)"
          strokeWidth="10"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="relative z-10 text-center">
        <div className="text-3xl font-bold text-white leading-none">{Math.round(value).toLocaleString()}</div>
        <div className="text-sm text-gray-400 mt-1">{unit}</div>
        {label && <div className="text-xs text-gray-500 mt-0.5">{label}</div>}
        <div className="text-xs text-violet-400 mt-1">{Math.round(percentage)}%</div>
      </div>
    </div>
  );
});

Ring.displayName = 'Ring';

export default Ring;
