// src/components/DataDisplay.tsx

import React from 'react';
import { List, Card, Progress, Row, Col, Statistic } from 'antd';
import { RegionData } from '../../../../types/types';
import './DataDisplay.css';

interface DataDisplayProps {
    dataType: string;
    regionData: RegionData | null;
    selectedDate: Date;
}

const DataDisplay: React.FC<DataDisplayProps> = ({ dataType, regionData, selectedDate }) => {
    // 格式化日期为YYYY-MM-DD
    const dateString = selectedDate.toISOString().split('T')[0];

    // 获取当天的数据
    const dailyData = regionData?.weatherData[dateString];

    if (dataType === 'all') {
        // 全部模式下显示所有指标的列表
        return (
            <div className="data-display">
                <List
                    itemLayout="horizontal"
                    dataSource={[
                        { key: 'weather', title: '天气', value: dailyData?.weather },
                        { key: 'temperature', title: '气温', value: `${dailyData?.temperature.min}°C - ${dailyData?.temperature.max}°C` },
                        { key: 'humidity', title: '湿度', value: `${dailyData?.humidity.min}% - ${dailyData?.humidity.max}%` },
                        { key: 'uv', title: '紫外线', value: dailyData?.uvIndex },
                        { key: 'air', title: '空气质量', value: `AQI: ${dailyData?.airQuality.aqi}` },
                        { key: 'warning', title: '灾害预警', value: dailyData?.warnings.length ? dailyData.warnings.join(', ') : '无' },
                        ...(regionData?.hasWater ? [{ key: 'tide', title: '潮水', value: '有潮水数据' }] : [])
                    ]}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.title}
                                description={item.value}
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }

    // 其他模式下显示该指标的详细数据
    return (
        <div className="data-display">
            <Card title={`${dataType}详细数据`}>
                {dataType === 'weather' && (
                    <div>
                        <h3>天气: {dailyData?.weather}</h3>
                        <p>24小时预报: 大部分时间晴朗，傍晚可能有零星降雨</p>
                    </div>
                )}

                {dataType === 'temperature' && dailyData && (
                    <div>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Statistic title="最高温度" value={dailyData.temperature.max} suffix="°C" />
                            </Col>
                            <Col span={12}>
                                <Statistic title="最低温度" value={dailyData.temperature.min} suffix="°C" />
                            </Col>
                        </Row>
                        <div style={{ marginTop: 20 }}>
                            <h4>小时温度变化</h4>
                            {dailyData.temperature.hourly.map((temp, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                    <span style={{ width: 40 }}>{index}:00</span>
                                    <Progress
                                        percent={((temp - dailyData.temperature.min) / (dailyData.temperature.max - dailyData.temperature.min)) * 100}
                                        showInfo={false}
                                        style={{ width: 200, margin: '0 10px' }}
                                    />
                                    <span>{temp}°C</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 其他数据类型的显示逻辑类似 */}
                {dataType !== 'temperature' && (
                    <p>这是{dataType}的详细数据展示区域</p>
                )}
            </Card>
        </div>
    );
};

export default DataDisplay;