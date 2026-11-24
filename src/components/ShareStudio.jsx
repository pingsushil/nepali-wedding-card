import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Users,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import { weddingConfig } from '../data/weddingConfig';
import { translations } from '../data/translations';
import { buildPersonalizedInviteUrl } from '../utils/urlParams';
import { DhakaBorder, RoyalDivider } from './DhakaBorder';
import { triggerMiniGoldPop } from '../utils/confetti';

const RECENT_INVITES_KEY = 'nepali_wedding_recent_invites_v1';

function loadRecentInvites() {
  try {
    const raw = window.localStorage.getItem(RECENT_INVITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRecentInvite(name) {
  if (!name.trim()) return loadRecentInvites();
  const cleaned = name.trim();
  const prev = loadRecentInvites().filter(
    (item) => item.toLowerCase() !== cleaned.toLowerCase()
  );
  const next = [cleaned, ...prev].slice(0, 8);
  try {
    window.localStorage.setItem(RECENT_INVITES_KEY, JSON.stringify(next));
  } catch {
    // Ignore restricted storage
  }
  return next;
}

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fallback
    }
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = value;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

export function ShareStudio({ lang = 'en', onExitToPreview }) {
  const [familyName, setFamilyName] = useState('Suman Thapa & Family');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [recentInvites, setRecentInvites] = useState(() => loadRecentInvites());

  const t = translations[lang]?.share || translations.en.share;
  const doorsT = translations[lang]?.doors || translations.en.doors;
  const nepaliFont = lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined;

  const effectiveName =
    familyName.trim() || weddingConfig.entrance.defaultGuestName;

  const personalizedUrl = useMemo(
    () => buildPersonalizedInviteUrl(familyName),
    [familyName]
  );

  const whatsappMessage = useMemo(
    () =>
      weddingConfig.shareStudio.buildWhatsAppMessage(
        effectiveName,
        personalizedUrl
      ),
    [effectiveName, personalizedUrl]
  );

  const whatsappHref = useMemo(
    () => `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`,
    [whatsappMessage]
  );

  const handleCopyLink = async () => {
    await copyText(personalizedUrl);
    setCopiedUrl(true);
    setRecentInvites(saveRecentInvite(familyName));
    triggerMiniGoldPop({ x: 0.5, y: 0.5 });
    window.setTimeout(() => setCopiedUrl(false), 2200);
  };

  const handleCopyMessage = async () => {
    await copyText(whatsappMessage);
    setCopiedMsg(true);
    setRecentInvites(saveRecentInvite(familyName));
    window.setTimeout(() => setCopiedMsg(false), 2200);
  };

  const handleWhatsAppClick = () => {
    setRecentInvites(saveRecentInvite(familyName));
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#3D0814] text-[#FDF8F0] royal-silk-bg overflow-x-clip">
      <DhakaBorder height={16} opacity={0.9} />

      <div className="mx-auto w-full max-w-lg px-5 pt-14 pb-14" style={nepaliFont}>
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/45 bg-[#2A040C]/85 px-3 py-1 text-[10.5px] uppercase tracking-[0.16em] text-[#F3D98B]">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>{t.badge}</span>
          </div>

          <button
            type="button"
            onClick={() => onExitToPreview?.(effectiveName)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/35 bg-[#2A040C]/70 px-3 py-1.5 text-xs text-[#F7E7CE] hover:border-[#F3D98B] cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t.previewBtn}</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <p
            className="text-xs text-[#F3D98B]/90 tracking-wider mb-1"
            style={{ fontFamily: 'var(--font-nepali)' }}
          >
            निमन्त्रणा लिङ्क निर्माता • {weddingConfig.couple.groomFirst} &amp;{' '}
            {weddingConfig.couple.brideFirst}
          </p>
          <h1
            className="text-gold-foil text-[32px] sm:text-[38px] font-semibold leading-tight"
            style={{
              fontFamily:
                lang === 'ne' ? 'var(--font-nepali)' : 'var(--font-display)',
            }}
          >
            {t.heading}
          </h1>
          <p className="mt-1.5 text-xs text-[#F7E7CE]/78 max-w-sm mx-auto leading-relaxed">
            {t.subtitle}
          </p>
          <RoyalDivider className="mt-4" />
        </div>

        {/* Family Name Input Card */}
        <div
          className="rounded-2xl border border-[#D4AF37]/45 p-5 shadow-xl"
          style={{
            background:
              'linear-gradient(155deg, rgba(107, 15, 26, 0.48) 0%, rgba(36, 4, 11, 0.92) 100%)',
          }}
        >
          <label
            htmlFor="share-guest-name"
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-[#F3D98B] mb-2"
          >
            <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t.inputLabel}</span>
          </label>

          <input
            id="share-guest-name"
            type="text"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            placeholder="e.g. Suman Thapa & Family"
            maxLength={72}
            className="w-full rounded-xl border border-[#D4AF37]/50 bg-[#22040B]/90 px-4 py-3 text-sm sm:text-base text-[#FDF8F0] placeholder:text-[#F7E7CE]/38 focus:border-[#FFF4D4] focus:outline-none"
          />

          {/* Quick sample chips */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {weddingConfig.shareStudio.sampleNames.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => setFamilyName(sample)}
                className="rounded-full border border-[#D4AF37]/30 bg-[#3D0814]/80 px-2.5 py-1 text-[11px] text-[#F7E7CE]/85 hover:border-[#F3D98B] cursor-pointer transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>

          {/* Live Crest Plaque Preview */}
          <div className="mt-5 rounded-xl border border-[#D4AF37]/50 bg-[#2A040C]/90 px-4 py-3.5 text-center shadow-inner">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4AF37]/85 mb-1">
              {t.crestPreviewLabel}
            </p>
            <p
              className="text-gold-foil text-xl font-semibold leading-snug break-words"
              style={{
                fontFamily:
                  lang === 'ne' ? 'var(--font-nepali)' : 'var(--font-display)',
              }}
            >
              {doorsT.salutationPrefix} {effectiveName}
            </p>
            <p className="mt-0.5 text-[10.5px] uppercase tracking-[0.18em] text-[#F7E7CE]/80">
              {doorsT.salutationSuffix}
            </p>
          </div>
        </div>

        {/* Personalized Link Output + Copy */}
        <div className="mt-5 rounded-2xl border border-[#D4AF37]/35 bg-[#24040B]/85 p-4">
          <p className="text-[10.5px] uppercase tracking-[0.18em] text-[#F3D98B] mb-2">
            {t.urlLabel}
          </p>
          <div className="rounded-xl border border-[#D4AF37]/25 bg-[#180207] px-3.5 py-2.5 text-xs text-[#F7E7CE]/90 break-all font-mono">
            {personalizedUrl}
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={handleCopyLink}
              data-testid="share-copy-link"
              className="metallic-sheen flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold text-[#3D0814] cursor-pointer"
              style={{
                background:
                  'linear-gradient(135deg, #FFF4D4 0%, #E7C45A 50%, #C69823 100%)',
              }}
            >
              {copiedUrl ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.linkCopied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.copyLink}</span>
                </>
              )}
            </motion.button>

            <motion.a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              whileTap={{ scale: 0.97 }}
              data-testid="share-whatsapp-btn"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#34D399]/50 bg-[#0D5B3E] px-4 py-3 text-xs font-semibold text-[#FDF8F0] hover:bg-[#10704D] transition-colors shadow-[0_8px_20px_rgba(13,91,62,0.35)]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.sendWhatsapp}</span>
            </motion.a>
          </div>
        </div>

        {/* WhatsApp Message Preview */}
        <div className="mt-5 rounded-2xl border border-[#D4AF37]/30 bg-[#24040B]/75 p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-[10.5px] uppercase tracking-[0.18em] text-[#F3D98B]">
              {t.msgPreviewLabel}
            </p>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="inline-flex items-center gap-1 text-[11px] text-[#F7E7CE]/80 hover:text-[#FFF4D4] cursor-pointer"
            >
              {copiedMsg ? (
                <>
                  <Check className="w-3 h-3 text-[#F3D98B]" />
                  <span>{t.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#D4AF37]" />
                  <span>{t.copyText}</span>
                </>
              )}
            </button>
          </div>

          <pre className="whitespace-pre-wrap break-words rounded-xl border border-[#D4AF37]/20 bg-[#180207]/90 p-3.5 text-xs leading-relaxed text-[#FDF8F0]/88 font-sans">
            {whatsappMessage}
          </pre>

          <a
            href={personalizedUrl}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#F3D98B] hover:text-[#FFF4D4]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{t.openLivePrefix} {effectiveName}</span>
          </a>
        </div>

        {/* Recent Shared History */}
        {recentInvites.length > 0 && (
          <div className="mt-5 rounded-2xl border border-[#D4AF37]/25 bg-[#24040B]/60 p-4">
            <p className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.18em] text-[#D4AF37] mb-2.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.recentLabel}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {recentInvites.map((recent) => (
                <button
                  key={recent}
                  type="button"
                  onClick={() => setFamilyName(recent)}
                  className="rounded-full border border-[#D4AF37]/30 bg-[#3D0814]/80 px-3 py-1 text-xs text-[#F7E7CE] hover:border-[#F3D98B] cursor-pointer"
                >
                  {recent}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <DhakaBorder height={14} opacity={0.8} />
    </div>
  );
}
