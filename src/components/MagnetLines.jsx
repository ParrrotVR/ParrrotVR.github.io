import { useEffect, useRef } from 'react';

export default function MagnetLines({ rows = 7, columns = 7, lineColor = '#10215d' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!container || reducedMotion) return;
    const lines = [...container.querySelectorAll('i')];
    let frame;

    const onPointerMove = event => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        lines.forEach(line => {
          const rect = line.getBoundingClientRect();
          const angle = Math.atan2(event.clientY - (rect.top + rect.height / 2), event.clientX - (rect.left + rect.width / 2));
          line.style.setProperty('--line-angle', `${angle}rad`);
        });
      });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <div
      className="magnet-lines"
      ref={containerRef}
      style={{ '--rows': rows, '--columns': columns, '--line-color': lineColor }}
      aria-hidden="true"
    >
      {Array.from({ length: rows * columns }, (_, index) => <i key={index} />)}
    </div>
  );
}
