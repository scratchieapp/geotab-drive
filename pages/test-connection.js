import { useState } from "react";
import { 
  Card, 
  Button, 
  TextField, 
  CardContent 
} from "../components/ZenithComponents";

export default function TestConnectionPage() {
  const [database, setDatabase] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

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

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Geotab API Connection Test</h1>
      
      <Card>
        <CardContent>
          <h3>Enter Geotab Credentials</h3>
          <form onSubmit={handleSubmit}>
            <TextField 
              label="Database" 
              placeholder="Your Geotab database" 
              value={database} 
              onChange={e => setDatabase(e.target.value)} 
              required 
              style={{ marginBottom: "1rem" }}
            />
            <TextField 
              label="Username" 
              placeholder="Your Geotab username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              style={{ marginBottom: "1rem" }}
            />
            <TextField 
              type="password" 
              label="Password" 
              placeholder="Your Geotab password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ marginBottom: "1rem" }}
            />
            <Button 
              type="primary" 
              htmlType="submit" 
              disabled={loading}
            >
              {loading ? "Testing Connection..." : "Test Connection"}
            </Button>
          </form>

          {error && (
            <div style={{ 
              marginTop: "20px", 
              padding: "10px", 
              backgroundColor: "#ffebee", 
              border: "1px solid #ffcdd2",
              borderRadius: "4px",
              color: "#b71c1c" 
            }}>
              <h4>Error:</h4>
              <p>{error}</p>
            </div>
          )}

          {result && result.success && (
            <div style={{ 
              marginTop: "20px", 
              padding: "10px", 
              backgroundColor: "#e8f5e9", 
              border: "1px solid #c8e6c9",
              borderRadius: "4px",
              color: "#1b5e20" 
            }}>
              <h4>✅ Connection Successful!</h4>
              <p>Successfully connected to Geotab API server: <strong>{result.server}</strong></p>
              <p>Number of drivers retrieved: <strong>{result.driversCount}</strong></p>
              {result.sampleDrivers && result.sampleDrivers.length > 0 && (
                <>
                  <h5>Sample Drivers:</h5>
                  <ul>
                    {result.sampleDrivers.map(driver => (
                      <li key={driver.id}>
                        {driver.name} (ID: {driver.id.substring(0, 8)}...)
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card style={{ marginTop: "20px" }}>
        <CardContent>
          <h3>Usage Notes</h3>
          <ul>
            <li>This page tests direct connection to the Geotab API</li>
            <li>Successful connection confirms your credentials work</li>
            <li>Retrieving drivers confirms API functionality is working</li>
            <li>No data is stored - credentials are only used for this test</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 