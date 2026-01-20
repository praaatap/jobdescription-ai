import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Experience from './Experience';
import { Environment, ScrollControls } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

const Scene = () => {
    return (
        <div className="fixed inset-0 z-0 h-screen w-full pointer-events-none">
            <Canvas
                shadows
                dpr={[1, 2]}
                camera={{ position: [0, 0, 8], fov: 45 }}
                gl={{ antialias: false, alpha: true }}
            >
                <Suspense fallback={null}>
                    <ScrollControls pages={4} damping={0.2}>
                        <Experience />
                    </ScrollControls>

                    <Environment preset="night" />

                    <EffectComposer enableNormalPass>
                        <Bloom
                            intensity={1.5}
                            luminanceThreshold={0.2}
                            luminanceSmoothing={0.9}
                            height={300}
                        />
                        <Noise opacity={0.03} />
                        <ChromaticAberration
                            blendFunction={BlendFunction.NORMAL}
                            offset={new THREE.Vector2(0.001, 0.001)}
                        />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Scene;
