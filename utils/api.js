// Mock data for driver performance
const mockPerformanceData = [
  { date: '2024-01', score: 85, improvement: 5 },
  { date: '2024-02', score: 87, improvement: 8 },
  { date: '2024-03', score: 89, improvement: 12 },
  { date: '2024-04', score: 91, improvement: 15 },
  { date: '2024-05', score: 93, improvement: 18 },
  { date: '2024-06', score: 95, improvement: 20 }
];

/**
 * Fetches driver performance data from the API
 * @returns {Promise<Array>} Array of performance data points
 */
export async function getDriverPerformance() {
  // TODO: Replace with actual API call
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPerformanceData);
    }, 500); // Simulate network delay
  });
} 