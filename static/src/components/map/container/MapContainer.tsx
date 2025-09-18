import React, { useState, useRef, useEffect } from 'react';
import { Radio, Card } from 'antd';
import { RadioChangeEvent } from 'antd/es/radio';
import ThreeJSMap from '../three/ThreeJSMap';
import { RegionType, UserLocation } from '../types';
import './MapContainer.css';

const { Group: RadioGroup } = Radio;

interface MapContainerProps {
    selectedRegion: string;
    onRegionSelect: (regionCode: string) => void;
    userLocation: UserLocation | null;
}

const MapContainer: React.FC<MapContainerProps> = ({
                                                       selectedRegion,
                                                       onRegionSelect,
                                                       userLocation
                                                   }) => {
    const [regionType, setRegionType] = useState<RegionType>('city');
    const mapRef = useRef<any>(null);

    const handleRegionTypeChange = (e: RadioChangeEvent) => {
        setRegionType(e.target.value);
    };

    return (
        <Card
            title="浙江省及周边地区地图"
            className="map-card"
            extra={
                <div className="map-controls">
                    <span>视图级别：</span>
                    <RadioGroup
                        value={regionType}
                        onChange={handleRegionTypeChange}
                        optionType="button"
                        buttonStyle="solid"
                        size="small"
                    >
                        <Radio value="province">省</Radio>
                        <Radio value="city">地级市</Radio>
                        <Radio value="county">县/县级市</Radio>
                    </RadioGroup>
                </div>
            }
        >
            <div className="map-wrapper">
                <ThreeJSMap
                    ref={mapRef}
                    regionType={regionType}
                    selectedRegion={selectedRegion}
                    onRegionSelect={onRegionSelect}
                    userLocation={userLocation}
                />
            </div>
        </Card>
    );
};

export default MapContainer;