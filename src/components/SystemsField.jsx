import { useEffect, useRef } from 'react';

export default function SystemsField() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!wrap || !canvas || !context) return undefined;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let active = true;
    let width = 0;
    let height = 0;
    let stars = [];
    let pointerX = 0.5;
    let pointerY = 0.5;

    const buildStars = () => {
      let seed = 1847;
      const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
      const count = Math.min(240, Math.max(110, Math.round(width * height / 7200)));
      stars = Array.from({ length: count }, (_, index) => ({
        x: random(),
        y: random(),
        depth: 0.25 + random() * 0.75,
        size: 0.45 + random() * 1.45,
        speed: 2 + random() * 7,
        phase: random() * Math.PI * 2,
        anchor: index % 29 === 0,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
      draw(0);
    };

    const draw = (time) => {
      context.clearRect(0, 0, width, height);

      const clock = motionQuery.matches ? 0 : time * 0.001;
      const scroll = window.scrollY * 0.012;
      const parallaxX = (pointerX - 0.5) * 34;
      const parallaxY = (pointerY - 0.5) * 22;
      const projected = [];

      stars.forEach((star) => {
        const x = star.x * width + parallaxX * star.depth;
        const travel = clock * star.speed + scroll * star.depth;
        const y = ((star.y * (height + 50) + travel + parallaxY * star.depth) % (height + 50)) - 25;
        const pulse = 0.48 + Math.sin(clock * 1.7 + star.phase) * 0.28;
        const radius = star.size * star.depth;
        projected.push({ x, y, anchor: star.anchor });

        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(255,255,255,${0.18 + pulse * star.depth * 0.62})`;
        context.fill();

        if (star.anchor) {
          context.strokeStyle = `rgba(255,255,255,${0.14 + pulse * 0.18})`;
          context.lineWidth = 0.7;
          context.beginPath();
          context.moveTo(x - 5, y);
          context.lineTo(x + 5, y);
          context.moveTo(x, y - 5);
          context.lineTo(x, y + 5);
          context.stroke();
        }
      });

      const anchors = projected.filter(point => point.anchor);
      context.strokeStyle = 'rgba(255,255,255,.09)';
      context.lineWidth = 0.65;
      context.beginPath();
      anchors.forEach((point, index) => {
        const next = anchors[index + 1];
        if (next && Math.hypot(next.x - point.x, next.y - point.y) < width * 0.34) {
          context.moveTo(point.x, point.y);
          context.lineTo(next.x, next.y);
        }
      });
      context.stroke();

      const meteorPhase = motionQuery.matches ? 0.42 : (clock * 0.028) % 1;
      const meteorX = width * (1.12 - meteorPhase * 1.35);
      const meteorY = height * (0.12 + meteorPhase * 0.34);
      const meteor = context.createLinearGradient(meteorX, meteorY, meteorX + 110, meteorY - 45);
      meteor.addColorStop(0, 'rgba(255,255,255,.62)');
      meteor.addColorStop(1, 'rgba(255,255,255,0)');
      context.strokeStyle = meteor;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(meteorX, meteorY);
      context.lineTo(meteorX + 110, meteorY - 45);
      context.stroke();

      if (active && !motionQuery.matches) frame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      window.cancelAnimationFrame(frame);
      if (active) frame = window.requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) start();
      else window.cancelAnimationFrame(frame);
    });
    const resizeObserver = new ResizeObserver(resize);
    const handlePointer = (event) => {
      const rect = wrap.getBoundingClientRect();
      pointerX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      pointerY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    };

    observer.observe(wrap);
    resizeObserver.observe(canvas);
    wrap.addEventListener('pointermove', handlePointer, { passive: true });
    motionQuery.addEventListener('change', start);
    resize();
    start();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      wrap.removeEventListener('pointermove', handlePointer);
      motionQuery.removeEventListener('change', start);
    };
  }, []);

  return (
    <div className="systems-field" ref={wrapRef} aria-hidden="true">
      <div className="systems-nebula" />
      <div className="systems-horizon" />
      <canvas ref={canvasRef} />
    </div>
  );
}
