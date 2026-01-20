import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, useScroll } from '@react-three/drei';
import * as THREE from 'three';

const NeuralCloud = () => {
    const ref = useRef<THREE.Points>(null);
    const scroll = useScroll();

    const particles = useMemo(() => {
        const positions = new Float32Array(2000 * 3);
        for (let i = 0; i < 2000; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return positions;
    }, []);

    useFrame((state) => {
        if (ref.current) {
            const scrollOffset = scroll.offset;
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.05 + scrollOffset * 0.5;
            ref.current.rotation.x = state.clock.getElapsedTime() * 0.02;

            // Subtle breathing effect
            const scale = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
            ref.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#3b82f6"
                size={0.02}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.4}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
};

const Experience = () => {
    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
            <NeuralCloud />
        </>
    );
};

export default Experience;
