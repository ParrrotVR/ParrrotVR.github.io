import { useEffect, useRef } from 'react';

export default function Magnet({ children, strength = 4, padding = 70, className = '' }) {
  const wrapperRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const move = event => {
      const wrapper = wrapperRef.current;
      const inner = innerRef.current;
      if (!wrapper || !inner) return;
      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;
      const radiusX = rect.width / 2 + padding;
      const radiusY = rect.height / 2 + padding;
      const distance = Math.hypot(deltaX / radiusX, deltaY / radiusY);

      if (distance < 1) {
        const influence = Math.pow(1 - distance, 2);
        inner.style.transform = `translate3d(${deltaX * influence / strength}px, ${deltaY * influence / strength}px, 0)`;
        inner.classList.add('is-magnetic');
      } else {
        inner.style.transform = 'translate3d(0, 0, 0)';
        inner.classList.remove('is-magnetic');
      }
    };

    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [padding, strength]);

  return (
    <span className={`magnet ${className}`} ref={wrapperRef}>
      <span className="magnet-inner" ref={innerRef}>{children}</span>
    </span>
  );
}
