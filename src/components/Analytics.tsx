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
  const analytics = {
    labels: [
      "totalWebsites",
      "totalFeedback",
      "totalTasksFinished",
      "totalIncompleteTasks",
    ],
    datasets: [
      {
        label: "My First Dataset",
        data: [
          totalWebsites,
          totalFeedback,
          totalTasksFinished,
          totalIncompleteTasks,
        ],
        backgroundColor: ["#00d4ff", "#22c55e", "#eab308", "#ef4444"],
      },
    ],
  };

  return (
    <div className="mt-7">
      <div className="p-4 bg-[#161617] rounded-lg border-[1px] border-[#2c2c2d]">
        {loading ? (
          <Loader message={"Please wait"} />
        ) : (
          <>
            <h1 className="md:text-2xl text-lg font-semibold text-slate-300 px-4 md:px-8 pt-3 mb-2">
              Your Analytics
            </h1>
            <Doughnut data={analytics} className="w-96 mx-auto p-10" />
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
