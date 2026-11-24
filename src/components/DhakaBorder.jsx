import React from 'react';

/**
 * Woven Nepali Dhaka geometric border trim.
 * Repeats authentic Palpali/Dhaka diamond-chevron weave cleanly at any viewport width.
 */
export function DhakaBorder({ className = '', opacity = 0.72, height = 16 }) {
  const patternId = React.useId().replace(/:/g, '');
  return (
    <div
      className={`w-full overflow-hidden select-none pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ height }}
    >
      <svg
        width="100%"
        height={height}
        preserveAspectRatio="none"
        className="block w-full h-full"
        style={{ opacity }}
      >
        <defs>
          <pattern
            id={`dhaka-${patternId}`}
            x="0"
            y="0"
            width="36"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            {/* Top & bottom fine metallic thread */}
            <line x1="0" y1="1" x2="36" y2="1" stroke="#D4AF37" strokeWidth="0.9" strokeOpacity="0.85" />
            <line x1="0" y1="15" x2="36" y2="15" stroke="#D4AF37" strokeWidth="0.9" strokeOpacity="0.85" />

            {/* Woven crimson base */}
            <rect x="0" y="2" width="36" height="12" fill="#4E0A16" fillOpacity="0.6" />

            {/* Classic Dhaka diamond motif */}
            <polygon
              points="18,2.5 25,8 18,13.5 11,8"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1.05"
            />
            <polygon
              points="18,5 21.6,8 18,11 14.4,8"
              fill="#F7E7CE"
              fillOpacity="0.82"
            />
            <circle cx="18" cy="8" r="1.15" fill="#6B0F1A" />

            {/* Flanking woven zig-zag chevrons */}
            <polyline
              points="0,8 4.5,3.5 9,8 4.5,12.5 0,8"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.9"
              strokeOpacity="0.78"
            />
            <polyline
              points="36,8 31.5,3.5 27,8 31.5,12.5 36,8"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.9"
              strokeOpacity="0.78"
            />

            {/* Tiny accent gold stitches */}
            <circle cx="9" cy="4.2" r="0.8" fill="#F7E7CE" fillOpacity="0.75" />
            <circle cx="27" cy="4.2" r="0.8" fill="#F7E7CE" fillOpacity="0.75" />
            <circle cx="9" cy="11.8" r="0.8" fill="#F7E7CE" fillOpacity="0.75" />
            <circle cx="27" cy="11.8" r="0.8" fill="#F7E7CE" fillOpacity="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height={height} fill={`url(#dhaka-${patternId})`} />
      </svg>
    </div>
  );
}

/**
 * Ornamental horizontal section divider with gold filigree and central lotus diamond.
 */
export function RoyalDivider({ className = '' }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 w-full max-w-xs mx-auto select-none ${className}`}
      aria-hidden="true"
    >
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/65 to-[#D4AF37]" />
      <svg width="42" height="18" viewBox="0 0 42 18" fill="none" className="shrink-0">
        <path
          d="M2 9 H11 M31 9 H40"
          stroke="#D4AF37"
          strokeWidth="0.9"
          strokeOpacity="0.75"
        />
        <path
          d="M21 1.5 L28.5 9 L21 16.5 L13.5 9 Z"
          stroke="#D4AF37"
          strokeWidth="1.15"
          fill="#6B0F1A"
        />
        <path
          d="M21 4.5 L25 9 L21 13.5 L17 9 Z"
          fill="#F7E7CE"
          fillOpacity="0.88"
        />
        <circle cx="9" cy="9" r="1.6" fill="#D4AF37" />
        <circle cx="33" cy="9" r="1.6" fill="#D4AF37" />
      </svg>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37]/65 to-[#D4AF37]" />
    </div>
  );
}
