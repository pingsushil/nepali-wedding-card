import React from 'react';
import { motion } from 'framer-motion';

/**
 * Split Royal Mandala Medallion for the 3D double doors.
 * `side="left"` renders x=[0..150]; `side="right"` renders x=[150..300] so the two
 * halves unite seamlessly along the center seam when the doors are closed.
 */
export function DoorHalfMandala({ side = 'left', className = '' }) {
  const viewBox = side === 'left' ? '0 0 150 300' : '150 0 150 300';
  const petalAngles = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const innerAngles = Array.from({ length: 8 }, (_, i) => i * 45);

  return (
    <svg
      viewBox={viewBox}
      className={`select-none pointer-events-none ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`mandalaGlow-${side}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F7E7CE" stopOpacity="0.28" />
          <stop offset="55%" stopColor="#D4AF37" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`goldStroke-${side}`} x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F7E7CE" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#A67C1E" />
        </linearGradient>
      </defs>

      {/* Ambient radial gold aura */}
      <circle cx="150" cy="150" r="144" fill={`url(#mandalaGlow-${side})`} />

      {/* Outer scalloped filigree rings */}
      <circle
        cx="150"
        cy="150"
        r="138"
        stroke={`url(#goldStroke-${side})`}
        strokeWidth="1.2"
        strokeDasharray="3 4"
        strokeOpacity="0.82"
      />
      <circle
        cx="150"
        cy="150"
        r="128"
        stroke={`url(#goldStroke-${side})`}
        strokeWidth="1.8"
        strokeOpacity="0.92"
      />
      <circle
        cx="150"
        cy="150"
        r="121"
        stroke="#F7E7CE"
        strokeWidth="0.7"
        strokeOpacity="0.55"
      />

      {/* 16 Outer Royal Lotus Petals */}
      <g stroke={`url(#goldStroke-${side})`} strokeWidth="1.15">
        {petalAngles.map((deg) => (
          <g key={deg} transform={`rotate(${deg} 150 150)`}>
            <path
              d="M150 26 C158 46 164 62 150 78 C136 62 142 46 150 26 Z"
              fill="#6B0F1A"
              fillOpacity="0.62"
            />
            <path
              d="M150 38 C154 50 156 59 150 70 C144 59 146 50 150 38 Z"
              fill="#D4AF37"
              fillOpacity="0.24"
              strokeOpacity="0.7"
            />
            <circle cx="150" cy="19" r="2.2" fill="#F7E7CE" fillOpacity="0.88" stroke="none" />
          </g>
        ))}
      </g>

      {/* Mid geometric star ring */}
      <circle
        cx="150"
        cy="150"
        r="86"
        stroke={`url(#goldStroke-${side})`}
        strokeWidth="1.4"
        fill="#3D0814"
        fillOpacity="0.72"
      />
      <circle
        cx="150"
        cy="150"
        r="78"
        stroke="#F7E7CE"
        strokeWidth="0.8"
        strokeDasharray="2 3"
        strokeOpacity="0.72"
      />

      {/* 8 Inner Filigree Arches */}
      <g stroke="#F7E7CE" strokeWidth="1">
        {innerAngles.map((deg) => (
          <g key={deg} transform={`rotate(${deg} 150 150)`}>
            <path
              d="M150 68 Q166 94 150 116 Q134 94 150 68 Z"
              fill="#D4AF37"
              fillOpacity="0.16"
            />
            <circle cx="150" cy="83" r="2" fill="#D4AF37" stroke="none" />
          </g>
        ))}
      </g>

      {/* Center medallion cradle behind the wax seal */}
      <circle
        cx="150"
        cy="150"
        r="52"
        stroke={`url(#goldStroke-${side})`}
        strokeWidth="1.8"
        fill="#4A0A16"
        fillOpacity="0.88"
      />
      <circle
        cx="150"
        cy="150"
        r="44"
        stroke="#F7E7CE"
        strokeWidth="0.9"
        strokeOpacity="0.65"
      />
    </svg>
  );
}

/**
 * Self-drawing Sacred Nepali Kalash & Mandala Ornament for the Hero section.
 * Animates `pathLength` from 0 to 1 once the doors reveal the invitation.
 */
