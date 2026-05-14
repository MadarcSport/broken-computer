import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  ShaderMaterial,
} from "three";

type SoftRainProps = {
  count?: number;
  color?: string;
  opacity?: number;
  width?: number;
  height?: number;
  depth?: number;
};

const vertexShader = `
  uniform float uTime;
  uniform float uHeight;

  attribute float aSpeed;
  attribute float aSize;
  attribute float aPhase;

  varying float vAlpha;

  void main() {
    vec3 pos = position;

    float cycle = uHeight;
    float y = mod(position.y + aPhase - (uTime * aSpeed), cycle);
    pos.y = y - cycle * 0.5;

    float localY = y / cycle;
    vAlpha = smoothstep(0.0, 0.15, localY) * (1.0 - smoothstep(0.82, 1.0, localY));

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float perspective = 220.0 / max(1.0, -mvPosition.z);
    gl_PointSize = aSize * perspective * 0.02;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float x = abs(uv.x);
    float y = abs(uv.y);

    float streak = smoothstep(0.34, 0.0, x) * smoothstep(0.48, 0.0, y);
    float core = smoothstep(0.20, 0.0, x) * smoothstep(0.30, 0.0, y);
    float alpha = (streak * 0.7 + core * 0.3) * uOpacity * vAlpha;

    if (alpha < 0.01) {
      discard;
    }

    gl_FragColor = vec4(uColor, alpha);
  }
`;

export function SoftRain({
  count = 700,
  color = "#e8f2ff",
  opacity = 0.22,
  width = 10,
  height = 7,
  depth = 8,
}: SoftRainProps) {
  const materialRef = useRef<ShaderMaterial | null>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const index = i * 3;
      positions[index] = (Math.random() - 0.5) * width;
      positions[index + 1] = Math.random() * height;
      positions[index + 2] = (Math.random() - 0.5) * depth;

      speeds[i] = 0.6 + Math.random() * 1.4;
      sizes[i] = 8 + Math.random() * 18;
      phases[i] = Math.random() * height;
    }

    const rainGeometry = new BufferGeometry();
    rainGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(positions, 3),
    );
    rainGeometry.setAttribute("aSpeed", new Float32BufferAttribute(speeds, 1));
    rainGeometry.setAttribute("aSize", new Float32BufferAttribute(sizes, 1));
    rainGeometry.setAttribute("aPhase", new Float32BufferAttribute(phases, 1));

    return rainGeometry;
  }, [count, depth, height, width]);

  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uHeight: { value: height },
        uColor: { value: new Color(color) },
        uOpacity: { value: opacity },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: AdditiveBlending,
      toneMapped: false,
    });
  }, [color, height, opacity]);

  useEffect(() => {
    materialRef.current = material;

    return () => {
      material.dispose();
      geometry.dispose();
    };
  }, [geometry, material]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points geometry={geometry} material={material} frustumCulled={false} />
  );
}
