import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Shirt,
  ChevronDown,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { weddingConfig } from '../data/weddingConfig';
import { RoyalDivider } from './DhakaBorder';

function EventCard({ event, index, isExpanded, onToggle, reducedMotion }) {
  return (
    <motion.article
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={
        reducedMotion
          ? { duration: 0.01 }
          : {
              type: 'spring',
              stiffness: 120,
              damping: 20,
              delay: index * 0.06,
            }
      }
      className="relative pl-11 sm:pl-13"
    >
      {/* Milestone Node glowing on the vertical golden timeline spine */}
      <div
        aria-hidden="true"
        className="absolute left-[11px] top-6 z-20 flex items-center justify-center w-[18px] h-[18px] rounded-full border-2 border-[#F7E7CE]"
        style={{
          backgroundColor: event.accentHex,
          boxShadow: `0 0 0 4px rgba(61, 8, 20, 0.95), 0 0 16px ${event.accentHex}`,
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFF4D4]" />
      </div>

      {/* Interactive Royal Event Card with distinct mood accent */}
      <div
        className="relative rounded-2xl overflow-hidden backdrop-blur-sm transition-shadow"
        style={{
          background: `linear-gradient(155deg, ${event.bgTint} 0%, rgba(36, 4, 11, 0.9) 100%)`,
          border: `1px solid ${event.borderTint}`,
          boxShadow: '0 14px 34px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(247, 231, 206, 0.16)',
        }}
      >
        {/* Top mood accent hairline */}
        <div
          aria-hidden="true"
          className="h-[3px] w-full"
          style={{
            background: `linear-gradient(90deg, ${event.accentHex} 0%, #D4AF37 55%, transparent 100%)`,
          }}
        />

        <div className="p-4 sm:p-5">
          {/* Header Row */}
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isExpanded}
            className="w-full text-left cursor-pointer focus:outline-none group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span
                  className="inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-medium tracking-wide border"
                  style={{
                    color: event.badgeText,
                    borderColor: event.borderTint,
                    backgroundColor: 'rgba(26, 4, 9, 0.55)',
                    fontFamily: 'var(--font-nepali)',
                  }}
                >
                  {event.nepaliTitle}
                </span>

                <h3
                  className="mt-2 text-[25px] sm:text-[28px] font-semibold leading-tight text-[#FDF8F0] group-hover:text-[#F7E7CE] transition-colors"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {event.title}
                </h3>
                <p className="mt-0.5 text-xs text-[#F7E7CE]/75">{event.subtitle}</p>
              </div>

              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="mt-1 flex items-center justify-center w-8 h-8 rounded-full border border-[#D4AF37]/40 bg-[#2A040C]/70 text-[#F3D98B] shrink-0"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </div>
          </button>

          {/* Dates (BS + AD), Time, Dress Code & Venue */}
          <div className="mt-4 space-y-2.5 text-[13px] text-[#FDF8F0]/90">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="leading-snug">
                <p className="font-semibold text-[#FFF4D4]">{event.bsDate}</p>
                <p className="text-xs text-[#F7E7CE]/75">{event.adDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <p className="leading-snug">{event.time}</p>
            </div>

            <div className="flex items-start gap-2.5">
              <Shirt className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <p className="leading-snug text-[#F7E7CE]/90">
                <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] mr-1.5">
                  Attire:
                </span>
                {event.dressCode}
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="leading-snug">
                <p className="font-medium text-[#FDF8F0]">{event.venueName}</p>
                <p className="text-xs text-[#F7E7CE]/70">{event.venueAddress}</p>
              </div>
            </div>
          </div>

          {/* Expandable Ceremony Highlights & Cultural Notes */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="details"
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={{ duration: reducedMotion ? 0.01 : 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-3.5 border-t border-[#D4AF37]/25">
                  <p className="text-xs italic text-[#F7E7CE]/85 leading-relaxed mb-3">
                    &ldquo;{event.note}&rdquo;
                  </p>
                  <p className="text-[10.5px] uppercase tracking-[0.2em] text-[#D4AF37] mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Ceremony Highlights
                  </p>
                  <ul className="space-y-1.5">
                    {event.highlights.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-[#FDF8F0]/85 leading-relaxed"
                      >
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: event.accentHex }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Action Row */}
          <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={onToggle}
              className="text-[11px] uppercase tracking-[0.16em] text-[#F3D98B]/90 hover:text-[#FFF4D4] cursor-pointer py-1"
            >
              {isExpanded ? 'Hide Details' : 'Ceremony Details'}
            </button>

            <motion.a
              href={event.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={reducedMotion ? {} : { scale: 0.96 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/60 bg-[#3D0814]/85 px-3.5 py-2 text-xs font-medium text-[#F7E7CE] shadow-[0_4px_14px_rgba(0,0,0,0.3)] hover:border-[#F3D98B] hover:text-[#FFF4D4] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Open Venue in Maps</span>
              <ExternalLink className="w-3 h-3 opacity-75" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function EventsTimeline({ reducedMotion = false }) {
  const timelineRef = useRef(null);
  // Keep Shubha Biwaha expanded initially so guests immediately see expandable richness
  const [expandedIds, setExpandedIds] = useState(() => ({
    'shubha-biwaha': true,
  }));

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 72%'],
  });

  const smoothScaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  const toggleEvent = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="wedding-events"
      className="relative z-20 mx-auto w-full max-w-lg px-5 py-12"
    >
      {/* Section Header */}
      <motion.div
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-9"
      >
        <p
          className="text-xs text-[#F3D98B]/90 tracking-wider mb-1"
          style={{ fontFamily: 'var(--font-nepali)' }}
        >
          वैवाहिक कार्यक्रम तालिका
        </p>
        <h2
          className="text-gold-foil text-[34px] sm:text-[40px] font-semibold leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Wedding Celebrations
        </h2>
        <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-[#F7E7CE]/75">
          {weddingConfig.weddingDate.dateRangeSummary}
        </p>
        <RoyalDivider className="mt-5" />
      </motion.div>

      {/* Scroll-Driven Glowing Vertical Gold Timeline */}
      <div ref={timelineRef} className="relative">
        {/* Static muted background spine */}
        <div
          aria-hidden="true"
          className="absolute left-[19px] top-4 bottom-4 w-[2px] rounded-full bg-[#D4AF37]/20"
        />

        {/* Scroll-animated glowing gold foreground spine (GPU scaleY) */}
        <motion.div
          aria-hidden="true"
          className="absolute left-[19px] top-4 bottom-4 w-[2px] rounded-full origin-top"
          style={{
            scaleY: reducedMotion ? 1 : smoothScaleY,
            background:
              'linear-gradient(180deg, #F7E7CE 0%, #D4AF37 55%, #F3D98B 100%)',
            boxShadow: '0 0 12px rgba(212, 175, 55, 0.85)',
          }}
        />

        <div className="space-y-6">
          {weddingConfig.events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              isExpanded={Boolean(expandedIds[event.id])}
              onToggle={() => toggleEvent(event.id)}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
