import React, { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RegionType, UserLocation } from '../../../types/types';
import { loadMapData, loadRegionGeoJson } from '../../../services/mapData';
import './ThreeJSMap.css';

interface ThreeJSMapProps {
    regionType: RegionType;
    selectedRegion: string;
    onRegionSelect: (regionCode: string) => void;
    userLocation: UserLocation | null;
}

export interface ThreeJSMapHandle {
    highlightRegion: (regionCode: string) => void;
}

const ThreeJSMap = forwardRef<ThreeJSMapHandle, ThreeJSMapProps>(
    ({ regionType, selectedRegion, onRegionSelect, userLocation }, ref) => {
        const mountRef = useRef<HTMLDivElement>(null);
        const sceneRef = useRef<THREE.Scene | null>(null);
        const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
        const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
        const controlsRef = useRef<OrbitControls | null>(null);
        const regionsRef = useRef<THREE.Mesh[]>([]);

        useImperativeHandle(ref, () => ({
            highlightRegion: (regionCode: string) => {
                // 高亮显示指定区域
                regionsRef.current.forEach(mesh => {
                    const code = mesh.userData.regionCode;
                    if (code === regionCode) {
                        (mesh.material as THREE.MeshPhongMaterial).color.set(0x1890ff);
                        (mesh.material as THREE.MeshPhongMaterial).emissive.set(0x052a56);
                    } else {
                        (mesh.material as THREE.MeshPhongMaterial).color.set(0x87e8de);
                        (mesh.material as THREE.MeshPhongMaterial).emissive.set(0x000000);
                    }
                });
            }
        }));

        useEffect(() => {
            if (!mountRef.current) return;

            // 初始化Three.js场景
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf0f0f0);
            sceneRef.current = scene;

            const camera = new THREE.PerspectiveCamera(
                75,
                mountRef.current.clientWidth / mountRef.current.clientHeight,
                0.1,
                1000
            );
            camera.position.z = 50;
            camera.position.y = 30;
            camera.position.x = 0;
            cameraRef.current = camera;

            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(
                mountRef.current.clientWidth,
                mountRef.current.clientHeight
            );
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            rendererRef.current = renderer;

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.screenSpacePanning = false;
            controls.maxPolarAngle = Math.PI / 2;
            controlsRef.current = controls;

            // 添加光源
            const ambientLight = new THREE.AmbientLight(0x404040);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(1, 1, 1);
            directionalLight.castShadow = true;
            scene.add(directionalLight);

            mountRef.current.appendChild(renderer.domElement);

            // 加载模拟地图数据
            createMockMap();

            const animate = () => {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            };

            animate();

            const handleResize = () => {
                if (!mountRef.current || !camera || !renderer) return;

                camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(
                    mountRef.current.clientWidth,
                    mountRef.current.clientHeight
                );
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                if (mountRef.current && renderer.domElement) {
                    mountRef.current.removeChild(renderer.domElement);
                }
            };
        }, []);

        // 创建模拟地图数据
        const createMockMap = () => {
            if (!sceneRef.current) return;

            // 清除现有区域
            regionsRef.current.forEach(mesh => {
                sceneRef.current?.remove(mesh);
            });
            regionsRef.current = [];

            // 创建模拟的浙江省地图区域
            const regions = [
                {
                    code: '330100',
                    name: '杭州市',
                    position: { x: 0, y: 0 },
                    size: { width: 20, height: 15 },
                    elevation: 3
                },
                {
                    code: '330200',
                    name: '宁波市',
                    position: { x: 25, y: 5 },
                    size: { width: 18, height: 12 },
                    elevation: 2.5
                },
                {
                    code: '330300',
                    name: '温州市',
                    position: { x: 15, y: 20 },
                    size: { width: 16, height: 14 },
                    elevation: 2
                },
                {
                    code: '330400',
                    name: '嘉兴市',
                    position: { x: 10, y: -15 },
                    size: { width: 12, height: 10 },
                    elevation: 1.5
                },
                {
                    code: '330500',
                    name: '湖州市',
                    position: { x: -5, y: -10 },
                    size: { width: 14, height: 11 },
                    elevation: 2
                }
            ];

            regions.forEach(region => {
                const shape = new THREE.Shape();
                shape.moveTo(0, 0);
                shape.lineTo(region.size.width, 0);
                shape.lineTo(region.size.width, region.size.height);
                shape.lineTo(0, region.size.height);
                shape.lineTo(0, 0);

                const extrudeSettings = {
                    depth: region.elevation,
                    bevelEnabled: false
                };

                const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                const material = new THREE.MeshPhongMaterial({
                    color: selectedRegion === region.code ? 0x1890ff : 0x87e8de,
                    side: THREE.DoubleSide,
                    shininess: 70,
                    emissive: selectedRegion === region.code ? 0x052a56 : 0x000000
                });

                const mesh = new THREE.Mesh(geometry, material);
                mesh.rotation.x = -Math.PI / 2;
                mesh.position.set(region.position.x, region.position.y, 0);
                mesh.userData = { regionCode: region.code };
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                // 添加交互事件
                mesh.userData.originalColor = material.color.clone();

                // 添加点击事件监听器
                const handleClick = () => {
                    onRegionSelect(region.code);
                };

                // 添加事件监听器
                mesh.addEventListener('click', handleClick);
                mesh.userData.handleClick = handleClick;

                sceneRef.current?.add(mesh);
                regionsRef.current.push(mesh);

                // 添加区域名称文本
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                if (context) {
                    canvas.width = 256;
                    canvas.height = 64;
                    context.fillStyle = selectedRegion === region.code ? '#ffffff' : '#262626';
                    context.font = '24px Arial';
                    context.textAlign = 'center';
                    context.fillText(region.name, 128, 32);

                    const texture = new THREE.CanvasTexture(canvas);
                    const textMaterial = new THREE.SpriteMaterial({ map: texture });
                    const textSprite = new THREE.Sprite(textMaterial);
                    textSprite.position.set(
                        region.position.x + region.size.width / 2,
                        region.position.y + region.size.height / 2,
                        region.elevation + 1
                    );
                    textSprite.scale.set(10, 2.5, 1);
                    sceneRef.current.add(textSprite);
                }
            });
        };

        useEffect(() => {
            // 当选中区域变化时更新地图高亮
            if (sceneRef.current) {
                regionsRef.current.forEach(mesh => {
                    const code = mesh.userData.regionCode;
                    if (code === selectedRegion) {
                        (mesh.material as THREE.MeshPhongMaterial).color.set(0x1890ff);
                        (mesh.material as THREE.MeshPhongMaterial).emissive.set(0x052a56);
                    } else {
                        (mesh.material as THREE.MeshPhongMaterial).color.set(0x87e8de);
                        (mesh.material as THREE.MeshPhongMaterial).emissive.set(0x000000);
                    }
                });
            }
        }, [selectedRegion]);

        useEffect(() => {
            // 区域类型变化时重新创建地图
            if (sceneRef.current) {
                createMockMap();
            }
        }, [regionType]);

        return <div ref={mountRef} className="threejs-map" />;
    }
);

ThreeJSMap.displayName = 'ThreeJSMap';

export default ThreeJSMap;