import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarHeart, ChevronDown, Sparkles } from 'lucide-react';
import { weddingConfig } from '../data/weddingConfig';
import { DhakaBorder, RoyalDivider } from './DhakaBorder';
import { HeroKalashMandala } from './RoyalMandala';

function getTimeRemaining(targetIso) {
  const targetMs = new Date(targetIso).getTime();
  const diff = Math.max(0, targetMs - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    isPast: diff === 0,
  };
}

function FlipDigitCell({ value, label, reducedMotion }) {
  return (
    <div
      className="relative flex flex-col items-center justify-center rounded-2xl border border-[#D4AF37]/45 px-2 py-3 overflow-hidden"
      style={{
        background:
          'linear-gradient(165deg, rgba(107, 15, 26, 0.56) 0%, rgba(45, 5, 14, 0.88) 100%)',
        boxShadow:
          'inset 0 1px 0 rgba(247, 231, 206, 0.22), 0 8px 20px rgba(0, 0, 0, 0.32)',
      }}
    >
      {/* Subtle split flip-clock seam */}
      <div
        aria-hidden="true"
        className="absolute inset-x-2 top-[46%] h-[1px] bg-[#D4AF37]/15 pointer-events-none"
      />

      <div className="relative h-9 sm:h-10 w-full flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={
              reducedMotion
                ? { opacity: 0.9 }
                : { y: -16, opacity: 0, scale: 0.92 }
            }
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { y: 16, opacity: 0, scale: 0.92 }
            }
            transition={{
              duration: reducedMotion ? 0.01 : 0.34,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-gold-foil text-[28px] sm:text-[32px] font-semibold leading-none tabular-nums"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>

      <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#F7E7CE]/75 font-medium">
        {label}
      </span>
    </div>
  );
}

