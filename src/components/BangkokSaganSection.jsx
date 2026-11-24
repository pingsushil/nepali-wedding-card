import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Check,
  Copy,
  Download,
  HeartHandshake,
  Plane,
  Sparkles,
} from 'lucide-react';
import { OPTIONAL_ASSETS } from 'virtual:optional-assets';
import { weddingConfig } from '../data/weddingConfig';
import { translations } from '../data/translations';
import { RoyalDivider } from './DhakaBorder';
import { triggerMiniGoldPop } from '../utils/confetti';

/**
 * Deterministic 21x21 QR-like decorative pattern matrix so the fallback SVG QR
 * looks crisp, authentic, and balanced whenever `/qr-honeymoon.png` isn't uploaded yet.
 */
function buildFallbackQrModules() {
  const size = 21;
  const cells = [];

  const isFinder = (r, c) =>
    (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
  const isCenterLogo = (r, c) => r >= 8 && r <= 12 && c >= 8 && c <= 12;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isFinder(r, c) || isCenterLogo(r, c)) continue;
      // Timing tracks + crisp pseudo-random deterministic fill
      const hash = ((r * 31 + c * 17 + r * c * 7 + 13) % 19);
      const isTiming = (r === 6 && c % 2 === 0) || (c === 6 && r % 2 === 0);
      if (isTiming || hash < 9) {
        cells.push({ r, c });
      }
    }
  }
  return cells;
}

const QR_MODULES = buildFallbackQrModules();

/**
 * Computes exact (x, y, angleDeg) along a quadratic bezier curve for smooth GPU airplane glide.
 */
function sampleQuadraticBezier(t, p0, p1, p2) {
  const inv = 1 - t;
  const x = inv * inv * p0.x + 2 * inv * t * p1.x + t * t * p2.x;
  const y = inv * inv * p0.y + 2 * inv * t * p1.y + t * t * p2.y;
  const dx = 2 * inv * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * inv * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return { x, y, angle };
}

/**
 * Custom Animated SVG Travel Header: KTM (Kathmandu) -> BKK (Bangkok)
 * with self-drawing golden dashed flight arc and a tiny gliding airplane icon.
 */
