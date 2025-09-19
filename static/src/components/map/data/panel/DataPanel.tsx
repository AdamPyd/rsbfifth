import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import { RegionData } from '../../../../types/types';
import DataCalendar from '../../calendar/DataCalendar';
import DataDisplay from '../display/DataDisplay';
import './DataPanel.css';

const { TabPane } = Tabs;
// 使用 React.ComponentProps (需要 @types/react)
type TabsProps = React.ComponentProps<typeof Tabs>;

interface DataPanelProps {
    regionData: RegionData | null;
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
}

const DataPanel: React.FC<DataPanelProps> = ({
                                                 regionData,
                                                 selectedDate,
                                                 onDateSelect
                                             }) => {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [selectedDataDate, setSelectedDataDate] = useState<Date>(selectedDate);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDataDate(date);
        onDateSelect(date);
    };

    const tabItems: TabsProps['items'] = [
        {
            key: 'all',
            label: '全部'
        },
        {
            key: 'weather',
            label: '天气'
        },
        {
            key: 'temperature',
            label: '气温'
        },
        {
            key: 'humidity',
            label: '湿度'
        },
        {
            key: 'uv',
            label: '紫外线'
        },
        {
            key: 'air',
            label: '空气质量'
        },
        {
            key: 'warning',
            label: '灾害预警'
        },
        ...(regionData?.hasWater ? [{
            key: 'tide',
            label: '潮水'
        }] : [])
    ];

    return (
        <Card title={regionData?.regionName || '选择区域'} className="data-panel">
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                type="card"
                className="data-tabs"
            >
                {tabItems.map(item => (
                    <TabPane tab={item.label} key={item.key}>
                        <div className="data-content">
                            <DataCalendar
                                selectedDate={selectedDataDate}
                                onDateSelect={handleDateSelect}
                            />
                            <DataDisplay
                                dataType={item.key as any}
                                regionData={regionData}
                                selectedDate={selectedDataDate}
                            />
                        </div>
                    </TabPane>
                ))}
            </Tabs>
        </Card>
    );
};

export default DataPanel;