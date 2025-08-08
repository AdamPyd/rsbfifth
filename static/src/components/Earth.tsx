import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    OrbitControls,
    Stars as ThreeStars,
    useTexture,
    PerspectiveCamera
} from '@react-three/drei';
import * as THREE from 'three';

interface EarthModelProps {
    setScale?: (scale: number) => void;
    initialScale?: number;
}

const EarthModel: React.FC<EarthModelProps> = ({ setScale = () => {}, initialScale = 1 }) => {
    const earthRef = useRef<THREE.Mesh>(null);
    const cloudRef = useRef<THREE.Mesh>(null);

    // 加载纹理 - 添加错误处理和回退
    const textures = useTexture([
            '/textures/earth_daymap.png', // 使用更常见的 jpg 格式
            '/textures/earth_bump.png',
            '/textures/earth_specular.png',
            '/textures/earth_clouds.png'
        ],
        (loadedTextures) => {
            console.log('纹理加载成功:', loadedTextures);
        },
        (error) => {
            console.error('纹理加载失败:', error);
        });

    const [earthTexture, bumpMap, specularMap, cloudTexture] = textures;

    // 初始动画效果
    useEffect(() => {
        if (initialScale < 0.1) {
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
                    } else {
                        console.log('地球动画完成');
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
                    bumpScale={0.1} // 增加凹凸效果
                    specularMap={specularMap}
                    specular={new THREE.Color(0x333333)} // 更明显的高光
                    shininess={10} // 增加光泽度
                    side={THREE.FrontSide}
                />
            </mesh>

            {/* 云层 */}
            <mesh ref={cloudRef} scale={[initialScale * 1.01, initialScale * 1.01, initialScale * 1.01]}>
                <sphereGeometry args={[1.01, 64, 64]} />
                <meshPhongMaterial
                    map={cloudTexture}
                    transparent={true}
                    opacity={0.6} // 增加云层可见度
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* 环境光 - 增加强度 */}
            <ambientLight intensity={0.5} color={0xffffff} />

            {/* 平行光 - 调整位置和强度 */}
            <directionalLight
                position={[10, 5, 10]}
                intensity={2}
                castShadow
                color={0xffffff}
            />

            {/* 辅助光 */}
            <pointLight position={[-5, -3, -5]} intensity={0.5} />
        </>
    );
};

interface EarthSceneProps {
    onLoaded?: () => void;
    initialScale?: number;
}

const EarthScene: React.FC<EarthSceneProps> = ({ onLoaded, initialScale = 1 }) => {
    const [scale, setScale] = useState<number>(initialScale);
    const controlsRef = useRef<any>(null);

    useEffect(() => {
        console.log('地球缩放:', scale);
        if (scale > 0.5 && onLoaded) {
            onLoaded();
        }
    }, [scale, onLoaded]);

    return (
        <Canvas
            style={{ background: 'transparent' }}
            onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0); // 透明背景
                gl.setPixelRatio(window.devicePixelRatio);
                console.log('WebGL上下文已创建');
            }}
        >
            {/* 相机 - 调整位置 */}
            <PerspectiveCamera
                makeDefault
                position={[0, 0, 5]}
                fov={75}
                near={0.1}
                far={1000}
            />

            {/* 地球模型 */}
            <EarthModel setScale={setScale} initialScale={initialScale} />

            {/* 控制器 */}
            <OrbitControls
                ref={controlsRef}
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                zoomSpeed={0.8}
                rotateSpeed={0.8}
                minDistance={2.5}
                maxDistance={15}
                autoRotate={true}
                autoRotateSpeed={0.5}
            />

            {/* 星空背景 */}
            <ThreeStars
                radius={150}
                depth={100}
                count={8000}
                factor={6}
                saturation={0}
                fade
                speed={0.5}
            />

            {/* 添加坐标轴辅助 */}
            <axesHelper args={[5]} />
        </Canvas>
    );
};

interface EarthProps {
    initialScale?: number;
    onLoaded?: () => void;
    style?: React.CSSProperties;
}

const Earth: React.FC<EarthProps> = ({ initialScale = 0.01, onLoaded, style }) => {
    // 添加容器尺寸检查
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            console.log('容器尺寸:', {
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight
            });
        }
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw', // 使用视口单位
                height: '100vh',
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.1)', // 临时背景用于调试
                ...style
            }}
        >
            <EarthScene initialScale={initialScale} onLoaded={onLoaded} />
        </div>
    );
};

export default Earth;