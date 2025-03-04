// pages/dashboard.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import DriverTable from "../components/DriverTable";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Create a NoSSR wrapper component
const NoSSR = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="zenith-spinner">Loading components...</div>;
  }

  return children;
};

// Dynamically import Chart.js with SSR disabled
const Chart = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), { ssr: false });

// Dynamically import Zenith components with SSR disabled
const ZenithComponents = dynamic(
  () => import('../components/ZenithComponents'),
  { ssr: false }
);

// Sample data for top performers - replace with API data later
const topPerformers = [
  { id: "driver1", name: "Alice Anderson", score: 95, rank: 1, photo: "/images/avatar1.png" },
  { id: "driver2", name: "Bob Brown", score: 92, rank: 2, photo: "/images/avatar2.png" },
  { id: "driver3", name: "Charlie Carter", score: 88, rank: 3, photo: "/images/avatar3.png" }
];

// Sample data for most improved - replace with API data later
const mostImproved = [
  { id: "driver4", name: "David Davis", score: 82, improvement: 15, photo: "/images/avatar4.png" },
  { id: "driver5", name: "Eva Edwards", score: 78, improvement: 12, photo: "/images/avatar5.png" }
];

// Sample data for the line chart
const getLineChartData = () => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Alice Anderson',
      data: [95, 92, 94, 93, 95, 95],
      borderColor: '#4CAF50',
      backgroundColor: '#4CAF5033',
      fill: false,
      tension: 0.4,
      borderWidth: 3
    },
    {
      label: 'Bob Brown',
      data: [85, 88, 90, 91, 92, 92],
      borderColor: '#2196F3',
      backgroundColor: '#2196F333',
      fill: false,
      tension: 0.4,
      borderWidth: 3
    },
    {
      label: 'Charlie Carter',
      data: [80, 82, 84, 85, 87, 88],
      borderColor: '#FF9800',
      backgroundColor: '#FF980033',
      fill: false,
      tension: 0.4,
      borderWidth: 3
    },
    {
      label: 'All Others (avg)',
      data: [70, 72, 73, 75, 76, 78],
      borderColor: '#9E9E9E',
      backgroundColor: '#9E9E9E33',
      fill: false,
      tension: 0.4,
      borderWidth: 2,
      borderDash: [5, 5]
    }
  ]
});

