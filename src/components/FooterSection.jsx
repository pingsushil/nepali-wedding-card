import React from 'react';
import { motion } from 'framer-motion';
import { weddingConfig } from '../data/weddingConfig';
import { translations } from '../data/translations';
import { DhakaBorder, RoyalDivider } from './DhakaBorder';

export function FooterSection({ lang = 'en', reducedMotion = false }) {
  const t = translations[lang]?.footer || translations.en.footer;
  const nepaliFont = lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined;

  return (
    <footer className="relative z-20 mt-6 w-full overflow-hidden">
      <div className="mx-auto w-full max-w-lg px-5 pb-10 pt-4 text-center">
        <RoyalDivider className="mb-7" />

        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
        >
          {/* Ornamental Monogram Crest */}
          <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full border border-[#D4AF37]/60 bg-[#2A040C]/85 shadow-[0_0_24px_rgba(212,175,55,0.22)]">
            <span
              className="text-gold-foil text-lg font-semibold tracking-wider"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {weddingConfig.couple.monogram}
            </span>
          </div>

          <p
            className="text-base text-[#F3D98B] tracking-wide"
            style={{ fontFamily: 'var(--font-nepali)' }}
          >
            {t.nepaliClosing}
          </p>

          <p
            className="mt-1.5 text-2xl italic text-[#F7E7CE]"
            style={{
              fontFamily:
                lang === 'ne' ? 'var(--font-nepali)' : 'var(--font-display)',
            }}
          >
            {t.englishClosing}
          </p>

          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
            {weddingConfig.couple.hashtag}
          </p>

          <p className="mt-4 text-xs text-[#FDF8F0]/75" style={nepaliFont}>
            {t.hostsLine}
          </p>
          <p
            className="mt-1.5 text-[11px] text-[#F7E7CE]/55 max-w-xs mx-auto leading-relaxed"
            style={nepaliFont}
          >
            {t.rsvpNote}
          </p>
        </motion.div>
      </div>

      <DhakaBorder height={16} opacity={0.85} />
    </footer>
  );
}
