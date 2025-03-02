import { authenticateGeotab, getDriverData } from "../../lib/geotab";

export default async function handler(req, res) {
  // Only accept GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get credentials from environment variables or query parameters
  const username = process.env.GEOTAB_USERNAME || req.query.username;
  const password = process.env.GEOTAB_PASSWORD || req.query.password;
  const database = process.env.GEOTAB_DATABASE || req.query.database;

  if (!username || !password || !database) {
    return res.status(400).json({ 
      error: "Missing credentials. Please provide username, password, and database parameters or set environment variables.",
      message: "You can use query parameters: ?username=x&password=y&database=z"
    });
  }

  try {
    // Step 1: Authenticate with Geotab
    console.log(`Attempting to authenticate with Geotab for database: ${database}`);
    const { server, credentials } = await authenticateGeotab(username, password, database);
    
    // Step 2: If authenticated, fetch driver data
    console.log(`Successfully authenticated. Fetching driver data from server: ${server}`);
    const drivers = await getDriverData(credentials, server);
    
    // Return success response with authentication info and drivers count
    return res.status(200).json({
      success: true,
      server,
      authenticationSuccessful: true,
      driversCount: drivers.length,
      // Include the first few drivers as a sample
      sampleDrivers: drivers.slice(0, 5).map(driver => ({
        id: driver.id,
        name: driver.name,
        isActive: driver.isActive || true
      }))
    });
  } catch (error) {
    console.error("Error connecting to Geotab:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to connect to Geotab API",
      details: error.toString()
    });
  }
} 