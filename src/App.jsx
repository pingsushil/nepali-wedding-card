import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion';
import { parseInviteRoute, buildPersonalizedInviteUrl } from './utils/urlParams';
import { RoyalDoors } from './components/RoyalDoors';
import { AmbientCanvas } from './components/AmbientCanvas';
import { AudioController } from './components/AudioController';
import { HeroSection } from './components/HeroSection';
import { EventsTimeline } from './components/EventsTimeline';
import { BangkokSaganSection } from './components/BangkokSaganSection';
import { BlessingWall } from './components/BlessingWall';
import { FooterSection } from './components/FooterSection';
import { ShareStudio } from './components/ShareStudio';

export default function App() {
  const prefersReduced = useReducedMotion();
  const reducedMotion = Boolean(prefersReduced);

  const [route, setRoute] = useState(() => parseInviteRoute());
  const [hasBegunReveal, setHasBegunReveal] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const audioRef = useRef(null);

  // Sync URL/hash navigation (e.g., entering or leaving #/share or ?mode=share)
  useEffect(() => {
    const syncRoute = () => setRoute(parseInviteRoute());
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  // Lock viewport scroll before the 3D Royal Nepali Doors open
  useEffect(() => {
    const shouldLock = !route.isShareMode && !isUnlocked;
    if (shouldLock) {
      document.body.classList.add('scroll-locked');
      window.scrollTo(0, 0);
    } else {
      document.body.classList.remove('scroll-locked');
    }
    return () => {
      document.body.classList.remove('scroll-locked');
    };
  }, [route.isShareMode, isUnlocked]);

  const handleBeginOpen = () => {
    setHasBegunReveal(true);
    // Attempt background music playback inside the user gesture
    audioRef.current?.attemptAutoplay();
  };

  const handleDoorsOpened = () => {
    setIsUnlocked(true);
  };

  const handleExitShareStudio = (previewGuestName) => {
    const targetUrl = buildPersonalizedInviteUrl(previewGuestName);
    window.history.pushState({}, '', targetUrl);
    setHasBegunReveal(false);
    setIsUnlocked(false);
    setRoute(parseInviteRoute());
  };

  // Hidden Host Share Studio Mode (?mode=share or #/share)
  if (route.isShareMode) {
    return (
      <MotionConfig reducedMotion="user">
        <ShareStudio onExitToPreview={handleExitShareStudio} />
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-[100dvh] w-full overflow-x-clip royal-silk-bg">
        {/* Soft Cinema Vignette Lighting */}
        <div
          aria-hidden="true"
          className="royal-vignette fixed inset-0 z-10 pointer-events-none"
        />

        {/* Lightweight Continuous Golden Bokeh & Marigold Petals Canvas (<= 28 particles) */}
        <AmbientCanvas visible={hasBegunReveal} reducedMotion={reducedMotion} />

        {/* Sleek Floating Gold Audio Controller (top-right corner) */}
        <AudioController ref={audioRef} visible={hasBegunReveal} />

        {/* Pre-Open Luxury Entrance: 3D Royal Nepali Double Doors */}
        <AnimatePresence>
          {!isUnlocked && (
            <RoyalDoors
              guestName={route.guestName}
              onBeginOpen={handleBeginOpen}
              onOpened={handleDoorsOpened}
              reducedMotion={reducedMotion}
            />
          )}
        </AnimatePresence>

        {/* Main Revealed Wedding Invitation Experience */}
        <main
          aria-hidden={!isUnlocked}
          className="relative z-20 w-full transition-opacity duration-700"
          style={{ opacity: hasBegunReveal ? 1 : 0.25 }}
        >
          <HeroSection
            guestName={route.guestName}
            isRevealed={hasBegunReveal}
            reducedMotion={reducedMotion}
          />

          <EventsTimeline reducedMotion={reducedMotion} />

          <BangkokSaganSection reducedMotion={reducedMotion} />

          <BlessingWall
            initialGuestName={route.rawGuestName}
            isPersonalized={route.isPersonalized}
            reducedMotion={reducedMotion}
          />

          <FooterSection reducedMotion={reducedMotion} />
        </main>
      </div>
    </MotionConfig>
  );
}
