import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { weddingConfig } from '../data/weddingConfig';
import { translations } from '../data/translations';

function resolvePublicAsset(pathStr) {
  if (!pathStr) return '';
  if (pathStr.startsWith('http')) return pathStr;
  return `${import.meta.env.BASE_URL}${pathStr.replace(/^\//, '')}`;
}

function PortraitCard({
  photoSrc,
  altText,
  roleLabel,
  name,
  bio,
  delay = 0,
  reducedMotion = false,
  lang = 'en',
}) {
  return (
    <motion.figure
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={
        reducedMotion
          ? { duration: 0.01 }
          : { type: 'spring', stiffness: 120, damping: 20, delay }
      }
      className="relative flex flex-col items-center rounded-2xl border border-[#D4AF37]/40 p-2.5 sm:p-3 backdrop-blur-xs overflow-hidden"
      style={{
        background:
          'linear-gradient(165deg, rgba(107, 15, 26, 0.48) 0%, rgba(36, 4, 11, 0.88) 100%)',
        boxShadow:
          '0 14px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(247, 231, 206, 0.2)',
      }}
    >
      {/* Royal Arched Metallic Gold Portrait Frame */}
      <div className="relative w-full aspect-[3/4] rounded-t-[999px] rounded-b-xl p-[2.5px] bg-gradient-to-b from-[#FFF4D4] via-[#D4AF37] to-[#7A5910] shadow-[0_8px_22px_rgba(0,0,0,0.45)]">
        <div className="relative w-full h-full overflow-hidden rounded-t-[999px] rounded-b-[10px] bg-[#24040B]">
          <img
            src={photoSrc}
            alt={altText}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
          />
          {/* Soft warm velvet vignette at bottom of portrait */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#2B050D]/90 via-[#2B050D]/30 to-transparent pointer-events-none"
          />
          {/* Inner subtle gold arch hairline */}
          <div
            aria-hidden="true"
            className="absolute inset-1.5 rounded-t-[999px] rounded-b-[7px] border border-[#F7E7CE]/30 pointer-events-none"
          />
        </div>
      </div>

      {/* Bilingual Caption */}
      <figcaption className="mt-3 text-center px-1 pb-0.5">
        <span
          className="inline-block rounded-full border border-[#D4AF37]/40 bg-[#2A040C]/85 px-2.5 py-0.5 text-[9.5px] uppercase tracking-[0.14em] text-[#F3D98B]"
          style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
        >
          {roleLabel}
        </span>

        <h3
          className="mt-1.5 text-[21px] sm:text-[23px] font-semibold leading-tight text-[#FDF8F0]"
          style={{
            fontFamily:
              lang === 'ne' ? 'var(--font-nepali)' : 'var(--font-display)',
          }}
        >
          {name}
        </h3>

        <p
          className="mt-1 text-[11px] leading-relaxed text-[#F7E7CE]/78"
          style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
        >
          {bio}
        </p>
      </figcaption>
    </motion.figure>
  );
}

/**
 * Royal Side-by-Side Portrait Showcase of the Groom & Bride.
 * Replace `public/groom-sample.jpg` and `public/bride-sample.jpg` anytime
 * with the couple's own photography.
 */
export function CouplePortraits({ lang = 'en', reducedMotion = false }) {
  const t = translations[lang]?.hero || translations.en.hero;
  const groomSrc = resolvePublicAsset(weddingConfig.couple.groomPhoto);
  const brideSrc = resolvePublicAsset(weddingConfig.couple.bridePhoto);

  return (
    <div className="mt-8 mb-3" data-testid="couple-portraits">
      <div className="text-center mb-4">
        <p
          className="text-[10.5px] uppercase tracking-[0.24em] text-[#F3D98B]/90"
          style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
        >
          {t.portraitsEyebrow}
        </p>
        <h3
          className="text-gold-foil text-[28px] sm:text-[32px] font-semibold leading-tight mt-0.5"
          style={{
            fontFamily:
              lang === 'ne' ? 'var(--font-nepali)' : 'var(--font-display)',
          }}
        >
          {t.portraitsHeading}
        </h3>
      </div>

      {/* Side-by-Side Royal Arch Cards with Central Heart Medallion */}
      <div className="relative grid grid-cols-2 gap-3 sm:gap-4 items-stretch">
        <PortraitCard
          photoSrc={groomSrc}
          altText={`${weddingConfig.couple.groomFull} — Groom`}
          roleLabel={t.groomRole}
          name={
            lang === 'ne'
              ? weddingConfig.couple.groomNepali.split(' ')[0]
              : weddingConfig.couple.groomFirst
          }
          bio={t.groomBio}
          delay={0.05}
          reducedMotion={reducedMotion}
          lang={lang}
        />

        <PortraitCard
          photoSrc={brideSrc}
          altText={`${weddingConfig.couple.brideFull} — Bride`}
          roleLabel={t.brideRole}
          name={
            lang === 'ne'
              ? weddingConfig.couple.brideNepali.split(' ')[0]
              : weddingConfig.couple.brideFirst
          }
          bio={t.brideBio}
          delay={0.14}
          reducedMotion={reducedMotion}
          lang={lang}
        />

        {/* Floating Golden Union Medallion between Groom & Bride */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 rounded-full border border-[#FFF4D4]/80 bg-[#3D0814] shadow-[0_0_20px_rgba(212,175,55,0.6),0_6px_16px_rgba(0,0,0,0.6)]"
        >
          <Heart className="w-4 h-4 text-[#F3D98B] fill-[#D4AF37]" />
        </div>
      </div>

      <p
        className="mt-3 text-center text-[10.5px] uppercase tracking-[0.22em] text-[#D4AF37]/85"
        style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
      >
        ✦ {t.uniteTag} ✦
      </p>
    </div>
  );
}
