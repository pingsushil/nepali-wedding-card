import React from 'react';
import { motion } from 'framer-motion';

/**
 * Floating Royal Gold Language Switch (EN | नेपाली) fixed at top-left.
 * Stays accessible both on the pre-open 3D doors and throughout the invitation.
 */
export function LanguageToggle({ lang = 'en', onChange, reducedMotion = false }) {
  const options = [
    { code: 'en', label: 'EN', aria: 'Switch to English' },
    { code: 'ne', label: 'नेपाली', aria: 'नेपाली भाषामा हेर्नुहोस्' },
  ];

  return (
    <div
      role="group"
      aria-label="Language switcher"
      data-testid="language-toggle"
      className="fixed top-3.5 left-3.5 z-[60] inline-flex items-center rounded-full border border-[#D4AF37]/65 bg-[#3D0814]/88 p-0.5 shadow-[0_8px_22px_rgba(0,0,0,0.45),0_0_14px_rgba(212,175,55,0.2)] backdrop-blur-md"
    >
      {options.map((opt) => {
        const active = lang === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => onChange?.(opt.code)}
            aria-label={opt.aria}
            aria-pressed={active}
            data-testid={`lang-btn-${opt.code}`}
            className={`relative rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide cursor-pointer transition-colors ${
              active ? 'text-[#3D0814]' : 'text-[#F7E7CE]/85 hover:text-[#FFF4D4]'
            }`}
            style={
              opt.code === 'ne'
                ? { fontFamily: 'var(--font-nepali)' }
                : undefined
            }
          >
            {active && (
              <motion.span
                layoutId="activeLangPill"
                transition={
                  reducedMotion
                    ? { duration: 0.01 }
                    : { type: 'spring', stiffness: 420, damping: 30 }
                }
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'linear-gradient(135deg, #FFF4D4 0%, #E7C45A 55%, #C69823 100%)',
                  boxShadow: '0 2px 10px rgba(212, 175, 55, 0.4)',
                }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
