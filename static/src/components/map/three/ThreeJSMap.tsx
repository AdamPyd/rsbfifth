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

            // 加载地图数据
            loadMapData(regionType).then(geoJson => {
                createMapFromGeoJson(geoJson);
            });

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

        useEffect(() => {
            // 区域类型变化时重新加载地图
            if (sceneRef.current) {
                // 清除现有区域
                regionsRef.current.forEach(mesh => {
                    sceneRef.current?.remove(mesh);
                });
                regionsRef.current = [];

                // 加载新数据
                loadMapData(regionType).then(geoJson => {
                    createMapFromGeoJson(geoJson);
                });
            }
        }, [regionType]);

        const createMapFromGeoJson = (geoJson: any) => {
            if (!sceneRef.current) return;

            geoJson.features.forEach((feature: any) => {
                const { properties, geometry } = feature;

                if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
                    const shape = createShapeFromCoordinates(geometry.coordinates);
                    const extrudeSettings = {
                        depth: properties.elevation || 2,
                        bevelEnabled: false
                    };

                    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                    const material = new THREE.MeshPhongMaterial({
                        color: 0x87e8de,
                        side: THREE.DoubleSide,
                        shininess: 70,
                        emissive: 0x000000
                    });

                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.rotation.x = -Math.PI / 2; // 旋转以使地图平放
                    mesh.userData = { regionCode: properties.code };
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;

                    // 添加交互事件
                    mesh.userData.originalColor = material.color.clone();
                    mesh.addEventListener('click', () => {
                        onRegionSelect(properties.code);
                    });

                    sceneRef.current?.add(mesh);
                    regionsRef.current.push(mesh);
                }
            });
        };

        const createShapeFromCoordinates = (coordinates: number[][][]) => {
            const shape = new THREE.Shape();

            coordinates[0].forEach((coord, index) => {
                const [x, y] = coord;
                if (index === 0) {
                    shape.moveTo(x, y);
                } else {
                    shape.lineTo(x, y);
                }
            });

            return shape;
        };

        return <div ref={mountRef} className="threejs-map" />;
    }
);

ThreeJSMap.displayName = 'ThreeJSMap';

export default ThreeJSMap;