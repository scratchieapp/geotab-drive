// src/app/scripts/components/DriverDashboard.tsx
import React from "react";
import { 
  Card, 
  Cards,
  SummaryTile, 
  SummaryTileBar,
  Button
} from "@geotab/zenith";
import { allDrivers, getTopPerformers, getMostImproved, getTopDriversForChart } from "../../../data/fakeData";
import DriverPerformanceChart from "./DriverPerformanceChart";
import DriverTable from "../../../../components/DriverTable"; // adjust path if needed

// Get data from our centralized data source
const top3 = getTopPerformers(3);         // top 3 by score
const improved = getMostImproved(2);      // top 2 by improvement
const topDriversForChart = getTopDriversForChart(5); // top 5 for the chart

const DriverDashboard: React.FC = () => {
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
      <DriverTable drivers={allDrivers} />
    </div>
  );
};

export default DriverDashboard;