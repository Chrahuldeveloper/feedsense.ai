import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Loader from "./Loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

interface AnalyticsProps {
  totalWebsites: string;
  totalFeedback: string;
  totalTasksFinished: string;
  totalIncompleteTasks: string;
  loading: boolean;
}

const Analytics: React.FC<AnalyticsProps> = ({
  totalWebsites,
  totalFeedback,
  totalTasksFinished,
  totalIncompleteTasks,
  loading,
}) => {
  const items = [
    { label: "Websites", value: Number(totalWebsites) || 0, color: "#22d3ee" },
    { label: "Feedbacks", value: Number(totalFeedback) || 0, color: "#a78bfa" },
    {
      label: "Completed",
      value: Number(totalTasksFinished) || 0,
      color: "#34d399",
    },
    {
      label: "Pending",
      value: Number(totalIncompleteTasks) || 0,
      color: "#fbbf24",
    },
  ];

  const sum = items.reduce((a, b) => a + b.value, 0);
  const tasks = items[2].value + items[3].value;
  const rate = tasks > 0 ? Math.round((items[2].value / tasks) * 100) : null;

  const analytics = {
    labels: items.map((i) => i.label),
    datasets: [
      {
        label: "Overview",
        data: sum === 0 ? [1] : items.map((i) => i.value),
        backgroundColor: sum === 0 ? ["#1b2129"] : items.map((i) => i.color),
        borderWidth: 0,
        borderRadius: 6,
        spacing: sum === 0 ? 0 : 4,
      },
    ],
  };

  const options = {
    cutout: "76%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: sum !== 0 },
    },
  };

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 sm:p-6 lg:h-full">
      {loading ? (
        <div className="grid min-h-[22rem] place-items-center">
          <Loader message={"Please wait"} />
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold text-white">Your Analytics</h2>
          <p className="mt-1 text-sm text-slate-500">
            How your feedback turns into action
          </p>

          <div className="relative mx-auto mt-6 aspect-square w-full max-w-[240px]">
            <Doughnut data={analytics} options={options} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-semibold tabular-nums tracking-tight text-white">
                {rate === null ? "–" : `${rate}%`}
              </span>
              <span className="mt-1 text-xs text-slate-500">tasks resolved</span>
            </div>
          </div>

          <ul className="mt-7 grid grid-cols-2 gap-3">
            {items.map((i) => (
              <li
                key={i.label}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: i.color }}
                  />
                  <span className="text-xs text-slate-400">{i.label}</span>
                </div>
                <p className="mt-1.5 text-lg font-semibold tabular-nums text-white">
                  {i.value}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Analytics;