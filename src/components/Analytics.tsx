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


  console.log(totalWebsites, totalFeedback)

  return (
    <div className="w-[90vw] md:w-[68vw] mx-auto  mt-7">
      <div className="p-4 bg-[#111115]  border-[1px] border-[#15171b]">
        <h1 className="md:text-2xl text-lg font-semibold text-slate-300 px-4 md:px-8 pt-3 mb-2">
          Your Analytics
        </h1>
        <Line data={analytics} />
      </div>
    </div>
  );
};

export default Analytics;
