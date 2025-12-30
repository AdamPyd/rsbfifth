
import React, { useState } from 'react';
import { Button, Row, Col, Progress } from 'antd';
import './CustomConfig.css';

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
    isCollapsed: boolean;
    onToggle: () => void;
}

const CustomConfig: React.FC<ConfigProps> = ({ config, setConfig, isCollapsed, onToggle }) => {
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

    if (!isCollapsed) {
        return (
            <div className="section-collapsed" onClick={onToggle}>
                自定义配置
            </div>
        );
    }

    return (
        <div className="custom-config">
            <div className="section-header">
                <span>自定义配置</span>
                <Button onClick={onToggle} color="primary" variant="text">收起</Button>
            </div>
            <div className="config-row">
                <label>
                    <div className="color-preview" style={{ backgroundColor: config.addedColor, color: getContrastColor(config.addedColor) }} onClick={() => setShowAddedPicker(!showAddedPicker)} >
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
                    <div className="color-preview" style={{ backgroundColor: config.deletedColor, color: getContrastColor(config.deletedColor) }} onClick={() => setShowDeletedPicker(!showDeletedPicker)} >
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
                    <Col>差异离散度：</Col>
                    <Col>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={config.discreteness}
                            onChange={handleDiscretenessChange}
                        />
                    </Col>
                    <Col>{config.discreteness}</Col>
                </Row>
            </div>
        </div>
    );
};

const getContrastColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? '#000' : '#fff';
};

export default CustomConfig;
