import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import { getDriverPerformance } from '../utils/api';

// Load Chart.js and Zenith components ONLY on client-side
const ClientSideOnly = dynamic(
  () => 
    import('./ClientComponents').then((mod) => mod.default),
  { 
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
          <p style={{ color: '#666', margin: 0 }}>Loading components...</p>
        </div>
      </div>
    )
  }
);

// Sample data for top performers
const topPerformers = [
  { name: 'John Smith', score: 95, improvement: '+15%' },
  { name: 'Sarah Johnson', score: 92, improvement: '+12%' },
  { name: 'Mike Wilson', score: 90, improvement: '+10%' }
];

// Sample data for most improved
const mostImproved = [
  { name: 'David Brown', improvement: '+25%', currentScore: 85 },
  { name: 'Lisa Anderson', improvement: '+20%', currentScore: 88 },
  { name: 'Tom Davis', improvement: '+18%', currentScore: 82 }
];

export default function DashboardContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDriverPerformance();
        setPerformanceData(data);
      } catch (err) {
        console.error("Error fetching performance data:", err);
        setError(err.message || "Failed to load performance data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Pass all the data as props to the client-side component
  return (
    <ClientSideOnly 
      loading={loading}
      error={error}
      performanceData={performanceData}
      topPerformers={topPerformers}
      mostImproved={mostImproved}
    />
  );
} 