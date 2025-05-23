import React from 'react';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

type MonthRangeProps = {
    onChange: (dates: { startDate: string; endDate: string }) => void;
};

const MonthRange: React.FC<MonthRangeProps> = ({ onChange }) => {
    const handleChange = (value: [Date, Date] | null) => {
        if (value) {
            const [start, end] = value;
    
            const startYear = start.getFullYear();
            const startMonth = start.getMonth();
    
            const endYear = end.getFullYear();
            const endMonth = end.getMonth();
    
            const finalStartDate = new Date(startYear, startMonth, 1);
            finalStartDate.setHours(12); // Hindari bug timezone
    
            const finalEndDate = new Date(endYear, endMonth + 1, 0);
            finalEndDate.setHours(12); // Hindari bug timezone
    
            const startDate = finalStartDate.toISOString().split('T')[0];
            const endDate = finalEndDate.toISOString().split('T')[0];
    
            console.log(startDate, endDate);
            onChange({ startDate, endDate });
        }
    };
    

    return (
        <div>
            <DateRangePicker
                format="yyyy-MM"
                placement="auto"
                appearance="default"
                showOneCalendar
                style={{ width: 250 }}
                onChange={handleChange}
            />
        </div>
    );
};

export default MonthRange;
