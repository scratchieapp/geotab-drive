import React, { useState, useEffect } from 'react';
import NoSSR from './NoSSR';
import DriverTable from './DriverTable';

// Generate line chart data
const generateLineChartData = (data) => {
  // Handle case when data is null or undefined
  if (!data || !Array.isArray(data)) {
    return {
      labels: [],
      datasets: [
        {
          label: 'Performance Score',
          data: [],
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Improvement',
          data: [],
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  }

  const labels = data.map(d => d.date);
  const scores = data.map(d => d.score);
  const improvements = data.map(d => d.improvement);

  return {
    labels,
    datasets: [
      {
        label: 'Performance Score',
        data: scores,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Improvement',
        data: improvements,
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };
};

// Loading component
const LoadingComponent = () => (
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
);

// Error component
const ErrorComponent = ({ error }) => (
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
      <p style={{ color: '#e74c3c', margin: 0 }}>Error: {error}</p>
    </div>
  </div>
);

// This is the inner component that uses Zenith
const DashboardInner = ({ performanceData, topPerformers, mostImproved }) => {
  // We need to dynamically import Zenith components at runtime
  const [components, setComponents] = useState(null);
  const [chartComponent, setChartComponent] = useState(null);

  useEffect(() => {
    // Import Zenith components
    const loadComponents = async () => {
      try {
        // Import Zenith
        const zenith = await import('@geotab/zenith');
        
        // Import Chart.js and react-chartjs-2
        const ChartJS = await import('chart.js');
        const reactChartjs = await import('react-chartjs-2');
        
        // Register Chart.js components
        ChartJS.Chart.register(
          ChartJS.CategoryScale,
          ChartJS.LinearScale,
          ChartJS.PointElement,
          ChartJS.LineElement,
          ChartJS.Title,
          ChartJS.Tooltip,
          ChartJS.Legend
        );
        
        setComponents(zenith);
        setChartComponent(reactChartjs.Line);
      } catch (err) {
        console.error('Failed to load components:', err);
      }
    };
    
    loadComponents();
  }, []);

  // Don't render until components are loaded
  if (!components || !chartComponent) {
    return <LoadingComponent />;
  }
  
  const { Card, SummaryTile, IconTicket } = components;
  const LineChart = chartComponent;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem',
          fontWeight: '600',
          color: '#2c3e50',
          marginBottom: '1rem'
        }}>
          Driver Performance Dashboard
        </h1>
        <p style={{ 
          color: '#7f8c8d',
          marginBottom: '2rem'
        }}>
          Track and analyze driver performance metrics
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <Card>
          <SummaryTile
            title="Average Score"
            value="88%"
            trend="+5%"
            icon={<IconTicket />}
          />
        </Card>
        <Card>
          <SummaryTile
            title="Active Drivers"
            value="24"
            trend="+2"
            icon={<IconTicket />}
          />
        </Card>
        <Card>
          <SummaryTile
            title="Rewards Issued"
            value="156"
            trend="+12"
            icon={<IconTicket />}
          />
        </Card>
      </div>

      <Card style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem',
          fontWeight: '500',
          color: '#2c3e50',
          marginBottom: '1rem'
        }}>
          Performance Trends
        </h2>
        <div style={{ height: '300px' }}>
          <LineChart
            data={generateLineChartData(performanceData)}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }}
          />
        </div>
      </Card>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        <Card>
          <h2 style={{ 
            fontSize: '1.5rem',
            fontWeight: '500',
            color: '#2c3e50',
            marginBottom: '1rem'
          }}>
            Top Performers
          </h2>
          <DriverTable
            data={topPerformers}
            columns={[
              { key: 'name', label: 'Driver' },
              { key: 'score', label: 'Score' },
              { key: 'improvement', label: 'Improvement' }
            ]}
          />
        </Card>

        <Card>
          <h2 style={{ 
            fontSize: '1.5rem',
            fontWeight: '500',
            color: '#2c3e50',
            marginBottom: '1rem'
          }}>
            Most Improved
          </h2>
          <DriverTable
            data={mostImproved}
            columns={[
              { key: 'name', label: 'Driver' },
              { key: 'improvement', label: 'Improvement' },
              { key: 'currentScore', label: 'Current Score' }
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

const ClientComponents = ({ loading, error, performanceData, topPerformers, mostImproved }) => {
  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <NoSSR fallback={<LoadingComponent />}>
      <DashboardInner
        performanceData={performanceData}
        topPerformers={topPerformers}
        mostImproved={mostImproved}
      />
    </NoSSR>
  );
};

export default ClientComponents; 