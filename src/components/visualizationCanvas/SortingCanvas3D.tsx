import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import * as THREE from 'three';
import { useVisualizerStore } from '../../store/visualizerStore';

const Bar = ({ position, color, height, width }: { position: [number, number, number], color: string, height: number, width: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Smoothly interpolate height and color if we wanted to avoid strict layout pops
  // but react-three-fiber re-renders fast enough for direct assignment.

  return (
    <Box ref={meshRef} position={position} args={[width, height, width]} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
    </Box>
  );
};

export const SortingCanvas3D: React.FC = () => {
  const { array, steps, currentStepIndex } = useVisualizerStore();

  const currentState = steps.length > 0 ? steps[currentStepIndex].state : {
    array, comparisons: [], swaps: [], sortedIndices: []
  };

  const currentArray = currentState.array || array;

  const getBarColor = (index: number) => {
    if (currentState.swaps?.includes(index)) return '#ef4444'; 
    if (currentState.comparisons?.includes(index)) return '#f59e0b'; 
    if (currentState.sortedIndices?.includes(index)) return '#22c55e';
    if (currentState.pivot === index) return '#a855f7';
    return '#3b82f6';
  };

  const maxVal = Math.max(...(currentArray.length > 0 ? currentArray : [1]));
  const count = currentArray.length;
  
  // Distribute items along X axis
  const spacing = 1.1; 
  const totalWidth = count * spacing;
  const startX = -totalWidth / 2;

  // Scale heights so they look decent in 3D (max 10 units high)
  const baseScale = 10;

  return (
    <div className="flex-1 w-full bg-slate-950 min-h-[400px] relative">
      {steps.length > 0 && (
        <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg border border-slate-700 max-w-md z-10">
          <p className="text-slate-200 text-sm font-medium">{steps[currentStepIndex]?.description}</p>
        </div>
      )}
      <Canvas shadows camera={{ position: [0, 8, 15], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#22c55e" />
        
        {currentArray.map((val, idx) => {
          const height = (val / maxVal) * baseScale;
          // Position Y is height/2 so the base sits on Y=0
          return (
             <Bar 
               key={`${idx}-${val}`} 
               position={[startX + idx * spacing, height / 2, 0]} 
               color={getBarColor(idx)} 
               height={height}
               width={1}
             />
          );
        })}

        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[maxVal * 2, maxVal * 2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>

        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going below floor
        />
      </Canvas>
    </div>
  );
};
