import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface LineChartProps {
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
  titleX?: string;
  titleY?: string;
  isNominal?: boolean;  // Prop to determine if data is nominal
}

const LineChart: React.FC<LineChartProps> = ({ chartData, titleX, titleY, isNominal }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (
      !Array.isArray(chartData.datasets) ||
      chartData.datasets.length === 0 ||
      !Array.isArray(chartData.labels) ||
      chartData.labels.length === 0
    ) {
      console.error("Data atau labels untuk LineChart kosong atau tidak valid.");
      return;
    }

    const ctx = chartRef.current?.getContext("2d");
    if (ctx) {
      const myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: chartData.labels,
          datasets: chartData.datasets.map((dataset) => ({
            label: dataset.label,
            data: dataset.data,
            borderColor: dataset.borderColor,
            backgroundColor: dataset.backgroundColor,
            borderWidth: 3,
            tension: 0.4,
            pointBackgroundColor: dataset.borderColor,
            pointRadius: 5,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Penting untuk fleksibilitas tinggi
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                font: {
                  size: 14,
                  family: "Arial",
                  weight: "bold",
                },
                color: "#333",
                padding: 15,
              },
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label: function (tooltipItem) {
                  const value = tooltipItem.raw as number;
                  // Conditionally add "Rp" for nominal data
                  if (isNominal) {
                    return `Rp ${value.toLocaleString("id-ID")}`;
                  }
                  return `Value: ${value.toLocaleString("id-ID")}`; // Just return the number for non-nominal data
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: titleX,
                font: { size: 14, family: "Arial", weight: "bold" },
                color: "#333",
              },
              grid: { display: false },
            },
            y: {
              title: {
                display: true,
                text: titleY,
                font: { size: 14, family: "Arial", weight: "bold" },
                color: "#333",
              },
              grid: { color: "rgba(200, 200, 200, 0.2)" },
              beginAtZero: true,
              ticks: {
                callback: function (value: string | number) {
                  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

                  // Deteksi layar mobile
                  const isMobile = window.innerWidth < 768;

                  if (isMobile) {
                    if (numericValue >= 1_000_000_000) return (numericValue / 1_000_000_000).toFixed(0) + 'M'; // Miliar jadi "M"
                    if (numericValue >= 1_000_000) return (numericValue / 1_000_000).toFixed(0) + 'jt';       // Juta jadi "jt"
                    if (numericValue >= 1_000) return (numericValue / 1_000).toFixed(0) + 'rb';               // Ribu jadi "rb"
                    return numericValue;
                  } else {
                    return numericValue.toLocaleString("id-ID");
                  }
                },
              },
            },
          },

          animation: {
            duration: 1500,
            easing: "easeInOutQuart",
          },
        },
      });

      return () => myChart.destroy();
    }
  }, [chartData, titleX, titleY, isNominal]);

  return (
    <div
      style={{
        width: "100%",
        margin: "0 auto",
        height: "100%",
        padding: "0 10px",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {chartData.labels.length === 0 || chartData.datasets.length === 0 ? (
        <div
          style={{
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
            fontSize: "18px",
            fontStyle: "italic",
          }}
        >
          Data Pada Rentang Tanggal Yang Dipilih Kosong
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "400px",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onWheel={(e) => {
            const container = e.currentTarget;
            container.scrollLeft += e.deltaY;
          }}
          className="hide-scrollbar"
        >
          <div
            style={{
              minWidth: "100%", // minimal selebar layar
              width: chartData.labels.length * 50 + "px", // tetap fleksibel bila label banyak
              height: "100%",
            }}
          >
            <canvas ref={chartRef} />
          </div>
        </div>
      )}
    </div>
  );
  
  
  
  

};

export default LineChart;
