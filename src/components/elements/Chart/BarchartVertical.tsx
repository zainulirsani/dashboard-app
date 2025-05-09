import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

interface Props {
  data: {
    result: {
      CSR: number;
      KerjaPraktik: number;
      KerjaSama: number;
      Narasumber: number;
      Presentasi: number;
      Meeting: number;
      Undangan: number;
      Knowledge: number;
      Tugas: number;
      Lamaran: number;
      Penelitian: number;
    };
  };
}

interface TooltipData {
  x: number;
  y: number;
  label: string;
  value: number;
}
export function BarChartVertical({ data }: Props) {
  const height = 350;
  const margin = { top: 20, right: 20, bottom: 80, left: 40 };

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  
  // Auto detect width
  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        setContainerWidth(wrapperRef.current.clientWidth);
      }
    };

    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chartData = [
    { key: "Surat CSR", value: data?.result?.CSR ?? 0 },
    { key: "Surat Kerja Praktek", value: data?.result?.KerjaPraktik ?? 0 },
    { key: "Surat Kerja Sama", value: data?.result?.KerjaSama ?? 0 },
    { key: "Surat Narasumber", value: data?.result?.Narasumber ?? 0 },
    { key: "Surat Presentasi", value: data?.result?.Presentasi ?? 0 },
    { key: "Surat Meeting", value: data?.result?.Meeting ?? 0 },
    { key: "Surat Undangan", value: data?.result?.Undangan ?? 0 },
    { key: "Surat Knowledge", value: data?.result?.Knowledge ?? 0 },
    { key: "Surat Tugas", value: data?.result?.Tugas ?? 0 },
    { key: "Surat Lamaran", value: data?.result?.Lamaran ?? 0 },
    { key: "Surat Penelitian", value: data?.result?.Penelitian ?? 0 },
  ];  

  // Hitung width berdasarkan jumlah bar
    const width = containerWidth || 600; // fallback 600px


  const xScale = d3
    .scaleBand<string>()
    .domain(chartData.map((d) => d.key))
    .range([margin.left, width - margin.right])
    .padding(0.3);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(chartData, (d) => d.value) ?? 0])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <svg width={width} height={height}>
        {/* Grid Y */}
        {yScale.ticks(5).map((tick, i) => (
          <g key={i} transform={`translate(${margin.left},${yScale(tick)})`}>
            <line
              x2={width - margin.left - margin.right}
              stroke="lightgray"
              strokeDasharray="5,5"
            />
            <text
              x={-10}
              y={5}
              fontSize="10"
              textAnchor="end"
              fill="gray"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* Bars */}
        {chartData.map((d, i) => {
          const x = xScale(d.key) ?? 0;
          const bw = xScale.bandwidth();
          const barHeight = height - margin.bottom - yScale(d.value);
          const barY = yScale(d.value);

          return (
            <rect
              key={i}
              x={x}
              y={barY}
              width={bw}
              height={barHeight}
              fill="url(#barGradient)"
              rx="4"
              onMouseEnter={() =>
                setTooltip({
                  x: x + bw / 2,
                  y: barY - 10,
                  label: d.key,
                  value: d.value,
                })
              }
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}

        {/* Labels X */}
        {chartData.map((d, i) => (
          <text
            key={i}
            x={(xScale(d.key) ?? 0) + xScale.bandwidth() / 2}
            y={height - 10}
            fontSize="10"
            textAnchor="middle"
            fill="gray"
            transform={`rotate(-10 ${(xScale(d.key) ?? 0) + xScale.bandwidth() / 2}, ${height - 10})`}
          >
            {d.key.length > 20 ? `${d.key.slice(0, 20)}...` : d.key}
          </text>
        ))}

        {/* Gradient */}
        <defs>
          <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#8b0000" />
            <stop offset="100%" stopColor="#b22222" />
          </linearGradient>
        </defs>
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y,
            left: tooltip.x,
            transform: "translate(-50%, -100%)",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "6px 10px",
            fontSize: "12px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          <strong>{tooltip.label}</strong>: {tooltip.value}
        </div>
      )}
    </div>
  );
}


export default BarChartVertical;
