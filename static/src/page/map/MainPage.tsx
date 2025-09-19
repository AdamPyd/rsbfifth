import React, { useState, useEffect } from 'react';
import { Layout, Row, Col } from 'antd';
import Banner from '../../components/banner';
import MapContainer from '../../components/map/container/MapContainer';
import DataPanel from '../../components/map/data/panel/DataPanel';
import { fetchUserLocation, fetchRegionData } from '../../services/api';
import { RegionData, RegionType, UserLocation } from '../../types/types';
import './MainPage.css';

const { Content } = Layout;

const MainPage: React.FC = () => {
    const [selectedRegion, setSelectedRegion] = useState<string>('330000'); // 默认浙江
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [regionData, setRegionData] = useState<RegionData | null>(null);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

    useEffect(() => {
        // 获取用户当前位置
        fetchUserLocation().then(location => {
            setUserLocation(location);
            setSelectedRegion(location.cityCode);
        });
    }, []);

    useEffect(() => {
        // 获取区域数据
        fetchRegionData(selectedRegion).then(data => {
            setRegionData(data);
        });
    }, [selectedRegion]);

    const handleRegionSelect = (regionCode: string) => {
        setSelectedRegion(regionCode);
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    return (
        <Layout className="main-layout">
            <Banner />
            <Content className="main-content">
                <Row gutter={16} className="content-row">
                    <Col span={14} className="map-col">
                        <MapContainer
                            selectedRegion={selectedRegion}
                            onRegionSelect={handleRegionSelect}
                            userLocation={userLocation}
                        />
                    </Col>
                    <Col span={10} className="data-col">
                        <DataPanel
                            regionData={regionData}
                            selectedDate={selectedDate}
                            onDateSelect={handleDateSelect}
                        />
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default MainPage;