import React, { useEffect, useRef } from 'react';

/**
 * InteractiveTelemetryGrid Component
 * Creates a Formula 1 aerodynamic engineering surface background:
 * 1. Desktop: Interactive gravitational elastic grid surface curvature when cursor moves (cursor pulls grid).
 * 2. Mobile / Scroll: Fluid floating aerodynamic wave & inertial parallax surface when scrolling.
 */
export const InteractiveTelemetryGrid = ({ className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Grid configuration
    const spacing = 36; // Grid cell size in px
    let cols = 0;
    let rows = 0;
    let points = [];

    // Mouse / Cursor state
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isHovering: false,
      radius: 220, // Interaction radius in px
      pullStrength: 0.42, // Gravitational pull factor
    };

    // Mobile / Scroll state
    let scrollY = window.scrollY || 0;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY || 0;
    let isTouch = false;

    // Check device type
    const checkTouch = () => {
      isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    };
    checkTouch();

    // Node class for grid points
    class Point {
      constructor(baseX, baseY, col, row) {
        this.baseX = baseX;
        this.baseY = baseY;
        this.col = col;
        this.row = row;
        this.x = baseX;
        this.y = baseY;
        this.vx = 0;
        this.vy = 0;
        this.intensity = 0; // Highlight factor (0..1)
      }

      update(time, currentMouse, isMobile, currentScrollVel) {
        // Base target position
        let targetX = this.baseX;
        let targetY = this.baseY;

        if (isMobile) {
          // MOBILE: Floating undulating aerodynamic surface wave + scroll inertia
          const wavePhase = time * 0.0018;
          const waveX = Math.sin(this.baseY * 0.012 + wavePhase) * 6;
          const waveY = Math.cos(this.baseX * 0.012 + wavePhase) * 8 + currentScrollVel * 0.35;
          targetX += waveX;
          targetY += waveY;
          this.intensity = Math.max(0, (Math.sin(this.baseX * 0.01 + this.baseY * 0.01 + wavePhase) + 1) * 0.25);
        } else if (currentMouse.isHovering) {
          // DESKTOP: Cursor gravitational pull deformation
          const dx = currentMouse.x - this.baseX;
          const dy = currentMouse.y - this.baseY;
          const dist = Math.hypot(dx, dy);

          if (dist < currentMouse.radius) {
            // Elastic radial curve (pull grid toward cursor)
            const normDist = dist / currentMouse.radius;
            const pull = (1 - normDist) ** 2 * currentMouse.pullStrength;
            targetX += dx * pull;
            targetY += dy * pull;

            // Highlight intensity based on proximity
            this.intensity = (1 - normDist) ** 1.5;
          } else {
            this.intensity = 0;
          }
        } else {
          this.intensity = 0;
        }

        // Spring physics relaxation to target
        const spring = isMobile ? 0.06 : 0.12;
        const friction = isMobile ? 0.88 : 0.78;

        this.vx += (targetX - this.x) * spring;
        this.vy += (targetY - this.y) * spring;
        this.vx *= friction;
        this.vy *= friction;
        this.x += this.vx;
        this.y += this.vy;
      }
    }

    // Initialize or resize grid mesh
    const initGrid = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / spacing) + 2;
      rows = Math.ceil(height / spacing) + 2;
      points = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = (c - 0.5) * spacing;
          const by = (r - 0.5) * spacing;
          points.push(new Point(bx, by, c, r));
        }
      }
    };

    initGrid();

    // Mouse Listeners (Desktop)
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovering = false;
    };

    // Scroll Listener (Mobile floating inertia)
    const handleScroll = () => {
      const currentY = window.scrollY || 0;
      scrollVelocity = (currentY - lastScrollY) * 0.4;
      lastScrollY = currentY;
    };

    const handleResize = () => {
      checkTouch();
      initGrid();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Animation Render Loop
    let startTime = performance.now();

    const render = (now) => {
      const time = now - startTime;

      // Smooth mouse coordinate interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.2;
      mouse.y += (mouse.targetY - mouse.y) * 0.2;

      // Damp scroll velocity gradually
      scrollVelocity *= 0.92;

      // Check current color theme (dark vs light mode)
      const isDark = document.documentElement.classList.contains('dark');
      ctx.clearRect(0, 0, width, height);

      // 1. Update all mesh points
      for (let i = 0; i < points.length; i++) {
        points[i].update(time, mouse, isTouch, scrollVelocity);
      }

      // 2. Draw Horizontal Grid Splines
      ctx.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        const rowPoints = [];
        for (let c = 0; c < cols; c++) {
          rowPoints.push(points[r * cols + c]);
        }

        ctx.beginPath();
        ctx.moveTo(rowPoints[0].x, rowPoints[0].y);

        for (let c = 1; c < cols; c++) {
          const pt = rowPoints[c];
          const prev = rowPoints[c - 1];
          const midX = (prev.x + pt.x) / 2;
          const midY = (prev.y + pt.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
        }

        // Draw line with theme aware stroke
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
        ctx.stroke();
      }

      // 3. Draw Vertical Grid Splines
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        const startPt = points[c];
        ctx.moveTo(startPt.x, startPt.y);

        for (let r = 1; r < rows; r++) {
          const pt = points[r * cols + c];
          const prev = points[(r - 1) * cols + c];
          const midX = (prev.x + pt.x) / 2;
          const midY = (prev.y + pt.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
        }

        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
        ctx.stroke();
      }

      // 4. Highlighted Dynamic Warp Mesh near Cursor / Scroll Wave
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pt = points[r * cols + c];
          if (pt.intensity > 0.04) {
            // Draw glowing node point
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.5 + pt.intensity * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(244, 63, 94, ${pt.intensity * 0.75})`;
            ctx.fill();

            // Connect nearby dynamic lines with highlighted accent stroke
            if (c < cols - 1) {
              const nextX = points[r * cols + c + 1];
              if (nextX.intensity > 0.04) {
                ctx.beginPath();
                ctx.moveTo(pt.x, pt.y);
                ctx.lineTo(nextX.x, nextX.y);
                ctx.strokeStyle = `rgba(244, 63, 94, ${(pt.intensity + nextX.intensity) * 0.28})`;
                ctx.stroke();
              }
            }

            if (r < rows - 1) {
              const nextY = points[(r + 1) * cols + c];
              if (nextY.intensity > 0.04) {
                ctx.beginPath();
                ctx.moveTo(pt.x, pt.y);
                ctx.lineTo(nextY.x, nextY.y);
                ctx.strokeStyle = `rgba(244, 63, 94, ${(pt.intensity + nextY.intensity) * 0.28})`;
                ctx.stroke();
              }
            }
          }
        }
      }

      // 5. Radial cursor illumination spotlight on Desktop
      if (!isTouch && mouse.isHovering) {
        const glow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius
        );
        glow.addColorStop(0, 'rgba(244, 63, 94, 0.08)');
        glow.addColorStop(0.5, 'rgba(244, 63, 94, 0.02)');
        glow.addColorStop(1, 'transparent');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden z-0 transition-opacity duration-700 ${className}`}
      aria-hidden="true"
    >
      {/* Interactive Elastic & Floating Surface Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Smooth Perimeter Vignette Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-white/70 dark:to-[#09090b]/80" />
    </div>
  );
};

export default InteractiveTelemetryGrid;
