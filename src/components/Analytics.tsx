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
    labels: ["totalWebsites", "totalFeedback"],
    datasets: [
      {
        label: "Dashboard",
        data: [totalWebsites, totalFeedback],
        borderColor: "#04a7e5",
        pointBackgroundColor: "#04a7e5",
        pointBorderColor: "#04a7e5",
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
    <div className="md:max-w-6xl mx-auto p-5">
      <div className="p-4 border-[0.1px] rounded-lg border-stone-800 ">
        <Line data={analytics} />
      </div>
    </div>
  );
};

export default Analytics;
