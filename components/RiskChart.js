// components/RiskChart.js
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useMemo } from "react";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function RiskChart({ driverName, riskData }) {
  // Simulate historical trend data for each risk factor (e.g., 6 periods)
  const chartData = useMemo(() => {
    const labels = ["-5m", "-4m", "-3m", "-2m", "-1m", "Current"];  // last 5 months and current
    // Helper to generate a semi-random sequence based on current value or placeholder if null
    const genSeries = (currentVal, seed) => {
      const series = [];
      const base = currentVal ?? (seed % 5 + 1) * 20; // if no current value, use seed to pick a base 20-100
      for (let i = 0; i < labels.length; i++) {
        // simulate variation over time
        let variance = Math.floor(Math.random() * 15) - 7; // random between -7 and +7
        let val = Math.max(0, Math.min(100, base + variance * i));
        series.push(val);
      }
      return series;
    };
    // Use driverName (or id) as a seed for consistent random generation
    const seed = driverName.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const speedingSeries = genSeries(riskData.speeding, seed);
    const accelSeries = genSeries(riskData.acceleration, seed + 1);
    const brakingSeries = genSeries(riskData.braking, seed + 2);
    const corneringSeries = genSeries(riskData.cornering, seed + 3);

    return {
      labels,
      datasets: [
        { label: "Speeding", data: speedingSeries, borderColor: "#e74c3c", backgroundColor: "#e74c3c88" },
        { label: "Acceleration", data: accelSeries, borderColor: "#f39c12", backgroundColor: "#f39c1288" },
        { label: "Braking", data: brakingSeries, borderColor: "#3498db", backgroundColor: "#3498db88" },
        { label: "Cornering", data: corneringSeries, borderColor: "#8e44ad", backgroundColor: "#8e44ad88" }
      ]
    };
  }, [driverName, riskData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" }, title: { display: false } },
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  };

  return (
    <div style={{ height: "200px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}