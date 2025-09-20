import React, { useState, useRef, useEffect } from 'react';
import { Radio, Card } from 'antd';
import ThreeJSMap from '../three/ThreeJSMap';
import { RegionType, UserLocation } from '../../../types/types';
import './MapContainer.css';

const { Group: RadioGroup } = Radio;
type RadioGroupType = typeof Radio.Group;
// 获取 Radio.Group 的 props 类型
type RadioGroupProps = React.ComponentProps<RadioGroupType>;
// 提取 onChange 属性的类型
type OnChangeType = RadioGroupProps['onChange'];
// 提取 onChange 函数的第一个参数的类型
type DerivedRadioChangeEvent = Parameters<NonNullable<OnChangeType>>[0];

interface MapContainerProps {
    selectedRegion: string;
    onRegionSelect: (regionCode: string) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({
                                                       selectedRegion,
                                                       onRegionSelect,
                                                   }) => {
    const [regionType, setRegionType] = useState<RegionType>('city');
    const mapRef = useRef<any>(null);

    const handleRegionTypeChange = (e: RadioChangeEvent) => {
        setRegionType(e.target.value);
    };

    useEffect(() => {
        // 当选中区域变化时，高亮显示该区域
        if (mapRef.current) {
            mapRef.current.highlightRegion(selectedRegion);
        }
    }, [selectedRegion]);

    return (
        <Card
            title="浙江省及周边地区地图"
            className="map-card"
            extra={
                <div className="map-controls">
                    <span>视图级别：</span>
                    <Radio.Group
                        value={regionType}
                        onChange={handleRegionTypeChange}
                        optionType="button"
                        buttonStyle="solid"
                        size="small"
                    >
                        <Radio value="province">省</Radio>
                        <Radio value="city">地级市</Radio>
                        <Radio value="county">县/县级市</Radio>
                    </Radio.Group>
                </div>
            }
        >
            <div className="map-wrapper">
                <ThreeJSMap
                    ref={mapRef}
                    regionType={regionType}
                    selectedRegion={selectedRegion}
                    onRegionSelect={onRegionSelect}
                    userLocation={null}
                />
            </div>
        </Card>
    );
};

export default MapContainer;