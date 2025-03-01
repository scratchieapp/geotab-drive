// pages/index.js
import { useState } from "react";
import { useRouter } from "next/router";
// Import Zenith UI components
import { Button, TextField, Card, CardContent } from "@geotab/zenith";

export default function LoginPage({}) {
  const router = useRouter();
  const [database, setDatabase] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ database, username, password })
      });
      setLoading(false);
      if (res.ok) {
        // Logged in successfully – redirect to dashboard
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false);
      setError("Network error, please try again");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center" }}>
      <Card>
        <CardContent>
          <h3 className="heading-02-mobile-drive">Geotab Driver Dashboard Login</h3>
          <form onSubmit={handleSubmit}>
            <TextField 
              label="Database" 
              placeholder="Database name" 
              value={database} 
              onChange={e => setDatabase(e.target.value)} 
              required 
              style={{ marginBottom: "1rem" }}
            />
            <TextField 
              label="Username" 
              placeholder="Email or username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              style={{ marginBottom: "1rem" }}
            />
            <TextField 
              type="password" 
              label="Password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ marginBottom: "1rem" }}
            />
            {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
            <Button type="submit" appearance="primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Note: We could add getServerSideProps here to redirect if already logged in (session cookie present).