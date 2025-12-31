
import React, { useState } from 'react';
import { Button, Radio } from 'antd';
import { Row, Col } from 'antd';
import CustomConfig from '../config/CustomConfig';
import './DiffResult.css';

interface DiffResultProps {
    config: {
        addedColor: string;
        deletedColor: string;
        discreteness: number;
    };
    textData: {
        leftText: string;
        rightText: string;
    };
    diffResults: {
        originResult: string;
        newResult: string;
        mixResult: string;
    };
    isCollapsed: boolean;
    onToggle: () => void;
    setConfig: React.Dispatch<React.SetStateAction<{
        addedColor: string;
        deletedColor: string;
        discreteness: number;
    }>>;
}

const DiffResult: React.FC<DiffResultProps> = ({
                                                   config,
                                                   textData,
                                                   diffResults,
                                                   isCollapsed,
                                                   onToggle,
                                                   setConfig,
                                               }) => {
    const [showConfig, setShowConfig] = useState(false);
    const [activeTab, setActiveTab] = useState<'split' | 'unified'>('split');

    if (isCollapsed) {
        return (
            <div className="section-collapsed" onClick={onToggle}>
                对比结果
            </div>
        );
    }

    return (
        <div className="diff-result">
            <div className="section-header">
                <Row>
                    <Col>
                        <div className="section-header">
                            <span>对比结果</span>
                        </div>
                    </Col>
                    <Col>
                        <span
                            className="config-link"
                            style={{ marginLeft:'5px' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowConfig(!showConfig);
                            }}
                        >
                          自定义配置
                        </span>
                    </Col>
                </Row>
                {showConfig && (
                    <div className="config-overlay" onClick={() => setShowConfig(false)}>
                        <div className="config-popup" onClick={(e) => e.stopPropagation()}>
                            <div className="popup-header">
                                <span>自定义配置</span>
                                <button className="close-btn" onClick={() => setShowConfig(false)}>×</button>
                            </div>
                            <CustomConfig config={config} setConfig={setConfig} />
                        </div>
                    </div>
                )}
                <Button onClick={onToggle} color="primary" variant="text">收起</Button>
            </div>
            <div className="tabs">
                <Radio.Group
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                >
                    <Radio.Button value="split">左右模式</Radio.Button>
                    <Radio.Button value="active">融合模式</Radio.Button>
                </Radio.Group>
            </div>
            <div className="result-content">
                {activeTab === 'split' ? (
                    <div className="split-view">
                        <div
                            className="diff-box"
                            // style={{ borderLeftColor: config.addedColor }}
                        >
                            {diffResults.originResult}
                        </div>
                        <div
                            className="diff-box"
                            // style={{ borderLeftColor: config.deletedColor }}
                        >
                            {diffResults.newResult}
                        </div>
                    </div>
                ) : (
                    <div
                        className="unified-view"
                        // style={{ borderLeftColor: config.addedColor }}
                    >
                        {diffResults.mixResult}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiffResult;
