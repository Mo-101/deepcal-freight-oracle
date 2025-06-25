
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

interface AnimatedBrainProps {
  trainingProgress: number; // 0-100
  accuracy: number; // 0-100
  isTraining: boolean;
  samples: number;
}

const BrainMesh: React.FC<AnimatedBrainProps> = ({ trainingProgress, accuracy, isTraining, samples }) => {
  const brainRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  // Create neural network particles
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return positions;
  }, []);

  // Animate the brain and particles
  useFrame((state) => {
    if (brainRef.current) {
      // Gentle rotation
      brainRef.current.rotation.y += 0.01;
      
      // Pulsing based on training activity
      const pulseScale = isTraining ? 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1 : 1;
      brainRef.current.scale.setScalar(0.8 + (trainingProgress / 500) + pulseScale * 0.1);
    }

    if (particlesRef.current && isTraining) {
      // Animate particles when training
      particlesRef.current.rotation.y += 0.02;
      particlesRef.current.rotation.x += 0.01;
    }
  });

  // Dynamic color based on accuracy
  const brainColor = useMemo(() => {
    if (accuracy < 50) return '#ff4444'; // Red for low accuracy
    if (accuracy < 80) return '#ffaa44'; // Orange for medium
    return '#44ff88'; // Green for high accuracy
  }, [accuracy]);

  return (
    <>
      {/* Main brain sphere */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <Sphere ref={brainRef} args={[1, 32, 32]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color={brainColor}
            distort={isTraining ? 0.4 : 0.2}
            speed={isTraining ? 5 : 2}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.8}
            emissive={brainColor}
            emissiveIntensity={0.3}
          />
        </Sphere>
      </Float>

      {/* Neural network particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={isTraining ? '#00ffff' : '#4444ff'}
          size={0.05}
          transparent
          opacity={isTraining ? 0.8 : 0.4}
        />
      </points>

      {/* Holographic rings */}
      {[1.5, 2, 2.5].map((radius, index) => (
        <mesh key={index} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.01, 8, 64]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.3 - index * 0.1}
            wireframe
          />
        </mesh>
      ))}

      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color={brainColor} />
    </>
  );
};

export const AnimatedBrain: React.FC<AnimatedBrainProps> = (props) => {
  return (
    <div className="w-24 h-24 mx-auto">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <BrainMesh {...props} />
      </Canvas>
    </div>
  );
};
