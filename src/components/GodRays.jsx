import { useEffect, useRef } from 'react';
import { Renderer, Program, Triangle, Mesh } from 'ogl';

const vertex = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragment = `
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 uMouse;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float beam(vec2 uv, vec2 source, float offset, float width, float drift) {
  vec2 delta = uv - source;
  float angle = atan(delta.x, delta.y);
  float distance = length(delta);
  float center = offset + sin(iTime * drift + distance * 3.0) * 0.025;
  float ray = exp(-pow((angle - center) / width, 2.0));
  float falloff = smoothstep(1.35, 0.05, distance);
  return ray * falloff;
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  uv.y = 1.0 - uv.y;
  vec2 source = vec2(mix(0.28, 0.72, uMouse.x), -0.14);
  float light = 0.0;
  light += beam(uv, source, -0.46, 0.095, 0.22) * 0.55;
  light += beam(uv, source, -0.23, 0.14, 0.17) * 0.72;
  light += beam(uv, source,  0.02, 0.17, 0.13) * 0.8;
  light += beam(uv, source,  0.30, 0.11, 0.2) * 0.62;
  light += beam(uv, source,  0.52, 0.075, 0.25) * 0.4;
  float grain = mix(0.86, 1.1, hash(gl_FragCoord.xy + floor(iTime * 8.0)));
  light *= grain;
  light *= smoothstep(1.0, 0.08, uv.y);
  gl_FragColor = vec4(vec3(light), light * 0.72);
}`;

export default function GodRays() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio || 1, 1.5) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    container.appendChild(gl.canvas);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] },
      uMouse: { value: [0.5, 0.5] }
    };
    const program = new Program(gl, { vertex, fragment, uniforms });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const mouse = [0.5, 0.5];
    const target = [0.5, 0.5];
    let frame;
    let visible = true;

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      uniforms.iResolution.value = [gl.canvas.width, gl.canvas.height];
    };
    const move = event => {
      const rect = container.getBoundingClientRect();
      target[0] = (event.clientX - rect.left) / rect.width;
      target[1] = (event.clientY - rect.top) / rect.height;
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(container);
    resizeObserver.observe(container);
    container.addEventListener('pointermove', move);
    resize();

    const render = time => {
      frame = requestAnimationFrame(render);
      if (!visible || document.hidden) return;
      mouse[0] += (target[0] - mouse[0]) * 0.025;
      mouse[1] += (target[1] - mouse[1]) * 0.025;
      uniforms.uMouse.value = mouse;
      uniforms.iTime.value = reducedMotion ? 0 : time * 0.001;
      renderer.render({ scene: mesh });
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', move);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <div className="god-rays" ref={containerRef} aria-hidden="true" />;
}
