import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { TooltipItem } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string;
}

interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

interface Props {
  chartData: ChartData;
  valueType?: 'currency' | 'number';
  titleX?: string;
  titleY?: string;
}

const Barchart: React.FC<Props> = ({
  chartData,
  valueType = 'number',
  titleX,
  titleY,
}) => {
  // Format lengkap
  const formatValue = (value: number) => {
    return value.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });
  };

  // Format pendek (untuk datalabels)
  const formatShortCurrency = (value: number) => {
    if (value >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(1)}jt`;
    if (value >= 1_000) return `Rp${(value / 1_000).toFixed(1)}rb`;
    return `Rp${value}`;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#4B5563',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
      },
      datalabels: {
        display: valueType !== 'currency', // nonaktifkan untuk currency agar tidak tumpang tindih
        color: '#111827',
        anchor: 'center' as const,
        align: 'center' as const,
        font: {
          size: 12,
          weight: 'bold' as const,
        },
        formatter: (value: number) => {
          return valueType === 'currency' ? formatShortCurrency(value) : value.toLocaleString('id-ID');
        },
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#FFFFFF',
        bodyColor: '#F9FAFB',
        callbacks: {
          label: (context: TooltipItem<'bar'>) => {
            const val = context.parsed.y;
            return valueType === 'currency' ? formatValue(val) : val.toLocaleString('id-ID');
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB',
        },
        ticks: {
          color: '#6B7280',
          callback: function (tickValue: string | number) {
            const numeric = typeof tickValue === 'number' ? tickValue : parseFloat(tickValue);
            return valueType === 'currency' ? formatShortCurrency(numeric) : numeric.toLocaleString('id-ID');
          },
        },
        title: {
          display: !!titleY,
          text: titleY,
          color: '#374151',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        },
        title: {
          display: !!titleX,
          text: titleX,
          color: '#374151',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 40, // mempertebal bar
      },
    },
  };

  // Tambahkan warna default jika tidak diset
  chartData.datasets = chartData.datasets.map((dataset) => ({
    ...dataset,
    backgroundColor: dataset.backgroundColor || `rgba(59, 130, 246, 0.7)`,
  }));

  return (
    <div style={{ width: '100%', height: '400px', background: '#FFFFFF' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default Barchart;
