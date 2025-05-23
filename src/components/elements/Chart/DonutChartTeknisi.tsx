import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

import React from 'react';

// Registrasi chart element
ChartJS.register(ArcElement, Tooltip, Legend);

interface TeknisiData {
  nama_teknisi: string;
  total: number;
}

interface DonutChartTeknisiProps {
  data: TeknisiData[];
}

const generateColorByValue = (value: number, max: number): string => {
  const darkness = Math.floor((1 - value / max) * 60); // skala kegelapan
  const r = 7;
  const g = 29 - Math.floor(darkness / 2); // makin gelap, makin rendah hijau
  const b = 89 - darkness; // makin besar value, makin tinggi biru (lebih terang)
  return `rgb(${Math.max(r, 0)}, ${Math.max(g, 0)}, ${Math.max(b, 0)})`;
};

const DonutChartTeknisi: React.FC<DonutChartTeknisiProps> = ({ data }) => {
  const isValidData =
    Array.isArray(data) && data.length > 0 && data.every((d) => typeof d.total === 'number' && typeof d.nama_teknisi === 'string');

  if (!isValidData) {
    return <div className="text-center text-gray-500">Tidak ada data teknisi</div>;
  }

  const max = Math.max(...data.map((d) => d.total));

  const backgroundColors = data.map((d) => generateColorByValue(d.total, max));

  const chartData = {
    labels: data.map((item) => item.nama_teknisi),
    datasets: [
      {
        data: data.map((item) => item.total),
        backgroundColor: backgroundColors,
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value} tugas`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: 400, margin: '10px auto' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};


export default DonutChartTeknisi;
