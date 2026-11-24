import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarHeart, ChevronDown, Sparkles } from 'lucide-react';
import { weddingConfig } from '../data/weddingConfig';
import { translations, localizeDigits } from '../data/translations';
import { DhakaBorder, RoyalDivider } from './DhakaBorder';
import { HeroKalashMandala } from './RoyalMandala';
import { CouplePortraits } from './CouplePortraits';

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

function FlipDigitCell({ value, label, lang, reducedMotion }) {
  const displayVal = localizeDigits(value, lang);
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
            key={displayVal}
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
            className="text-gold-foil text-[26px] sm:text-[31px] font-semibold leading-none tabular-nums"
            style={{
              fontFamily:
                lang === 'ne' ? 'var(--font-nepali)' : 'var(--font-display)',
            }}
          >
            {displayVal}
          </motion.span>
        </AnimatePresence>
      </div>

      <span
        className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#F7E7CE]/75 font-medium"
        style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
      >
        {label}
      </span>
    </div>
  );
}

export function HeroSection({
  guestName,
  isPersonalized = false,
  lang = 'en',
  isRevealed = false,
  reducedMotion = false,
}) {
  const [countdown, setCountdown] = useState(() =>
    getTimeRemaining(weddingConfig.weddingDate.isoTarget)
  );

  const t = translations[lang]?.hero || translations.en.hero;
  const doorsT = translations[lang]?.doors || translations.en.doors;
  const displayGuest = isPersonalized ? guestName : doorsT.defaultGuest;

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

      <div className="mx-auto w-full max-w-lg px-5 pt-13 text-center">
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
          <p
            className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#F7E7CE]/80"
            style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
          >
            {t.eyebrow}
          </p>
        </motion.div>

        {/* Personalized Guest Welcome Pill */}
        <motion.div {...springItem(0.32)} className="mt-5 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/45 bg-[#2A040C]/70 px-4 py-1.5 backdrop-blur-xs shadow-[0_6px_20px_rgba(0,0,0,0.28)]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span
              className="text-xs text-[#F7E7CE] tracking-wide"
              style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
            >
              {t.honoringPrefix}{' '}
              <strong className="font-semibold text-[#FFF4D4]">{displayGuest}</strong>
            </span>
          </div>
        </motion.div>

        {/* Formal Invitation Verse */}
        <motion.p
          {...springItem(0.4)}
          className="mt-5 text-[13.5px] leading-relaxed text-[#FDF8F0]/85 max-w-md mx-auto"
          style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
        >
          {t.formalLine}
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
            <span
              className="inline-block rounded-full border border-[#D4AF37]/40 bg-[#3D0814]/80 px-3 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[#F3D98B]"
              style={{ fontFamily: 'var(--font-nepali)' }}
            >
              {t.groomBadge}
            </span>
            <p
              className="mt-2.5 text-[11px] uppercase tracking-[0.16em] text-[#F7E7CE]/70"
              style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
            >
              {t.groomParentsLabel}
            </p>
            <p
              className="mt-1 text-[18px] sm:text-[20px] font-semibold text-[#FDF8F0] leading-snug"
              style={{
                fontFamily:
                  lang === 'ne' ? 'var(--font-nepali)' : 'var(--font-display)',
              }}
            >
              {t.groomParents}
            </p>
            <p
              className="mt-1 text-xs text-[#F7E7CE]/75 leading-relaxed"
              style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
            >
              {t.groomGrandparents}
            </p>
            <p
              className="mt-1 text-[11px] text-[#D4AF37]/90 tracking-wider uppercase"
              style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
            >
              {t.groomResidence}
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
            <span
              className="inline-block rounded-full border border-[#D4AF37]/40 bg-[#3D0814]/80 px-3 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[#F3D98B]"
              style={{ fontFamily: 'var(--font-nepali)' }}
            >
              {t.brideBadge}
            </span>
            <p
              className="mt-2.5 text-[11px] uppercase tracking-[0.16em] text-[#F7E7CE]/70"
              style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
            >
              {t.brideParentsLabel}
            </p>
            <p
              className="mt-1 text-[18px] sm:text-[20px] font-semibold text-[#FDF8F0] leading-snug"
              style={{
                fontFamily:
                  lang === 'ne' ? 'var(--font-nepali)' : 'var(--font-display)',
              }}
            >
              {t.brideParents}
            </p>
            <p
              className="mt-1 text-xs text-[#F7E7CE]/75 leading-relaxed"
              style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
            >
              {t.brideGrandparents}
            </p>
            <p
              className="mt-1 text-[11px] text-[#D4AF37]/90 tracking-wider uppercase"
              style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
            >
              {t.brideResidence}
            </p>
          </motion.div>
        </div>

        {/* Couple's Grand Names with Animated Gold-Foil Sheen */}
        <motion.div {...springItem(0.75)} className="mt-9 mb-6">
          <RoyalDivider className="mb-6" />

          <h2
            className="text-gold-foil text-[46px] sm:text-[56px] font-semibold leading-[1.08] tracking-tight"
            style={{
              fontFamily:
                lang === 'ne' ? 'var(--font-nepali)' : 'var(--font-display)',
            }}
          >
            {t.coupleGroomFirst}
          </h2>

          <div className="my-1.5 flex items-center justify-center gap-3">
            <span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[#D4AF37]/75" />
            <span
              className="italic text-2xl text-[#F7E7CE]"
              style={{
                fontFamily:
                  lang === 'ne' ? 'var(--font-nepali)' : 'var(--font-display)',
              }}
            >
              {lang === 'ne' ? 'र' : '&'}
            </span>
            <span className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[#D4AF37]/75" />
          </div>

          <h2
            className="text-gold-foil text-[46px] sm:text-[56px] font-semibold leading-[1.08] tracking-tight"
            style={{
              fontFamily:
                lang === 'ne' ? 'var(--font-nepali)' : 'var(--font-display)',
            }}
          >
            {t.coupleBrideFirst}
          </h2>

          <p
            className="mt-3 text-xs tracking-wider text-[#F7E7CE]/80"
            style={{ fontFamily: 'var(--font-nepali)' }}
          >
            {lang === 'ne'
              ? `${weddingConfig.couple.groomFull}  ✦  ${weddingConfig.couple.brideFull}`
              : `${weddingConfig.couple.groomNepali}  ✦  ${weddingConfig.couple.brideNepali}`}
          </p>

          {/* Groom & Bride Royal Arched Sample Portraits */}
          <CouplePortraits lang={lang} reducedMotion={reducedMotion} />

          {/* Auspicious Date Highlight Strip */}
          <div className="mt-6 inline-flex flex-col items-center rounded-2xl border border-[#D4AF37]/40 bg-[#2A040C]/65 px-5 py-3 backdrop-blur-xs">
            <div
              className="flex items-center gap-2 text-[#F3D98B] text-xs font-medium tracking-[0.14em] uppercase"
              style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
            >
              <CalendarHeart className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.dateBs}</span>
            </div>
            <p
              className="mt-1 text-xs text-[#FDF8F0]/85 tracking-wide"
              style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
            >
              {t.dateAdCity}
            </p>
          </div>
        </motion.div>

        {/* Live Animated Wedding Countdown Timer */}
        <motion.div {...springItem(0.88)} className="mt-7">
          <p
            className="text-[10.5px] uppercase tracking-[0.22em] text-[#F3D98B]/90 mb-3"
            style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
          >
            {countdown.isPast ? t.countdownPast : t.countdownHeading}
          </p>
          <div
            className="grid grid-cols-4 gap-2.5 max-w-[360px] mx-auto"
            aria-label="Wedding countdown timer"
          >
            <FlipDigitCell value={countdown.days} label={t.days} lang={lang} reducedMotion={reducedMotion} />
            <FlipDigitCell value={countdown.hours} label={t.hours} lang={lang} reducedMotion={reducedMotion} />
            <FlipDigitCell value={countdown.minutes} label={t.mins} lang={lang} reducedMotion={reducedMotion} />
            <FlipDigitCell value={countdown.seconds} label={t.secs} lang={lang} reducedMotion={reducedMotion} />
          </div>
        </motion.div>

        {/* Scroll Prompt */}
        <motion.a
          href="#wedding-events"
          {...springItem(1.0)}
          className="mt-9 inline-flex flex-col items-center gap-1 text-[#F7E7CE]/75 hover:text-[#F3D98B] transition-colors"
        >
          <span
            className="text-[10px] uppercase tracking-[0.2em]"
            style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
          >
            {t.exploreCta}
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
