import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { weddingConfig } from '../data/weddingConfig';
import { DhakaBorder } from './DhakaBorder';
import { DoorHalfMandala } from './RoyalMandala';
import { triggerWaxSealBurst } from '../utils/confetti';

// Pre-seeded ambient gold dust specs for the closed entrance screen (zero runtime allocation)
const DOOR_DUST = [
  { id: 1, left: '10%', top: '22%', size: 3, dur: '6.8s', delay: '0s', dx: '12px' },
  { id: 2, left: '22%', top: '68%', size: 2.5, dur: '7.6s', delay: '1.1s', dx: '-10px' },
  { id: 3, left: '34%', top: '36%', size: 2, dur: '6.2s', delay: '2.2s', dx: '15px' },
  { id: 4, left: '48%', top: '18%', size: 3, dur: '8.1s', delay: '0.6s', dx: '-8px' },
  { id: 5, left: '62%', top: '76%', size: 2.5, dur: '7.2s', delay: '1.8s', dx: '11px' },
  { id: 6, left: '78%', top: '28%', size: 3.5, dur: '7.8s', delay: '0.4s', dx: '-14px' },
  { id: 7, left: '88%', top: '62%', size: 2, dur: '6.4s', delay: '2.5s', dx: '9px' },
  { id: 8, left: '16%', top: '82%', size: 2.5, dur: '7.5s', delay: '3.1s', dx: '14px' },
  { id: 9, left: '70%', top: '46%', size: 2, dur: '6.9s', delay: '1.5s', dx: '-11px' },
  { id: 10, left: '42%', top: '84%', size: 3, dur: '8.4s', delay: '2.9s', dx: '8px' },
  { id: 11, left: '84%', top: '16%', size: 2, dur: '6.6s', delay: '0.9s', dx: '-9px' },
  { id: 12, left: '28%', top: '14%', size: 2.5, dur: '7.9s', delay: '2.0s', dx: '10px' },
];

function DoorCornerFiligree({ flipX = false, flipY = false }) {
  const transform = `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`;
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      style={{ transform }}
      className="opacity-75 pointer-events-none select-none"
      aria-hidden="true"
    >
      <path
        d="M3 39 V9 C3 5.5 5.5 3 9 3 H39"
        stroke="#D4AF37"
        strokeWidth="1.4"
      />
      <path
        d="M9 33 V13 C9 10.8 10.8 9 13 9 H33"
        stroke="#F7E7CE"
        strokeWidth="0.75"
        strokeOpacity="0.65"
      />
      <path
        d="M9 9 C15 9 18 13 18 18 C13 18 9 15 9 9 Z"
        fill="#D4AF37"
        fillOpacity="0.35"
        stroke="#D4AF37"
        strokeWidth="0.9"
      />
      <circle cx="22" cy="9" r="1.4" fill="#F7E7CE" />
      <circle cx="9" cy="22" r="1.4" fill="#F7E7CE" />
    </svg>
  );
}

