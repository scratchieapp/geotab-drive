// components/DriverTable.js
import React, { useState, useMemo, useCallback, Fragment } from "react";
import RiskChart from "./RiskChart";
import { 
  Button, 
  Table, 
  Pill, 
  MainColumn,
  useMobile,
  IconActivity,
  IconCheck,
  IconClose,
  ColumnSortDirection 
} from "@geotab/zenith";

export default function DriverTable({ drivers }) {
  const [expandedDriverId, setExpandedDriverId] = useState(null);
  const [awardingId, setAwardingId] = useState(null);
  const isMobile = useMobile();

  // Add sort state to control default sorting
  const [sortValue, setSortValue] = useState({
    sortColumn: "collisionRisk",
    sortDirection: ColumnSortDirection.Ascending // Changed to Ascending so lowest risk is at the top
  });

  const handleAward = async (driverId) => {
    setAwardingId(driverId);
    try {
      // In a real app, this would call an API
      alert(`🎉 Scratchie awarded to driver ${driverId}!`);
    } catch (err) {
      console.error("Scratchie award error:", err);
      alert("Error awarding Scratchie.");
    } finally {
      setAwardingId(null);
    }
  };

  const toggleExpand = (driverId) => {
    setExpandedDriverId(prev => (prev === driverId ? null : driverId));
  };

  // Render functions for different columns
  const renderSpeeding = useCallback((entity) => {
    const isGood = entity.speeding === "Best" || entity.speeding === "Good";
    return (
      <Pill 
        className="zen-caption" 
        type={isGood ? "success" : entity.speeding === "At risk" ? "error" : "warning"}
        icon={isGood ? IconCheck : entity.speeding === "At risk" ? IconClose : null}
      >
        <span className="zen-caption__content">{entity.speeding}</span>
      </Pill>
    );
  }, []);

  const renderAcceleration = useCallback((entity) => {
    const isGood = entity.acceleration === "Best" || entity.acceleration === "Good";
    return (
      <Pill 
        className="zen-caption" 
        type={isGood ? "success" : entity.acceleration === "At risk" ? "error" : "warning"}
        icon={isGood ? IconCheck : entity.acceleration === "At risk" ? IconClose : null}
      >
        <span className="zen-caption__content">{entity.acceleration}</span>
      </Pill>
    );
  }, []);

  const renderBraking = useCallback((entity) => {
    const isGood = entity.braking === "Best" || entity.braking === "Good";
    return (
      <Pill 
        className="zen-caption" 
        type={isGood ? "success" : entity.braking === "At risk" ? "error" : "warning"}
        icon={isGood ? IconCheck : entity.braking === "At risk" ? IconClose : null}
      >
        <span className="zen-caption__content">{entity.braking}</span>
      </Pill>
    );
  }, []);

  const renderCornering = useCallback((entity) => {
    const isGood = entity.cornering === "Best" || entity.cornering === "Good";
    return (
      <Pill 
        className="zen-caption" 
        type={isGood ? "success" : entity.cornering === "At risk" ? "error" : "warning"}
        icon={isGood ? IconCheck : entity.cornering === "At risk" ? IconClose : null}
      >
        <span className="zen-caption__content">{entity.cornering}</span>
      </Pill>
    );
  }, []);

  const renderActions = useCallback((entity) => {
    return (
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button 
          type="secondary" 
          onClick={() => toggleExpand(entity.id)}
        >
          {expandedDriverId === entity.id ? "Hide Trend" : "View Trend"}
        </Button>
        <Button 
          type="primary" 
          onClick={() => handleAward(entity.id)} 
          disabled={awardingId === entity.id}
        >
          {awardingId === entity.id ? "Awarding..." : "Award Scratchie"}
        </Button>
      </div>
    );
  }, [expandedDriverId, awardingId]);

  // Define table columns
  const columns = useMemo(() => [
    {
      id: "name",
      title: "Driver",
      meta: {
        defaultWidth: 250
      },
      columnComponent: new MainColumn("name", isMobile, {
        icon: {
          createIcon: () => IconActivity,
          createLink: (e) => `#driver/${e.id}`,
          createTitle: () => "Driver Profile"
        },
        mainText: {
          createLink: e => `#driver/${e.id}`
        },
        descriptionText: {
          createDescription: e => `Score: ${e.score} ${e.trend >= 0 ? `▲ ${e.trend}` : `▼ ${Math.abs(e.trend)}`}`
        }
      })
    },
    {
      id: "collisionRisk",
      title: "Collision Risk",
      meta: {
        defaultWidth: 120
      },
      columnComponent: {
        render: (entity) => (
          <Pill 
            className="zen-caption" 
            type={entity.collisionRisk > 7 ? "error" : entity.collisionRisk > 4 ? "warning" : "success"}
            icon={entity.collisionRisk > 7 ? IconClose : entity.collisionRisk <= 4 ? IconCheck : null}
          >
            <span className="zen-caption__content">{entity.collisionRisk.toFixed(1)}%</span>
          </Pill>
        ),
        renderHeader: (title) => title
      }
    },
    {
      id: "speeding",
      title: "Speeding",
      meta: {
        defaultWidth: 120
      },
      columnComponent: {
        render: renderSpeeding,
        renderHeader: (title) => title
      }
    },
    {
      id: "acceleration",
      title: "Acceleration",
      meta: {
        defaultWidth: 120
      },
      columnComponent: {
        render: renderAcceleration,
        renderHeader: (title) => title
      }
    },
    {
      id: "braking",
      title: "Braking",
      meta: {
        defaultWidth: 120
      },
      columnComponent: {
        render: renderBraking,
        renderHeader: (title) => title
      }
    },
    {
      id: "cornering",
      title: "Cornering",
      meta: {
        defaultWidth: 120
      },
      columnComponent: {
        render: renderCornering,
        renderHeader: (title) => title
      }
    },
    {
      id: "actions",
      title: "Actions",
      meta: {
        defaultWidth: 250
      },
      columnComponent: {
        render: renderActions,
        renderHeader: (title) => title
      }
    }
  ], [isMobile, renderSpeeding, renderAcceleration, renderBraking, renderCornering, renderActions]);

  // Sort data based on current sort settings
  const sortedData = useMemo(() => {
    if (!sortValue) {
      return drivers;
    }
    
    const sortColumn = sortValue.sortColumn;
    return [...drivers].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (typeof aVal === "number" && typeof bVal === "number") {
        const direction = sortValue.sortDirection === ColumnSortDirection.Ascending ? 1 : -1;
        return (aVal - bVal) * direction;
      }
      
      // Default to string comparison for non-numeric values
      const direction = sortValue.sortDirection === ColumnSortDirection.Ascending ? 1 : -1;
      return String(aVal).localeCompare(String(bVal)) * direction;
    });
  }, [drivers, sortValue]);

  // Need to wrap the table to handle the expandable rows
  return (
    <div className="driver-table-container" style={{ minHeight: "calc(100vh - 350px)" }}>
      <Table 
        columns={columns} 
        entities={sortedData}
        sortable={{
          pageName: "driverTable",
          value: sortValue,
          onChange: setSortValue
        }}
      />
      
      {/* Additional expandable content for the risk chart */}
      {expandedDriverId && (
        <div style={{ 
          padding: "1rem", 
          margin: "0.5rem 0 1.5rem", 
          backgroundColor: "#f9f9f9", 
          borderRadius: "4px" 
        }}>
          <h4>Performance Trend for {drivers.find(d => d.id === expandedDriverId)?.name}</h4>
          <RiskChart 
            driverName={drivers.find(d => d.id === expandedDriverId)?.name} 
            riskData={{
              speeding: drivers.find(d => d.id === expandedDriverId)?.scoreOverTime[drivers.find(d => d.id === expandedDriverId)?.scoreOverTime.length - 1],
              acceleration: drivers.find(d => d.id === expandedDriverId)?.scoreOverTime[drivers.find(d => d.id === expandedDriverId)?.scoreOverTime.length - 1] * 0.9,
              braking: drivers.find(d => d.id === expandedDriverId)?.scoreOverTime[drivers.find(d => d.id === expandedDriverId)?.scoreOverTime.length - 1] * 0.8,
              cornering: drivers.find(d => d.id === expandedDriverId)?.scoreOverTime[drivers.find(d => d.id === expandedDriverId)?.scoreOverTime.length - 1] * 0.7
            }} 
          />
        </div>
      )}
    </div>
  );
}