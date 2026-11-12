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

/* Card with a thin gradient border and an optional corner glow */
const GlowCard = ({
  children,
  className = "",
  innerClassName = "",
  tint,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  tint?: string; // e.g. "bg-cyan-500/25"
  style?: React.CSSProperties;
}) => (
  <div
    style={style}
    className={`relative rounded-2xl bg-gradient-to-b from-white/[0.18] via-white/[0.05] to-white/[0.03] p-px ${className}`}
  >
    <div
      className={`relative h-full overflow-hidden rounded-[15px] bg-[#0a0d13]/95 backdrop-blur-xl ${innerClassName}`}
    >
      {tint && (
        <div
          className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl ${tint}`}
        />
      )}
      <div className="relative h-full">{children}</div>
    </div>
  </div>
);


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
  const max = Math.max(...items.map((i) => i.value), 1);

  const analytics = {
    labels: items.map((i) => i.label),
    datasets: [
      {
        label: "Overview",
        data: sum === 0 ? [1] : items.map((i) => i.value),
        backgroundColor: sum === 0 ? ["#1b2129"] : items.map((i) => i.color),
        borderWidth: 0,
        borderRadius: 8,
        spacing: sum === 0 ? 0 : 5,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    cutout: "78%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: sum !== 0 },
    },
  };

  return (
    <GlowCard className="lg:h-full" tint="bg-cyan-500/20">
      <div className="p-5 sm:p-6">
        {loading ? (
          <div className="grid min-h-[22rem] place-items-center">
            <Loader message={"Please wait"} />
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-white">Your Analytics</h2>
            <p className="mt-1 text-sm text-slate-500">
              Everything in your workspace at a glance
            </p>

            <div className="relative mx-auto mt-6 aspect-square w-full max-w-[230px] [filter:drop-shadow(0_0_26px_rgba(99,102,241,0.3))]">
              <Doughnut data={analytics} options={options} />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-5xl font-extrabold tabular-nums tracking-tight text-transparent">
                  {sum}
                </span>
                <span className="mt-1 text-xs text-slate-500">total items</span>
              </div>
            </div>

            <ul className="mt-7 space-y-3.5">
              {items.map((i) => (
                <li key={i.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-300">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: i.color,
                          boxShadow: `0 0 12px ${i.color}`,
                        }}
                      />
                      {i.label}
                    </span>
                    <span className="font-bold tabular-nums text-white">
                      {i.value}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(i.value / max) * 100}%`,
                        backgroundColor: i.color,
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </GlowCard>
  );
};

export default Analytics;