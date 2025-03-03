// pages/index.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import { 
  Card, 
  Button, 
  TextField, 
  CardContent 
} from '../components/ZenithComponents';

// Dynamically import Zenith components with SSR disabled
const ZenithComponents = dynamic(
  () => import('../components/ZenithComponents'),
  { ssr: false }
);

// Create a placeholder component for server-side rendering
const LoadingPlaceholder = () => (
  <div style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center", padding: "20px" }}>
    <div style={{ padding: "20px", border: "1px solid #eee", borderRadius: "8px" }}>
      <h3>Loading...</h3>
    </div>
  </div>
);

export default function LoginPage({}) {
  const router = useRouter();
  const [database, setDatabase] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

  // Render client-side form with Zenith components
  if (isClient) {
    return (
      <ZenithComponents 
        database={database}
        username={username}
        password={password}
        loading={loading}
        error={error}
        setDatabase={setDatabase}
        setUsername={setUsername}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
    );
  }

  // Render placeholder for server-side
  return <LoadingPlaceholder />;
}

// Note: We could add getServerSideProps here to redirect if already logged in (session cookie present).