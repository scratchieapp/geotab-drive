// src/data/fakeData.ts

export interface Driver {
  id: string;
  name: string;
  photo: string;         // e.g. "/images/avatar1.png"
  score: number;         // 0-100 safety score
  trend: number;         // difference from last period (+/-)
  collisionRisk: number; // 0-10 scale
  isActive: boolean;

  // for the "All Drivers" table stats
  speeding: string;      // "Underperforming" | "Average" | "Best" | ...
  acceleration: string;
  braking: string;
  cornering: string;

  // for a line chart example
  scoreOverTime: number[];  // historical monthly/weekly scores

  // optional: used for top-performers or improvements
  rank?: number;
  improvement?: number;   // e.g. +12% improvement
}

// The array of 12 drivers
export const allDrivers: Driver[] = [
  {
    id: "driver1",
    name: "Alice Anderson",
    photo: "https://i.pravatar.cc/150?img=1",
    score: 95,
    trend: +3,
    collisionRisk: 7.6,
    isActive: true,
    speeding: "Underperforming",
    acceleration: "Best",
    braking: "At risk",
    cornering: "At risk",
    scoreOverTime: [88, 90, 92, 94, 95],
    rank: 1,
  },
  {
    id: "driver2",
    name: "Bob Brown",
    photo: "https://i.pravatar.cc/150?img=3",
    score: 92,
    trend: +2,
    collisionRisk: 7.3,
    isActive: true,
    speeding: "Average",
    acceleration: "At risk",
    braking: "At risk",
    cornering: "At risk",
    scoreOverTime: [85, 86, 87, 90, 92],
    rank: 2
  },
  {
    id: "driver3",
    name: "Charlie Carter",
    photo: "https://i.pravatar.cc/150?img=5",
    score: 88,
    trend: +1,
    collisionRisk: 6.6,
    isActive: true,
    speeding: "Average",
    acceleration: "Average",
    braking: "At risk",
    cornering: "At risk",
    scoreOverTime: [82, 83, 85, 87, 88],
    rank: 3
  },
  {
    id: "driver4",
    name: "David Davis",
    photo: "https://i.pravatar.cc/150?img=7",
    score: 82,
    trend: +4,
    collisionRisk: 5.5,
    isActive: true,
    speeding: "Low",
    acceleration: "Good",
    braking: "Average",
    cornering: "Average",
    scoreOverTime: [70, 75, 78, 80, 82],
    improvement: 15
  },
  {
    id: "driver5",
    name: "Eva Edwards",
    photo: "https://i.pravatar.cc/150?img=9",
    score: 78,
    trend: +2,
    collisionRisk: 5.0,
    isActive: true,
    speeding: "Average",
    acceleration: "Underperforming",
    braking: "At risk",
    cornering: "At risk",
    scoreOverTime: [70, 72, 73, 76, 78],
    improvement: 12
  },
  {
    id: "driver6",
    name: "Fiona Fisher",
    photo: "https://i.pravatar.cc/150?img=11",
    score: 85,
    trend: 0,
    collisionRisk: 4.2,
    isActive: true,
    speeding: "Average",
    acceleration: "Best",
    braking: "Underperforming",
    cornering: "At risk",
    scoreOverTime: [80, 82, 85, 85, 85],
  },
  {
    id: "driver7",
    name: "George Green",
    photo: "https://i.pravatar.cc/150?img=13",
    score: 76,
    trend: -2,
    collisionRisk: 8.4,
    isActive: true,
    speeding: "Underperforming",
    acceleration: "Underperforming",
    braking: "At risk",
    cornering: "At risk",
    scoreOverTime: [78, 79, 79, 78, 76],
  },
  {
    id: "driver8",
    name: "Hannah Hill",
    photo: "https://i.pravatar.cc/150?img=15",
    score: 70,
    trend: -3,
    collisionRisk: 8.8,
    isActive: false,
    speeding: "At risk",
    acceleration: "At risk",
    braking: "Underperforming",
    cornering: "Underperforming",
    scoreOverTime: [74, 73, 72, 71, 70],
  },
  {
    id: "driver9",
    name: "Ian Ivory",
    photo: "https://i.pravatar.cc/150?img=17",
    score: 64,
    trend: -4,
    collisionRisk: 9.2,
    isActive: true,
    speeding: "At risk",
    acceleration: "At risk",
    braking: "At risk",
    cornering: "At risk",
    scoreOverTime: [70, 68, 66, 65, 64],
  },
  {
    id: "driver10",
    name: "Jenny Jones",
    photo: "https://i.pravatar.cc/150?img=19",
    score: 90,
    trend: +1,
    collisionRisk: 3.4,
    isActive: true,
    speeding: "Best",
    acceleration: "Best",
    braking: "Average",
    cornering: "Great",
    scoreOverTime: [85, 87, 88, 89, 90],
  },
  {
    id: "driver11",
    name: "Kyle King",
    photo: "https://i.pravatar.cc/150?img=21",
    score: 68,
    trend: +1,
    collisionRisk: 2.9,
    isActive: true,
    speeding: "Low",
    acceleration: "Average",
    braking: "Average",
    cornering: "Good",
    scoreOverTime: [62, 64, 65, 67, 68],
  },
  {
    id: "driver12",
    name: "Laura Lane",
    photo: "https://i.pravatar.cc/150?img=23",
    score: 59,
    trend: -2,
    collisionRisk: 9.5,
    isActive: false,
    speeding: "At risk",
    acceleration: "At risk",
    braking: "At risk",
    cornering: "At risk",
    scoreOverTime: [65, 63, 60, 61, 59],
  }
];

// Helper functions to pick "top performers" or "most improved"
export function getTopPerformers(count: number): Driver[] {
  // sort by score desc
  const sorted = [...allDrivers].sort((a, b) => b.score - a.score);
  return sorted.slice(0, count);
}

export function getMostImproved(count: number): Driver[] {
  // sort by improvement desc
  const sorted = [...allDrivers].sort((a, b) => (b.improvement ?? 0) - (a.improvement ?? 0));
  return sorted.slice(0, count);
}

// For the line chart, you might want the top 5 or so:
export function getTopDriversForChart(count: number): Driver[] {
  return getTopPerformers(count);
} 