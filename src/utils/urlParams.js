import { weddingConfig } from '../data/weddingConfig';

/**
 * Parses URL search parameters and hash to determine:
 * - `guestName`: personalized guest name from `?guest=` (safe fallback)
 * - `isPersonalized`: whether a custom `?guest=` query param was provided
 * - `isShareMode`: whether Host Share Studio should render (`?mode=share` or `#/share`)
 */
export function parseInviteRoute(loc = window.location) {
  const params = new URLSearchParams(loc.search);
  const rawGuest = params.get('guest');
  const cleanedGuest = rawGuest
    ? rawGuest.replace(/\s+/g, ' ').trim().slice(0, 72)
    : '';

  const mode = (params.get('mode') || '').toLowerCase();
  const normalizedHash = (loc.hash || '').toLowerCase().replace(/\/+$/, '');
  const isShareMode = mode === 'share' || normalizedHash === '#/share';

  return {
    guestName: cleanedGuest || weddingConfig.entrance.defaultGuestName,
    rawGuestName: cleanedGuest,
    isPersonalized: Boolean(cleanedGuest),
    isShareMode,
  };
}

/**
 * Generates a clean, WhatsApp-friendly personalized invitation link for a given family name.
 */
export function buildPersonalizedInviteUrl(guestName, loc = window.location) {
  const cleanPath = (loc.pathname || '/').replace(/index\.html$/, '');
  const baseUrl = `${loc.origin}${cleanPath}`;
  const cleaned = (guestName || '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return baseUrl;
  const params = new URLSearchParams();
  params.set('guest', cleaned);
  return `${baseUrl}?${params.toString()}`;
}
