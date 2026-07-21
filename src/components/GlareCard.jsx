export default function GlareCard({ children, className = '' }) {
  const onPointerMove = event => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty('--pointer-x', `${x * 100}%`);
    card.style.setProperty('--pointer-y', `${y * 100}%`);
    card.style.setProperty('--tilt-x', `${(0.5 - y) * 2.2}deg`);
    card.style.setProperty('--tilt-y', `${(x - 0.5) * 2.2}deg`);
  };

  const onPointerLeave = event => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  return <div className={`glare-card ${className}`} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>{children}</div>;
}
