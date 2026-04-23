import React, { useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SpaceGlobeVisualizer = ({ analyser }) => {
    const globeRef = useRef();
    const coreSolidRef = useRef();
    const coreBorderRef = useRef();
    const starsRef = useRef();

    const dataArray = useMemo(() => {
        if (!analyser) return new Uint8Array(0);
        return new Uint8Array(analyser.frequencyBinCount);
    }, [analyser]);

    // Star positions
    const { positions, originalPositions } = useMemo(() => {
        const starCount = 3000;
        const pos = new Float32Array(starCount * 3);
        for(let i=0; i<starCount; i++) {
            // Random spherical distribution
            const r = 15 + Math.random() * 40; // between 15 and 55 radius
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            
            pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i*3+2] = r * Math.cos(phi);
        }
        return { positions: pos, originalPositions: new Float32Array(pos) };
    }, []);

    useFrame((state) => {
        if (!globeRef.current || !analyser || dataArray.length === 0) return;

        analyser.getByteFrequencyData(dataArray);

        // Calculate frequency averages
        let bassSum = 0;
        let midSum = 0;
        let highSum = 0;
        for (let i = 0; i < 15; i++) bassSum += dataArray[i];
        for (let i = 15; i < 60; i++) midSum += dataArray[i];
        for (let i = 60; i < 150; i++) highSum += dataArray[i];
        
        const bassAvg = bassSum / 15;
        const midAvg = midSum / 45;
        const highAvg = highSum / 90;

        const time = state.clock.getElapsedTime();

        // React Globe to Bass
        const bassScale = 1 + (bassAvg / 255) * 0.4; // Max 40% bigger
        globeRef.current.scale.lerp(new THREE.Vector3(bassScale, bassScale, bassScale), 0.15);
        globeRef.current.rotation.y = time * 0.2;
        globeRef.current.rotation.z = time * 0.1;

        // Core reacts to low-mids and pulses emissive
        const coreScale = 0.95 + (midAvg / 255) * 0.2;
        const scaleVec = new THREE.Vector3(coreScale, coreScale, coreScale);
        
        if (coreSolidRef.current) {
            coreSolidRef.current.scale.lerp(scaleVec, 0.2);
            coreSolidRef.current.material.emissiveIntensity = 0.5 + (bassAvg / 255) * 2.5;
        }
        if (coreBorderRef.current) {
            coreBorderRef.current.scale.lerp(scaleVec, 0.2);
            coreBorderRef.current.material.emissiveIntensity = 1.0 + (bassAvg / 255) * 3;
        }

        // Stars react to high frequencies
        starsRef.current.rotation.y = time * 0.05 + (midAvg / 255) * 0.2;
        const starScale = 1 + (highAvg / 255) * 0.1;
        starsRef.current.scale.lerp(new THREE.Vector3(starScale, starScale, starScale), 0.1);
    });

    return (
        <group>
            {/* Outer Globe Wireframe */}
            <mesh ref={globeRef}>
                <icosahedronGeometry args={[4, 5]} />
                <meshStandardMaterial 
                    color="#00f2fe" 
                    emissive="#00f2fe"
                    emissiveIntensity={0.8}
                    wireframe={true} 
                    transparent
                    opacity={0.6}
                />
            </mesh>

            {/* Inner Glowing Core - Solid */}
            <mesh ref={coreSolidRef}>
                <icosahedronGeometry args={[2.2, 3]} />
                <meshStandardMaterial 
                    color="#2a0a18" 
                    emissive="#ff0066"
                    emissiveIntensity={1}
                    flatShading={true}
                />
            </mesh>

            {/* Inner Glowing Core - Neon Border line */}
            <mesh ref={coreBorderRef}>
                <icosahedronGeometry args={[2.25, 3]} />
                <meshStandardMaterial 
                    color="#ffffff" 
                    emissive="#ff00ff"
                    emissiveIntensity={2}
                    wireframe={true}
                />
            </mesh>

            {/* Starfield */}
            <points ref={starsRef}>
                <bufferGeometry>
                    <bufferAttribute 
                        attach="attributes-position" 
                        count={positions.length / 3} 
                        array={positions} 
                        itemSize={3} 
                    />
                </bufferGeometry>
                <pointsMaterial 
                    size={0.15} 
                    color="#e0e7ff" 
                    transparent 
                    opacity={0.8} 
                    sizeAttenuation={true} 
                />
            </points>
        </group>
    );
};

export const AudioVisualizer = ({ analyser }) => {
    return createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2fe" />
                <pointLight position={[-10, -10, -10]} intensity={1.5} color="#4c1d95" />

                {analyser ? (
                    <SpaceGlobeVisualizer analyser={analyser} />
                ) : (
                    <mesh rotation={[0, 0, 0]}>
                        <icosahedronGeometry args={[4, 2]} />
                        <meshStandardMaterial color="#ffffff" wireframe={true} transparent opacity={0.3} />
                    </mesh>
                )}
            </Canvas>
        </div>,
        document.body
    );
};
