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
    let targetPointerX = 0.5;
    let targetPointerY = 0.5;

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
      if (!motionQuery.matches) {
        pointerX += (targetPointerX - pointerX) * 0.035;
        pointerY += (targetPointerY - pointerY) * 0.035;
      }
      const parallaxX = (pointerX - 0.5) * 34;
      const parallaxY = (pointerY - 0.5) * 22;
      const projected = [];
      const cardProgress = [...document.querySelectorAll('[data-project-card]')].map((card) => {
        const cardRect = card.getBoundingClientRect();
        return Math.min(1, Math.max(0, (height * 0.92 - cardRect.top) / (height * 0.52)));
      });
      const networkLevel = cardProgress.length
        ? cardProgress.reduce((total, progress) => total + progress, 0) / cardProgress.length
        : 0;

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
      context.strokeStyle = `rgba(255,255,255,${0.045 + networkLevel * 0.13})`;
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

      const overscan = Math.max(0, (width - window.innerWidth) * 0.5);
      const railInset = overscan + Math.max(19, window.innerWidth * 0.018);
      const nodes = [
        { x: railInset, y: height * 0.2 },
        { x: width - railInset, y: height * 0.39 },
        { x: railInset, y: height * 0.59 },
        { x: width - railInset, y: height * 0.79 },
      ];

      context.save();
      context.setLineDash([3, 8]);
      context.strokeStyle = 'rgba(255,255,255,.12)';
      context.lineWidth = 0.7;
      context.beginPath();
      context.moveTo(nodes[0].x, height * 0.1);
      context.lineTo(nodes[0].x, height * 0.9);
      context.moveTo(nodes[1].x, height * 0.1);
      context.lineTo(nodes[1].x, height * 0.9);
      context.stroke();
      context.restore();

      context.strokeStyle = 'rgba(255,255,255,.1)';
      context.lineWidth = 0.8;
      context.beginPath();
      nodes.forEach((node, index) => {
        if (index === 0) context.moveTo(node.x, node.y);
        else context.lineTo(node.x, node.y);
      });
      context.stroke();

      nodes.forEach((node, index) => {
        const reveal = cardProgress[index] || 0;
        const previous = nodes[index - 1];
        if (previous && reveal > 0) {
          const endX = previous.x + (node.x - previous.x) * reveal;
          const endY = previous.y + (node.y - previous.y) * reveal;
          context.strokeStyle = `rgba(255,255,255,${0.28 + reveal * 0.48})`;
          context.lineWidth = 1.1;
          context.beginPath();
          context.moveTo(previous.x, previous.y);
          context.lineTo(endX, endY);
          context.stroke();
        }

        const pulse = 1 + Math.sin(clock * 2.1 + index) * 0.16;
        context.strokeStyle = `rgba(255,255,255,${0.2 + reveal * 0.64})`;
        context.fillStyle = `rgba(255,255,255,${0.08 + reveal * 0.88})`;
        context.lineWidth = 0.8;
        context.beginPath();
        context.arc(node.x, node.y, (5 + reveal * 3) * pulse, 0, Math.PI * 2);
        context.stroke();
        context.beginPath();
        context.arc(node.x, node.y, 1.4 + reveal * 1.6, 0, Math.PI * 2);
        context.fill();

        context.font = '9px "DM Mono", monospace';
        context.textBaseline = 'middle';
        context.textAlign = index % 2 === 0 ? 'left' : 'right';
        context.fillStyle = `rgba(255,255,255,${0.2 + reveal * 0.58})`;
        context.fillText(`NODE 0${index + 1} / ${reveal > 0.92 ? 'LINKED' : 'SEARCHING'}`, node.x + (index % 2 === 0 ? 13 : -13), node.y);
      });

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
      targetPointerX = Math.min(1, Math.max(0, event.clientX / window.innerWidth));
      targetPointerY = Math.min(1, Math.max(0, event.clientY / window.innerHeight));
    };

    observer.observe(wrap);
    resizeObserver.observe(canvas);
    window.addEventListener('pointermove', handlePointer, { passive: true });
    motionQuery.addEventListener('change', start);
    resize();
    start();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointer);
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
