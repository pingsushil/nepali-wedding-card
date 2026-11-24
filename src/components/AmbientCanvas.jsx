import React, { useEffect, useRef } from 'react';

const MAX_PARTICLES = 28; // Strictly capped at 28 particles for silky 60fps mobile performance

/**
 * Lightweight continuous HTML5 Canvas atmosphere of drifting golden bokeh
 * and soft Nepali Sayapatri (marigold) petals. Fades in smoothly after reveal.
 */
export function AmbientCanvas({ visible = false, reducedMotion = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let rafId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Create 18 golden bokeh orbs + 10 Sayapatri marigold petals = 28 total particles
    const particles = Array.from({ length: MAX_PARTICLES }, (_, index) => {
      const isPetal = index >= 18;
      return {
        type: isPetal ? 'petal' : 'bokeh',
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isPetal ? 4.2 + Math.random() * 3.8 : 2.2 + Math.random() * 5.4,
        vx: (Math.random() - 0.5) * (isPetal ? 0.32 : 0.16),
        vy: isPetal ? 0.36 + Math.random() * 0.42 : -(0.14 + Math.random() * 0.28),
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.008 + Math.random() * 0.012,
        swayAmp: isPetal ? 0.48 + Math.random() * 0.45 : 0.16,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.022,
        alpha: isPetal ? 0.24 + Math.random() * 0.24 : 0.14 + Math.random() * 0.26,
        hue: isPetal
          ? index % 2 === 0
            ? '#F59E0B' // Bright Sayapatri marigold
            : '#E67E22' // Deep tangerine marigold
          : index % 3 === 0
          ? '#F7E7CE' // Champagne glow
          : '#D4AF37', // Antique metallic gold
      };
    });

    const drawFrame = (advance = true) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (advance) {
          p.swayPhase += p.swaySpeed;
          p.x += p.vx + Math.sin(p.swayPhase) * p.swayAmp;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;

          // Seamless vertical wrapping
          if (p.type === 'petal' && p.y > height + 20) {
            p.y = -18;
            p.x = Math.random() * width;
          } else if (p.type === 'bokeh' && p.y < -20) {
            p.y = height + 18;
            p.x = Math.random() * width;
          }

          // Horizontal wrap
          if (p.x > width + 20) p.x = -16;
          if (p.x < -20) p.x = width + 16;
        }

        if (p.type === 'bokeh') {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.2);
          grad.addColorStop(0, p.hue);
          grad.addColorStop(0.45, p.hue);
          grad.addColorStop(1, 'rgba(212, 175, 55, 0)');

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Soft curled Sayapatri marigold petal silhouette
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.hue;
          ctx.beginPath();
          ctx.moveTo(0, -p.radius);
          ctx.bezierCurveTo(
            p.radius * 0.9,
            -p.radius * 0.55,
            p.radius * 0.85,
            p.radius * 0.65,
            0,
            p.radius
          );
          ctx.bezierCurveTo(
            -p.radius * 0.75,
            p.radius * 0.55,
            -p.radius * 0.85,
            -p.radius * 0.5,
            0,
            -p.radius
          );
          ctx.fill();
          ctx.restore();
        }
      }
    };

    if (reducedMotion) {
      drawFrame(false);
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
    }

    const loop = () => {
      if (!document.hidden) {
        drawFrame(true);
      }
      rafId = window.requestAnimationFrame(loop);
    };

    rafId = window.requestAnimationFrame(loop);
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [visible, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-10 pointer-events-none transition-opacity duration-1000"
      style={{ opacity: visible ? 1 : 0 }}
    />
  );
}
