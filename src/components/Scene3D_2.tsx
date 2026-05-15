import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Sphere,
  useTexture,
} from "@react-three/drei";
import { Color, Mesh, MeshStandardMaterial, NearestFilter } from "three";
import { SoftRain } from "./SoftRain.tsx";
import { Model as OnlyRings } from "./OnlyRings-1.tsx";
import { RingEffectPanel } from "./RingEffectPanel";
import { type RingEffectId } from "../shaders/ringEffects";

interface RotatingCubeProps {
  position?: [number, number, number];
  tintHex: string;
}

function RotatingCube({ position = [0, 0, 0], tintHex }: RotatingCubeProps) {
  const meshRef = useRef<Mesh>(null);
  const albedoTintRef = useRef(new Color(tintHex));
  const innerSphereMaterialRef = useRef<MeshStandardMaterial>(null);
  const spherePulseShaderRef = useRef<{
    uniforms: Record<string, { value: number }>;
  } | null>(null);
  const textures = useTexture({
    color: "/material/color2048Neutral2.png",
    ao: "/material/ao2048bis2.png",
    normal: "/material/normal2048screw2.png",
    roughness: "/material/roughness2048.png",
    metalness: "/material/metalness2048.png",
    height: "/material/height4.png",
    matcap: "/material/matcaps/3.png",
    alpha: "/material/tryAlpha03.png",
    circuitBall: "/material/circuitBall1Color.png",
  });

  // Option A: start Nearest filter imported from three at the top
  useEffect(() => {
    Object.values(textures).forEach((tex) => {
      tex.magFilter = NearestFilter;
      tex.minFilter = NearestFilter;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
    });
  }, [textures]);
  // Option A:end Nearest filter

  useEffect(() => {
    albedoTintRef.current.set(tintHex);
  }, [tintHex]);

  useEffect(() => {
    if (!meshRef.current) {
      return;
    }

    const geometry = meshRef.current.geometry;
    if (geometry.attributes.uv && !geometry.attributes.uv2) {
      geometry.setAttribute("uv2", geometry.attributes.uv);
    }
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.0; //here stop the rotation on the x-axis
      meshRef.current.rotation.y += 0.0; // here stop the rotation on the y-axis
      // meshRef.current.rotation.z += 0.001;
    }

    if (spherePulseShaderRef.current) {
      spherePulseShaderRef.current.uniforms.uTime.value += 0.03;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={1.5}>
      <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
      <meshStandardMaterial
        envMapIntensity={0.2}
        map={textures.color}
        aoMap={textures.ao}
        aoMapIntensity={0.8}
        normalMap={textures.normal}
        normalScale={[1, 1]}
        roughnessMap={textures.roughness}
        metalnessMap={textures.metalness}
        displacementMap={textures.height}
        displacementScale={0.0}
        onBeforeCompile={(shader: {
          uniforms: Record<string, { value: Color }>;
          fragmentShader: string;
        }) => {
          shader.uniforms.uAlbedoTint = { value: albedoTintRef.current };
          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <map_fragment>",
            "#include <map_fragment>\n  diffuseColor.rgb *= uAlbedoTint;",
          );
          shader.fragmentShader = shader.fragmentShader.replace(
            "void main() {",
            "uniform vec3 uAlbedoTint;\nvoid main() {",
          );
        }}
        // roughness={0.2}
        // metalness={0.7}
        alphaMap={textures.alpha}
        transparent={true}
      />

      <mesh position={[0, 0, 0]}>
        <Sphere args={[0.31, 32, 32]}>
          <meshStandardMaterial
            ref={innerSphereMaterialRef}
            map={textures.circuitBall}
            color="#e85602"
            emissive="#ffa200"
            emissiveIntensity={0.1}
            roughness={0.2}
            metalness={0.8}
            transparent={true}
            onBeforeCompile={(shader: {
              uniforms: Record<string, { value: number }>;
              fragmentShader: string;
            }) => {
              shader.uniforms.uTime = { value: 0 };
              shader.uniforms.uPulseSpeed = { value: 0.2 };
              shader.uniforms.uPulseMin = { value: 0.4 };
              shader.uniforms.uPulseAmp = { value: 1.0 };

              shader.fragmentShader = shader.fragmentShader.replace(
                "void main() {",
                "uniform float uTime;\nuniform float uPulseSpeed;\nuniform float uPulseMin;\nuniform float uPulseAmp;\nvoid main() {",
              );

              shader.fragmentShader = shader.fragmentShader.replace(
                "#include <dithering_fragment>",
                "float pulse = uPulseMin + uPulseAmp * abs(sin(uTime * uPulseSpeed));\ngl_FragColor.rgb *= (0.65 + pulse * 1.3);\n#include <dithering_fragment>",
              );

              spherePulseShaderRef.current = {
                uniforms: {
                  uTime: shader.uniforms.uTime,
                },
              };
            }}
          />
        </Sphere>
      </mesh>
    </mesh>
  );
}
export function Scene3D_2() {
  const [selectedTint, setSelectedTint] = useState<string>("#be0e0e");
  const [selectedRingEffect, setSelectedRingEffect] =
    useState<RingEffectId>("iridescentOilFilm");
  const tintOptions = [
    { label: "Red", value: "#d91010" },
    { label: "Blue", value: "#0b4d92" },
    { label: "Black", value: "#141617" },
  ];

  return (
    <div className="scene-root">
      <Canvas camera={{ position: [4, 2, 2], fov: 45 }}>
        <ambientLight intensity={5} />
        <pointLight position={[10, 10, 10]} intensity={20} />
        <hemisphereLight
          color={0x084382}
          groundColor={0x084382}
          intensity={80}
        />
        <SoftRain />
        <OnlyRings scale={[0.27, 0.27, 0.27]} effect={selectedRingEffect} />
        <RotatingCube position={[0, 0, 0]} tintHex={selectedTint} />
        <OrbitControls makeDefault enablePan={false} enableZoom={false} />
        {/* <Environment files="/material/rosendal.hdr" background={false} /> */}
        <Environment files="/material/studio.hdr" background={false} />
      </Canvas>

      <RingEffectPanel
        selectedEffect={selectedRingEffect}
        onSelectEffect={setSelectedRingEffect}
      />

      <div className="tint-panel">
        {tintOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSelectedTint(option.value)}
            className={`tint-button ${selectedTint === option.value ? "is-selected" : ""}`}
            style={{ background: option.value }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