export default function DashboardPage() {
  const router = useRouter();
  const [drivers, setDrivers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lineChartData, setLineChartData] = useState(getLineChartData());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Fetch driver performance data from our API
    async function fetchDrivers() {
      try {
        const res = await fetch("/api/hybrid-drivers");
        if (res.status === 401) {
          // Session invalid or expired – redirect to login
          router.replace("/");
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load driver data");
        }
        console.log("Retrieved driver data:", data);
        setDrivers(data);
      } catch (err) {
        console.error("Error loading drivers:", err);
        setError("Unable to load driver data.");
      } finally {
        setLoading(false);
      }
    }
    fetchDrivers();
  }, [router]);

  // Function to handle awarding a scratchie
  const handleAwardScratchie = async (driverId) => {
    try {
      const res = await fetch("/api/scratchie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId })
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to award Scratchie");
      } else {
        alert("🎉 Scratchie awarded to driver!");
      }
    } catch (err) {
      console.error("Scratchie award error:", err);
      alert("Error awarding Scratchie.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "5rem" }}>
        <div className="zenith-spinner">Loading driver data...</div>
      </div>
    );
  }

  if (error) {
    return <div style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>{error}</div>;
  }

  if (!isClient) {
    return (
      <div style={{ textAlign: "center", marginTop: "5rem" }}>
        <div className="zenith-spinner">Loading components...</div>
      </div>
    );
  }

  return (
    <NoSSR>
      <div style={{ padding: "1rem" }}>
        {/* Dashboard Header */}
        <h3 className="heading-02-mobile-drive" style={{ marginBottom: "0.5rem" }}>
          Driver Dashboard
        </h3>
        <p style={{ marginBottom: "2rem" }}>
          Instantly recognize top performance and encourage safe behavior. Need more detail? 
          Check the Supervisor Leaderboard or adjust Rules.
        </p>

        {/* Summary Tiles */}
        <ZenithComponents>
          {({ SummaryTileBar, SummaryTile, IconStar, IconArrowTop, IconTicket, IconArrowBottom, IconMoney, Button, IconPeople, Card }) => (
            <>
              <SummaryTileBar>
                <SummaryTile
                  title="Carrots Awarded This Week"
                  tooltipText="Total carrots awarded to drivers for good performance"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                    <IconStar size="large" style={{ marginRight: "0.5rem", color: "#FFB300" }} />
                    <span style={{ fontSize: "2rem", fontWeight: "bold" }}>14</span>
                    <div style={{ marginLeft: "1rem", display: "flex", alignItems: "center", color: "#4CAF50" }}>
                      <IconArrowTop size="small" />
                      <span>3</span>
                    </div>
                  </div>
                </SummaryTile>

                <SummaryTile
                  title="Scratchies Left This Month"
                  tooltipText="Remaining scratchies in your monthly allocation"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                    <IconTicket size="large" style={{ marginRight: "0.5rem", color: "#2196F3" }} />
                    <span style={{ fontSize: "2rem", fontWeight: "bold" }}>8</span>
                    <div style={{ marginLeft: "1rem", display: "flex", alignItems: "center", color: "#F44336" }}>
                      <IconArrowBottom size="small" />
                      <span>2</span>
                    </div>
                  </div>
                </SummaryTile>

                <SummaryTile
                  title="Award Pool"
                  tooltipText="Remaining funds in the reward budget"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                    <IconMoney size="large" style={{ marginRight: "0.5rem", color: "#4CAF50" }} />
                    <span style={{ fontSize: "2rem", fontWeight: "bold" }}>$1,250</span>
                    <Button type="tertiary" size="small" style={{ marginLeft: "1rem" }}>
                      Add Funds
                    </Button>
                  </div>
                </SummaryTile>

                <SummaryTile
                  title="Average Driver Score"
                  tooltipText="Average safety score across all active drivers"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                    <IconPeople size="large" style={{ marginRight: "0.5rem", color: "#673AB7" }} />
                    <span style={{ fontSize: "2rem", fontWeight: "bold" }}>87</span>
                    <div style={{ marginLeft: "1rem", display: "flex", alignItems: "center", color: "#4CAF50" }}>
                      <IconArrowTop size="small" />
                      <span>5</span>
                    </div>
                  </div>
                </SummaryTile>
              </SummaryTileBar>

              {/* Performance Chart */}
              <Card title="Driver Performance Trends" size="L" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
                <Card.Content>
                  <div style={{ height: "300px" }}>
                    <Chart 
                      data={lineChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                          tooltip: {
                            mode: 'index',
                            intersect: false,
                          }
                        },
                        scales: {
                          y: {
                            min: 50,
                            max: 100,
                            title: {
                              display: true,
                              text: 'Safety Score'
                            }
                          },
                          x: {
                            title: {
                              display: true,
                              text: 'Month'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </Card.Content>
              </Card>
            </>
          )}
        </ZenithComponents>

        {/* Top Performers Section */}
        <h4 className="heading-03-mobile-drive" style={{ marginBottom: "1rem" }}>
          Top Three Performers This Week
        </h4>
        <ZenithComponents>
          {({ Cards, Card, Button }) => (
            <Cards>
              {topPerformers.map(driver => (
                <Card key={driver.id} size="S" title={driver.name}>
                  <Card.Content>
                    <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                      <div style={{ 
                        width: "80px", 
                        height: "80px", 
                        borderRadius: "50%", 
                        backgroundColor: "#E0E0E0", 
                        margin: "0 auto 0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2rem",
                        overflow: "hidden"
                      }}>
                        {driver.photo ? (
                          <img src={driver.photo} alt={driver.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          driver.name.charAt(0)
                        )}
                      </div>
                      <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                        Score: {driver.score}
                      </div>
                      <div style={{ 
                        color: "#FFF", 
                        backgroundColor: "#FFB300", 
                        borderRadius: "12px", 
                        padding: "0.25rem 0.75rem",
                        display: "inline-block",
                        margin: "0.5rem 0"
                      }}>
                        Rank #{driver.rank}
                      </div>
                    </div>
                    <Button 
                      type="primary" 
                      style={{ width: "100%" }}
                      onClick={() => handleAwardScratchie(driver.id)}
                    >
                      Issue Scratchie
                    </Button>
                  </Card.Content>
                </Card>
              ))}
            </Cards>
          )}
        </ZenithComponents>

        {/* Most Improved Section */}
        <h4 className="heading-03-mobile-drive" style={{ margin: "2rem 0 1rem" }}>
          Most Improved This Week
        </h4>
        <ZenithComponents>
          {({ Cards, Card, Button }) => (
            <Cards>
              {mostImproved.map(driver => (
              <Card key={driver.id} size="S" title={driver.name}>
                <Card.Content>
                  <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                    <div style={{ 
                      width: "80px", 
                      height: "80px", 
                      borderRadius: "50%", 
                      backgroundColor: "#E0E0E0", 
                      margin: "0 auto 0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                      overflow: "hidden"
                    }}>
                      {driver.photo ? (
                        <img src={driver.photo} alt={driver.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        driver.name.charAt(0)
                      )}
                    </div>
                    <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                      Score: {driver.score}
                    </div>
                    <div style={{ 
                      color: "#FFF", 
                      backgroundColor: "#4CAF50", 
                      borderRadius: "12px", 
                      padding: "0.25rem 0.75rem",
                      display: "inline-block",
                      margin: "0.5rem 0"
                    }}>
                      +{driver.improvement}% Improvement
                    </div>
                  </div>
                  <Button 
                    type="primary" 
                    style={{ width: "100%" }}
                    onClick={() => handleAwardScratchie(driver.id)}
                  >
                    Issue Scratchie
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </Cards>
        )}
      </ZenithComponents>

      {/* Driver Table (showing all drivers) */}
      <h4 className="heading-03-mobile-drive" style={{ margin: "2rem 0 1rem" }}>
        All Drivers
      </h4>
      {drivers && <DriverTable drivers={drivers} />}
    </div>
  </NoSSR>
  );
}