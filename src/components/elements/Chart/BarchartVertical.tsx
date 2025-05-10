import React, { CSSProperties } from "react";
import { scaleBand, scaleLinear, max } from "d3";

interface DataItem {
  key: string;
  value: number;
}

const data: DataItem[] = [
  { key: "France", value: 38.1 },
  { key: "Spain", value: 25.3 },
  { key: "Italy", value: 23.1 },
  { key: "Portugal", value: 19.5 },
  { key: "Germany", value: 14.7 },
  { key: "Netherlands", value: 6.1 },
  { key: "Belgium", value: 10.8 },
  { key: "Austria", value: 7.8 },
  { key: "Greece", value: 6.8 },
  { key: "Luxembourg", value: 5.5 },
  { key: "Cyprus", value: 4.8 },
  { key: "Malta", value: 3.5 },
  { key: "Slovenia", value: 3.8 },
  { key: "Estonia", value: 8.8 },
  { key: "Latvia", value: 15.8 },
  { key: "Lithuania", value: 12.8 },
  { key: "Croatia", value: 5.8 },
].toSorted((a, b) => b.value - a.value);

export function BarChartVertical(): JSX.Element {
  const yScale = scaleBand<string>()
    .domain(data.map((d) => d.key))
    .range([0, 100])
    .padding(0.6);

  const xScale = scaleLinear()
    .domain([0, max(data, (d) => d.value) ?? 0])
    .range([0, 100]);

  const longestWord = max(data, (d) => d.key.length) || 1;

  return (
    <div
      className="relative w-full h-72"
      style={
        {
          "--marginTop": "0px",
          "--marginRight": "0px",
          "--marginBottom": "16px",
          "--marginLeft": `${longestWord * 7}px`,
        } as CSSProperties
      }
    >
      <div
        className="absolute inset-0 z-10 h-[calc(100%-var(--marginTop)-var(--marginBottom))] translate-y-[var(--marginTop)] w-[calc(100%-var(--marginLeft)-var(--marginRight))] translate-x-[var(--marginLeft)] overflow-visible"
      >
        {/* Hover Areas */}
        {data.map((d, index) => {
          const barWidth = xScale(d.value);
          const barHeight = yScale.bandwidth();
          const hoverColor =
            barWidth > 50
              ? "hover:bg-pink-200/40"
              : barWidth > 25
                ? "hover:bg-purple-200/40"
                : barWidth > 10
                  ? "hover:bg-indigo-200/40"
                  : "hover:bg-sky-200/40";

          return (
            <div
              key={`hover-${index}`}
              style={{
                position: "absolute",
                left: "0",
                top: `${yScale(d.key)}%`,
                width: "100%",
                height: `calc(${barHeight}% + 8px)`,
                transform: "translateY(-4px)",
              }}
              className={`${hoverColor} hover:bg-gray-200/50 relative z-10`}
            />
          );
        })}

        {/* Bars */}
        {data.map((d, index) => {
          const barWidth = xScale(d.value);
          const barHeight = yScale.bandwidth();
          const barColor =
            barWidth > 50
              ? "bg-pink-300 dark:bg-pink-500"
              : barWidth > 25
                ? "bg-purple-300 dark:bg-purple-500"
                : barWidth > 10
                  ? "bg-indigo-300 dark:bg-indigo-500"
                  : "bg-sky-300 dark:bg-sky-500";

          return (
            <React.Fragment key={`bar-${index}`}>
              <div
                style={{
                  position: "absolute",
                  left: "0",
                  top: `${yScale(d.key)}%`,
                  width: `${barWidth}%`,
                  height: `${barHeight}%`,
                }}
                className={`${barColor}`}
              />
              <div
                style={{
                  position: "absolute",
                  left: `${barWidth}%`,
                  top: `${(yScale(d.key) ?? 0) + barHeight / 2}%`,
                  transform: "translate(-100%, -50%)",
                  width: "9px",
                  height: "9px",
                  borderRadius: "2px",
                }}
                className={`${barColor}`}
              />
            </React.Fragment>
          );
        })}

        {/* Grid Lines */}
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {xScale
            .ticks(8)
            .map(xScale.tickFormat(8, "d"))
            .map((tick, i) => (
              <g
                key={`grid-${i}`}
                transform={`translate(${xScale(+tick)},0)`}
                className="text-gray-300/80 dark:text-gray-800/80"
              >
                <line
                  y1={0}
                  y2={100}
                  stroke="currentColor"
                  strokeDasharray="6,5"
                  strokeWidth={0.5}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
        </svg>

        {/* X Axis Labels */}
        {xScale.ticks(4).map((value, i) => (
          <div
            key={`x-label-${i}`}
            style={{
              left: `${xScale(value)}%`,
              top: "100%",
            }}
            className="absolute text-xs -translate-x-1/2 tabular-nums text-gray-400"
          >
            {value}
          </div>
        ))}
      </div>

      {/* Y Axis Labels */}
      <div className="h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[var(--marginLeft)] translate-y-[var(--marginTop)] overflow-visible">
        {data.map((entry, i) => (
          <span
            key={`y-label-${i}`}
            style={{
              left: "0",
              top: `${(yScale(entry.key) ?? 0) + yScale.bandwidth() / 2}%`,
            }}
            className="absolute text-xs text-gray-400 -translate-y-1/2 w-full text-right pr-2"
          >
            {entry.key}
          </span>
        ))}
      </div>
    </div>
  );
}
