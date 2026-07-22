import { Geometry, Mesh, Program, Renderer } from 'ogl';
import { useEffect, useRef } from 'react';

const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

uniform float uTime;
uniform vec2 uResolution;

#define MAX_STEPS 14
#define PI 3.14159
#define TAU 6.28318

void main() {
  vec2 pixel = gl_FragCoord.xy;
  vec2 centered = pixel - 0.5 * uResolution;
  float angle = -0.18;
  centered = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * centered;
  pixel = centered + 0.5 * uResolution;

  float time = uTime * PI;
  float distanceTravelled = 0.0;
  float shortest = 1.0;
  vec3 origin = vec3(0.0, 0.0, -7.0);
  vec3 direction = normalize(vec3((pixel - 0.5 * uResolution) / uResolution.y, 0.82));
  vec2 field = vec2(0.0);

  for (int index = 0; index < MAX_STEPS; ++index) {
    vec3 point = origin + direction * distanceTravelled;
    point.x -= 14.8;
    float x = point.x;
    float firstBend = 0.82 + sin(time * 0.7 + x * 0.8) * 0.1;
    float secondBend = 0.46 + cos(time * 0.9 + x * 1.1) * 0.1;
    vec2 firstOffset = sin(vec2(x, x + 1.5708) + time * 0.038) * firstBend;
    vec2 secondOffset = cos(vec2(x, x + 1.5708) - time * 0.03) * secondBend;
    field.x = max(x + 0.28, length(point.yz - firstOffset) - 0.28);
    field.y = max(x + 0.28, length(point.yz - secondOffset) - 0.28);
    shortest = min(shortest, min(field.x, field.y));
    if (shortest < 0.001 || distanceTravelled > 300.0) break;
    distanceTravelled += shortest * 0.7;
  }

  float depth = sqrt(distanceTravelled);
  vec3 raw = max(cos(distanceTravelled * TAU) - shortest * depth - vec3(field, 0.0), 0.0);
  raw.gb += 0.08;
  float maximum = max(raw.r, max(raw.g, raw.b));
  if (maximum < 0.15) discard;
  raw = raw * 0.4 + raw.brg * 0.6 + raw * raw;
  float luminance = dot(raw, vec3(0.299, 0.587, 0.114)) * 1.75;
  gl_FragColor = vec4(vec3(luminance), clamp(luminance, 0.0, 0.68));
}
`;

export default function PlasmaWave() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false, dpr: Math.min(window.devicePixelRatio || 1, 1.35) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const resolution = new Float32Array([1, 1]);
    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
    });
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: resolution },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    gl.canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(gl.canvas);

    let frame = 0;
    let visible = false;
    const startedAt = performance.now();

    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height);
      resolution[0] = gl.canvas.width;
      resolution[1] = gl.canvas.height;
      if (reducedMotion.matches) renderer.render({ scene: mesh });
    };

    const render = (time) => {
      program.uniforms.uTime.value = reducedMotion.matches ? 0 : (time - startedAt) * 0.001;
      renderer.render({ scene: mesh });
      frame = visible && !reducedMotion.matches ? window.requestAnimationFrame(render) : 0;
    };

    const start = () => {
      window.cancelAnimationFrame(frame);
      frame = visible ? window.requestAnimationFrame(render) : 0;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    const resizeObserver = new ResizeObserver(resize);

    resize();
    renderer.render({ scene: mesh });
    observer.observe(container);
    resizeObserver.observe(container);
    reducedMotion.addEventListener('change', start);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      reducedMotion.removeEventListener('change', start);
      gl.canvas.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <div className="plasma-wave-container" ref={containerRef} aria-hidden="true" />;
}
