import React, { useState } from "react";
import { DateRange } from "react-date-range";
import {
  format,
  subDays,
  startOfToday,
  startOfYesterday,
  endOfYesterday,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  subYears,
} from "date-fns";
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

  const handleRangeUpdate = (startDate: Date, endDate: Date) => {
    const newRange = { startDate, endDate, key: "selection" };
    setRange([newRange]);

    onDateChange({
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    });

    if (onDone) onDone();
  };

  const handlePreset = (type: string) => {
    const today = startOfToday();

    switch (type) {
      case "today":
        handleRangeUpdate(today, today);
        break;
      case "yesterday":
        handleRangeUpdate(startOfYesterday(), endOfYesterday());
        break;
      case "last7":
        handleRangeUpdate(subDays(today, 6), today);
        break;
      case "last30":
        handleRangeUpdate(subDays(today, 29), today);
        break;
      case "thisMonth":
        handleRangeUpdate(startOfMonth(today), endOfMonth(today));
        break;
      case "lastMonth":
        const lastMonth = subMonths(today, 1);
        handleRangeUpdate(startOfMonth(lastMonth), endOfMonth(lastMonth));
        break;
      case "thisYear":
        handleRangeUpdate(startOfYear(today), endOfYear(today));
        break;
      case "lastYear":
        const lastYear = subYears(today, 1);
        handleRangeUpdate(startOfYear(lastYear), endOfYear(lastYear));
        break;
    }
  };

  const handleChange = (ranges: RangeSelection) => {
    const selectedRange = ranges.selection;
    setRange([selectedRange]);

    const startDateStr = format(selectedRange.startDate, "yyyy-MM-dd");
    const endDateStr = format(selectedRange.endDate, "yyyy-MM-dd");

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
    <div>
      <DateRange
        editableDateInputs={true}
        onChange={handleChange}
        moveRangeOnFirstSelection={false}
        ranges={range}
        maxDate={new Date()}
        rangeColors={["#0d6efd"]}
      />
      <div style={{ marginBottom: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePreset("today")}>Today</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePreset("yesterday")}>Yesterday</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePreset("last7")}>Last 7 Days</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePreset("last30")}>Last 30 Days</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePreset("thisMonth")}>This Month</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePreset("lastMonth")}>Last Month</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePreset("thisYear")}>This Year</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePreset("lastYear")}>Last Year</button>
        </div>
      </div>

    </div>

  );
};

export default DateRangeInput;
