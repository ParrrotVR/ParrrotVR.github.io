import { Mesh, Program, Renderer, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform float uSpeed;
uniform float uInnerLines;
uniform float uOuterLines;
uniform float uWarpIntensity;
uniform float uRotation;
uniform float uEdgeFadeWidth;
uniform float uBrightness;

#define HALF_PI 1.5707963

float hashF(float n) {
  return fract(sin(n * 127.1) * 43758.5453123);
}

float smoothNoise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hashF(i), hashF(i + 1.0), u);
}

float displaceA(float coord, float t) {
  float result = sin(coord * 2.123) * 0.2;
  result += sin(coord * 3.234 + t * 4.345) * 0.1;
  result += sin(coord * 0.589 + t * 0.934) * 0.5;
  return result;
}

float displaceB(float coord, float t) {
  float result = sin(coord * 1.345) * 0.3;
  result += sin(coord * 2.734 + t * 3.345) * 0.2;
  result += sin(coord * 0.189 + t * 0.934) * 0.3;
  return result;
}

vec2 rotate2D(vec2 p, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

void main() {
  vec2 coords = gl_FragCoord.xy / uResolution.xy;
  coords = rotate2D(coords * 2.0 - 1.0, uRotation);

  float halfT = uTime * uSpeed * 0.5;
  float fullT = uTime * uSpeed;
  vec2 fieldA = vec2(
    coords.x + displaceA(coords.y, halfT) * uWarpIntensity,
    coords.y - displaceA(coords.x * cos(fullT) * 1.235, halfT) * uWarpIntensity
  );
  vec2 fieldB = vec2(
    coords.x + displaceB(coords.y, halfT) * uWarpIntensity,
    coords.y - displaceB(coords.x * sin(fullT) * 1.235, halfT) * uWarpIntensity
  );
  vec2 blended = mix(fieldA, fieldB, mix(fieldA, fieldB, 0.5));

  float fadeTop = smoothstep(uEdgeFadeWidth, uEdgeFadeWidth + 0.4, blended.y);
  float fadeBottom = smoothstep(-uEdgeFadeWidth, -(uEdgeFadeWidth + 0.4), blended.y);
  float verticalMask = 1.0 - max(fadeTop, fadeBottom);
  float tileCount = mix(uOuterLines, uInnerLines, verticalMask);
  float scaledY = blended.y * tileCount;
  float noiseY = smoothNoise(abs(scaledY));
  float ridge = pow(
    step(abs(noiseY - blended.x) * 2.0, HALF_PI) * cos(2.0 * (noiseY - blended.x)),
    5.0
  );

  float lines = 0.0;
  for (float i = 1.0; i < 3.0; i += 1.0) {
    lines += pow(max(fract(scaledY), fract(-scaledY)), i * 2.0);
  }

  float pattern = verticalMask * lines;
  float signal = (pattern + lines * ridge) * (0.72 + 0.28 * sin(blended.x + fullT * 0.18));
  vec3 color = vec3(signal * uBrightness);
  gl_FragColor = vec4(color, clamp(length(color), 0.0, 0.72));
}
`;

export default function LineWaves({
  speed = 0.22,
  innerLineCount = 23,
  outerLineCount = 29,
  warpIntensity = 0.72,
  rotation = -18,
  edgeFadeWidth = 0.08,
  brightness = 0.13,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false, dpr: Math.min(window.devicePixelRatio || 1, 1.5) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1, 1] },
        uSpeed: { value: speed },
        uInnerLines: { value: innerLineCount },
        uOuterLines: { value: outerLineCount },
        uWarpIntensity: { value: warpIntensity },
        uRotation: { value: (rotation * Math.PI) / 180 },
        uEdgeFadeWidth: { value: edgeFadeWidth },
        uBrightness: { value: brightness },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    gl.canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(gl.canvas);

    let frame = 0;
    let visible = false;
    let startTime = performance.now();

    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height];
      if (reducedMotion.matches) renderer.render({ scene: mesh });
    };

    const render = (time) => {
      program.uniforms.uTime.value = reducedMotion.matches ? 0 : (time - startTime) * 0.001;
      renderer.render({ scene: mesh });
      frame = visible && !reducedMotion.matches ? window.requestAnimationFrame(render) : 0;
    };

    const start = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      if (visible) {
        startTime = performance.now() - program.uniforms.uTime.value * 1000;
        frame = window.requestAnimationFrame(render);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    const resizeObserver = new ResizeObserver(resize);
    const handleMotionChange = () => {
      if (visible) start();
    };

    resize();
    renderer.render({ scene: mesh });
    observer.observe(container);
    resizeObserver.observe(container);
    reducedMotion.addEventListener('change', handleMotionChange);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      reducedMotion.removeEventListener('change', handleMotionChange);
      gl.canvas.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [speed, innerLineCount, outerLineCount, warpIntensity, rotation, edgeFadeWidth, brightness]);

  return <div className="line-waves-container" ref={containerRef} aria-hidden="true" />;
}
