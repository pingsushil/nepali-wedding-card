import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, VolumeX } from 'lucide-react';
import { OPTIONAL_ASSETS } from 'virtual:optional-assets';
import { weddingConfig } from '../data/weddingConfig';

/**
 * Floating Gold Audio Atmosphere Controller targeting `/wedding-theme.mp3`.
 * Gracefully stays silent with zero console errors when `/wedding-theme.mp3`
 * has not been placed in `public/` yet, and activates immediately once added.
 */
export const AudioController = forwardRef(function AudioController(
  { visible = false },
  ref
) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(OPTIONAL_ASSETS.hasAudio);
  const [statusToast, setStatusToast] = useState('');
  const toastTimerRef = useRef(null);

  const showNotice = (msg) => {
    setStatusToast(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setStatusToast(''), 2600);
  };

  useEffect(() => {
    if (!OPTIONAL_ASSETS.hasAudio) return;

    const rawSrc = weddingConfig.audio.src || OPTIONAL_ASSETS.audioPath;
    const resolvedSrc = rawSrc.startsWith('http')
      ? rawSrc
      : `${import.meta.env.BASE_URL}${rawSrc.replace(/^\//, '')}`;
    const audio = new Audio(resolvedSrc);
    audio.loop = true;
    audio.preload = 'metadata';
    audio.volume = 0.55;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handleError = () => {
      setAudioAvailable(false);
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('error', handleError);
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('error', handleError);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const attemptAutoplay = () => {
    if (!audioAvailable || !audioRef.current) return;
    const playPromise = audioRef.current.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Browser blocked autoplay or missing codec — fail silently
          setIsPlaying(false);
        });
    }
  };

  useImperativeHandle(ref, () => ({
    attemptAutoplay,
  }));

  const handleToggle = () => {
    if (!audioAvailable || !audioRef.current) {
      showNotice('Place wedding-theme.mp3 in /public to enable music');
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-3.5 right-3.5 z-40 flex flex-col items-end gap-2"
        >
          <button
            type="button"
            onClick={handleToggle}
            aria-label={isPlaying ? 'Pause wedding music' : 'Play wedding music'}
            title={weddingConfig.audio.title}
            className="group relative flex items-center gap-1.5 rounded-full border border-[#D4AF37]/65 bg-[#3D0814]/82 px-2.5 py-1.5 text-[#F7E7CE] shadow-[0_8px_22px_rgba(0,0,0,0.42),0_0_14px_rgba(212,175,55,0.2)] backdrop-blur-md cursor-pointer active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <>
                <span className="flex items-end gap-[2.5px] h-3.5 w-4 justify-center" aria-hidden="true">
                  <span
                    className="eq-bar w-[2.5px] h-full rounded-full bg-[#F3D98B]"
                    style={{ '--eq-dur': '0.78s', '--eq-delay': '0s' }}
                  />
                  <span
                    className="eq-bar w-[2.5px] h-full rounded-full bg-[#D4AF37]"
                    style={{ '--eq-dur': '0.62s', '--eq-delay': '0.16s' }}
                  />
                  <span
                    className="eq-bar w-[2.5px] h-full rounded-full bg-[#F7E7CE]"
                    style={{ '--eq-dur': '0.88s', '--eq-delay': '0.08s' }}
                  />
                </span>
                <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#F7E7CE]">
                  Playing
                </span>
              </>
            ) : (
              <>
                {audioAvailable ? (
                  <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-[#D4AF37]/85" />
                )}
                <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#F7E7CE]/90">
                  Music
                </span>
              </>
            )}
          </button>

          <AnimatePresence>
            {statusToast && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.22 }}
                className="max-w-[230px] rounded-xl border border-[#D4AF37]/45 bg-[#2A040C]/95 px-3 py-2 text-right text-[11px] leading-snug text-[#F7E7CE] shadow-xl backdrop-blur-md"
              >
                {statusToast}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
