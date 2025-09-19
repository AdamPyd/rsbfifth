// src/components/DataCalendar.tsx

import React from 'react';
import { Calendar } from 'antd';
import { Moment } from 'moment';
import './DataCalendar.css';

// 使用 React.ComponentProps (需要 @types/react)
type CalendarProps = React.ComponentProps<typeof Calendar>;

interface DataCalendarProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
}

const DataCalendar: React.FC<DataCalendarProps> = ({ selectedDate, onDateSelect }) => {
    const onPanelChange: CalendarProps<Moment>['onSelect'] = (date) => {
        onDateSelect(date.toDate());
    };

    return (
        <div className="data-calendar">
            <Calendar
                fullscreen={false}
                onSelect={onPanelChange}
                // 可以设置默认值，但注意Calendar使用moment对象
            />
        </div>
    );
};

export default DataCalendar;