import confetti from 'canvas-confetti';

const ROYAL_GOLD_PALETTE = ['#D4AF37', '#F7E7CE', '#FFE599', '#E6B422', '#B8860B'];
const CELEBRATION_PALETTE = ['#D4AF37', '#F7E7CE', '#F59E0B', '#9E1B2B', '#FFE8A3'];

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Golden sparkle burst radiating from the center wax seal on invitation reveal.
 */
export function triggerWaxSealBurst(origin = { x: 0.5, y: 0.52 }) {
  if (prefersReducedMotion()) return;
  try {
    confetti({
      particleCount: 44,
      spread: 76,
      startVelocity: 26,
      gravity: 0.65,
      ticks: 130,
      scalar: 0.78,
      origin,
      colors: ROYAL_GOLD_PALETTE,
      disableForReducedMotion: true,
    });
    window.setTimeout(() => {
      confetti({
        particleCount: 22,
        spread: 110,
        startVelocity: 18,
        gravity: 0.5,
        ticks: 110,
        scalar: 0.65,
        origin,
        colors: CELEBRATION_PALETTE,
        disableForReducedMotion: true,
      });
    }, 140);
  } catch {
    // Ignore canvas-confetti errors in restricted environments
  }
}

/**
 * Mini gold confetti pop when copying eSewa/Fonepay ID or posting a blessing.
 */
export function triggerMiniGoldPop(origin = { x: 0.5, y: 0.72 }) {
  if (prefersReducedMotion()) return;
  try {
    confetti({
      particleCount: 26,
      spread: 58,
      startVelocity: 22,
      gravity: 0.85,
      ticks: 95,
      scalar: 0.72,
      origin,
      colors: ROYAL_GOLD_PALETTE,
      disableForReducedMotion: true,
    });
  } catch {
    // Ignore errors gracefully
  }
}