export function HeroSection({ guestName, isRevealed = false, reducedMotion = false }) {
  const [countdown, setCountdown] = useState(() =>
    getTimeRemaining(weddingConfig.weddingDate.isoTarget)
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setCountdown(getTimeRemaining(weddingConfig.weddingDate.isoTarget));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const springItem = (delay = 0) => ({
    initial: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    animate: isRevealed
      ? { opacity: 1, y: 0 }
      : reducedMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 24 },
    transition: reducedMotion
      ? { duration: 0.01 }
      : {
          type: 'spring',
          stiffness: 120,
          damping: 20,
          delay,
        },
  });

  return (
    <section
      id="invitation-hero"
      className="relative z-20 w-full overflow-hidden pb-12"
    >
      {/* Top Royal Dhaka Ribbon */}
      <DhakaBorder height={16} opacity={0.85} />

      <div className="mx-auto w-full max-w-lg px-5 pt-9 text-center">
        {/* Auspicious Mantra */}
        <motion.p
          {...springItem(0.05)}
          className="text-xs tracking-[0.16em] text-[#F3D98B]/90 mb-3"
          style={{ fontFamily: 'var(--font-nepali)' }}
        >
          {weddingConfig.ceremonyHeader.mantra}
        </motion.p>

        {/* Self-drawing Sacred Kalash & Mandala SVG */}
        <HeroKalashMandala animateIn={isRevealed} reducedMotion={reducedMotion} />

        {/* Gleaming Devanagari शुभ विवाह Header */}
        <motion.div {...springItem(0.2)} className="mt-3">
          <h1
            className="text-gold-foil text-[40px] sm:text-[46px] font-bold leading-tight tracking-wide"
            style={{ fontFamily: 'var(--font-nepali)' }}
          >
            {weddingConfig.ceremonyHeader.nepaliTitle}
          </h1>
          <p className="mt-1 text-[11px] uppercase tracking-[0.26em] text-[#F7E7CE]/80">
            {weddingConfig.ceremonyHeader.englishEyebrow}
          </p>
        </motion.div>

        {/* Personalized Guest Welcome Pill */}
        <motion.div {...springItem(0.32)} className="mt-5 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/45 bg-[#2A040C]/70 px-4 py-1.5 backdrop-blur-xs shadow-[0_6px_20px_rgba(0,0,0,0.28)]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="text-xs text-[#F7E7CE] tracking-wide">
              Honoring <strong className="font-semibold text-[#FFF4D4]">{guestName}</strong>
            </span>
          </div>
        </motion.div>

        {/* Formal Invitation Verse */}
        <motion.p
          {...springItem(0.4)}
          className="mt-5 text-[13.5px] leading-relaxed text-[#FDF8F0]/85 max-w-md mx-auto"
        >
          {weddingConfig.families.formalInvitationLine}
        </motion.p>

        {/* Staggered Family Lineage Cards (Groom Side & Bride Side) */}
        <div className="mt-6 grid grid-cols-1 gap-3.5 text-center">
          {/* Groom's Family */}
          <motion.div
            {...springItem(0.5)}
            className="relative rounded-2xl border border-[#D4AF37]/35 px-5 py-4 backdrop-blur-xs"
            style={{
              background:
                'linear-gradient(155deg, rgba(107, 15, 26, 0.44) 0%, rgba(44, 5, 14, 0.72) 100%)',
            }}
          >
            <span className="inline-block rounded-full border border-[#D4AF37]/40 bg-[#3D0814]/80 px-3 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[#F3D98B]">
              {weddingConfig.families.groomSide.badge} •{' '}
              <span style={{ fontFamily: 'var(--font-nepali)' }}>
                {weddingConfig.families.groomSide.nepaliBadge}
              </span>
            </span>
            <p className="mt-2.5 text-[11px] uppercase tracking-[0.18em] text-[#F7E7CE]/70">
              {weddingConfig.families.groomSide.parentsLabel}
            </p>
            <p
              className="mt-1 text-[19px] sm:text-[21px] font-semibold text-[#FDF8F0] leading-snug"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {weddingConfig.families.groomSide.parents}
            </p>
            <p className="mt-1 text-xs text-[#F7E7CE]/75 leading-relaxed">
              {weddingConfig.families.groomSide.grandparents}
            </p>
            <p className="mt-1 text-[11px] text-[#D4AF37]/90 tracking-wider uppercase">
              {weddingConfig.families.groomSide.residence}
            </p>
          </motion.div>

          {/* Bride's Family */}
          <motion.div
            {...springItem(0.62)}
            className="relative rounded-2xl border border-[#D4AF37]/35 px-5 py-4 backdrop-blur-xs"
            style={{
              background:
                'linear-gradient(155deg, rgba(107, 15, 26, 0.44) 0%, rgba(44, 5, 14, 0.72) 100%)',
            }}
          >
            <span className="inline-block rounded-full border border-[#D4AF37]/40 bg-[#3D0814]/80 px-3 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[#F3D98B]">
              {weddingConfig.families.brideSide.badge} •{' '}
              <span style={{ fontFamily: 'var(--font-nepali)' }}>
                {weddingConfig.families.brideSide.nepaliBadge}
              </span>
            </span>
            <p className="mt-2.5 text-[11px] uppercase tracking-[0.18em] text-[#F7E7CE]/70">
              {weddingConfig.families.brideSide.parentsLabel}
            </p>
            <p
              className="mt-1 text-[19px] sm:text-[21px] font-semibold text-[#FDF8F0] leading-snug"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {weddingConfig.families.brideSide.parents}
            </p>
            <p className="mt-1 text-xs text-[#F7E7CE]/75 leading-relaxed">
              {weddingConfig.families.brideSide.grandparents}
            </p>
            <p className="mt-1 text-[11px] text-[#D4AF37]/90 tracking-wider uppercase">
              {weddingConfig.families.brideSide.residence}
            </p>
          </motion.div>
        </div>

        {/* Couple's Grand Names with Animated Gold-Foil Sheen */}
        <motion.div {...springItem(0.75)} className="mt-9 mb-6">
          <RoyalDivider className="mb-6" />

          <h2
            className="text-gold-foil text-[48px] sm:text-[56px] font-semibold leading-[1.04] tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {weddingConfig.couple.groomFirst}
          </h2>

          <div className="my-1.5 flex items-center justify-center gap-3">
            <span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[#D4AF37]/75" />
            <span
              className="italic text-2xl text-[#F7E7CE]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              &amp;
            </span>
            <span className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[#D4AF37]/75" />
          </div>

          <h2
            className="text-gold-foil text-[48px] sm:text-[56px] font-semibold leading-[1.04] tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {weddingConfig.couple.brideFirst}
          </h2>

          <p
            className="mt-3 text-xs tracking-wider text-[#F7E7CE]/80"
            style={{ fontFamily: 'var(--font-nepali)' }}
          >
            {weddingConfig.couple.groomNepali} &nbsp;✦&nbsp; {weddingConfig.couple.brideNepali}
          </p>

          {/* Auspicious Date Highlight Strip */}
          <div className="mt-5 inline-flex flex-col items-center rounded-2xl border border-[#D4AF37]/40 bg-[#2A040C]/65 px-5 py-3 backdrop-blur-xs">
            <div className="flex items-center gap-2 text-[#F3D98B] text-xs font-medium tracking-[0.16em] uppercase">
              <CalendarHeart className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{weddingConfig.weddingDate.bsFull}</span>
            </div>
            <p className="mt-1 text-xs text-[#FDF8F0]/85 tracking-wide">
              {weddingConfig.weddingDate.adFull} • {weddingConfig.couple.city}
            </p>
          </div>
        </motion.div>

        {/* Live Animated Wedding Countdown Timer */}
        <motion.div {...springItem(0.88)} className="mt-7">
          <p className="text-[10.5px] uppercase tracking-[0.26em] text-[#F3D98B]/90 mb-3">
            {countdown.isPast ? 'The Celebrations Have Begun' : 'Counting Down to Shubha Biwaha'}
          </p>
          <div
            className="grid grid-cols-4 gap-2.5 max-w-[360px] mx-auto"
            aria-label="Wedding countdown timer"
          >
            <FlipDigitCell value={countdown.days} label="Days" reducedMotion={reducedMotion} />
            <FlipDigitCell value={countdown.hours} label="Hours" reducedMotion={reducedMotion} />
            <FlipDigitCell value={countdown.minutes} label="Mins" reducedMotion={reducedMotion} />
            <FlipDigitCell value={countdown.seconds} label="Secs" reducedMotion={reducedMotion} />
          </div>
        </motion.div>

        {/* Scroll Prompt */}
        <motion.a
          href="#wedding-events"
          {...springItem(1.0)}
          className="mt-9 inline-flex flex-col items-center gap-1 text-[#F7E7CE]/75 hover:text-[#F3D98B] transition-colors"
        >
          <span className="text-[10px] uppercase tracking-[0.24em]">
            Explore Ceremonies
          </span>
          <motion.span
            animate={reducedMotion ? {} : { y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2.1, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-4 h-4 text-[#D4AF37]" />
          </motion.span>
        </motion.a>
      </div>
    </section>
  );
}