export function HeroKalashMandala({ animateIn = true, reducedMotion = false }) {
  const drawTransition = (delay = 0, duration = 1.45) =>
    reducedMotion
      ? { duration: 0.01 }
      : {
          pathLength: { delay, duration, ease: [0.22, 1, 0.36, 1] },
          opacity: { delay, duration: 0.35 },
        };

  const initialState = reducedMotion
    ? { pathLength: 1, opacity: 1 }
    : { pathLength: 0, opacity: 0 };

  const targetState = animateIn
    ? { pathLength: 1, opacity: 1 }
    : initialState;

  return (
    <div className="relative flex items-center justify-center w-36 h-36 mx-auto select-none">
      {/* Subtle radiant halo behind Kalash */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={animateIn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: reducedMotion ? 0.01 : 1.1, delay: reducedMotion ? 0 : 0.25 }}
        className="absolute inset-2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.26)_0%,rgba(212,175,55,0.06)_52%,transparent_75%)]"
      />

      <svg
        viewBox="0 0 180 180"
        className="relative w-full h-full overflow-visible"
        fill="none"
        role="img"
        aria-label="Sacred Nepali Wedding Kalash Ornament"
      >
        <defs>
          <linearGradient id="kalashGold" x1="20" y1="15" x2="160" y2="165" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F7E7CE" />
            <stop offset="48%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#A67C1E" />
          </linearGradient>
        </defs>

        {/* Outer Ornamental Mandala Halo */}
        <motion.circle
          cx="90"
          cy="90"
          r="78"
          stroke="url(#kalashGold)"
          strokeWidth="1.15"
          strokeDasharray="3 4"
          initial={initialState}
          animate={targetState}
          transition={drawTransition(0.05, 1.5)}
        />
        <motion.circle
          cx="90"
          cy="90"
          r="70"
          stroke="url(#kalashGold)"
          strokeWidth="1.4"
          initial={initialState}
          animate={targetState}
          transition={drawTransition(0.15, 1.4)}
        />

        {/* Delicate Crown Arch */}
        <motion.path
          d="M36 90 C36 52 60 28 90 22 C120 28 144 52 144 90"
          stroke="#F7E7CE"
          strokeWidth="0.9"
          strokeOpacity="0.65"
          initial={initialState}
          animate={targetState}
          transition={drawTransition(0.25, 1.25)}
        />

        {/* Mango Leaves (Aam ko Paat) fanning from Kalash neck */}
        <motion.path
          d="M90 66 C74 52 58 53 48 64 C60 66 74 68 86 73"
          stroke="url(#kalashGold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={initialState}
          animate={targetState}
          transition={drawTransition(0.35, 1.1)}
        />
        <motion.path
          d="M90 66 C106 52 122 53 132 64 C120 66 106 68 94 73"
          stroke="url(#kalashGold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={initialState}
          animate={targetState}
          transition={drawTransition(0.35, 1.1)}
        />
        <motion.path
          d="M84 65 C75 46 66 39 58 43 C63 53 72 62 82 69"
          stroke="#F7E7CE"
          strokeWidth="1.25"
          strokeLinecap="round"
          initial={initialState}
          animate={targetState}
          transition={drawTransition(0.42, 1.0)}
        />
        <motion.path
          d="M96 65 C105 46 114 39 122 43 C117 53 108 62 98 69"
          stroke="#F7E7CE"
          strokeWidth="1.25"
          strokeLinecap="round"
          initial={initialState}
          animate={targetState}
          transition={drawTransition(0.42, 1.0)}
        />

        {/* Sacred Coconut (Nariwal) crowning the Kalash */}
        <motion.path
          d="M78 65 C78 46 83 36 90 34 C97 36 102 46 102 65"
          stroke="url(#kalashGold)"
          strokeWidth="1.8"
          strokeLinecap="round"
          initial={initialState}
          animate={targetState}
          transition={drawTransition(0.48, 1.0)}
        />
        <motion.path
          d="M90 25 L90 34"
          stroke="#F7E7CE"
          strokeWidth="1.4"
          strokeLinecap="round"
          initial={initialState}
          animate={targetState}
          transition={drawTransition(0.65, 0.5)}
        />

        {/* Kalash Rim & Neck */}
        <motion.path
          d="M68 68 C74 64 106 64 112 68 C108 75 103 77 103 82 L77 82 C77 77 72 75 68 68 Z"
          stroke="url(#kalashGold)"
          strokeWidth="1.8"
          strokeLinejoin="round"
          initial={initialState}
          animate={targetState}
          transition={drawTransition(0.52, 1.0)}
        />

        {/* Kalash Sacred Body */}
        <motion.path
          d="M77 82 C54 90 50 116 64 134 C71 142 78 145 90 145 C102 145 109 142 116 134 C130 116 126 90 103 82"
          stroke="url(#kalashGold)"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={initialState}
          animate={targetState}
          transition={drawTransition(0.58, 1.25)}
        />

        {/* Kalash Ornamental Band & Pedestal Base */}
        <motion.path
          d="M60 102 Q90 112 120 102"
          stroke="#F7E7CE"
          strokeWidth="1.15"
          strokeOpacity="0.85"
          initial={initialState}
          animate={targetState}
          transition={drawTransition(0.75, 0.9)}
        />
        <motion.path
          d="M72 144 L66 154 L114 154 L108 144"
          stroke="url(#kalashGold)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={initialState}
          animate={targetState}
          transition={drawTransition(0.82, 0.8)}
        />

        {/* Auspicious Lotus Emblem on Kalash center */}
        <motion.path
          d="M90 113 L97 123 L90 133 L83 123 Z"
          stroke="#F7E7CE"
          strokeWidth="1.35"
          initial={initialState}
          animate={targetState}
          transition={drawTransition(0.92, 0.75)}
        />
        <motion.circle
          cx="90"
          cy="123"
          r="2.4"
          fill="#F7E7CE"
          initial={{ opacity: 0, scale: 0 }}
          animate={animateIn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ delay: reducedMotion ? 0 : 1.25, duration: 0.45 }}
        />

        {/* Accent Stars around Halo */}
        <motion.circle
          cx="90"
          cy="12"
          r="2.5"
          fill="#F7E7CE"
          initial={{ opacity: 0 }}
          animate={animateIn ? { opacity: 0.95 } : { opacity: 0 }}
          transition={{ delay: reducedMotion ? 0 : 1.15, duration: 0.4 }}
        />
        <motion.circle
          cx="18"
          cy="90"
          r="2"
          fill="#D4AF37"
          initial={{ opacity: 0 }}
          animate={animateIn ? { opacity: 0.85 } : { opacity: 0 }}
          transition={{ delay: reducedMotion ? 0 : 1.2, duration: 0.4 }}
        />
        <motion.circle
          cx="162"
          cy="90"
          r="2"
          fill="#D4AF37"
          initial={{ opacity: 0 }}
          animate={animateIn ? { opacity: 0.85 } : { opacity: 0 }}
          transition={{ delay: reducedMotion ? 0 : 1.2, duration: 0.4 }}
        />
      </svg>
    </div>
  );
}
