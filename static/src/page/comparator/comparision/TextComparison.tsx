
import React from 'react';
import { Button } from 'antd';
import './TextComparison.css';

interface TextComparisonProps {
    textData: {
        leftText: string;
        rightText: string;
    };
    setTextData: React.Dispatch<React.SetStateAction<{
        leftText: string;
        rightText: string;
    }>>;
    isCollapsed: boolean;
    onToggle: () => void;
}

const TextComparison: React.FC<TextComparisonProps> = ({ textData, setTextData, isCollapsed, onToggle }) => {
    const handleLeftChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextData(prev => ({ ...prev, leftText: e.target.value }));
    };

    const handleRightChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextData(prev => ({ ...prev, rightText: e.target.value }));
    };

    if (isCollapsed) {
        return (
            <div className="section-collapsed" onClick={onToggle}>
                要对比的数据
            </div>
        );
    }

    return (
        <div className="text-comparison">
            <div className="section-header">
                <span>要对比的数据</span>
                <Button onClick={onToggle} color="primary" variant="text">收起</Button>
            </div>
            <div className="text-inputs">
        <textarea
            value={textData.leftText}
            onChange={handleLeftChange}
            placeholder="原始文本"
            className="text-input"
        />
                <textarea
                    value={textData.rightText}
                    onChange={handleRightChange}
                    placeholder="变更后文本"
                    className="text-input"
                />
            </div>
        </div>
    );
};

export default TextComparison;
