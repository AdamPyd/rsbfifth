
import React, { useState } from 'react';
import { Button, Radio } from 'antd';
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
    isCollapsed: boolean;
    onToggle: () => void;
}

const DiffResult: React.FC<DiffResultProps> = ({ config, textData, isCollapsed, onToggle }) => {
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
                <span>对比结果</span>
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
                            {/* 这里应实现左右差异高亮逻辑 */}
                            {textData.leftText || ''}
                        </div>
                        <div
                            className="diff-box"
                            // style={{ borderLeftColor: config.deletedColor }}
                        >
                            {/* 这里应实现右侧差异高亮逻辑 */}
                            {textData.rightText || ''}
                        </div>
                    </div>
                ) : (
                    <div
                        className="unified-view"
                        // style={{ borderLeftColor: config.addedColor }}
                    >
                        {/* 这里应实现融合差异展示逻辑 */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiffResult;
