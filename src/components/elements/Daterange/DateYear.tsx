import React from 'react';
import styles from './DateYear.module.scss';

interface DateYearInputProps {
  value?: number;
  onChange?: (year: number) => void;
  options: number[];
}

const DateYearInput: React.FC<DateYearInputProps> = ({
  value,
  onChange,
  options
}) => {
  return (
    <div className={`${styles.yearSelectWrapper}`}>
    <select
      className={`${styles.search} form-select`}
      value={value ?? ''}
      onChange={(e) => onChange && onChange(parseInt(e.target.value))}
    >
      <option value="">Select Year</option>
      {options.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  </div>
  
  );
};

export default DateYearInput;
