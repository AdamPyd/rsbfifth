import React, { useEffect, useRef, useState } from 'react';
import { Layout, Typography } from 'antd';
import Earth from '../components/Earth';

// 正确解构 Layout 的子组件
const { Header, Footer } = Layout;
const { Title, Text } = Typography;

// 添加 Content 组件的类型定义
const Content = Layout.Content;

interface Star {
    x: number;
    y: number;
    size: number;
    brightness: number;
    baseBrightness: number;
    speed: number;
    type: 'normal' | 'glowing';
    color: string;
}

interface ShootingStar {
    x: number;
    y: number;
    angle: number;
    length: number;
    speed: number;
    brightness: number;
    trail: Array<{ x: number; y: number; size: number }>;
    trailPoints: number;
}

const Home = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const starsRef = useRef<Star[]>([]);
    const shootingStarsRef = useRef<ShootingStar[]>([]);
    const animationFrameRef = useRef<number>(0);
    const lastShootingStarTimeRef = useRef<number>(0);

    const [showEarth, setShowEarth] = useState(false);
    const [earthPosition, setEarthPosition] = useState({ x: 0, y: 0 });
    const [earthScale, setEarthScale] = useState(0.001);
    const [earthLoaded, setEarthLoaded] = useState(false);
    const [titleVisible, setTitleVisible] = useState(true);
    const isAnimatingRef = useRef(false);

    const hexToRgb = (hex: string): string => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
            : '255,255,255';
    };

    const initStars = (width: number, height: number, count: number = 120) => {
        const stars: Star[] = [];
        const colors = ['#ffffff', '#4facfe', '#00f2fe', '#f6d365', '#a6c0fe'];

        for (let i = 0; i < count; i++) {
            const baseBrightness = Math.random() * 0.5 + 0.5;
            const type = Math.random() < 0.1 ? 'glowing' : 'normal';
            let color = '#ffffff';
            if (baseBrightness > 0.8 && Math.random() < 0.5) {
                color = colors[Math.floor(Math.random() * (colors.length - 1)) + 1];
            }

            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 3 + 0.5,
                brightness: baseBrightness,
                baseBrightness,
                speed: Math.random() * 0.002 + 0.0005,
                type,
                color
            });
        }
        starsRef.current = stars;
    };

    const createShootingStar = (width: number, height: number) => {
        const startEdge = Math.floor(Math.random() * 4);
        let x, y, angle;

        switch (startEdge) {
            case 0: // top
                x = Math.random() * width;
                y = 0;
                angle = Math.random() * Math.PI * 0.5 + Math.PI * 0.25;
                break;
            case 1: // right
                x = width;
                y = Math.random() * height;
                angle = Math.random() * Math.PI * 0.5 + Math.PI * 0.75;
                break;
            case 2: // bottom
                x = Math.random() * width;
                y = height;
                angle = Math.random() * Math.PI * 0.5 + Math.PI * 1.25;
                break;
            case 3: // left
                x = 0;
                y = Math.random() * height;
                angle = Math.random() * Math.PI * 0.5 + Math.PI * 1.75;
                break;
            default:
                x = Math.random() * width;
                y = 0;
                angle = Math.random() * Math.PI * 0.5 + Math.PI * 0.25;
        }

        shootingStarsRef.current.push({
            x,
            y,
            angle,
            length: Math.random() * 80 + 40,
            speed: Math.random() * 10 + 5,
            brightness: 1,
            trail: [],
            trailPoints: 0
        });
    };

    const animate = (time: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height } = dimensions;

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        const stars = starsRef.current;
        stars.forEach(star => {
            star.brightness = star.baseBrightness + Math.sin(time * star.speed) * 0.5;
            const brightness = Math.max(0, Math.min(1, star.brightness));

            ctx.save();

            if (star.type === 'normal') {
                const gradient = ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.size * 1.5
                );
                gradient.addColorStop(0, `rgba(${hexToRgb(star.color)}, ${brightness})`);
                gradient.addColorStop(1, `rgba(${hexToRgb(star.color)}, 0)`);

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            } else {
                const glowLength = star.size * 4;
                const glowBrightness = brightness * 0.6;

                ctx.beginPath();
                ctx.moveTo(star.x - glowLength, star.y);
                ctx.lineTo(star.x + glowLength, star.y);
                ctx.moveTo(star.x, star.y - glowLength);
                ctx.lineTo(star.x, star.y + glowLength);

                ctx.strokeStyle = `rgba(${hexToRgb(star.color)}, ${glowBrightness})`;
                ctx.lineWidth = 1;
                ctx.stroke();

                const gradient = ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.size * 2
                );
                gradient.addColorStop(0, `rgba(${hexToRgb(star.color)}, ${brightness})`);
                gradient.addColorStop(1, `rgba(${hexToRgb(star.color)}, 0)`);

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            ctx.restore();
        });

        const shootingStars = shootingStarsRef.current;
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const star = shootingStars[i];

            star.trailPoints++;
            if (star.trailPoints >= 3) {
                star.trailPoints = 0;
                star.trail.push({
                    x: star.x,
                    y: star.y,
                    size: Math.min(3, star.brightness * 4)
                });
                if (star.trail.length > star.length) {
                    star.trail.shift();
                }
            }

            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;

            if (star.trail.length >= 2) {
                ctx.beginPath();
                ctx.moveTo(star.trail[0].x, star.trail[0].y);

                for (let j = 1; j < star.trail.length; j++) {
                    const prevPoint = star.trail[j-1];
                    const point = star.trail[j];
                    const alpha = (j / star.trail.length) * star.brightness;

                    ctx.lineTo(point.x, point.y);
                    ctx.lineWidth = prevPoint.size * (1 - j/star.trail.length) * 0.8 + 0.5;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(point.x, point.y);
                }
            }

            for (let j = 0; j < star.trail.length; j++) {
                const point = star.trail[j];
                const alpha = (j / star.trail.length) * star.brightness * 0.7;
                const size = point.size * (1 - j/star.trail.length) * 0.8 + 0.5;

                ctx.save();
                const gradient = ctx.createRadialGradient(
                    point.x, point.y, 0,
                    point.x, point.y, size
                );
                gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.beginPath();
                ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.restore();
            }

            ctx.save();
            const headGradient = ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, 4
            );
            headGradient.addColorStop(0, `rgba(255, 255, 255, ${star.brightness})`);
            headGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.beginPath();
            ctx.arc(star.x, star.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = headGradient;
            ctx.fill();
            ctx.restore();

            star.brightness -= 0.01;

            if (star.brightness <= 0 ||
                star.x < -50 || star.x > width + 50 ||
                star.y < -50 || star.y > height + 50) {
                shootingStars.splice(i, 1);
            }
        }

        if (time - lastShootingStarTimeRef.current > 2000 && Math.random() < 0.02) {
            createShootingStar(width, height);
            lastShootingStarTimeRef.current = time;
        }

        animationFrameRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        const updateDimensions = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            setDimensions({ width, height });

            if (canvasRef.current) {
                canvasRef.current.width = width;
                canvasRef.current.height = height;
            }

            initStars(width, height);
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (dimensions.width > 0 && dimensions.height > 0) {
            animationFrameRef.current = requestAnimationFrame(animate);
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [dimensions]);

    const showEarthAnimation = (event?: React.MouseEvent | React.TouchEvent) => {
        if (showEarth || isAnimatingRef.current || !titleRef.current) return;
        isAnimatingRef.current = true;

        let clientX, clientY;
        if (event && 'touches' in event) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else if (event) {
            clientX = event.clientX;
            clientY = event.clientY;
        } else {
            const titleRect = titleRef.current.getBoundingClientRect();
            clientX = titleRect.left + titleRect.width / 2;
            clientY = titleRect.top + titleRect.height / 2;
        }

        setEarthPosition({ x: clientX, y: clientY });
        setTitleVisible(false);

        setTimeout(() => {
            setShowEarth(true);
            setEarthScale(0.001);
            isAnimatingRef.current = false;
        }, 500);
    };

    useEffect(() => {
        if (earthLoaded) {
            const interval = setInterval(() => {
                setEarthScale(prev => {
                    const newScale = prev * 1.1;
                    if (newScale >= 1) {
                        clearInterval(interval);
                        return 1;
                    }
                    return newScale;
                });
            }, 16);
        }
    }, [earthLoaded]);

    return (
        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1
                }}
            />

            {showEarth && (
                <Earth
                    initialScale={earthScale}
                    onLoaded={() => setEarthLoaded(true)}
                    style={{
                        transform: `translate(${earthPosition.x}px, ${earthPosition.y}px)`,
                        transformOrigin: 'center',
                        transition: earthLoaded ? 'transform 0.5s, width 0.5s, height 0.5s' : 'none',
                        ...(earthLoaded ? {
                            transform: 'translate(0, 0)',
                            width: '100%',
                            height: '100%'
                        } : {
                            width: '1px',
                            height: '1px'
                        })
                    }}
                />
            )}

            <Header style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                zIndex: 20
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%'
                }}>
                    <Text style={{
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        DISCOVERY
                    </Text>
                    <div style={{ flex: 1 }} />
                </div>
            </Header>

            {/* 使用 Content 组件 */}
            <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <div style={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    padding: '120px 0',
                    textAlign: 'center'
                }}>
                    <Title
                        ref={titleRef}
                        onMouseEnter={() => {
                            if (!showEarth) {
                                titleRef.current?.style.setProperty('transform', 'scale(1.05)');
                            }
                        }}
                        onMouseLeave={() => {
                            if (!showEarth) {
                                titleRef.current?.style.setProperty('transform', 'scale(1)');
                            }
                        }}
                        onClick={(e) => showEarthAnimation(e as React.MouseEvent)}
                        onTouchStart={(e) => showEarthAnimation(e)}
                        style={{
                            color: '#fff',
                            fontSize: '4rem',
                            marginBottom: 24,
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease, opacity 0.5s ease',
                            opacity: titleVisible ? 1 : 0,
                            transform: titleVisible ? 'scale(1)' : 'scale(0)',
                            pointerEvents: titleVisible ? 'auto' : 'none'
                        }}
                    >
                        探索
                    </Title>
                </div>
            </Content>

            <Footer style={{
                textAlign: 'center',
                background: 'rgba(0, 0, 0, 0.3)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.6)',
                zIndex: 20
            }}>
                © {new Date().getFullYear()} 去探索 — 去发现
            </Footer>
        </Layout>
    );
};

export default Home;