import { useEffect, useRef } from 'react';

export default function MysmicCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!cursor || !finePointer || reducedMotion) return undefined;

    const root = document.documentElement;
    let frame = 0;
    let visible = false;
    let initialized = false;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const animate = () => {
      currentX += (targetX - currentX) * 0.17;
      currentY += (targetY - currentY) * 0.17;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      const unsettled = Math.abs(targetX - currentX) > 0.08 || Math.abs(targetY - currentY) > 0.08;
      frame = unsettled ? window.requestAnimationFrame(animate) : 0;
    };

    const start = () => {
      if (!frame) frame = window.requestAnimationFrame(animate);
    };

    const handleMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!initialized) {
        currentX = targetX;
        currentY = targetY;
        initialized = true;
      }
      if (!visible) {
        visible = true;
        cursor.classList.add('is-visible');
      }
      start();
    };

    const handleLeave = () => {
      visible = false;
      cursor.classList.remove('is-visible');
    };

    const handleDown = () => cursor.classList.add('is-pressed');
    const handleUp = () => cursor.classList.remove('is-pressed');

    root.classList.add('has-mysmic-cursor');
    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerdown', handleDown, { passive: true });
    document.addEventListener('pointerup', handleUp, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      root.classList.remove('has-mysmic-cursor');
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerdown', handleDown);
      document.removeEventListener('pointerup', handleUp);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div className="mysmic-cursor" ref={cursorRef} aria-hidden="true">
      <span className="mysmic-cursor-ring" />
      <b />
    </div>
  );
}
