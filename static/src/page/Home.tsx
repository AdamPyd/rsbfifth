import React, { useEffect, useRef, useState } from 'react';
import { Layout, Typography } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

interface Star {
    x: number;
    y: number;
    size: number;
    brightness: number;
    baseBrightness: number;
    speed: number;
    type: 'normal' | 'glowing'; // 星星类型：普通或带光晕
    color: string; // 星星颜色
}

interface ShootingStar {
    x: number;
    y: number;
    angle: number;
    length: number;
    speed: number;
    brightness: number;
    trail: Array<{ x: number; y: number; size: number }>; // 增加轨迹点尺寸
    trailPoints: number; // 轨迹点计数器
}

const Home = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const starsRef = useRef<Star[]>([]);
    const shootingStarsRef = useRef<ShootingStar[]>([]);
    const animationFrameRef = useRef<number>(0);
    const lastShootingStarTimeRef = useRef<number>(0);

    // 十六进制颜色转RGB
    const hexToRgb = (hex: string): string => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
            : '255,255,255';
    };

    // 初始化星星
    const initStars = (width: number, height: number, count: number = 120) => {
        const stars: Star[] = [];
        const colors = ['#ffffff', '#4facfe', '#00f2fe', '#f6d365', '#a6c0fe'];

        for (let i = 0; i < count; i++) {
            const baseBrightness = Math.random() * 0.5 + 0.5;
            // 随机类型：10%的概率为带光晕的星星
            const type = Math.random() < 0.1 ? 'glowing' : 'normal';
            // 随机选择颜色，亮度高的星星更可能使用非白色
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
            length: Math.random() * 80 + 40,
            speed: Math.random() * 10 + 5,
            brightness: 1,
            trail: [],
            trailPoints: 0
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

            ctx.save();

            if (star.type === 'normal') {
                // 普通星星：使用径向渐变创建模糊边缘
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
                // 带光晕的星星
                // 绘制十字光晕（四条线组成）
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

                // 绘制中心亮点（带模糊效果）
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

        // 更新和绘制流星
        const shootingStars = shootingStarsRef.current;
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const star = shootingStars[i];

            // 每3帧添加一个新的轨迹点（减少点密度）
            star.trailPoints++;
            if (star.trailPoints >= 3) {
                star.trailPoints = 0;
                // 添加当前位置到轨迹（带尺寸信息）
                star.trail.push({
                    x: star.x,
                    y: star.y,
                    size: Math.min(3, star.brightness * 4) // 头部大尾部小
                });
                if (star.trail.length > star.length) {
                    star.trail.shift();
                }
            }

            // 更新位置
            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;

            // 优化1: 使用线段连接轨迹点，形成连续轨迹
            if (star.trail.length >= 2) {
                ctx.beginPath();
                ctx.moveTo(star.trail[0].x, star.trail[0].y);

                // 绘制平滑的轨迹线段
                for (let j = 1; j < star.trail.length; j++) {
                    const prevPoint = star.trail[j-1];
                    const point = star.trail[j];

                    // 计算当前点的透明度（越靠近尾部透明度越低）
                    const alpha = (j / star.trail.length) * star.brightness;

                    // 优化2: 使用线段连接相邻点
                    ctx.lineTo(point.x, point.y);

                    // 设置线段样式（渐变宽度和透明度）
                    ctx.lineWidth = prevPoint.size * (1 - j/star.trail.length) * 0.8 + 0.5;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.stroke();

                    // 开始新的子路径
                    ctx.beginPath();
                    ctx.moveTo(point.x, point.y);
                }
            }

            // 优化3: 在轨迹点上添加光晕效果增强连贯性
            for (let j = 0; j < star.trail.length; j++) {
                const point = star.trail[j];
                const alpha = (j / star.trail.length) * star.brightness * 0.7; // 稍低的透明度
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

            // 绘制流星头部（更亮的中心）
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
                        DISCOVERY
                    </Text>
                    <div style={{ flex: 1 }} />
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
                        探索
                    </Title>
                </div>
            </Content>

            <Footer style={{
                textAlign: 'center',
                background: 'rgba(0, 0, 0, 0.3)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.6)'
            }}>
                © {new Date().getFullYear()} 去探索 — 去发现
            </Footer>
        </Layout>
    );
};

export default Home;