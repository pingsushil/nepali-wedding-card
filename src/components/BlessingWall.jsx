import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Sparkles, Quote, LayoutGrid, GalleryHorizontalEnd } from 'lucide-react';
import { blessingStore } from '../utils/blessingStore';
import { triggerMiniGoldPop } from '../utils/confetti';
import { translations, localizeDigits } from '../data/translations';
import { RoyalDivider } from './DhakaBorder';

export function BlessingWall({
  initialGuestName = '',
  isPersonalized = false,
  lang = 'en',
  reducedMotion = false,
}) {
  const [blessings, setBlessings] = useState(() => blessingStore.getAll());
  const [name, setName] = useState(isPersonalized ? initialGuestName : '');
  const [relation, setRelation] = useState('');
  const [message, setMessage] = useState('');
  const [viewMode, setViewMode] = useState('deck');
  const [justPostedId, setJustPostedId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const submitBtnRef = useRef(null);
  const deckRef = useRef(null);

  const t = translations[lang]?.blessings || translations.en.blessings;
  const nepaliFont = lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setErrorMsg(t.errName);
      return;
    }
    if (!trimmedMessage) {
      setErrorMsg(t.errMessage);
      return;
    }

    setErrorMsg('');
    const { entry, list } = blessingStore.add({
      name: trimmedName,
      relation,
      message: trimmedMessage,
      tag: lang === 'ne' ? 'अतिथि शुभकामना' : 'Guest Blessing',
    });

    setBlessings(list);
    setJustPostedId(entry.id);
    setMessage('');
    setRelation('');

    if (deckRef.current) {
      deckRef.current.scrollTo({ left: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    }

    let origin = { x: 0.5, y: 0.65 };
    if (submitBtnRef.current) {
      const rect = submitBtnRef.current.getBoundingClientRect();
      origin = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      };
    }
    triggerMiniGoldPop(origin);

    window.setTimeout(() => setJustPostedId(null), 10000);
  };

  return (
    <section
      id="blessing-wall"
      className="relative z-20 mx-auto w-full max-w-lg px-5 py-12"
    >
      {/* Section Header */}
      <motion.div
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-7"
      >
        <p
          className="text-xs text-[#F3D98B]/90 tracking-wider mb-1"
          style={{ fontFamily: 'var(--font-nepali)' }}
        >
          {t.eyebrow}
        </p>
        <h2
          className="text-gold-foil text-[32px] sm:text-[38px] font-semibold leading-tight"
          style={{
            fontFamily:
              lang === 'ne' ? 'var(--font-nepali)' : 'var(--font-display)',
          }}
        >
          {t.heading}
        </h2>
        <p className="mt-1.5 text-xs text-[#F7E7CE]/78 max-w-xs mx-auto leading-relaxed" style={nepaliFont}>
          {t.subtitle}
        </p>
        <RoyalDivider className="mt-5" />
      </motion.div>

      {/* Guest Wish Composer Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
        className="rounded-2xl border border-[#D4AF37]/40 p-4 sm:p-5 backdrop-blur-sm"
        style={{
          background:
            'linear-gradient(155deg, rgba(107, 15, 26, 0.36) 0%, rgba(36, 4, 11, 0.88) 100%)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.36)',
          ...nepaliFont,
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="blessing-name"
              className="block text-[10.5px] uppercase tracking-[0.16em] text-[#F3D98B] mb-1.5"
            >
              {t.nameLabel}
            </label>
            <input
              id="blessing-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              maxLength={64}
              className="w-full rounded-xl border border-[#D4AF37]/35 bg-[#22040B]/80 px-3.5 py-2.5 text-sm text-[#FDF8F0] placeholder:text-[#F7E7CE]/38 focus:border-[#F3D98B] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="blessing-relation"
              className="block text-[10.5px] uppercase tracking-[0.16em] text-[#F3D98B] mb-1.5"
            >
              {t.relationLabel}
            </label>
            <input
              id="blessing-relation"
              type="text"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              placeholder={t.relationPlaceholder}
              maxLength={48}
              className="w-full rounded-xl border border-[#D4AF37]/35 bg-[#22040B]/80 px-3.5 py-2.5 text-sm text-[#FDF8F0] placeholder:text-[#F7E7CE]/38 focus:border-[#F3D98B] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="mt-3">
          <label
            htmlFor="blessing-message"
            className="block text-[10.5px] uppercase tracking-[0.16em] text-[#F3D98B] mb-1.5"
          >
            {t.messageLabel}
          </label>
          <textarea
            id="blessing-message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.messagePlaceholder}
            maxLength={280}
            className="w-full resize-none rounded-xl border border-[#D4AF37]/35 bg-[#22040B]/80 px-3.5 py-2.5 text-sm text-[#FDF8F0] placeholder:text-[#F7E7CE]/38 focus:border-[#F3D98B] focus:outline-none transition-colors"
          />
        </div>

        {/* One-tap quick wish starters */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {t.quickStarters.map((starter, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setMessage(starter)}
              className="rounded-full border border-[#D4AF37]/25 bg-[#3D0814]/70 px-2.5 py-1 text-[11px] text-[#F7E7CE]/80 hover:border-[#D4AF37]/60 hover:text-[#FFF4D4] cursor-pointer transition-colors"
            >
              + &ldquo;{starter.slice(0, 26)}…&rdquo;
            </button>
          ))}
        </div>

        {errorMsg && (
          <p className="mt-2.5 text-xs text-[#FCA5A5]" role="alert">
            {errorMsg}
          </p>
        )}

        <motion.button
          ref={submitBtnRef}
          type="submit"
          whileTap={reducedMotion ? {} : { scale: 0.97 }}
          className="metallic-sheen mt-4 w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#3D0814] cursor-pointer shadow-[0_10px_24px_rgba(212,175,55,0.26)]"
          style={{
            background:
              'linear-gradient(135deg, #FFF4D4 0%, #E7C45A 50%, #C69823 100%)',
          }}
        >
          <Send className="w-4 h-4" />
          <span>{t.submitBtn}</span>
        </motion.button>
      </motion.form>

      {/* Deck / Masonry Controls */}
      <div className="mt-7 mb-3 flex items-center justify-between px-1" style={nepaliFont}>
        <div className="flex items-center gap-1.5 text-xs text-[#F7E7CE]/85">
          <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]/40" />
          <span>
            <strong className="text-[#FFF4D4]">{localizeDigits(blessings.length, lang)}</strong>{' '}
            {t.sharedLabel}
          </span>
        </div>

        <div className="inline-flex rounded-full border border-[#D4AF37]/35 bg-[#2A040C]/80 p-0.5">
          <button
            type="button"
            onClick={() => setViewMode('deck')}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-medium cursor-pointer transition-colors ${
              viewMode === 'deck'
                ? 'bg-[#D4AF37] text-[#3D0814]'
                : 'text-[#F7E7CE]/75'
            }`}
          >
            <GalleryHorizontalEnd className="w-3 h-3" />
            <span>{t.deckBtn}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-medium cursor-pointer transition-colors ${
              viewMode === 'grid'
                ? 'bg-[#D4AF37] text-[#3D0814]'
                : 'text-[#F7E7CE]/75'
            }`}
          >
            <LayoutGrid className="w-3 h-3" />
            <span>{t.wallBtn}</span>
          </button>
        </div>
      </div>

      {/* Stylized Floating Blessing Cards */}
      <div
        ref={deckRef}
        className={
          viewMode === 'deck'
            ? 'flex gap-3.5 overflow-x-auto snap-x snap-mandatory pb-3 -mx-1 px-1 no-scrollbar'
            : 'columns-1 sm:columns-2 gap-3.5 space-y-3.5'
        }
      >
        <AnimatePresence initial={false}>
          {blessings.map((wish, idx) => {
            const isHighlighted = wish.id === justPostedId;
            return (
              <motion.article
                key={wish.id}
                layout={!reducedMotion}
                initial={
                  reducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.88, y: 18 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  type: 'spring',
                  stiffness: 180,
                  damping: 22,
                }}
                className={`${
                  viewMode === 'deck'
                    ? 'snap-center shrink-0 w-[282px] sm:w-[300px]'
                    : 'break-inside-avoid w-full'
                } relative rounded-2xl border p-4 backdrop-blur-xs`}
                style={{
                  borderColor: isHighlighted
                    ? 'rgba(255, 244, 212, 0.85)'
                    : 'rgba(212, 175, 55, 0.34)',
                  background:
                    idx % 2 === 0
                      ? 'linear-gradient(155deg, rgba(107, 15, 26, 0.45) 0%, rgba(36, 4, 11, 0.9) 100%)'
                      : 'linear-gradient(155deg, rgba(78, 12, 26, 0.48) 0%, rgba(30, 4, 10, 0.92) 100%)',
                  boxShadow: isHighlighted
                    ? '0 0 26px rgba(212, 175, 55, 0.4), 0 12px 28px rgba(0,0,0,0.45)'
                    : '0 10px 26px rgba(0, 0, 0, 0.34)',
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <Quote className="w-4 h-4 text-[#D4AF37]/75 shrink-0" />
                  {isHighlighted && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-[#D4AF37]/20 border border-[#F3D98B]/50 px-2 py-0.5 text-[10px] font-medium text-[#FFF4D4]"
                      style={nepaliFont}
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      {t.justAdded}
                    </span>
                  )}
                </div>

                <p className="text-[13px] leading-relaxed text-[#FDF8F0]/90">
                  &ldquo;{wish.message}&rdquo;
                </p>

                <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <p
                      className="text-base font-semibold text-[#F7E7CE] leading-tight truncate"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {wish.name}
                    </p>
                    {wish.relation && (
                      <p className="text-[11px] text-[#D4AF37]/85 truncate mt-0.5">
                        {wish.relation}
                      </p>
                    )}
                  </div>

                  {wish.tag && (
                    <span className="shrink-0 rounded-full border border-[#D4AF37]/30 bg-[#2A040C]/75 px-2 py-0.5 text-[9.5px] text-[#F3D98B]/90">
                      {wish.tag}
                    </span>
                  )}
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {viewMode === 'deck' && (
        <p
          className="mt-1 text-center text-[10.5px] tracking-[0.14em] uppercase text-[#F7E7CE]/55"
          style={nepaliFont}
        >
          {t.swipeHint}
        </p>
      )}
    </section>
  );
}
