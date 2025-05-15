import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Plugin,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type KotaItem = {
  kota: string;
  totalJumlah: number;
  jumlah: number;
  persentase: number;
};

type DonutChartProps = {
  kotaData: KotaItem[];
};

export function DonutChartCenterText({ kotaData }: DonutChartProps) {
    const totalJumlah = kotaData.at(0)?.totalJumlah ?? 0;
  const data: ChartData<"doughnut", number[], string> = {
    labels: kotaData.map((d) => d.kota),
    datasets: [
      {
        data: kotaData.map((d) => d.jumlah),
        backgroundColor: [
          "#7e4cfe", "#895cfc", "#956bff", "#a37fff", "#b291fd", "#b597ff",
          "#63b3ed", "#4299e1", "#3182ce", "#2b6cb0",
        ],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    cutout: "70%",
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const item = kotaData[context.dataIndex];
            return `${item.kota}: ${item.jumlah} (${item.persentase.toFixed(2)}%)`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
  };

  const centerTextPlugin: Plugin<"doughnut"> = {
    id: "centerText",
    beforeDraw: (chart) => {
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);
        const centerPoint = meta.data[0]; // Titik data pertama
      
        if (!centerPoint) return;
      
        const centerX = centerPoint.x;
        const centerY = centerPoint.y;
      
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "#666";
        ctx.fillText("Total", centerX, centerY - 15);
        ctx.font = "bold 28px sans-serif";
        ctx.fillStyle = "#111";
        ctx.fillText(`${totalJumlah}`, centerX, centerY + 15);
        ctx.restore();
      },
      
  };

  return (
    <div className="mx-auto">
      <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
    </div>
  );
}
