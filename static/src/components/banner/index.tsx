import React from 'react';
import { Typography } from 'antd';
import './index.css';

const { Title } = Typography;

const Banner: React.FC = () => {
    return (
        <div className="banner">
            <div className="banner-content">
                <Title level={2} className="banner-title">
                    浙江省及周边地区数据可视化平台
                </Title>
                <p className="banner-description">
                    全面展示地理信息与环境数据的综合平台
                </p>
            </div>
        </div>
    );
};

export default Banner;