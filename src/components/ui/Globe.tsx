import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface GlobeProps {
  width?: number;
  height?: number;
  className?: string;
}

function GlobeObject() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group>
      {/* Ambient Light */}
      <ambientLight intensity={0.4} color="#404040" />
      {/* Directional Light */}
      <directionalLight
        intensity={0.6}
        position={[5, 5, 5]}
        color="#ffffff"
        castShadow
      />
      {/* Point Light for eco-friendly glow */}
      <pointLight
        intensity={0.3}
        position={[0, 0, 5]}
        color="#4ade80"
      />
      
      {/* Main Globe Sphere */}
      <Sphere 
        ref={meshRef} 
        args={[2, 64, 64]} 
        position={[0, 0, 0]}
      >
        <meshPhongMaterial
          color="#1a1a2e"
          transparent
          opacity={0.8}
          shininess={100}
        />
      </Sphere>

      {/* Outer glow effect */}
      <Sphere args={[2.1, 32, 32]}>
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Atmosphere effect */}
      <Sphere args={[2.15, 32, 32]}>
        <meshBasicMaterial
          color="#4ade80"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Rotating ring for extra effect */}
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.3, 0.02, 8, 32]} />
          <meshBasicMaterial
            color="#22c55e"
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
    </group>
  );
}

const GlobeComponent: React.FC<GlobeProps> = ({ 
  width = 400, 
  height = 400, 
  className = '' 
}) => {
  return (
    <div 
      className={`globe-container ${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Canvas
        camera={{ 
          position: [0, 0, 8], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
      >
        <GlobeObject />
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={2 * Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};

export default GlobeComponent;