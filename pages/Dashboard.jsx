// pages/dashboard.js
import React from "react";
import dynamic from 'next/dynamic';

// Import everything else inside the DynamicDashboard component to avoid SSR issues
const DynamicDashboard = dynamic(() => import('../components/DashboardContent'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f5f5f5'
    }}>
      <div style={{ 
        textAlign: 'center',
        padding: '2rem',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p style={{ color: '#666', margin: 0 }}>Loading dashboard...</p>
      </div>
    </div>
  )
});

export default function Dashboard() {
  return <DynamicDashboard />;
}