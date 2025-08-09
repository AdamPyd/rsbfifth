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

    // 加载纹理
    const textures = useTexture([
            '/textures/earth_daymap.png',
            '/textures/earth_specular.png', // 移除了法线贴图
            '/textures/earth_clouds.png'
        ],
        (loadedTextures) => {
            console.log('纹理加载成功:', loadedTextures);
        },
        (error) => {
            console.error('纹理加载失败:', error);
        });

    const [earthTexture, specularMap, cloudTexture] = textures;

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
                    // 移除了法线贴图
                    specularMap={specularMap}
                    specular={new THREE.Color(0x333333)}
                    shininess={10}
                    side={THREE.FrontSide}
                />
            </mesh>

            {/* 云层 */}
            <mesh ref={cloudRef} scale={[initialScale * 1.01, initialScale * 1.01, initialScale * 1.01]}>
                <sphereGeometry args={[1.01, 64, 64]} />
                <meshPhongMaterial
                    map={cloudTexture}
                    transparent={true}
                    opacity={0.6}
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* 环境光 */}
            <ambientLight intensity={0.5} color={0xffffff} />

            {/* 平行光 */}
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
    showStars?: boolean; // 新增：控制是否显示星空背景
}

const EarthScene: React.FC<EarthSceneProps> = ({ onLoaded, initialScale = 1, showStars = true }) => {
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
            {/* 相机 */}
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

            {/* 条件渲染星空背景 */}
            {showStars && (
                <ThreeStars
                    radius={150}
                    depth={100}
                    count={8000}
                    factor={6}
                    saturation={0}
                    fade
                    speed={0.5}
                />
            )}

            {/* 添加坐标轴辅助 */}
            <axesHelper args={[5]} />
        </Canvas>
    );
};

interface EarthProps {
    initialScale?: number;
    onLoaded?: () => void;
    style?: React.CSSProperties;
    onBackToHome?: () => void; // 新增：返回首页的回调函数
}

const Earth: React.FC<EarthProps> = ({
                                         initialScale = 0.01,
                                         onLoaded,
                                         style,
                                         onBackToHome // 新增
                                     }) => {
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
                width: '100vw',
                height: '100vh',
                zIndex: 10,
                backgroundColor: 'black', // 使用黑色背景
                ...style
            }}
        >
            {/* 添加返回按钮 */}
            {onBackToHome && (
                <button
                    onClick={onBackToHome}
                    style={{
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        padding: '10px 15px',
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        border: '0px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        zIndex: 20,
                        backdropFilter: 'blur(10px)',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                >

                </button>
            )}

            <EarthScene
                initialScale={initialScale}
                onLoaded={onLoaded}
                showStars={false} // 禁用星空背景
            />
        </div>
    );
};

export default Earth;