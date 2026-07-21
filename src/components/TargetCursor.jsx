import { useEffect, useRef } from 'react';

const restingCorners = [
  [-16, -16],
  [4, -16],
  [4, 4],
  [-16, 4]
];

export default function TargetCursor({ targetSelector = '.cursor-target' }) {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const cornersRef = useRef([]);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const corners = cornersRef.current;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let activeTarget = null;
    let frame;

    document.body.classList.add('has-target-cursor');

    const setTarget = target => {
      if (target === activeTarget) return;
      activeTarget = target;
      cursor.classList.toggle('is-targeting', Boolean(target));
      dot.textContent = target?.dataset.cursorLabel || '';
    };

    const onMove = event => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursor.classList.add('is-visible');
      setTarget(event.target.closest(targetSelector));
    };

    const onDown = () => cursor.classList.add('is-down');
    const onUp = () => cursor.classList.remove('is-down');
    const onLeave = () => cursor.classList.remove('is-visible');

    const render = () => {
      currentX += (mouseX - currentX) * 0.24;
      currentY += (mouseY - currentY) * 0.24;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      if (activeTarget?.isConnected) {
        const rect = activeTarget.getBoundingClientRect();
        const positions = [
          [rect.left - currentX - 5, rect.top - currentY - 5],
          [rect.right - currentX - 9, rect.top - currentY - 5],
          [rect.right - currentX - 9, rect.bottom - currentY - 9],
          [rect.left - currentX - 5, rect.bottom - currentY - 9]
        ];
        corners.forEach((corner, index) => {
          corner.style.transform = `translate3d(${positions[index][0]}px, ${positions[index][1]}px, 0)`;
        });
      } else {
        corners.forEach((corner, index) => {
          corner.style.transform = `translate3d(${restingCorners[index][0]}px, ${restingCorners[index][1]}px, 0)`;
        });
      }

      frame = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      document.body.classList.remove('has-target-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [targetSelector]);

  return (
    <div className="target-cursor" ref={cursorRef} aria-hidden="true">
      <span className="target-cursor-dot" ref={dotRef} />
      {restingCorners.map((_, index) => (
        <i
          className={`target-cursor-corner corner-${index}`}
          key={index}
          ref={element => { cornersRef.current[index] = element; }}
        />
      ))}
    </div>
  );
}
