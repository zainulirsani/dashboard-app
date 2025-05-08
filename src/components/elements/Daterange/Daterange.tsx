import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "daterangepicker";
import "daterangepicker/daterangepicker.css";

interface Props {
  onDateChange: (range: { startDate: string; endDate: string }) => void;
}

const DateRangeInput: React.FC<Props> = ({ onDateChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const $input = $(inputRef.current);

    $input.daterangepicker(
      {
        autoUpdateInput: false,
        locale: {
          cancelLabel: "Clear",
        },
      },
    );

    $input.on("apply.daterangepicker", (ev: any, picker: any) => {
      const start = picker.startDate.format("YYYY-MM-DD");
      const end = picker.endDate.format("YYYY-MM-DD");

      $input.val(picker.startDate.format("MM/DD/YYYY") + " - " + picker.endDate.format("MM/DD/YYYY"));
      onDateChange({ startDate: start, endDate: end });
    });

    $input.on("cancel.daterangepicker", () => {
      $input.val("");
      onDateChange({ startDate: "", endDate: "" });
    });

    return () => {
      $input.data("daterangepicker")?.remove();
    };
  }, [onDateChange]);

  return (
    <input
      type="text"
      name="datefilter"
      className="form-control"
      placeholder="Pilih Rentang Tanggal"
      ref={inputRef}
    />
  );
};

export default DateRangeInput;
