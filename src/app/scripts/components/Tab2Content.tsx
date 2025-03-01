import React, { useState, useMemo, useCallback } from "react";
import { 
  Button, 
  Table, 
  Pill, 
  ColumnSortDirection,
  useMobile,
  MainColumn,
  IconActivity,
  IconCheck,
  IconClose,
  IconChevronTop,
  IconChevronDownSmall
} from "@geotab/zenith";
import { allDrivers, Driver } from "../../../data/fakeData";

// Define the interface for table entities
interface DriverEntity extends Driver {
  id: string;
}

export const Tab2Content = () => {
  const [drivers, setDrivers] = useState<Driver[]>(allDrivers);
  const [showInactive, setShowInactive] = useState(true);
  const isMobile = useMobile();

  // For sorting - changed default to use ascending for collision risk
  const [sortValue, setSortValue] = useState({
    sortColumn: "collisionRisk",
    sortDirection: ColumnSortDirection.Ascending
  });

  const handleToggleActive = (id: string) => {
    setDrivers(prev =>
      prev.map(d => (d.id === id ? { ...d, isActive: !d.isActive } : d))
    );
  };

  const handleIssueScratchie = (driverId: string) => {
    // In a real application, this would call an API endpoint
    alert(`Issuing Scratchie to driver ${driverId}`);
  };

  // Filter drivers based on active status if needed
  const displayedDrivers = showInactive 
    ? drivers 
    : drivers.filter(d => d.isActive);

  // Custom render function for risk pill
  const renderRiskPill = useCallback((entity: DriverEntity) => {
    const isHighRisk = entity.collisionRisk > 7;
    const isMediumRisk = entity.collisionRisk > 4 && entity.collisionRisk <= 7;
    
    let pillType: "success" | "error" | "warning" = "success";
    if (isHighRisk) pillType = "error";
    else if (isMediumRisk) pillType = "warning";
    
    return (
      <Pill 
        className="zen-caption" 
        type={pillType}
        icon={isHighRisk ? IconClose : !isMediumRisk ? IconCheck : undefined}
      >
        <span className="zen-caption__content">{entity.collisionRisk.toFixed(1)}%</span>
      </Pill>
    );
  }, []);

  // Custom render functions for metric pills
  const renderMetricPill = useCallback((value: string) => {
    const isGood = value === "Best" || value === "Good" || value === "Great";
    const isAtRisk = value === "At risk";
    
    return (
      <Pill 
        className="zen-caption" 
        type={isGood ? "success" : isAtRisk ? "error" : "warning"}
        icon={isGood ? IconCheck : isAtRisk ? IconClose : undefined}
      >
        <span className="zen-caption__content">{value}</span>
      </Pill>
    );
  }, []);

  // Custom render function for status toggle
  const renderStatusToggle = useCallback((entity: DriverEntity) => {
    return (
      <Button
        type={entity.isActive ? "primary" : "secondary"}
        onClick={() => handleToggleActive(entity.id)}
      >
        {entity.isActive ? "Active" : "Inactive"}
      </Button>
    );
  }, []);

  // Custom render function for action button
  const renderActionButton = useCallback((entity: DriverEntity) => {
    return (
      <Button
        type="primary"
        onClick={() => handleIssueScratchie(entity.id)}
      >
        Issue Scratchie
      </Button>
    );
  }, []);

  // Table columns definition
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
          createLink: (e: DriverEntity) => `#driver/${e.id}`,
          createTitle: () => "Driver Profile"
        },
        mainText: {
          createLink: (e: DriverEntity) => `#driver/${e.id}`
        },
        descriptionText: {
          createDescription: (e: DriverEntity) => `Score: ${e.score} ${e.trend >= 0 ? 
            `${String.fromCharCode(9650)} ${e.trend}` : 
            `${String.fromCharCode(9660)} ${Math.abs(e.trend)}`}`
        }
      })
    },
    {
      id: "collisionRisk",
      title: "Collision Risk",
      meta: {
        defaultWidth: 150
      },
      columnComponent: {
        render: renderRiskPill,
        renderHeader: (title: React.ReactNode) => title
      }
    },
    {
      id: "speeding",
      title: "Speeding",
      meta: {
        defaultWidth: 120
      },
      columnComponent: {
        render: (entity: DriverEntity) => renderMetricPill(entity.speeding),
        renderHeader: (title: React.ReactNode) => title
      }
    },
    {
      id: "acceleration",
      title: "Acceleration",
      meta: {
        defaultWidth: 120
      },
      columnComponent: {
        render: (entity: DriverEntity) => renderMetricPill(entity.acceleration),
        renderHeader: (title: React.ReactNode) => title
      }
    },
    {
      id: "braking",
      title: "Braking",
      meta: {
        defaultWidth: 120
      },
      columnComponent: {
        render: (entity: DriverEntity) => renderMetricPill(entity.braking),
        renderHeader: (title: React.ReactNode) => title
      }
    },
    {
      id: "cornering",
      title: "Cornering",
      meta: {
        defaultWidth: 120
      },
      columnComponent: {
        render: (entity: DriverEntity) => renderMetricPill(entity.cornering),
        renderHeader: (title: React.ReactNode) => title
      }
    },
    {
      id: "status",
      title: "Status",
      meta: {
        defaultWidth: 120
      },
      columnComponent: {
        render: renderStatusToggle,
        renderHeader: (title: React.ReactNode) => title
      }
    },
    {
      id: "action",
      title: "Action",
      meta: {
        defaultWidth: 150
      },
      columnComponent: {
        render: renderActionButton,
        renderHeader: (title: React.ReactNode) => title
      }
    }
  ], [isMobile, renderRiskPill, renderMetricPill, renderStatusToggle, renderActionButton]);

  // Sort data based on current sort settings
  const sortedData = useMemo(() => {
    if (!sortValue) {
      return displayedDrivers;
    }
    
    const sortColumn = sortValue.sortColumn;
    return [...displayedDrivers].sort((a, b) => {
      // Use type assertion to tell TypeScript that we can access properties dynamically
      const aVal = a[sortColumn as keyof Driver];
      const bVal = b[sortColumn as keyof Driver];
      
      if (typeof aVal === "number" && typeof bVal === "number") {
        const direction = sortValue.sortDirection === ColumnSortDirection.Ascending ? 1 : -1;
        return (aVal - bVal) * direction;
      }
      
      // Default to string comparison for non-numeric values
      const direction = sortValue.sortDirection === ColumnSortDirection.Ascending ? 1 : -1;
      return String(aVal).localeCompare(String(bVal)) * direction;
    });
  }, [displayedDrivers, sortValue]);

  return (
    <div style={{ padding: "1rem", height: "100%" }}>
      <h3 className="heading-02-mobile-drive" style={{ marginBottom: "0.5rem" }}>
        Driver Leaderboard
      </h3>
      <p style={{ marginBottom: "1rem" }}>
        View all drivers, their collision risk, and key stats. Toggle drivers as active/inactive,
        or award a Scratchie on the fly.
      </p>
      
      {/* Filter control */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={showInactive}
            onChange={() => setShowInactive(!showInactive)}
            style={{ marginRight: "0.5rem" }}
          />
          Show inactive drivers
        </label>
      </div>
      
      {/* Zenith Table Component - added minHeight to make it take full available space */}
      <div style={{ minHeight: "calc(100vh - 250px)" }}>
        <Table 
          columns={columns} 
          entities={sortedData} 
          sortable={{
            pageName: "driverLeaderboard",
            value: sortValue,
            onChange: setSortValue
          }}
        />
      </div>
    </div>
  );
};

export default Tab2Content;