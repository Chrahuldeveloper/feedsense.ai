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
    { label: "Websites", value: Number(totalWebsites) || 0, color: "#818cf8" },
    { label: "Feedbacks", value: Number(totalFeedback) || 0, color: "#38bdf8" },
    { label: "Completed", value: Number(totalTasksFinished) || 0, color: "#34d399" },
    { label: "Pending", value: Number(totalIncompleteTasks) || 0, color: "#fbbf24" },
  ];

  const sum = items.reduce((a, b) => a + b.value, 0);

  const analytics = {
    labels: items.map((i) => i.label),
    datasets: [
      {
        label: "Overview",
        data: sum === 0 ? [1] : items.map((i) => i.value),
        backgroundColor: sum === 0 ? ["#1f1f23"] : items.map((i) => i.color),
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
    <div className="h-full rounded-2xl p-px bg-white/10">
      <div className="relative h-full overflow-hidden rounded-[15px] bg-[#111113] p-6 sm:p-8">
        
        {loading ? (
          <div className="grid min-h-[18rem] place-items-center">
            <Loader message={"Please wait"} />
          </div>
        ) : (
          <div className="relative">
            <h2 className="text-base font-semibold text-white">Your Analytics</h2>
            <p className="mt-1 text-sm text-zinc-500">
              A snapshot of your workspace
            </p>

            <div className="mt-6 flex flex-col items-center gap-8 sm:flex-row sm:gap-10">
              <div className="relative aspect-square w-full max-w-[200px] shrink-0">
                <Doughnut data={analytics} options={options} />
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold tabular-nums tracking-tight text-white">
                    {sum}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                    total
                  </span>
                </div>
              </div>

              <ul className="grid w-full flex-1 grid-cols-2 gap-3">
                {items.map((i) => (
                  <li
                    key={i.label}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: i.color }}
                      />
                      <span className="text-xs text-zinc-400">{i.label}</span>
                    </div>
                    <p className="mt-2 text-2xl font-semibold tabular-nums text-white">
                      {i.value}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;