function FlightPathIllustration({ reducedMotion = false, originCity, destinationCity, flightLabel }) {
  const wrapRef = useRef(null);
  const isInView = useInView(wrapRef, { once: true, amount: 0.35 });
  const [planePos, setPlanePos] = useState({ x: 52, y: 84, angle: -34 });

  useEffect(() => {
    const p0 = { x: 52, y: 84 };
    const p1 = { x: 180, y: 8 };
    const p2 = { x: 308, y: 84 };

    if (reducedMotion) {
      setPlanePos(sampleQuadraticBezier(0.54, p0, p1, p2));
      return;
    }

    if (!isInView) return;

    let rafId = 0;
    const durationMs = 5400;
    const startTime = performance.now();

    const tick = (now) => {
      if (!document.hidden) {
        const rawT = ((now - startTime) % durationMs) / durationMs;
        // Smooth ease-in-out glide across the arc with a gentle pause at arrival
        const clamped = Math.min(rawT / 0.86, 1);
        const eased =
          clamped < 0.5
            ? 2 * clamped * clamped
            : 1 - Math.pow(-2 * clamped + 2, 2) / 2;
        setPlanePos(sampleQuadraticBezier(eased, p0, p1, p2));
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [isInView, reducedMotion]);

  const { route } = weddingConfig.sagan;

  return (
    <div ref={wrapRef} className="w-full max-w-[360px] mx-auto mb-5 select-none">
      <svg
        viewBox="0 0 360 124"
        className="w-full h-auto overflow-visible"
        fill="none"
        role="img"
        aria-label="Honeymoon flight path from Kathmandu KTM to Bangkok BKK"
      >
        <defs>
          <linearGradient id="flightArcGold" x1="48" y1="84" x2="312" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F7E7CE" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#F7E7CE" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Subtle Himalayan peak silhouette near KTM */}
        <path
          d="M16 96 L32 76 L44 87 L56 71 L74 96"
          stroke="#D4AF37"
          strokeOpacity="0.28"
          strokeWidth="1.1"
          fill="rgba(212,175,55,0.06)"
        />

        {/* Subtle Thai Wat spire silhouette near BKK */}
        <path
          d="M286 96 L296 86 L300 72 L304 86 L310 66 L316 86 L322 76 L328 96"
          stroke="#D4AF37"
          strokeOpacity="0.28"
          strokeWidth="1.1"
          fill="rgba(212,175,55,0.06)"
        />

        {/* Soft horizon baseline */}
        <line
          x1="28"
          y1="96"
          x2="332"
          y2="96"
          stroke="#D4AF37"
          strokeOpacity="0.25"
          strokeWidth="1"
        />

        {/* Subtle underlying faint track */}
        <path
          d="M52 84 Q180 8 308 84"
          stroke="#D4AF37"
          strokeOpacity="0.2"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />

        {/* Self-drawing golden dashed flight arc */}
        <motion.path
          d="M52 84 Q180 8 308 84"
          stroke="url(#flightArcGold)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="5 5"
          initial={reducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.4 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: reducedMotion ? 0.01 : 1.8, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Origin Airport Pin: KTM */}
        <circle cx="52" cy="84" r="6" fill="#3D0814" stroke="#D4AF37" strokeWidth="1.8" />
        <circle cx="52" cy="84" r="2.2" fill="#F7E7CE" />
        <text
          x="52"
          y="111"
          textAnchor="middle"
          fill="#F3D98B"
          fontSize="12"
          fontWeight="700"
          letterSpacing="2"
        >
          {route.originCode}
        </text>
        <text
          x="52"
          y="122"
          textAnchor="middle"
          fill="#F7E7CE"
          fillOpacity="0.72"
          fontSize="8.5"
          letterSpacing="0.8"
        >
          {originCity || route.originCity}
        </text>

        {/* Destination Airport Pin: BKK */}
        <circle cx="308" cy="84" r="6" fill="#3D0814" stroke="#D4AF37" strokeWidth="1.8" />
        <circle cx="308" cy="84" r="2.2" fill="#F7E7CE" />
        <text
          x="308"
          y="111"
          textAnchor="middle"
          fill="#F3D98B"
          fontSize="12"
          fontWeight="700"
          letterSpacing="2"
        >
          {route.destinationCode}
        </text>
        <text
          x="308"
          y="122"
          textAnchor="middle"
          fill="#F7E7CE"
          fillOpacity="0.72"
          fontSize="8.5"
          letterSpacing="0.8"
        >
          {destinationCity || route.destinationCity}
        </text>

        {/* Center badge text */}
        <text
          x="180"
          y="85"
          textAnchor="middle"
          fill="#F7E7CE"
          fillOpacity="0.65"
          fontSize="8.5"
          letterSpacing="1.6"
        >
          {flightLabel || route.flightLabel.toUpperCase()}
        </text>

        {/* Gliding Tiny Golden Airplane Icon along the Bezier Arc */}
        <g
          transform={`translate(${planePos.x}, ${planePos.y}) rotate(${planePos.angle})`}
          style={{ filter: 'drop-shadow(0 0 6px rgba(243, 217, 139, 0.85))' }}
        >
          <path
            d="M11 0 L2 -2.6 L-5 -9.5 L-7.5 -9.5 L-4 -2 L-9.5 -2 L-11.5 -4.8 L-13 -4.8 L-11.5 0 L-13 4.8 L-11.5 4.8 L-9.5 2 L-4 2 L-7.5 9.5 L-5 9.5 L2 2.6 Z"
            fill="#FFF4D4"
            stroke="#9A761A"
            strokeWidth="0.6"
          />
        </g>
      </svg>
    </div>
  );
}

/**
 * Crisp realistic fallback SVG QR frame rendered whenever `/qr-honeymoon.png`
 * has not been placed into `public/` yet.
 */
function FallbackQrSvg({ svgRef }) {
  const cell = 8;
  const offset = 26;

  const renderFinder = (rx, ry) => (
    <g key={`finder-${rx}-${ry}`}>
      <rect
        x={offset + rx * cell}
        y={offset + ry * cell}
        width={7 * cell}
        height={7 * cell}
        rx="6"
        fill="none"
        stroke="#3D0814"
        strokeWidth="6"
      />
      <rect
        x={offset + (rx + 1.5) * cell}
        y={offset + (ry + 1.5) * cell}
        width={4 * cell}
        height={4 * cell}
        rx="3"
        fill="#6B0F1A"
      />
    </g>
  );

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 220"
      className="w-full h-full block"
      role="img"
      aria-label="Digital Sagan QR Code for eSewa and Fonepay"
    >
      <rect width="220" height="220" rx="14" fill="#FDF8F0" />
      <rect
        x="7"
        y="7"
        width="206"
        height="206"
        rx="10"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="1.6"
        strokeOpacity="0.7"
      />

      {/* Three QR Finder Patterns */}
      {renderFinder(0, 0)}
      {renderFinder(14, 0)}
      {renderFinder(0, 14)}

      {/* Deterministic QR Data Modules */}
      {QR_MODULES.map(({ r, c }) => (
        <rect
          key={`${r}-${c}`}
          x={offset + c * cell + 0.8}
          y={offset + r * cell + 0.8}
          width={cell - 1.6}
          height={cell - 1.6}
          rx="1.6"
          fill="#2B050D"
        />
      ))}

      {/* Center Royal Couple Crest */}
      <rect
        x="88"
        y="88"
        width="44"
        height="44"
        rx="10"
        fill="#3D0814"
        stroke="#D4AF37"
        strokeWidth="2.2"
      />
      <text
        x="110"
        y="115"
        textAnchor="middle"
        fill="#F7E7CE"
        fontSize="14"
        fontWeight="700"
        fontFamily="Georgia, serif"
      >
        {weddingConfig.couple.monogram}
      </text>
    </svg>
  );
}

/**
 * Clipboard helper that works reliably inside WhatsApp & Messenger mobile webviews.
 */
async function copyTextReliably(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function BangkokSaganSection({ lang = 'en', reducedMotion = false }) {
  const { sagan } = weddingConfig;
  const t = translations[lang]?.sagan || translations.en.sagan;
  const nepaliFont = lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined;
  const [selectedTagId, setSelectedTagId] = useState(sagan.blessingTags[0].id);
  const [qrImageFailed, setQrImageFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedNotice, setSavedNotice] = useState('');
  const fallbackSvgRef = useRef(null);
  const copyBtnRef = useRef(null);
  const toastTimerRef = useRef(null);

  const selectedTagBase =
    sagan.blessingTags.find((tag) => tag.id === selectedTagId) || sagan.blessingTags[0];
  const selectedTagLocalized = t.tags[selectedTagBase.id] || selectedTagBase;
  const selectedTag = { ...selectedTagBase, ...selectedTagLocalized };

  const resolvedQrSrc = sagan.qrImagePath.startsWith('http')
    ? sagan.qrImagePath
    : `${import.meta.env.BASE_URL}${sagan.qrImagePath.replace(/^\//, '')}`;

  const showRealQrImage = OPTIONAL_ASSETS.hasQrImage && !qrImageFailed;

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const flashToast = (message) => {
    setSavedNotice(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setSavedNotice(''), 3200);
  };

  const handleCopyPaymentId = async () => {
    await copyTextReliably(sagan.paymentId);
    setCopied(true);

    // Trigger mini golden confetti burst from the copy button
    let origin = { x: 0.5, y: 0.72 };
    if (copyBtnRef.current) {
      const rect = copyBtnRef.current.getBoundingClientRect();
      origin = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      };
    }
    triggerMiniGoldPop(origin);

    flashToast(
      `${t.copiedToastPrefix} ${sagan.paymentId} • ${t.saganTagPrefix} "${selectedTag.label}"`
    );
    window.setTimeout(() => setCopied(false), 2400);
  };

  const handleSaveQrToGallery = () => {
    if (showRealQrImage) {
      const link = document.createElement('a');
      link.href = resolvedQrSrc;
      link.download = sagan.qrDownloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      flashToast(t.savedToast);
      return;
    }

    // Export high-resolution 960x1120 luxury PNG card from the fallback SVG QR
    const svgEl = fallbackSvgRef.current;
    if (!svgEl) return;

    const serialized = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 960;
      canvas.height = 1120;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Luxury velvet maroon backdrop
        ctx.fillStyle = '#3D0814';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Antique gold border frame
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 6;
        ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

        // Header typography
        ctx.fillStyle = '#F7E7CE';
        ctx.font = 'bold 42px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${weddingConfig.couple.groomFirst} & ${weddingConfig.couple.brideFirst}`, 480, 118);

        ctx.fillStyle = '#D4AF37';
        ctx.font = '600 22px sans-serif';
        ctx.fillText('BANGKOK HONEYMOON DIGITAL SAGAN', 480, 158);

        // Draw crisp QR frame
        ctx.drawImage(img, 140, 200, 680, 680);

        // Footer payment info
        ctx.fillStyle = '#FDF8F0';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(`${sagan.paymentProviderLabel}: ${sagan.paymentId}`, 480, 956);

        ctx.fillStyle = '#F7E7CE';
        ctx.font = '22px sans-serif';
        ctx.fillText(`Blessing: ${selectedTag.label}`, 480, 1004);

        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = sagan.qrDownloadFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
      flashToast(t.savedToast);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      flashToast('Tap Copy ID below to send via eSewa or Fonepay.');
    };

    img.src = url;
  };

  return (
    <section
      id="honeymoon-sagan"
      className="relative z-20 mx-auto w-full max-w-lg px-5 py-12"
    >
      <motion.div
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.65 }}
        className="relative rounded-3xl border border-[#D4AF37]/45 px-5 py-8 sm:px-7 overflow-hidden"
        style={{
          background:
            'linear-gradient(165deg, rgba(107, 15, 26, 0.42) 0%, rgba(44, 5, 14, 0.92) 55%, rgba(28, 3, 9, 0.96) 100%)',
          boxShadow:
            '0 20px 50px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(247, 231, 206, 0.24)',
        }}
      >
        {/* Subtle decorative radial top highlight */}
        <div
          aria-hidden="true"
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-52 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(212,175,55,0.22) 0%, transparent 70%)',
          }}
        />

        {/* Section Header */}
        <div className="relative text-center">
          <div
            className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#2A040C]/80 px-3.5 py-1 text-[10.5px] uppercase tracking-[0.18em] text-[#F3D98B] mb-3"
            style={nepaliFont}
          >
            <Plane className="w-3 h-3 text-[#D4AF37]" />
            <span>{t.eyebrow}</span>
          </div>

          <p
            className="text-sm text-[#F7E7CE]/90 tracking-wide"
            style={{ fontFamily: 'var(--font-nepali)' }}
          >
            {t.nepaliSub}
          </p>
          <h2
            className="text-gold-foil text-[30px] sm:text-[36px] font-semibold leading-tight mt-0.5"
            style={{
              fontFamily:
                lang === 'ne' ? 'var(--font-nepali)' : 'var(--font-display)',
            }}
          >
            {t.heading}
          </h2>
        </div>

        {/* Custom Animated KTM -> BKK Flight Arc SVG */}
        <div className="mt-5">
          <FlightPathIllustration
            reducedMotion={reducedMotion}
            originCity={t.originCity}
            destinationCity={t.destinationCity}
            flightLabel={t.flightLabel}
          />
        </div>

        {/* Warm, Respectful Nepali & English Sagan Message */}
        <div className="text-center space-y-2.5 max-w-md mx-auto">
          <p
            className="text-[13.5px] font-medium text-[#F7E7CE] leading-relaxed"
            style={{ fontFamily: 'var(--font-nepali)' }}
          >
            &ldquo;{sagan.messageNepali}&rdquo;
          </p>
          <p className="text-[13px] text-[#FDF8F0]/82 leading-relaxed" style={nepaliFont}>
            {t.messageEnglish}
          </p>
        </div>

        <RoyalDivider className="my-6" />

        {/* Interactive Playful Blessing Tags */}
        <div className="mb-6">
          <p
            className="text-center text-[11px] uppercase tracking-[0.18em] text-[#F3D98B] mb-3 flex items-center justify-center gap-1.5"
            style={nepaliFont}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t.chooseNote}</span>
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {sagan.blessingTags.map((tag) => {
              const isSelected = tag.id === selectedTagId;
              const locTag = t.tags[tag.id] || tag;
              return (
                <motion.button
                  key={tag.id}
                  type="button"
                  onClick={() => setSelectedTagId(tag.id)}
                  whileTap={reducedMotion ? {} : { scale: 0.92 }}
                  whileHover={reducedMotion ? {} : { y: -1 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                  className={`relative rounded-full px-3.5 py-2 text-xs font-medium cursor-pointer border transition-colors ${
                    isSelected
                      ? 'text-[#3D0814] border-[#FFF4D4]'
                      : 'text-[#F7E7CE]/90 border-[#D4AF37]/35 bg-[#2A040C]/70 hover:border-[#D4AF37]/70'
                  }`}
                  style={nepaliFont}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="saganTagGlow"
                      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          'linear-gradient(135deg, #FFF4D4 0%, #E7C45A 52%, #C69823 100%)',
                        boxShadow: '0 4px 16px rgba(212, 175, 55, 0.42)',
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span aria-hidden="true">{tag.emoji}</span>
                    <span>{locTag.label}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Animated Selected Blessing Preview */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`${lang}-${selectedTag.id}`}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="mt-3 text-center text-xs italic text-[#F7E7CE]/85 px-3"
              style={nepaliFont}
            >
              &ldquo;{selectedTag.note}&rdquo;
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Shimmering Metallic-Bordered QR Card */}
        <div className="relative mx-auto w-full max-w-[266px]">
          <div
            aria-hidden="true"
            className="qr-metallic-aura absolute -inset-1 rounded-[24px] pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, #FFF4D4 0%, #D4AF37 32%, #6B0F1A 52%, #D4AF37 78%, #F7E7CE 100%)',
              filter: 'blur(0.4px)',
            }}
          />

          <div className="metallic-sheen relative rounded-[21px] bg-[#2D050E] p-3.5 shadow-[0_14px_32px_rgba(0,0,0,0.55)]">
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-[#FDF8F0] p-1.5 shadow-inner">
              {showRealQrImage ? (
                <img
                  src={resolvedQrSrc}
                  alt="Honeymoon Sagan Payment QR Code"
                  onError={() => setQrImageFailed(true)}
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <FallbackQrSvg svgRef={fallbackSvgRef} />
              )}
            </div>

            {/* Account Details under QR */}
            <div className="mt-3 text-center">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#F3D98B] font-semibold">
                {sagan.paymentProviderLabel}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[#FDF8F0] tracking-wider tabular-nums">
                ID: {sagan.paymentId}
              </p>
              <p className="mt-0.5 text-[11px] text-[#F7E7CE]/75">
                {sagan.accountHolder}
              </p>
              <p className="mt-1 text-[10px] text-[#D4AF37]/80" style={nepaliFont}>
                {t.bankNote}
              </p>
            </div>
          </div>
        </div>

        {/* Crucial Mobile UX Action Buttons */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.button
            type="button"
            onClick={handleSaveQrToGallery}
            whileTap={reducedMotion ? {} : { scale: 0.96 }}
            data-testid="save-qr-btn"
            className="metallic-sheen flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-xs sm:text-[13px] font-semibold text-[#3D0814] cursor-pointer shadow-[0_10px_24px_rgba(212,175,55,0.28)]"
            style={{
              background:
                'linear-gradient(135deg, #FFF4D4 0%, #E7C45A 48%, #C69823 100%)',
              ...nepaliFont,
            }}
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>{t.saveQrBtn}</span>
          </motion.button>

          <motion.button
            ref={copyBtnRef}
            type="button"
            onClick={handleCopyPaymentId}
            whileTap={reducedMotion ? {} : { scale: 0.96 }}
            data-testid="copy-payment-id-btn"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/70 bg-[#3D0814]/90 px-4 py-3.5 text-xs sm:text-[13px] font-semibold text-[#F7E7CE] cursor-pointer hover:bg-[#530C1A] transition-colors shadow-[0_8px_20px_rgba(0,0,0,0.32)]"
            style={nepaliFont}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#F3D98B] shrink-0" />
                <span className="text-[#FFF4D4]">{t.copiedBtn}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{t.copyIdBtn}</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Animated Confirmation Toast */}
        <AnimatePresence>
          {savedNotice && (
            <motion.div
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/60 bg-[#22040B]/95 px-4 py-2.5 text-center text-xs text-[#FFF4D4] shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>{savedNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
