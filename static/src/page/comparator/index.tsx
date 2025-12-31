
import React, { useState } from 'react';
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
        text: false,
        result: false,
    });

    // 差异效果的三个值
    const [diffResults, setDiffResults] = useState({
        originResult: '',
        newResult: '',
        mixResult: ''
    });

    const toggleSection = (section: 'text' | 'result') => {
        setCollapsedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    return (
        <div className="app">
            <TextComparison
                textData={textData}
                setTextData={setTextData}
                config={config}
                isCollapsed={collapsedSections.text}
                onToggle={() => toggleSection('text')}
            />
            <DiffResult
                config={config}
                setConfig={setConfig}
                diffResults={diffResults}
                textData={textData}
                isCollapsed={collapsedSections.result}
                onToggle={() => toggleSection('result')}
            />
        </div>
    );
};

export default DiffComparator;
