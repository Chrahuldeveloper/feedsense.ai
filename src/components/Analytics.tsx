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
    labels: ["Total ", "Cancelled "],
    datasets: [
      {
        label: "Your Appointments",
        data: [totalWebsites, totalFeedback],
        borderColor: "#6746ed",
        pointBackgroundColor: "#6746ed",
        pointBorderColor: "#fff",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="md:max-w-4xl mx-auto ">
      <Line data={analytics} />
    </div>
  );
};

export default Analytics;
