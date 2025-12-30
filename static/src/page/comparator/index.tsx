
import React, { useState } from 'react';
import CustomConfig from './config/CustomConfig';
import TextComparison from './comparision/TextComparison';
import DiffResult from './result/DiffResult';
import './index.css';

const DiffComparator: React.FC = () => {
    const [config, setConfig] = useState({
        addedColor: '#00ff00',
        deletedColor: '#ff0000',
        discreteness: 2,
    });

    const [textData, setTextData] = useState({
        leftText: '',
        rightText: '',
    });

    const [collapsedSections, setCollapsedSections] = useState({
        config: false,
        text: false,
        result: false,
    });

    const toggleSection = (section: 'config' | 'text' | 'result') => {
        setCollapsedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    return (
        <div className="app">
            <CustomConfig
                config={config}
                setConfig={setConfig}
                isCollapsed={collapsedSections.config}
                onToggle={() => toggleSection('config')}
            />
            <TextComparison
                textData={textData}
                setTextData={setTextData}
                isCollapsed={collapsedSections.text}
                onToggle={() => toggleSection('text')}
            />
            <DiffResult
                config={config}
                textData={textData}
                isCollapsed={collapsedSections.result}
                onToggle={() => toggleSection('result')}
            />
        </div>
    );
};

export default DiffComparator;
