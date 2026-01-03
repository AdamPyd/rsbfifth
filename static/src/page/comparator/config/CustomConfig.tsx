
import React, { useState } from 'react';
import { Row, Col } from 'antd';
import './CustomConfig.css';
import { StringUtilsPy } from "../../../types/comparator/stringUtilsPy";

interface ConfigProps {
    config: {
        addedColor: string;
        deletedColor: string;
        discreteness: number;
    };
    setConfig: React.Dispatch<React.SetStateAction<{
        addedColor: string;
        deletedColor: string;
        discreteness: number;
    }>>;
}

const CustomConfig: React.FC<ConfigProps> = ({ config, setConfig }) => {
    const [showAddedPicker, setShowAddedPicker] = useState(false);
    const [showDeletedPicker, setShowDeletedPicker] = useState(false);

    const handleDiscretenessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfig(prev => ({ ...prev, discreteness: parseInt(e.target.value, 10) }));
    };

    const handleAddedColorChange = (color: string) => {
        setConfig(prev => ({ ...prev, addedColor: color }));
        setShowAddedPicker(false);
    };

    const handleDeletedColorChange = (color: string) => {
        setConfig(prev => ({ ...prev, deletedColor: color }));
        setShowDeletedPicker(false);
    };

    return (
        <div className="custom-config-popup">
            <div className="config-row">
                <label>
                    <div className="color-preview" style={{ backgroundColor: config.addedColor, color: StringUtilsPy.getContrastColor(config.addedColor) }} onClick={() => setShowAddedPicker(!showAddedPicker)} >
                        新增部分的颜色
                    </div>
                    {showAddedPicker && (
                        <input
                            type="color"
                            value={config.addedColor}
                            onChange={(e) => handleAddedColorChange(e.target.value)}
                            onBlur={() => setShowAddedPicker(false)}
                            autoFocus
                        />
                    )}
                </label>
                <label>
                    <div className="color-preview" style={{ backgroundColor: config.deletedColor, color: StringUtilsPy.getContrastColor(config.deletedColor) }} onClick={() => setShowDeletedPicker(!showDeletedPicker)} >
                        删除部分的颜色
                    </div>
                    {showDeletedPicker && (
                        <input
                            type="color"
                            value={config.deletedColor}
                            onChange={(e) => handleDeletedColorChange(e.target.value)}
                            onBlur={() => setShowDeletedPicker(false)}
                            autoFocus
                        />
                    )}
                </label>
                <Row>
                    <Col style={{ marginTop : '5px'}}>差异离散度：</Col>
                    <Col>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={config.discreteness}
                            onChange={handleDiscretenessChange}
                        />
                    </Col>
                    <Col style={{ marginLeft : '10px', marginTop : '5px'}}>{config.discreteness}</Col>
                </Row>
            </div>
        </div>
    );
};

export default CustomConfig;
