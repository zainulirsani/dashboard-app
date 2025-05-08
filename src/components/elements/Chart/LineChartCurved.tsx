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

interface LineChartCurvedProps {
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
    }[];
  };
  titleX?: string;
  titleY?: string;
}

const LineChartCurved: React.FC<LineChartCurvedProps> = ({ chartData, titleX, titleY }) => {
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
        bodyFont: { size: 13 }
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
          color: '#444'
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
    <div style={{ height: '100%', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChartCurved;
