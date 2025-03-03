// src/app/scripts/components/DriverDashboard.tsx
import React, { useState, useEffect } from "react";
import { 
  Card, 
  Cards,
  SummaryTile, 
  SummaryTileBar,
  Button
} from "@geotab/zenith";
import { getTopPerformers, getMostImproved, getTopDriversForChart } from "../../../data/fakeData";
import DriverPerformanceChart from "./DriverPerformanceChart";
import DriverTable from "../../../../components/DriverTable"; // adjust path if needed

// DriverDashboard now uses real driver names from Geotab API
const DriverDashboard: React.FC = () => {
  // Add state for managing drivers data
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Derived data after fetching
  const [top3, setTop3] = useState<any[]>([]);
  const [improved, setImproved] = useState<any[]>([]);
  const [topDriversForChart, setTopDriversForChart] = useState<any[]>([]);
  
  // Function to fetch driver data from our new hybrid API
  useEffect(() => {
    async function fetchDrivers() {
      try {
        setLoading(true);
        // Use the new hybrid endpoint
        const response = await fetch('/api/hybrid-drivers');
        
        // Check for authentication errors
        if (response.status === 401) {
          setError("Your session has expired. Please login again.");
          // You might want to redirect to login here
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch drivers: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Fetched ${data.length} drivers from hybrid API`);
        
        // Set the drivers data
        setDrivers(data);
        
        // Calculate derived data
        // For top 3 performers, sort by score in descending order
        const sortedByScore = [...data].sort((a, b) => b.score - a.score);
        setTop3(sortedByScore.slice(0, 3));
        
        // For most improved, sort by improvement in descending order
        const sortedByImprovement = [...data]
          .filter(driver => driver.improvement !== undefined)
          .sort((a, b) => (b.improvement || 0) - (a.improvement || 0));
        setImproved(sortedByImprovement.slice(0, 2));
        
        // For chart, use top 5 by score
        setTopDriversForChart(sortedByScore.slice(0, 5));
        
        setError(null);
      } catch (err) {
        console.error("Error fetching drivers:", err);
        setError("Failed to load driver data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchDrivers();
  }, []);

  // Function to handle awarding a scratchie
  const handleAwardScratchie = (driverId: string) => {
    // In a real app, this would be an actual API call
    alert(`🎉 Scratchie awarded to driver ${driverId}!`);
  };

  // Custom CSS to make the title headers smaller (60% of original size)
  const titleStyles = `
    .summary-tiles-custom .zenith-summary-tile-title {
      font-size: 0.6em !important;
    }
  `;

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="zenith-loading" style={{ margin: 'auto' }}>
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="20" fill="none" strokeWidth="4" stroke="#2196F3" />
            </svg>
          </div>
          <p>Loading driver data...</p>
        </div>
      </div>
    );
  }

  // Show error message if there was an error fetching data
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
        <h3>Error</h3>
        <p>{error}</p>
        <Button type="primary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      {/* Add custom styles */}
      <style>{titleStyles}</style>
      
      {/* Dashboard Header */}
      <h3 className="heading-02-mobile-drive" style={{ marginBottom: "0.5rem" }}>
        Driver Dashboard
      </h3>
      <p style={{ marginBottom: "2rem" }}>
        Instantly recognize top performance and encourage safe behavior. Need more detail? 
        Check the Supervisor Leaderboard or adjust Rules.
      </p>

      {/* Summary Tiles - Using styling to make these significantly larger (50%+) */}
      <div style={{ transform: 'scale(1.5)', transformOrigin: 'top left', marginBottom: '4rem', width: '66%' }}>
        <SummaryTileBar className="summary-tiles-custom">
          <SummaryTile
            title="Carrots Awarded This Week"
            tooltipText="Total carrots awarded to drivers for good performance"
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.4rem" }}>
              <div className="icon-star" style={{ marginRight: "0.25rem", color: "#FFB300", fontSize: "11px" }}></div>
              <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>14</span>
              <div style={{ marginLeft: "0.35rem", display: "flex", alignItems: "center", color: "#4CAF50", fontSize: "0.7rem" }}>
                <span>▲</span>
                <span>3</span>
              </div>
            </div>
          </SummaryTile>

          <SummaryTile
            title="Scratchies Left This Month"
            tooltipText="Remaining scratchies in your monthly allocation"
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.4rem" }}>
              <div className="icon-ticket" style={{ marginRight: "0.25rem", color: "#2196F3", fontSize: "11px" }}></div>
              <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>8</span>
              <div style={{ marginLeft: "0.35rem", display: "flex", alignItems: "center", color: "#F44336", fontSize: "0.7rem" }}>
                <span>▼</span>
                <span>2</span>
              </div>
            </div>
          </SummaryTile>

          <SummaryTile
            title="Award Pool"
            tooltipText="Remaining funds in the reward budget"
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.4rem" }}>
              <div className="icon-money" style={{ marginRight: "0.25rem", color: "#4CAF50", fontSize: "11px" }}></div>
              <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>$1,250</span>
              <div style={{ marginLeft: "0.25rem" }}>
                <div style={{ display: "inline-block", transform: "scale(0.7)", transformOrigin: "left center" }}>
                  <Button type="tertiary">
                    Add Funds
                  </Button>
                </div>
              </div>
            </div>
          </SummaryTile>

          <SummaryTile
            title="Average Driver Score"
            tooltipText="Average safety score across all active drivers"
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.4rem" }}>
              <div className="icon-people" style={{ marginRight: "0.25rem", color: "#673AB7", fontSize: "11px" }}></div>
              <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>87</span>
              <div style={{ marginLeft: "0.35rem", display: "flex", alignItems: "center", color: "#4CAF50", fontSize: "0.7rem" }}>
                <span>▲</span>
                <span>5</span>
              </div>
            </div>
          </SummaryTile>
        </SummaryTileBar>
      </div>

      {/* Performance Chart section */}
      <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
        <Card title="Driver Performance Trends" size="L">
          <Card.Content>
            <div style={{ height: "350px" }}>
              <DriverPerformanceChart drivers={topDriversForChart} />
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Top Performers Section */}
      <h4 className="heading-03-mobile-drive" style={{ margin: "2rem 0 1rem" }}>
        Top Three Performers This Week
      </h4>
      
      {/* Cards in proper Zenith layout - using size="S" to make all 3 fit in a row */}
      <Cards>
        {top3.map(driver => (
          <Card 
            key={driver.id} 
            title={driver.name}
            size="S"
          >
            <Card.Content>
              <div style={{ 
                display: "flex", 
                flexDirection: "column",
                alignItems: "center", 
                justifyContent: "center", 
                padding: "1rem"
              }}>
                <div style={{ 
                  width: "100px", 
                  height: "100px", 
                  borderRadius: "50%", 
                  backgroundColor: "#E0E0E0", 
                  margin: "0 auto 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                  overflow: "hidden"
                }}>
                  {/* If we have a photo, show it; otherwise, show the first letter of the name */}
                  {driver.photo ? (
                    <img 
                      src={driver.photo} 
                      alt={driver.name} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    driver.name.charAt(0)
                  )}
                </div>
                
                <div style={{ 
                  fontWeight: "bold", 
                  fontSize: "1.2rem", 
                  margin: "0.5rem 0 1rem",
                  width: "100%",
                  textAlign: "center"
                }}>
                  Score: {driver.score}
                  {" "}
                  <span style={{
                    color: driver.trend >= 0 ? "#4CAF50" : "#F44336",
                    fontSize: "1rem",
                    marginLeft: "0.5rem"
                  }}>
                    {driver.trend >= 0 ? `▲ ${driver.trend}` : `▼ ${Math.abs(driver.trend)}`}
                  </span>
                </div>
                
                <div style={{ 
                  color: "#FFF", 
                  backgroundColor: "#FFB300", 
                  borderRadius: "12px", 
                  padding: "0.5rem 1rem",
                  display: "inline-block",
                  margin: "0.5rem 0 1.5rem",
                  fontSize: "1rem",
                  fontWeight: "500"
                }}>
                  Rank #{driver.rank}
                </div>
                
                <Button 
                  type="primary" 
                  onClick={() => handleAwardScratchie(driver.id)}
                >
                  Issue Scratchie
                </Button>
              </div>
            </Card.Content>
          </Card>
        ))}
      </Cards>

      {/* Most Improved Section */}
      <h4 className="heading-03-mobile-drive" style={{ margin: "2rem 0 1rem" }}>
        Most Improved This Week
      </h4>
      
      <Cards>
        {improved.map(driver => (
          <Card 
            key={driver.id} 
            title={driver.name}
            size="S"
          >
            <Card.Content>
              <div style={{ 
                display: "flex", 
                flexDirection: "column",
                alignItems: "center", 
                justifyContent: "center", 
                padding: "1rem"
              }}>
                <div style={{ 
                  width: "100px", 
                  height: "100px", 
                  borderRadius: "50%", 
                  backgroundColor: "#E0E0E0", 
                  margin: "0 auto 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                  overflow: "hidden"
                }}>
                  {/* If we have a photo, show it; otherwise, show the first letter of the name */}
                  {driver.photo ? (
                    <img 
                      src={driver.photo} 
                      alt={driver.name} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    driver.name.charAt(0)
                  )}
                </div>
                
                <div style={{ 
                  fontWeight: "bold", 
                  fontSize: "1.2rem", 
                  margin: "0.5rem 0 1rem",
                  width: "100%",
                  textAlign: "center"
                }}>
                  Score: {driver.score}
                </div>
                
                <div style={{ 
                  color: "#FFF", 
                  backgroundColor: "#4CAF50", 
                  borderRadius: "12px", 
                  padding: "0.5rem 1rem",
                  display: "inline-block",
                  margin: "0.5rem 0 1.5rem",
                  fontSize: "1rem",
                  fontWeight: "500"
                }}>
                  +{driver.improvement}% Improvement
                </div>
                
                <Button 
                  type="primary" 
                  onClick={() => handleAwardScratchie(driver.id)}
                >
                  Issue Scratchie
                </Button>
              </div>
            </Card.Content>
          </Card>
        ))}
      </Cards>

      {/* Driver Table (showing all drivers) */}
      <h4 className="heading-03-mobile-drive" style={{ margin: "2rem 0 1rem" }}>
        All Drivers
      </h4>
      <DriverTable drivers={drivers} />
    </div>
  );
};

export default DriverDashboard;