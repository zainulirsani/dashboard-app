import React, { useState } from "react";
import { DateRange } from "react-date-range"; // ✅ perbaikan di sini
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface RangeSelection {
  selection: {
    startDate: Date;
    endDate: Date;
    key: string;
  };
}

interface Props {
  onDateChange: (range: { startDate: string; endDate: string }) => void;
  onDone?: () => void;
}

const DateRangeInput: React.FC<Props> = ({ onDateChange, onDone }) => {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleChange = (ranges: RangeSelection) => {
    const selectedRange = ranges.selection;
    setRange([selectedRange]);

    // Gunakan format dari date-fns untuk menghindari pergeseran waktu
    const startDateStr = selectedRange.startDate
      ? format(selectedRange.startDate, "yyyy-MM-dd")
      : "";
    const endDateStr = selectedRange.endDate
      ? format(selectedRange.endDate, "yyyy-MM-dd")
      : "";

    onDateChange({ startDate: startDateStr, endDate: endDateStr });

    if (
      onDone &&
      selectedRange.startDate &&
      selectedRange.endDate &&
      selectedRange.startDate.getTime() !== selectedRange.endDate.getTime()
    ) {
      onDone();
    }
  };

  return (
    <DateRange
      editableDateInputs={true}
      onChange={handleChange}
      moveRangeOnFirstSelection={false}
      ranges={range}
      maxDate={new Date()}
      rangeColors={["#0d6efd"]}
    />
  );
};

export default DateRangeInput;
