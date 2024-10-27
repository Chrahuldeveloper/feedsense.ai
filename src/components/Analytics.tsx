import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface AnalyticsProps {
  totalWebsites: string;
  totalFeedback: string;
}

const Analytics: React.FC<AnalyticsProps> = ({
  totalWebsites,
  totalFeedback,
}) => {
  const analytics = {
    labels: ["totalWebsites", "totalFeedback"],
    datasets: [
      {
        label: "Dashboard",
        data: [totalWebsites, totalFeedback],
        borderColor: "#2967ec",
        pointBackgroundColor: "#2967ec",
        pointBorderColor: "#2967ec",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="md:max-w-6xl mx-auto p-5 mt-5">
      <div className="p-4   bg-[#17161c] rounded-xl">
        <h1 className="text-2xl font-semibold text-white  px-8 pt-3 mb-2">
          Your Analytics
        </h1>
        <Line data={analytics} />
      </div>
    </div>
  );
};

export default Analytics;
