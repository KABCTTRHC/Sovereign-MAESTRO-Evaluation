import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- 1. THE 3D SOVEREIGN GRID ---
// This mesh reacts in real-time to the thermodynamic variables.
const SovereignGrid = ({ entropy, resonance, isVetoed }: { entropy: number, resonance: number, isVetoed: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // The Lithic Resonance drives the baseline rotation
      meshRef.current.rotation.y += (resonance / 117.45) * delta;
      
      // If Vetoed, the system snaps to absolute geometric zero
      if (isVetoed) {
        meshRef.current.position.lerp(new THREE.Vector3(0, 0, 0), 0.1);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.1);
      } else {
        // High entropy induces chaotic kinetic vibration
        meshRef.current.position.x = (Math.random() - 0.5) * (entropy * 0.3);
        meshRef.current.position.y = (Math.random() - 0.5) * (entropy * 0.3);
      }
    }
  });

  // Calculate the thermodynamic color (Green -> Yellow -> Red)
  const isCritical = entropy >= 0.858;
  const gridColor = isVetoed ? "#00ff88" : (isCritical ? "#ff0033" : (entropy > 0.4 ? "#ffaa00" : "#00ff88"));

  return (
    <mesh ref={meshRef} scale={1.5}>
      <icosahedronGeometry args={[2, 4]} />
      <MeshDistortMaterial
        color={gridColor}
        wireframe={true}
        distort={isVetoed ? 0 : entropy * 1.2} // Vertex distortion scales with entropy
        speed={resonance / 20}
      />
    </mesh>
  );
};


// --- 2. THE COMMAND TERMINAL (UI) ---
export default function App() {
  const [entropy, setEntropy] = useState(0.200);
  const [resonance, setResonance] = useState(117.45);
  const [isVetoed, setIsVetoed] = useState(false);

  const hemiunuLimit = 0.858;
  const isCritical = entropy >= hemiunuLimit && !isVetoed;

  const triggerNovikovVeto = () => {
    setIsVetoed(true);
    setEntropy(0); // Instantly dump localized entropy
    setResonance(117.45); // Snap back to the Lithic baseline
    
    // Reset the Veto state after 3 seconds for demonstration purposes
    setTimeout(() => {
      setIsVetoed(false);
    }, 3000);
  };

  return (
    <div className="relative w-full h-screen bg-black text-green-400 font-mono overflow-hidden">
      
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6] }}>
          <ambientLight intensity={0.5} />
          <SovereignGrid entropy={entropy} resonance={resonance} isVetoed={isVetoed} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 p-6 pointer-events-none flex flex-col h-full justify-between">
        
        {/* Header */}
        <header className="flex justify-between items-start border-b border-green-900/50 pb-4 bg-black/40 backdrop-blur-sm p-4">
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-white">OCCIPITAL LOBE</h1>
            <p className="text-xs text-green-600 uppercase mt-1">SVCF Topological Matrix // Live</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-green-600 uppercase">System Status</p>
            <p className={`text-xl font-bold ${isCritical ? 'text-red-500 animate-pulse' : (isVetoed ? 'text-blue-400' : 'text-green-400')}`}>
              {isVetoed ? 'VETO ENGAGED : ZERO STATE' : (isCritical ? 'TOPOLOGICAL RUPTURE IMMINENT' : 'NOMINAL')}
            </p>
          </div>
        </header>

        {/* Controls - We use pointer-events-auto here so sliders can be clicked over the canvas */}
        <footer className="w-full max-w-md bg-black/80 border border-green-900 p-6 pointer-events-auto backdrop-blur-md">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-xs uppercase">Systemic Entropy (SVCF)</label>
              <span className={`text-xs ${isCritical ? 'text-red-500 font-bold' : ''}`}>{entropy.toFixed(3)} / {hemiunuLimit}</span>
            </div>
            <input 
              type="range" 
              min="0" max="1" step="0.001" 
              value={entropy} 
              onChange={(e) => { setEntropy(parseFloat(e.target.value)); setIsVetoed(false); }}
              className="w-full accent-green-500"
            />
          </div>

          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <label className="text-xs uppercase">Lithic Resonance (Hz)</label>
              <span className="text-xs text-blue-400">{resonance.toFixed(2)} Hz</span>
            </div>
            <input 
              type="range" 
              min="10" max="200" step="0.01" 
              value={resonance} 
              onChange={(e) => { setResonance(parseFloat(e.target.value)); setIsVetoed(false); }}
              className="w-full accent-blue-500"
            />
          </div>

          <button 
            onClick={triggerNovikovVeto}
            className={`w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-100 ${
              isCritical 
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(255,0,0,0.6)]' 
                : 'bg-green-900/50 hover:bg-green-800 text-green-300 border border-green-700'
            }`}
          >
            Execute Novikov Veto
          </button>
        </footer>
      </div>
      
    </div>
  );
}
