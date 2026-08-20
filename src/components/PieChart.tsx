"use client";

import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

export default function PieChart({ labels, data }: { labels: string[]; data: number[] }) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: ["#7c3aed", "#c084fc", "#e9d5ff"],
        hoverOffset: 8,
      },
    ],
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <Pie data={chartData} />
    </div>
  );
}
