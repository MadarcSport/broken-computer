import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { Mesh, NearestFilter } from "three";

interface RotatingCubeProps {
  position?: [number, number, number];
}

function RotatingCube({ position = [0, 0, 0] }: RotatingCubeProps) {
  const meshRef = useRef<Mesh>(null);
  const textures = useTexture({
    color: "/material/color2048Red2.png",
    ao: "/material/ao2048bis2.png",
    normal: "/material/normal2048screw2.png",
    roughness: "/material/roughness2048.png",
    metalness: "/material/metalness2048.png",
    height: "/material/height4.png",
    matcap: "/material/matcaps/3.png",
    alpha: "/material/tryAlpha02.png",
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
      meshRef.current.rotation.x += 0.001; //here stop the rotation on the x-axis
      meshRef.current.rotation.y += 0.001; // here stop the rotation on the y-axis
      // meshRef.current.rotation.z += 0.001;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={1.5}>
      <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
      <meshStandardMaterial
        envMapIntensity={0.8}
        map={textures.color}
        aoMap={textures.ao}
        aoMapIntensity={1}
        normalMap={textures.normal}
        normalScale={[1, 1]}
        roughnessMap={textures.roughness}
        metalnessMap={textures.metalness}
        displacementMap={textures.height}
        displacementScale={0.0}
        // roughness={0.2}
        // metalness={0.7}
        // alphaMap={textures.alpha}
        transparent={false}
      />
    </mesh>
  );
}

export function Scene3D_2() {
  return (
    <Canvas camera={{ position: [4, 1, 1], fov: 45 }}>
      <ambientLight intensity={2} />
      <pointLight position={[10, 10, 10]} intensity={10} />
      <RotatingCube position={[0, 0, 0]} />
      <OrbitControls makeDefault enablePan={false} enableZoom={false} />
      <Environment files="/material/rosendal.hdr" background={false} />
      <Environment files="/material/studio2.hdr" background={false} />
    </Canvas>
  );
}
