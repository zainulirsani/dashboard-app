import React from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { TooltipItem } from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Dataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
}

interface LineChartCurvedProps {
  chartData: {
    labels: string[];
    datasets: Dataset[];
  };
  titleX?: string;
  titleY?: string;
  isNominal?: boolean;
}

function formatRupiah(value: number) {
  return value.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });
}

const LineChartCurved: React.FC<LineChartCurvedProps> = ({
  chartData,
  titleX,
  titleY,
  isNominal = false
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#333',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(113, 3, 27, 0.56)',
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context: TooltipItem<'line'>): string | void => {
            const val = context.parsed.y;
            if (isNominal && typeof val === 'number') {
              return formatRupiah(val);
            }
            if (typeof val === 'number') {
              return val.toString();
            }
            return;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: !!titleX,
          text: titleX,
          color: '#666',
          font: {
            weight: 'bold' as const,
            size: 12
          }
        },
        ticks: {
          color: '#444'
        },
        grid: {
          color: '#eee'
        }
      },
      y: {
        title: {
          display: !!titleY,
          text: titleY,
          color: '#666',
          font: {
            weight: 'bold' as const,
            size: 12
          }
        },
        ticks: {
          color: '#444',
          callback: function (value: string | number) {
            const numericValue = typeof value === 'string' ? parseFloat(value) : value;

            // Deteksi layar mobile
            const isMobile = window.innerWidth < 850;

            if (isMobile) {
              if (numericValue >= 1_000_000_000_000) return (numericValue / 1_000_000_000_000).toFixed(0) + 'T'; // Triliun jadi "t"
              if (numericValue >= 1_000_000_000) return (numericValue / 1_000_000_000).toFixed(0) + 'M'; // Miliar jadi "M"
              if (numericValue >= 1_000_000) return (numericValue / 1_000_000).toFixed(0) + 'jt';       // Juta jadi "jt"
              if (numericValue >= 1_000) return (numericValue / 1_000).toFixed(0) + 'rb';               // Ribu jadi "rb"
              return numericValue;
            } else {
              return numericValue.toLocaleString("id-ID");
            }
          },
        },
        grid: {
          color: '#eee'
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        backgroundColor: '#ff4d4f',
        borderWidth: 2,
        borderColor: '#fff',
        hoverRadius: 6
      }
    }
  };

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <div style={{ minWidth: '600px', height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LineChartCurved;
