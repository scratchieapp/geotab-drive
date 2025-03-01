// src/app/scripts/components/Tab1Content.tsx
import React from "react";
import DriverDashboard from "./DriverDashboard"; // <=== import dashboard component

export const Tab1Content = () => {
  return (
    <>
      {/* Using the DriverDashboard component which contains all our summary tiles, performance chart, etc. */}
      <DriverDashboard />
    </>
  );
};

export default Tab1Content;