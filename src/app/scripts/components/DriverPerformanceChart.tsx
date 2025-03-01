import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Driver } from "../../../data/fakeData";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props {
  drivers: Driver[];
}

const DriverPerformanceChart: React.FC<Props> = ({ drivers }) => {
  // Generate weekly labels for 3 months (12 weeks)
  const labels = useMemo(() => {
    const weeks: string[] = [];
    // Create labels for 12 weeks
    for (let i = 1; i <= 12; i++) {
      weeks.push(`Week ${i}`);
    }
    return weeks;
  }, []);

  // Generate weekly data for each driver (expand from monthly)
  const expandData = (monthlyData: number[]): number[] => {
    // If we don't have enough monthly data, generate some
    const scoreData = monthlyData.length >= 5 ? monthlyData : [70, 75, 80, 85, 90];
    
    // Expand 5 months of data to 12 weeks with some variations
    const weeklyData: number[] = [];
    for (let i = 0; i < 12; i++) {
      // Map week to corresponding month (roughly)
      const monthIndex = Math.min(Math.floor(i / 2.4), scoreData.length - 1);
      const monthScore = scoreData[monthIndex];
      
      // Add some variation for weeks
      const variance = Math.floor(Math.random() * 5) - 2; // -2 to +2
      weeklyData.push(Math.max(0, Math.min(100, monthScore + variance)));
    }
    
    return weeklyData;
  };

  // Determine fixed colors for top 5 drivers
  const topColors = useMemo(() => [
    "#1E88E5", // Blue for #1
    "#D81B60", // Red for #2
    "#43A047", // Green for #3
    "#FB8C00", // Orange for #4
    "#8E24AA"  // Purple for #5
  ], []);

  // Create datasets with proper formatting
  const datasets = useMemo(() => {
    // Sort drivers by their overall score
    const sortedDrivers = [...drivers].sort((a, b) => b.score - a.score);
    
    // Map each driver to a dataset
    return sortedDrivers.map((driver, index) => {
      const isTopFive = index < 5;
      
      return {
        label: driver.name,
        data: expandData(driver.scoreOverTime),
        borderColor: isTopFive ? topColors[index] : "#999999", // Grey for non-top-5
        backgroundColor: isTopFive ? `${topColors[index]}33` : "rgba(153, 153, 153, 0.2)",
        borderWidth: isTopFive ? 3 : 1.5,
        pointRadius: isTopFive ? 4 : 2,
        pointHoverRadius: isTopFive ? 6 : 3,
        tension: 0.1, // Slight curve to lines
        // Make non-top drivers more transparent and send to back
        order: isTopFive ? index : 100,
        borderDash: isTopFive ? [] : [3, 3]
      };
    });
  }, [drivers, topColors]);

  const chartData = {
    labels,
    datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
      legend: {
        position: "bottom" as const,
        labels: {
          // Custom function to show colored boxes only for top 5
          filter: (item: any, data: any) => {
            // Show only top 5 drivers in legend or a single "Other Drivers" entry
            const index = data.datasets.findIndex((d: any) => d.label === item.text);
            return index < 5 || item.text === "Other Drivers";
          },
          usePointStyle: true,
          boxWidth: 8
        }
      },
      title: {
        display: true,
        text: 'Driver Performance Scores by Week - Last 3 Months',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Score'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Week'
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default DriverPerformanceChart; 