import { useEffect, useRef } from 'react';

export default function ClickSpark({ children, colors = ['#c8ff47', '#b657ff'], sparkCount = 10 }) {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let frame;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const burst = event => {
      if (event.button !== 0) return;
      const now = performance.now();
      for (let index = 0; index < sparkCount; index += 1) {
        sparksRef.current.push({
          x: event.clientX,
          y: event.clientY,
          angle: (Math.PI * 2 * index) / sparkCount + Math.random() * 0.16,
          speed: 28 + Math.random() * 24,
          color: colors[index % colors.length],
          born: now
        });
      }
    };

    const draw = time => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      sparksRef.current = sparksRef.current.filter(spark => {
        const progress = (time - spark.born) / 480;
        if (progress >= 1) return false;
        const eased = 1 - Math.pow(1 - progress, 3);
        const distance = spark.speed * eased;
        const length = 10 * (1 - progress);
        const x = spark.x + Math.cos(spark.angle) * distance;
        const y = spark.y + Math.sin(spark.angle) * distance;
        context.globalAlpha = 1 - progress;
        context.strokeStyle = spark.color;
        context.lineWidth = 1.7;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + Math.cos(spark.angle) * length, y + Math.sin(spark.angle) * length);
        context.stroke();
        return true;
      });
      context.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointerdown', burst, { passive: true });
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', burst);
    };
  }, [colors, sparkCount]);

  return (
    <>
      <canvas className="click-spark-canvas" ref={canvasRef} aria-hidden="true" />
      {children}
    </>
  );
}
