import { UserOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';

export interface Star {
    x: number;
    y: number;
    size: number;
    brightness: number;
    baseBrightness: number;
    speed: number;
    type: 'normal' | 'glowing';
    color: string;
}

export interface ShootingStar {
    x: number;
    y: number;
    angle: number;
    length: number;
    speed: number;
    brightness: number;
    trail: Array<{ x: number; y: number; size: number }>;
    trailPoints: number;
}