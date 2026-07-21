import { useEffect, useRef } from 'react';

const bayerMatrix = [
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5,
];

export default function DitherField() {
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
    let lastFrame = 0;
    let imageData;
    let pointerX = 0.72;
    let pointerY = 0.46;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const pixelSize = rect.width < 600 ? 4 : 5;
      canvas.width = Math.max(1, Math.ceil(rect.width / pixelSize));
      canvas.height = Math.max(1, Math.ceil(rect.height / pixelSize));
      imageData = context.createImageData(canvas.width, canvas.height);
      draw(0, true);
    };

    const draw = (time, force = false) => {
      if (!imageData) return;
      if (!force && time - lastFrame < 42) {
        frame = window.requestAnimationFrame(draw);
        return;
      }
      lastFrame = time;

      const width = canvas.width;
      const height = canvas.height;
      const clock = motionQuery.matches ? 0 : time * 0.001;
      const originX = pointerX * width;
      const originY = pointerY * height;
      const pixels = imageData.data;

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const offset = (y * width + x) * 4;
          const distance = Math.hypot(x - originX, y - originY);
          const wave = (Math.sin(distance * 0.17 - clock * 2.2) + 1) * 0.5;
          const sweep = (Math.sin(x * 0.035 + y * 0.018 + clock * 0.7) + 1) * 0.5;
          const falloff = Math.max(0, 1 - distance / (width * 0.76));
          const value = wave * 0.34 + sweep * 0.13 + falloff * 0.44;
          const threshold = bayerMatrix[(y % 4) * 4 + (x % 4)] / 16;
          const ink = value > threshold;

          pixels[offset] = 15;
          pixels[offset + 1] = 15;
          pixels[offset + 2] = 15;
          pixels[offset + 3] = ink ? 88 : 0;
        }
      }

      context.putImageData(imageData, 0, 0);
      if (active && !motionQuery.matches) frame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      window.cancelAnimationFrame(frame);
      if (active) frame = window.requestAnimationFrame(draw);
    };

    const handlePointer = (event) => {
      const rect = wrap.getBoundingClientRect();
      pointerX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      pointerY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    };

    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) start();
      else window.cancelAnimationFrame(frame);
    });
    const resizeObserver = new ResizeObserver(resize);

    observer.observe(wrap);
    resizeObserver.observe(wrap);
    wrap.addEventListener('pointermove', handlePointer);
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

  return <div className="dither-field" ref={wrapRef} aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
