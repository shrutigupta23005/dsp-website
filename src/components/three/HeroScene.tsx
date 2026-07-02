"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  PerspectiveCamera,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import * as THREE from "three";
import { BlendFunction } from "postprocessing";

function ProceduralShoe() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.3) * 0.1 - 0.3;
  });

  const goldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#C9933A",
        metalness: 0.3,
        roughness: 0.4,
      }),
    []
  );

  const darkGoldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#8B6914",
        metalness: 0.4,
        roughness: 0.5,
      }),
    []
  );

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <group ref={groupRef} position={[2.5, 0, 0]} scale={1.8}>
        {/* Sole */}
        <mesh position={[0, -0.15, 0]} material={darkGoldMaterial}>
          <boxGeometry args={[2, 0.15, 0.8]} />
        </mesh>
        {/* Upper */}
        <mesh
          position={[0, 0.15, 0]}
          rotation={[0, 0, Math.PI / 2]}
          material={goldMaterial}
        >
          <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
        </mesh>
        {/* Toe cap */}
        <mesh position={[0.8, 0, 0]} material={goldMaterial}>
          <sphereGeometry args={[0.25, 8, 8]} />
        </mesh>
        {/* Edge glow line */}
        <mesh position={[0, -0.08, 0.42]}>
          <boxGeometry args={[1.8, 0.02, 0.02]} />
          <meshStandardMaterial
            color="#E5AC52"
            emissive="#E5AC52"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const count = isMobile ? 800 : 2000;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 8 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0003;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#C9933A"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function CameraSway() {
  useFrame((state) => {
    state.camera.position.x =
      Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
  });
  return null;
}

function SceneContents() {
  return (
    <>
      <PerspectiveCamera makeDefault fov={50} position={[0, 0, 5]} />
      <CameraSway />

      {/* Local lighting setup simulating studio environment */}
      <ambientLight intensity={0.2} />
      
      {/* Sky and Ground lighting */}
      <hemisphereLight
        args={["#FFFFFF", "#0A0A0A", 0.6]}
      />

      {/* Main Golden Key Light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={2.0}
        color="#C9933A"
      />

      {/* Fill Light for shadows */}
      <directionalLight
        position={[-5, 3, 2]}
        intensity={0.8}
        color="#E5AC52"
      />

      {/* Back/Rim Light for highlights */}
      <pointLight
        position={[0, 2, -4]}
        intensity={1.5}
        color="#FFFFFF"
      />

      <ProceduralShoe />
      <Particles />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.8}
          luminanceSmoothing={0.9}
          intensity={0.4}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.002, 0.001)}
        />
      </EffectComposer>
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneContents />
        </Suspense>
      </Canvas>
    </div>
  );
}
