'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function OrbMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particlePositions = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.8 + Math.random() * 0.8;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = -state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.05;
    }
  });

  return (
    <>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.4, 4]} />
          <MeshDistortMaterial
            color="#B5005D"
            emissive="#350066"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
            distort={0.3}
            speed={2}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Wireframe overlay */}
        <mesh>
          <icosahedronGeometry args={[1.5, 3]} />
          <meshBasicMaterial
            color="#FF004E"
            wireframe
            transparent
            opacity={0.08}
          />
        </mesh>
      </Float>

      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#FF004E"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Ambient glow */}
      <pointLight position={[3, 3, 3]} color="#B5005D" intensity={2} />
      <pointLight position={[-3, -2, 2]} color="#FF004E" intensity={1} />
      <ambientLight intensity={0.3} />
    </>
  );
}

export default function EnergyOrb() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <OrbMesh />
      </Canvas>
    </div>
  );
}
