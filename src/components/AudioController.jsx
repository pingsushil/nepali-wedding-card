import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music } from 'lucide-react';
import { OPTIONAL_ASSETS } from 'virtual:optional-assets';
import { weddingConfig } from '../data/weddingConfig';
import { translations } from '../data/translations';
import { NepaliWeddingSynth } from '../utils/nepaliWeddingAudio';

/**
 * Floating Gold Audio Atmosphere Controller.
 * - Uses `/wedding-theme.mp3` automatically whenever placed in `public/wedding-theme.mp3`.
 * - Otherwise seamlessly plays the built-in Royal Nepali Mangal Dhun (Bansuri + Tanpura
 *   + Santoor) Web Audio synthesizer so background music works immediately out of the box!
 */
export const AudioController = forwardRef(function AudioController(
  { visible = false, lang = 'en' },
  ref
) {
  const audioRef = useRef(null);
  const synthRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [useCustomMp3, setUseCustomMp3] = useState(OPTIONAL_ASSETS.hasAudio);

  const t = translations[lang]?.audio || translations.en.audio;

  useEffect(() => {
    if (!OPTIONAL_ASSETS.hasAudio) {
      synthRef.current = new NepaliWeddingSynth();
      return () => {
        synthRef.current?.destroy();
        synthRef.current = null;
      };
    }

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
      // Gracefully fall back to built-in Mangal Dhun synth if custom MP3 fails
      setUseCustomMp3(false);
      if (!synthRef.current) {
        synthRef.current = new NepaliWeddingSynth();
      }
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
      synthRef.current?.destroy();
      synthRef.current = null;
    };
  }, []);

  const startPlayback = () => {
    if (useCustomMp3 && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
      return;
    }

    if (!synthRef.current) {
      synthRef.current = new NepaliWeddingSynth();
    }
    synthRef.current
      .play()
      .then((ok) => {
        if (ok) setIsPlaying(true);
      })
      .catch(() => setIsPlaying(false));
  };

  const stopPlayback = () => {
    if (useCustomMp3 && audioRef.current) {
      audioRef.current.pause();
    }
    synthRef.current?.pause();
    setIsPlaying(false);
  };

  useImperativeHandle(ref, () => ({
    attemptAutoplay: startPlayback,
  }));

  const handleToggle = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
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
          className="fixed top-3.5 right-3.5 z-[60] flex flex-col items-end gap-2"
        >
          <button
            type="button"
            onClick={handleToggle}
            data-testid="music-toggle-btn"
            aria-label={isPlaying ? t.pauseAria : t.playAria}
            aria-pressed={isPlaying}
            title={weddingConfig.audio.title}
            className="group relative flex items-center gap-1.5 rounded-full border border-[#D4AF37]/65 bg-[#3D0814]/88 px-2.5 py-1.5 text-[#F7E7CE] shadow-[0_8px_22px_rgba(0,0,0,0.45),0_0_14px_rgba(212,175,55,0.22)] backdrop-blur-md cursor-pointer active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <>
                <span
                  className="flex items-end gap-[2.5px] h-3.5 w-4 justify-center"
                  aria-hidden="true"
                >
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
                <span
                  className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#FFF4D4]"
                  style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
                >
                  {t.playing}
                </span>
              </>
            ) : (
              <>
                <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span
                  className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#F7E7CE]/90"
                  style={lang === 'ne' ? { fontFamily: 'var(--font-nepali)' } : undefined}
                >
                  {t.music}
                </span>
              </>
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
