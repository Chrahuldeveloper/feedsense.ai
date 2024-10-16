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
  totalWebsites: number;
  totalFeedback: number;
}

const Analytics: React.FC<AnalyticsProps> = ({
  totalWebsites,
  totalFeedback,
}) => {
  const analytics = {
    labels: ["totalWebsites", "totalFeedback", "totalTasks"],
    datasets: [
      {
        label: "Dashboard",
        data: [40, 34, 40],
        borderColor: "#588b79",
        pointBackgroundColor: "#588b79",
        pointBorderColor: "#588b79",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // shiny effect

  // borderImage: `linear-gradient(
  //   to right,
  //   #05bcff, #00b4db 25%,
  //   #0083b0 75%,
  //   #05bcff
  // ) 1 1`,
  // boxShadow: "0 0 15px rgba(5, 188, 255, 0.5)",
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
