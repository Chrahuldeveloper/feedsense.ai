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
  loading: boolean;
}

const Analytics: React.FC<AnalyticsProps> = ({
  totalWebsites,
  totalFeedback,
  loading,
}) => {
  const analytics = {
    labels: ["totalWebsites", "totalFeedback"],
    datasets: [
      {
        label: "My First Dataset",
        data: [10, 10],
        backgroundColor: ["#00a3ff", "#9f7aea"],
      },
    ],
  };

  console.log(totalWebsites, totalFeedback);

  return (
    <div className="mt-7">
      <div className="p-4 bg-[#151923] rounded-lg border-[1px] border-[#151923]">
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
