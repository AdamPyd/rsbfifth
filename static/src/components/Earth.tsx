import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    OrbitControls,
    Stars as ThreeStars,
    useTexture,
    PerspectiveCamera
} from '@react-three/drei';
import * as THREE from 'three';

// 地球模型组件
const EarthModel: React.FC<{
    scale: number;
    setScale: (scale: number) => void;
    initialScale?: number;
}> = ({ scale, setScale, initialScale = 0 }) => {
    const earthRef = useRef<THREE.Mesh>(null);
    const cloudRef = useRef<THREE.Mesh>(null);

    // 加载纹理
    const [earthTexture, bumpMap, specularMap, cloudTexture] = useTexture([
        '/public/textures/earth_daymap.png', // 地球纹理
        '/public/textures/earth_bump.png',   // 凹凸贴图
        '/public/textures/earth_specular.png', // 高光贴图
        '/public/textures/earth_clouds.png'  // 云层纹理
    ]);

    // 初始动画效果
    useEffect(() => {
        if (initialScale === 0) {
            // 从小到大的动画
            let targetScale = 1;
            const animate = () => {
                if (earthRef.current) {
                    const currentScale = earthRef.current.scale.x;
                    const newScale = currentScale + (targetScale - currentScale) * 0.05;

                    earthRef.current.scale.set(newScale, newScale, newScale);
                    if (cloudRef.current) {
                        cloudRef.current.scale.set(newScale * 1.01, newScale * 1.01, newScale * 1.01);
                    }

                    setScale(newScale);

                    if (Math.abs(targetScale - newScale) > 0.01) {
                        requestAnimationFrame(animate);
                    }
                }
            };
            animate();
        }
    }, [initialScale, setScale]);

    // 旋转动画
    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.001;
        }
        if (cloudRef.current) {
            cloudRef.current.rotation.y += 0.0015;
        }
    });

    return (
        <>
            {/* 地球 */}
            <mesh ref={earthRef} scale={[initialScale, initialScale, initialScale]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshPhongMaterial
                    map={earthTexture}
                    bumpMap={bumpMap}
                    bumpScale={0.05}
                    specularMap={specularMap}
                    specular={new THREE.Color('grey')}
                    shininess={5}
                />
            </mesh>

            {/* 云层 */}
            <mesh ref={cloudRef} scale={[initialScale * 1.01, initialScale * 1.01, initialScale * 1.01]}>
                <sphereGeometry args={[1.01, 64, 64]} />
                <meshPhongMaterial
                    map={cloudTexture}
                    transparent={true}
                    opacity={0.4}
                    depthWrite={false}
                />
            </mesh>

            {/* 环境光 */}
            <ambientLight intensity={0.2} />
            {/* 平行光（模拟太阳） */}
            <directionalLight
                position={[5, 3, 5]}
                intensity={1.5}
                castShadow
            />
        </>
    );
};

// 地球场景组件
const EarthScene: React.FC<{
    onLoaded?: () => void;
    initialScale?: number;
}> = ({ onLoaded, initialScale = 0 }) => {
    const [scale, setScale] = React.useState(initialScale);
    const controlsRef = useRef<any>(null);

    useEffect(() => {
        if (scale > 0.1 && onLoaded) {
            onLoaded();
        }
    }, [scale, onLoaded]);

    return (
        <Canvas
            style={{ background: 'transparent' }}
            onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0); // 设置透明背景
            }}
        >
            <PerspectiveCamera makeDefault position={[0, 0, 3]} />

            {/* 地球模型 */}
            <EarthModel scale={scale} setScale={setScale} initialScale={initialScale} />

            {/* 控制器（支持旋转和缩放） */}
            <OrbitControls
                ref={controlsRef}
                enableZoom={true}
                enablePan={false}
                enableRotate={true}
                zoomSpeed={0.6}
                rotateSpeed={0.5}
                minDistance={2}
                maxDistance={5}
            />

            {/* 保留原有的2D星空背景 */}
            <ThreeStars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
            />
        </Canvas>
    );
};

interface EarthProps {
    initialScale?: number;
    onLoaded?: () => void;
    style?: React.CSSProperties;
}

// 地球组件（导出）
const Earth: React.FC<EarthProps> = ({ initialScale = 1, onLoaded, style }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
            ...style
        }}>
            <EarthScene initialScale={initialScale} onLoaded={onLoaded} />
        </div>
    );
};

export default Earth;