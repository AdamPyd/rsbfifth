import React, { useEffect, useRef, useState } from 'react';
import { Layout, Typography, Button } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

interface Star {
    x: number;
    y: number;
    size: number;
    brightness: number;
    baseBrightness: number;
    speed: number;
}

interface ShootingStar {
    x: number;
    y: number;
    angle: number;
    length: number;
    speed: number;
    brightness: number;
    trail: Array<{ x: number; y: number }>;
}

const Home: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const starsRef = useRef<Star[]>([]);
    const shootingStarsRef = useRef<ShootingStar[]>([]);
    const animationFrameRef = useRef<number>(0);
    const lastShootingStarTimeRef = useRef<number>(0);

    // 初始化星星
    const initStars = (width: number, height: number, count: number = 60) => {
        const stars: Star[] = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 3 + 0.5,
                brightness: Math.random() * 0.5 + 0.5,
                baseBrightness: Math.random() * 0.5 + 0.5,
                speed: Math.random() * 0.02 + 0.005,
            });
        }
        starsRef.current = stars;
    };

    // 创建流星
    const createShootingStar = (width: number, height: number) => {
        const startEdge = Math.floor(Math.random() * 4);
        let x, y, angle;

        switch (startEdge) {
            case 0: // 上边
                x = Math.random() * width;
                y = 0;
                angle = Math.random() * Math.PI * 0.5 + Math.PI * 0.25;
                break;
            case 1: // 右边
                x = width;
                y = Math.random() * height;
                angle = Math.random() * Math.PI * 0.5 + Math.PI * 0.75;
                break;
            case 2: // 下边
                x = Math.random() * width;
                y = height;
                angle = Math.random() * Math.PI * 0.5 + Math.PI * 1.25;
                break;
            case 3: // 左边
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
            length: Math.random() * 60 + 30,
            speed: Math.random() * 10 + 5,
            brightness: 1,
            trail: []
        });
    };

    // 动画循环
    const animate = (time: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height } = dimensions;

        // 清除画布
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        // 绘制星星
        const stars = starsRef.current;
        stars.forEach(star => {
            // 更新亮度
            star.brightness = star.baseBrightness + Math.sin(time * star.speed) * 0.5;
            const brightness = Math.max(0, Math.min(1, star.brightness));

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            ctx.fill();
        });

        // 更新和绘制流星
        const shootingStars = shootingStarsRef.current;
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const star = shootingStars[i];

            // 添加当前位置到轨迹
            star.trail.push({ x: star.x, y: star.y });
            if (star.trail.length > star.length) {
                star.trail.shift();
            }

            // 更新位置
            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;

            // 绘制轨迹
            ctx.beginPath();
            ctx.moveTo(star.trail[0].x, star.trail[0].y);

            for (let j = 1; j < star.trail.length; j++) {
                const alpha = j / star.trail.length;
                ctx.lineTo(star.trail[j].x, star.trail[j].y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * star.brightness})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // 绘制头部
            ctx.beginPath();
            ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
            ctx.fill();

            // 减少亮度
            star.brightness -= 0.01;

            // 移除不可见或出界的流星
            if (star.brightness <= 0 ||
                star.x < -50 || star.x > width + 50 ||
                star.y < -50 || star.y > height + 50) {
                shootingStars.splice(i, 1);
            }
        }

        // 随机生成新流星
        if (time - lastShootingStarTimeRef.current > 2000 && Math.random() < 0.02) {
            createShootingStar(width, height);
            lastShootingStarTimeRef.current = time;
        }

        animationFrameRef.current = requestAnimationFrame(animate);
    };

    // 初始化画布
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

    // 开始动画
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

            <Header style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
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
                        STARGAZE
                    </Text>
                    <div style={{ flex: 1 }} />
                    <Button type="primary" ghost>登录</Button>
                </div>
            </Header>

            <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <div style={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    padding: '120px 0',
                    textAlign: 'center'
                }}>
                    <Title style={{
                        color: '#fff',
                        fontSize: '4rem',
                        marginBottom: 24,
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                    }}>
                        探索浩瀚星空
                    </Title>
                    <Text style={{
                        color: 'rgba(255, 255, 255, 0.85)',
                        fontSize: '1.2rem',
                        display: 'block',
                        maxWidth: 600,
                        margin: '0 auto 40px',
                        lineHeight: 1.7
                    }}>
                        在这里，您可以发现宇宙的奥秘，探索遥远的星系，体验星际旅行的魅力
                    </Text>
                    <div>
                        <Button
                            type="primary"
                            size="large"
                            style={{ marginRight: 16, padding: '0 30px', height: 46 }}
                        >
                            开始探索
                        </Button>
                        <Button
                            ghost
                            size="large"
                            style={{ padding: '0 30px', height: 46, borderColor: '#fff', color: '#fff' }}
                        >
                            了解更多
                        </Button>
                    </div>
                </div>
            </Content>

            <Footer style={{
                textAlign: 'center',
                background: 'rgba(0, 0, 0, 0.3)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.6)'
            }}>
                © {new Date().getFullYear()} 星空探索 — 发现宇宙之美
            </Footer>
        </Layout>
    );
};

export default Home;