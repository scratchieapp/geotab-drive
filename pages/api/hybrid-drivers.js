import { getDriverData, authenticateGeotab } from "../../lib/geotab";
import cookie from "cookie";
import { allDrivers } from "../../src/data/fakeData";

// This function remains as a fallback only if firstName/lastName fields aren't available
function formatNameFromEmail(email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return null;
  }

  // Extract the username part before @
  const username = email.split('@')[0];
  
  // Remove any numbers at the beginning or end of the username
  const cleanUsername = username.replace(/^\d+|\d+$/g, '').replace(/[_\-\d]/g, ' ').trim();
  
  if (cleanUsername.length === 0) {
    return null;
  }
  
  // Handle different email formats
  if (cleanUsername.includes('.')) {
    // Format: first.last@domain.com -> First Last
    return cleanUsername.split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  } else if (cleanUsername.includes(' ')) {
    // Already has spaces from removing special chars
    return cleanUsername.split(' ')
      .filter(part => part.length > 0)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  } else {
    // Format: firstlast@domain.com or FirstLast@domain.com
    // Try to detect camel case (e.g., BradleyRoberts -> Bradley Roberts)
    const camelCaseFormatted = cleanUsername.replace(/([A-Z])/g, ' $1').trim();
    
    if (camelCaseFormatted !== cleanUsername && camelCaseFormatted.includes(' ')) {
      // It was camel case, and we've now added spaces
      return camelCaseFormatted
        .split(' ')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    } else {
      // For single names without clear separation, just capitalize first letter
      return cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1).toLowerCase();
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }
  
  // For testing - check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development';
  let credentials;
  let server;
  
  console.log("Hybrid-drivers API called, mode:", isDev ? "development" : "production");
  
  // In production, use cookies for authentication
  if (!isDev) {
    // Parse the geotabSession cookie
    const cookies = cookie.parse(req.headers.cookie || "");
    const sessionCookie = cookies.geotabSession;
    if (!sessionCookie) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    let session;
    try {
      session = JSON.parse(sessionCookie);
    } catch {
      return res.status(400).json({ error: "Invalid session cookie" });
    }
    
    const { sessionId, userName, database, serverUrl } = session;
    if (!sessionId || !userName || !database || !serverUrl) {
      return res.status(401).json({ error: "Invalid session credentials" });
    }
    
    credentials = { sessionId, userName, database };
    server = serverUrl;
  } 
  // In development, use environment variables
  else {
    try {
      console.log("Development mode: Using environment variables for Geotab authentication");
      const username = process.env.GEOTAB_USERNAME;
      const password = process.env.GEOTAB_PASSWORD;
      const database = process.env.GEOTAB_DATABASE;
      
      console.log(`Auth details - Database: ${database}, Username: ${username}, Password: ${password ? '****' : 'MISSING'}`);
      
      if (!username || !password || !database) {
        console.error("Missing Geotab credentials in environment variables");
        // Instead of failing, let's fall back to fake data if no credentials
        console.log("Using fake data as fallback since no Geotab credentials are available");
        return res.status(200).json(allDrivers);
      }
      
      // Authenticate using env variables
      console.log("Attempting to authenticate with Geotab...");
      const authResult = await authenticateGeotab(username, password, database);
      credentials = authResult.credentials;
      server = authResult.server;
      console.log("Successfully authenticated with Geotab in development mode");
      console.log("Credentials:", JSON.stringify({ 
        ...credentials, 
        sessionId: credentials.sessionId ? `${credentials.sessionId.substr(0, 5)}...` : 'MISSING' 
      }));
      console.log("Server:", server);
    } catch (error) {
      console.error("Development auth error:", error);
      console.log("Falling back to fake driver data due to authentication error");
      return res.status(200).json(allDrivers);
    }
  }

  try {
    // Fetch real driver data from Geotab API
    console.log("Fetching real driver data from Geotab...");
    const realDrivers = await getDriverData(credentials, server);
    console.log(`Retrieved ${realDrivers.length} real drivers from Geotab`);
    
    // Log a sample of driver data for debugging
    if (realDrivers.length > 0) {
      console.log("Sample driver data:", JSON.stringify(realDrivers[0]));
      console.log("Database in use:", isDev ? process.env.GEOTAB_DATABASE : credentials.database);
    } else {
      console.log("No drivers returned from Geotab API");
      console.log("Falling back to fake driver data since no real drivers were returned");
      return res.status(200).json(allDrivers);
    }
    
    // Get our fake driver metrics
    const fakeDriversWithMetrics = allDrivers;
    console.log(`Using ${fakeDriversWithMetrics.length} fake drivers for metrics data`);
    
    // Create a hybrid dataset:
    // - Use real driver names and IDs from Geotab
    // - Keep all the fake metrics for visualization
    const hybridDrivers = realDrivers.map((realDriver, index) => {
      // Get a fake driver to use for metrics (cycle through if we have more real drivers)
      const fakeDriver = fakeDriversWithMetrics[index % fakeDriversWithMetrics.length];
      
      // Simpler, streamlined name extraction
      const first = realDriver.firstName || "";
      const last = realDriver.lastName || "";
      const fullName = (first + " " + last).trim() || 
                       realDriver.name || 
                       (realDriver.userName && realDriver.userName.includes('@') ? formatNameFromEmail(realDriver.userName) : realDriver.userName) || 
                       `Driver ${index + 1}`;
      
      console.log(`Driver ${index}: Using name "${fullName}" [firstName: "${first}", lastName: "${last}", email: "${realDriver.userName || 'N/A'}"]`);
      
      return {
        // Use real data for identification
        id: realDriver.id || `driver-${index}`,
        name: fullName,
        isActive: realDriver.isActive !== undefined ? realDriver.isActive : true,
        
        // Use fake data for metrics
        photo: fakeDriver.photo,
        score: fakeDriver.score,
        trend: fakeDriver.trend,
        collisionRisk: fakeDriver.collisionRisk,
        speeding: fakeDriver.speeding,
        acceleration: fakeDriver.acceleration,
        braking: fakeDriver.braking,
        cornering: fakeDriver.cornering,
        scoreOverTime: fakeDriver.scoreOverTime,
        rank: index < 3 ? index + 1 : undefined, // Only assign ranks to top 3
        improvement: index === 3 || index === 4 ? fakeDriver.improvement : undefined // Only assign improvements to index 3-4
      };
    });
    
    console.log(`Created ${hybridDrivers.length} hybrid driver records`);
    console.log("Sample hybrid driver:", hybridDrivers.length > 0 ? JSON.stringify(hybridDrivers[0]) : "No hybrid drivers");
    
    res.status(200).json(hybridDrivers);
  } catch (err) {
    console.error("Error fetching drivers:", err);
    // If error occurs, fall back to fake data instead of returning an error
    console.log("Falling back to fake driver data due to error:", err.message);
    return res.status(200).json(allDrivers);
  }
} 