
import React, { useState, useEffect } from 'react';
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
        result: true, // 缺省折叠
    });

    // 差异效果的三个值
    const [diffResults, setDiffResults] = useState({
        originResult: '',
        newResult: '',
        mixResult: ''
    });

    // 比较函数
    const compare = (str1: string, str2: string): Record<string, string> => {
        // 简单的行对比实现
        const lines1 = str1.split('\n');
        const lines2 = str2.split('\n');
        const maxLines = Math.max(lines1.length, lines2.length);

        const originResult: string[] = [];
        const newResult: string[] = [];
        const mixResult: string[] = [];

        for (let i = 0; i < maxLines; i++) {
            const line1 = lines1[i] || '';
            const line2 = lines2[i] || '';

            if (line1 === line2) {
                originResult.push(`<div>${line1}</div>`);
                newResult.push(`<div>${line2}</div>`);
                mixResult.push(`<div>${line1}</div>`);
            } else {
                if (line1) {
                    originResult.push(`<div style="background-color: ${config.deletedColor}20;"><del>${line1}</del></div>`);
                }
                if (line2) {
                    newResult.push(`<div style="background-color: ${config.addedColor}20;"><ins>${line2}</ins></div>`);
                }
                mixResult.push(
                    `<div style="display: flex; gap: 10px;">` +
                    `<div style="flex: 1; background-color: ${config.deletedColor}20;"><del>${line1 || ''}</del></div>` +
                    `<div style="flex: 1; background-color: ${config.addedColor}20;"><ins>${line2 || ''}</ins></div>` +
                    `</div>`
                );
            }
        }

        return {
            originResult: originResult.join(''),
            newResult: newResult.join(''),
            mixResult: mixResult.join('')
        };
    };

    // 文本变化时触发比较
    useEffect(() => {
        if (textData.leftText || textData.rightText) {
            const results = compare(textData.leftText, textData.rightText);
            setDiffResults(results);

            // 展开结果区域
            setCollapsedSections(prev => ({
                ...prev,
                result: false
            }));
        } else {
            setDiffResults({
                originResult: '',
                newResult: '',
                mixResult: ''
            });
        }
    }, [textData.leftText, textData.rightText, config.addedColor, config.deletedColor]);

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
