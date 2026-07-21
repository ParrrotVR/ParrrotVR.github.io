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

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(0);
    };

    const draw = (time) => {
      context.clearRect(0, 0, width, height);

      const spacing = width < 700 ? 62 : 92;
      const columns = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
      const clock = motionQuery.matches ? 0 : time * 0.00028;
      const scroll = window.scrollY * 0.0022;
      const points = [];

      for (let row = -1; row < rows; row += 1) {
        const line = [];
        for (let column = -1; column < columns; column += 1) {
          const baseX = column * spacing + (row % 2 ? spacing * 0.5 : 0);
          const baseY = row * spacing;
          line.push({
            x: baseX + Math.sin(row * 0.72 + clock * 3 + scroll) * 18,
            y: baseY + Math.cos(column * 0.58 - clock * 2.2 + scroll * 0.45) * 9,
          });
        }
        points.push(line);
      }

      context.lineWidth = 0.7;
      context.strokeStyle = 'rgba(255, 255, 255, 0.09)';
      context.beginPath();
      points.forEach((line, row) => {
        line.forEach((point, column) => {
          const right = line[column + 1];
          const down = points[row + 1]?.[column];
          if (right) {
            context.moveTo(point.x, point.y);
            context.lineTo(right.x, right.y);
          }
          if (down) {
            context.moveTo(point.x, point.y);
            context.lineTo(down.x, down.y);
          }
        });
      });
      context.stroke();

      points.forEach((line, row) => {
        line.forEach((point, column) => {
          const pulse = (Math.sin(clock * 4 + row * 0.8 + column * 0.55) + 1) * 0.5;
          const isNode = (row + column) % 7 === 0;
          context.beginPath();
          context.arc(point.x, point.y, isNode ? 2.1 + pulse : 0.9, 0, Math.PI * 2);
          context.fillStyle = `rgba(255, 255, 255, ${isNode ? 0.42 : 0.17})`;
          context.fill();
        });
      });

      const sweepY = motionQuery.matches ? height * 0.36 : ((time * 0.035) % (height + 240)) - 120;
      const sweep = context.createLinearGradient(0, sweepY - 100, 0, sweepY + 100);
      sweep.addColorStop(0, 'rgba(255,255,255,0)');
      sweep.addColorStop(0.5, 'rgba(255,255,255,0.13)');
      sweep.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = sweep;
      context.fillRect(0, sweepY - 100, width, 200);

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

    observer.observe(wrap);
    resizeObserver.observe(canvas);
    motionQuery.addEventListener('change', start);
    resize();
    start();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      motionQuery.removeEventListener('change', start);
    };
  }, []);

  return (
    <div className="systems-field" ref={wrapRef} aria-hidden="true">
      <div className="systems-field-grid" />
      <i className="systems-orbit orbit-a" />
      <i className="systems-orbit orbit-b" />
      <i className="systems-orbit orbit-c" />
      <i className="systems-orbit orbit-d" />
      <canvas ref={canvasRef} />
    </div>
  );
}