export function RoyalDoors({ guestName, onBeginOpen, onOpened, reducedMotion = false }) {
  // Phases: 'locked' -> 'seal-dissolving' -> 'doors-swinging'
  const [phase, setPhase] = useState('locked');
  const sealButtonRef = useRef(null);

  const handleOpenTap = () => {
    if (phase !== 'locked') return;

    // Fire golden sparkle burst from the exact wax seal position
    let origin = { x: 0.5, y: 0.54 };
    if (sealButtonRef.current) {
      const rect = sealButtonRef.current.getBoundingClientRect();
      origin = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      };
    }
    triggerWaxSealBurst(origin);

    // Invoke audio autoplay synchronously inside the user tap gesture
    onBeginOpen?.();

    if (reducedMotion) {
      setPhase('doors-swinging');
      window.setTimeout(() => {
        onOpened?.();
      }, 420);
      return;
    }

    // Step 1: Dissolve wax seal with scale + blur
    setPhase('seal-dissolving');

    // Step 2: Swing the 3D double doors outward
    window.setTimeout(() => {
      setPhase('doors-swinging');
    }, 340);

    // Step 3: Unlock scroll & unmount door overlay once swing completes
    window.setTimeout(() => {
      onOpened?.();
    }, 1680);
  };

  const isDissolvingOrSwinging = phase !== 'locked';
  const isSwinging = phase === 'doors-swinging';

  return (
    <motion.div
      className="fixed inset-0 z-50 h-[100dvh] w-full overflow-hidden door-stage select-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: isSwinging && reducedMotion ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.38 }}
      role="dialog"
      aria-modal="true"
      aria-label="Royal Nepali Wedding Invitation Entrance"
    >
      {/* Golden radiant light blooming from behind the center seam as doors part */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isSwinging ? [0, 0.9, 0] : isDissolvingOrSwinging ? 0.35 : 0,
        }}
        transition={{ duration: 1.35, ease: 'easeOut' }}
        style={{
          background:
            'radial-gradient(ellipse 48% 68% at 50% 52%, rgba(247, 231, 206, 0.52) 0%, rgba(212, 175, 55, 0.28) 38%, transparent 72%)',
        }}
      />

      {/* ==================== LEFT ROYAL DOOR ==================== */}
      <motion.div
        className="door-panel-3d absolute inset-y-0 left-0 w-1/2 overflow-hidden"
        style={{
          transformOrigin: '0% 50%',
          background:
            'linear-gradient(110deg, #2C050E 0%, #4E0A16 42%, #6B0F1A 88%, #520B15 100%)',
          boxShadow: 'inset -10px 0 28px rgba(0,0,0,0.45)',
        }}
        initial={{ rotateY: 0 }}
        animate={{
          rotateY: isSwinging && !reducedMotion ? -105 : 0,
          opacity: isSwinging && reducedMotion ? 0 : 1,
        }}
        transition={{
          duration: reducedMotion ? 0.35 : 1.32,
          ease: [0.22, 0.88, 0.24, 1],
        }}
      >
        {/* Top & Bottom Nepali Dhaka trim */}
        <DhakaBorder height={14} opacity={0.85} className="absolute top-0 inset-x-0 z-10" />
        <DhakaBorder height={14} opacity={0.85} className="absolute bottom-0 inset-x-0 z-10" />

        {/* Carved recessed royal molding frame */}
        <div className="absolute inset-y-6 left-3 right-1.5 sm:inset-y-8 sm:left-5 sm:right-2 border border-[#D4AF37]/45 rounded-l-md pointer-events-none">
          <div className="absolute inset-2 border border-[#F7E7CE]/20 rounded-l-sm" />
          {/* Inner decorative upper & lower carved niches */}
          <div className="absolute top-10 inset-x-3 h-[22%] border border-[#D4AF37]/25 bg-gradient-to-b from-[#2A040C]/45 to-transparent rounded-sm" />
          <div className="absolute bottom-10 inset-x-3 h-[22%] border border-[#D4AF37]/25 bg-gradient-to-t from-[#2A040C]/45 to-transparent rounded-sm" />

          {/* Corner filigrees */}
          <div className="absolute top-1 left-1">
            <DoorCornerFiligree />
          </div>
          <div className="absolute bottom-1 left-1">
            <DoorCornerFiligree flipY />
          </div>
        </div>

        {/* Golden Center Seam Edge */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-[#9A761A] via-[#F7E7CE] to-[#9A761A] opacity-85"
        />

        {/* Split Left Half Mandala anchored flush to the center seam */}
        <div className="absolute top-[54%] right-0 -translate-y-1/2 w-[132px] h-[264px] sm:w-[152px] sm:h-[304px]">
          <DoorHalfMandala side="left" className="w-full h-full" />
        </div>
      </motion.div>

      {/* ==================== RIGHT ROYAL DOOR ==================== */}
      <motion.div
        className="door-panel-3d absolute inset-y-0 right-0 w-1/2 overflow-hidden"
        style={{
          transformOrigin: '100% 50%',
          background:
            'linear-gradient(250deg, #2C050E 0%, #4E0A16 42%, #6B0F1A 88%, #520B15 100%)',
          boxShadow: 'inset 10px 0 28px rgba(0,0,0,0.45)',
        }}
        initial={{ rotateY: 0 }}
        animate={{
          rotateY: isSwinging && !reducedMotion ? 105 : 0,
          opacity: isSwinging && reducedMotion ? 0 : 1,
        }}
        transition={{
          duration: reducedMotion ? 0.35 : 1.32,
          ease: [0.22, 0.88, 0.24, 1],
        }}
      >
        {/* Top & Bottom Nepali Dhaka trim */}
        <DhakaBorder height={14} opacity={0.85} className="absolute top-0 inset-x-0 z-10" />
        <DhakaBorder height={14} opacity={0.85} className="absolute bottom-0 inset-x-0 z-10" />

        {/* Carved recessed royal molding frame */}
        <div className="absolute inset-y-6 right-3 left-1.5 sm:inset-y-8 sm:right-5 sm:left-2 border border-[#D4AF37]/45 rounded-r-md pointer-events-none">
          <div className="absolute inset-2 border border-[#F7E7CE]/20 rounded-r-sm" />
          {/* Inner decorative upper & lower carved niches */}
          <div className="absolute top-10 inset-x-3 h-[22%] border border-[#D4AF37]/25 bg-gradient-to-b from-[#2A040C]/45 to-transparent rounded-sm" />
          <div className="absolute bottom-10 inset-x-3 h-[22%] border border-[#D4AF37]/25 bg-gradient-to-t from-[#2A040C]/45 to-transparent rounded-sm" />

          {/* Corner filigrees */}
          <div className="absolute top-1 right-1">
            <DoorCornerFiligree flipX />
          </div>
          <div className="absolute bottom-1 right-1">
            <DoorCornerFiligree flipX flipY />
          </div>
        </div>

        {/* Golden Center Seam Edge */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-[#9A761A] via-[#F7E7CE] to-[#9A761A] opacity-85"
        />

        {/* Split Right Half Mandala anchored flush to the center seam */}
        <div className="absolute top-[54%] left-0 -translate-y-1/2 w-[132px] h-[264px] sm:w-[152px] sm:h-[304px]">
          <DoorHalfMandala side="right" className="w-full h-full" />
        </div>
      </motion.div>

      {/* Soft ambient vignette & floating golden dust across closed doors */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: isSwinging ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute inset-0 royal-vignette" />
        {!reducedMotion &&
          DOOR_DUST.map((p) => (
            <span
              key={p.id}
              className="door-dust-particle absolute rounded-full"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background:
                  'radial-gradient(circle, #FFF4D4 0%, #D4AF37 60%, transparent 100%)',
                boxShadow: '0 0 8px rgba(212, 175, 55, 0.75)',
                '--dur': p.dur,
                '--delay': p.delay,
                '--dx': p.dx,
              }}
            />
          ))}
      </motion.div>

      {/* ==================== TOP GLOWING GOLDEN CREST PLAQUE ==================== */}
      <motion.div
        className="absolute top-[9%] sm:top-[10%] inset-x-0 z-20 flex flex-col items-center px-5 text-center pointer-events-none"
        initial={{ opacity: 0, y: -16 }}
        animate={
          isDissolvingOrSwinging
            ? { opacity: 0, y: -22, scale: 0.96 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="text-[#F7E7CE]/90 text-xs tracking-[0.26em] uppercase mb-2"
          style={{ fontFamily: 'var(--font-nepali)' }}
        >
          {weddingConfig.ceremonyHeader.nepaliTitle} • {weddingConfig.couple.coupleNames || `${weddingConfig.couple.groomFirst} & ${weddingConfig.couple.brideFirst}`}
        </p>

        {/* Illuminated Golden Crest Plaque */}
        <div
          className="metallic-sheen relative w-full max-w-[336px] rounded-2xl px-5 py-4 border border-[#D4AF37]/70"
          style={{
            background:
              'linear-gradient(155deg, rgba(61, 8, 20, 0.92) 0%, rgba(107, 15, 26, 0.86) 52%, rgba(45, 5, 14, 0.95) 100%)',
            boxShadow:
              '0 14px 40px rgba(0, 0, 0, 0.55), 0 0 28px rgba(212, 175, 55, 0.24), inset 0 1px 0 rgba(247, 231, 206, 0.35)',
          }}
        >
          {/* Decorative inner hairline */}
          <div className="absolute inset-1.5 rounded-xl border border-[#F7E7CE]/20 pointer-events-none" />

          <span
            className="block text-[13px] text-[#F3D98B] mb-0.5 tracking-wide"
            style={{ fontFamily: 'var(--font-nepali)' }}
          >
            {weddingConfig.entrance.nepaliGreeting}
          </span>

          <h1
            className="text-gold-foil text-[22px] sm:text-[26px] font-semibold leading-snug tracking-wide break-words"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {weddingConfig.entrance.salutationPrefix} {guestName}
          </h1>

          <div className="my-2 mx-auto w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent" />

          <p className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#F7E7CE]/90 font-medium">
            {weddingConfig.entrance.salutationSuffix}
          </p>
        </div>
      </motion.div>

      {/* ==================== CENTERPIECE 3D EMBOSSED GOLDEN WAX SEAL ==================== */}
      <div className="absolute top-[54%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={
            isDissolvingOrSwinging
              ? {
                  opacity: 0,
                  scale: 1.38,
                  filter: 'blur(12px)',
                }
              : {
                  opacity: 1,
                  scale: 1,
                  filter: 'blur(0px)',
                }
          }
          transition={{ duration: reducedMotion ? 0.2 : 0.42, ease: [0.32, 0, 0.67, 0] }}
          className="relative flex flex-col items-center"
        >
          {/* Breathing shimmer ring */}
          <span
            aria-hidden="true"
            className="seal-pulse-ring absolute -inset-3 rounded-full border-2 border-[#F3D98B]/70 pointer-events-none"
          />
          <span
            aria-hidden="true"
            className="absolute -inset-6 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(212,175,55,0.34) 0%, rgba(212,175,55,0.08) 55%, transparent 72%)',
            }}
          />

          <button
            ref={sealButtonRef}
            type="button"
            onClick={handleOpenTap}
            disabled={isDissolvingOrSwinging}
            data-testid="open-invitation-seal"
            className="seal-breath metallic-sheen group relative w-[124px] h-[124px] sm:w-[136px] sm:h-[136px] rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7E7CE] focus-visible:ring-offset-4 focus-visible:ring-offset-[#3D0814] active:scale-95 transition-transform"
            style={{
              background:
                'radial-gradient(circle at 32% 28%, #FFF3CC 0%, #E7C45A 28%, #C69823 64%, #8E6710 92%, #6E4E0A 100%)',
              boxShadow:
                '0 14px 34px rgba(0, 0, 0, 0.65), 0 0 26px rgba(212, 175, 55, 0.52), inset 0 3px 6px rgba(255, 248, 220, 0.72), inset 0 -5px 10px rgba(72, 46, 5, 0.68)',
            }}
          >
            {/* Outer embossed wax ridge */}
            <span
              aria-hidden="true"
              className="absolute inset-[7px] rounded-full border-[1.5px] border-[#5E3E07]/45 shadow-[inset_0_1px_3px_rgba(255,248,225,0.65)] pointer-events-none"
            />
            {/* Inner debossed gold ring */}
            <span
              aria-hidden="true"
              className="absolute inset-[13px] rounded-full border border-[#FFF4D4]/55 pointer-events-none"
            />

            {/* Seal embossed content */}
            <span className="relative z-10 flex flex-col items-center justify-center px-2 text-center">
              <span
                className="text-[24px] sm:text-[26px] font-bold leading-none tracking-wider text-[#3D0814] drop-shadow-[0_1px_0_rgba(255,244,210,0.75)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {weddingConfig.couple.monogram}
              </span>
              <span className="my-1 w-9 h-[1px] bg-[#3D0814]/45" />
              <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-[#3D0814] leading-tight">
                {weddingConfig.entrance.sealCtaPrimary}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#4E0E18] leading-tight mt-0.5">
                {weddingConfig.entrance.sealCtaSecondary}
              </span>
            </span>
          </button>
        </motion.div>

        {/* Subtle tactile caption below the seal */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={
            isDissolvingOrSwinging
              ? { opacity: 0, y: 12 }
              : { opacity: 0.9, y: 0 }
          }
          transition={{ duration: 0.45, delay: isDissolvingOrSwinging ? 0 : 0.35 }}
          className="mt-5 whitespace-nowrap text-center px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#2A040C]/80 text-[10.5px] uppercase tracking-[0.22em] text-[#F7E7CE] backdrop-blur-xs pointer-events-none shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
        >
          Tap Wax Seal to Enter
        </motion.p>
      </div>

      {/* Bottom auspicious date stamp on the locked screen */}
      <motion.div
        className="absolute bottom-7 inset-x-0 z-20 flex justify-center px-4 pointer-events-none"
        animate={{ opacity: isDissolvingOrSwinging ? 0 : 0.85 }}
        transition={{ duration: 0.35 }}
      >
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#F7E7CE]/80 text-center">
          {weddingConfig.weddingDate.bsFull} • {weddingConfig.couple.city}
        </p>
      </motion.div>
    </motion.div>
  );
}
