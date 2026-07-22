import { Mesh, Program, Renderer, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform float uSpeed;
uniform float uScale;
uniform float uBrightness;
uniform float uNoiseFrequency;
uniform float uBandSpread;

#define TAU 6.28318

vec3 gradientHash(vec3 p) {
  p = vec3(
    dot(p, vec3(127.1, 311.7, 234.6)),
    dot(p, vec3(269.5, 183.3, 198.3)),
    dot(p, vec3(169.5, 283.3, 156.9))
  );
  vec3 h = fract(sin(p) * 43758.5453123);
  float phi = acos(2.0 * h.x - 1.0);
  float theta = TAU * h.y;
  return vec3(cos(theta) * sin(phi), sin(theta) * cos(phi), cos(phi));
}

float quintic(float value) {
  float value2 = value * value;
  float value3 = value * value2;
  return 6.0 * value3 * value2 - 15.0 * value2 * value2 + 10.0 * value3;
}

float perlin3D(float amplitude, float frequency, vec3 point) {
  vec3 samplePoint = vec3(point.xy * frequency, point.z);
  vec3 low = floor(samplePoint);
  vec3 high = ceil(samplePoint);

  float d000 = dot(gradientHash(vec3(low.x, low.y, low.z)), samplePoint - vec3(low.x, low.y, low.z));
  float d100 = dot(gradientHash(vec3(high.x, low.y, low.z)), samplePoint - vec3(high.x, low.y, low.z));
  float d010 = dot(gradientHash(vec3(low.x, high.y, low.z)), samplePoint - vec3(low.x, high.y, low.z));
  float d110 = dot(gradientHash(vec3(high.x, high.y, low.z)), samplePoint - vec3(high.x, high.y, low.z));
  float d001 = dot(gradientHash(vec3(low.x, low.y, high.z)), samplePoint - vec3(low.x, low.y, high.z));
  float d101 = dot(gradientHash(vec3(high.x, low.y, high.z)), samplePoint - vec3(high.x, low.y, high.z));
  float d011 = dot(gradientHash(vec3(low.x, high.y, high.z)), samplePoint - vec3(low.x, high.y, high.z));
  float d111 = dot(gradientHash(vec3(high.x, high.y, high.z)), samplePoint - vec3(high.x, high.y, high.z));

  vec3 blend = vec3(quintic(samplePoint.x - low.x), quintic(samplePoint.y - low.y), quintic(samplePoint.z - low.z));
  float lowZ = mix(mix(d000, d100, blend.x), mix(d010, d110, blend.x), blend.y);
  float highZ = mix(mix(d001, d101, blend.x), mix(d011, d111, blend.x), blend.y);
  return amplitude * mix(lowZ, highZ, blend.z);
}

float auroraGlow(vec2 uv, float timeOffset, float heightOffset) {
  float noiseValue = 0.0;
  float frequency = uNoiseFrequency;
  float amplitude = 0.82;
  vec2 samplePosition = uv * uScale;

  for (float octave = 0.0; octave < 3.0; octave += 1.0) {
    noiseValue += perlin3D(amplitude, frequency, vec3(samplePosition, timeOffset));
    amplitude *= 0.24;
    frequency *= 2.0;
  }

  float band = uv.y * 8.0 - heightOffset;
  return 0.34 * max(exp(uBandSpread * (1.0 - 1.25 * abs(noiseValue + band))), 0.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.y;
  float time = uTime * uSpeed;
  float first = auroraGlow(uv, time * 0.38, 3.6);
  float second = auroraGlow(uv, time * 0.38 + 1.7, 4.25);
  float horizontalFade = smoothstep(-0.12, 0.16, uv.x) * (1.0 - smoothstep(1.35, 1.78, uv.x));
  float luminance = (first * 0.72 + second * 0.42) * horizontalFade * uBrightness;
  vec3 color = vec3(luminance);
  gl_FragColor = vec4(color, clamp(luminance * 1.35, 0.0, 0.7));
}
`;

export default function SoftAurora({ speed = 0.42, scale = 1.28, brightness = 0.68, noiseFrequency = 1.9, bandSpread = 1.08 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false, dpr: Math.min(window.devicePixelRatio || 1, 1.5) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1, 1] },
        uSpeed: { value: speed },
        uScale: { value: scale },
        uBrightness: { value: brightness },
        uNoiseFrequency: { value: noiseFrequency },
        uBandSpread: { value: bandSpread },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    gl.canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(gl.canvas);

    let frame = 0;
    let visible = false;
    const startedAt = performance.now();

    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height];
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
  }, [speed, scale, brightness, noiseFrequency, bandSpread]);

  return <div className="soft-aurora-container" ref={containerRef} aria-hidden="true" />;
}
