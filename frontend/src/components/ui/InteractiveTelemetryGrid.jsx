import React, { useEffect, useRef, useState } from 'react';

/**
 * InteractiveTelemetryGrid Component
 * Creates an elegant, high-performance technical engineering grid background with
 * interactive mouse-proximity illumination and a soft radial cursor glow.
 */
export const InteractiveTelemetryGrid = ({ className = '' }) => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);
  const rafRef = useRef(null);
  const targetPosRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    // Check if device supports fine hover (mouse / trackpad)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setMousePos({ x: targetPosRef.current.x, y: targetPosRef.current.y });
          setIsHovering(true);
          rafRef.current = null;
        });
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none fixed inset-0 overflow-hidden z-0 transition-opacity duration-700 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Base Static Telemetry Grid Lines (32px pitch) */}
      <div className="absolute inset-0 bg-racing-grid opacity-60 dark:opacity-40" />

      {/* 2. Interactive Spotlight Grid Illumination (Follows Mouse Cursor) */}
      {isHovering && (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `
              radial-gradient(
                450px circle at ${mousePos.x}px ${mousePos.y}px,
                rgba(244, 63, 94, 0.07),
                rgba(244, 63, 94, 0.02) 40%,
                transparent 80%
              )
            `,
          }}
        />
      )}

      {/* 3. Dynamic Brightened Grid Overlay near Cursor */}
      {isHovering && (
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{
            maskImage: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
          }}
        >
          {/* Brighter Grid in dark mode and light mode */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(244, 63, 94, 0.22) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(244, 63, 94, 0.22) 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px',
            }}
          />
        </div>
      )}

      {/* 4. Soft Vignette to blend into page margins smoothly */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-white/80 dark:to-[#09090b]/90" />
    </div>
  );
};

export default InteractiveTelemetryGrid;
