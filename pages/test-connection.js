import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

// Dynamically import Zenith components with SSR disabled
const ZenithComponents = dynamic(
  () => import('../components/ZenithComponents'),
  { ssr: false }
);

// Create a placeholder component for server-side rendering
const LoadingPlaceholder = () => (
  <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
    <h1 style={{ marginBottom: "20px" }}>Geotab API Connection Test</h1>
    <div style={{ padding: "20px", border: "1px solid #eee", borderRadius: "8px" }}>
      <h3>Loading...</h3>
    </div>
  </div>
);

export default function TestConnectionPage() {
  const [database, setDatabase] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Only render client-side components after initial render
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);
    
    try {
      const queryString = new URLSearchParams({
        database,
        username,
        password
      }).toString();
      
      const res = await fetch(`/api/test-geotab-connection?${queryString}`);
      const data = await res.json();
      
      setResult(data);
      if (!data.success) {
        setError(data.error || "Connection failed");
      }
    } catch (err) {
      console.error("Error testing connection:", err);
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  // Render client-side form with Zenith components
  if (isClient) {
    return (
      <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
        <h1 style={{ marginBottom: "20px" }}>Geotab API Connection Test</h1>
        
        <ZenithComponents 
          database={database}
          username={username}
          password={password}
          loading={loading}
          error={error}
          result={result}
          setDatabase={setDatabase}
          setUsername={setUsername}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
        />
      </div>
    );
  }

  // Render placeholder for server-side
  return <LoadingPlaceholder />;
} 