// lib/geotab.js
const fetch = require('node-fetch');  // (if using Node fetch; in Next API routes, the global fetch is available)

const GEOTAB_API_BASE = process.env.GEOTAB_SERVER || "my.geotab.com";
/** 
 * Cache for driver data to minimize API calls.
 * cachedDrivers.data will store the latest driver list with risk metrics,
 * cachedDrivers.timestamp tracks the last refresh time.
 */
let cachedDrivers = {
  data: null,
  timestamp: 0
};
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;  // refresh every 12 hours (43200000 ms)

/**
 * Make a JSON-RPC call to the Geotab API.
 * @param {string} server - The Geotab server domain (e.g. "my.geotab.com" or "my3.geotab.com").
 * @param {string} method - API method name (e.g. "Authenticate", "Get").
 * @param {Object} params - Parameters for the API call (will include credentials as needed).
 * @returns {Promise<any>} - Resolves with the result of the API call.
 */
async function geotabApiCall(server, method, params) {
  const url = `https://${server}/apiv1`;  // Geotab JSON-RPC endpoint
  
  // Remove credentials from logging to avoid exposing sensitive data
  const logParams = { ...params };
  if (logParams.credentials) {
    logParams.credentials = { sessionId: "***", userName: logParams.credentials.userName };
  }
  if (logParams.password) {
    logParams.password = "***";
  }
  
  console.log(`Calling Geotab API: ${method} on ${url}`, JSON.stringify(logParams));
  
  const body = {
    method,
    params,
    id: 1,
    jsonrpc: "2.0"
  };
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} - ${res.statusText}`);
    }
    
    const json = await res.json();
    if (json.error) {
      // Throw an error with message if API returned an error
      const msg = json.error.message || "Geotab API error";
      const code = json.error.code || 0;
      console.error(`Geotab API error (code ${code}): ${msg}`);
      throw new Error(msg);
    }
    
    return json.result;
  } catch (error) {
    console.error(`Error calling Geotab API (${method}):`, error.message);
    throw error;
  }
}

/**
 * Authenticate with Geotab to obtain a session credential.
 * @param {string} username - Geotab username (email).
 * @param {string} password - Geotab password.
 * @param {string} database - Geotab database name.
 * @returns {Promise<{ server: string, credentials: object }>}
 *    server: the server domain to use for subsequent calls,
 *    credentials: object containing at least { userName, sessionId, database }.
 */
async function authenticateGeotab(username, password, database) {
  console.log(`Authenticating with Geotab using database: ${database}, user: ${username}`);
  
  // Initial authentication call to the base server (e.g., my.geotab.com).
  const loginParams = { userName: username, password: password, database: database };
  
  try {
    const loginResult = await geotabApiCall(GEOTAB_API_BASE, "Authenticate", loginParams);
    console.log("Authentication successful");
    
    // Determine the server to use: if loginResult.path is "ThisServer", remain on GEOTAB_API_BASE, otherwise use the provided path.
    let server = GEOTAB_API_BASE;
    if (loginResult.path && loginResult.path !== "ThisServer") {
      server = loginResult.path;
      console.log(`Redirected to server: ${server}`);
    }
    
    const credentials = loginResult.credentials;  // { userName, sessionId, database }
    if (!credentials || !credentials.sessionId) {
      throw new Error("Authentication response did not include valid credentials");
    }
    
    return { server, credentials };
  } catch (error) {
    console.error("Authentication failed:", error.message);
    throw error;
  }
}

/**
 * Fetch the list of drivers (users with isDriver=true) and their risk metrics.
 * Uses caching to avoid frequent calls – updates once or twice daily.
 * @param {object} credentials - Geotab credentials object with sessionId, userName, database.
 * @param {string} server - Geotab server domain to call (from authentication).
 */
async function getDriverData(credentials, server) {
  const now = Date.now();
  // Return cached data if it exists and is still fresh
  if (cachedDrivers.data && (now - cachedDrivers.timestamp) < CACHE_TTL_MS) {
    console.log("Returning cached driver data");
    return cachedDrivers.data;
  }
  
  console.log("Fetching driver data from Geotab API");
  
  // Verify we have valid credentials
  if (!credentials || !credentials.sessionId || !credentials.userName || !credentials.database) {
    throw new Error("Invalid credentials for Geotab API call");
  }
  
  try {
    // Otherwise, fetch from Geotab API
    const params = {
      typeName: "User",
      search: { isDriver: true, activeFrom: { "--gt": 0 } },  // isDriver = true (and activeFrom > 0 filters active users)
      credentials
    };
    
    const drivers = await geotabApiCall(server, "Get", params);
    console.log(`Retrieved ${drivers.length} drivers from Geotab API`);
    
    // Attach risk rating data if available (here we assume no direct fields, so this could be extended if an API existed for risk metrics)
    // For now, just include placeholder or default values for risk categories if none present:
    const driversWithRisk = drivers.map(d => {
      return {
        id: d.id,
        name: d.name || ((d.firstName || '') + " " + (d.lastName || '')).trim() || d.userName,
        companyGroups: d.companyGroups,  // group membership if needed
        isActive: !!d.activeFrom,
        // Risk ratings if provided by some data source, else null (we'll handle display of "N/A" on frontend if null)
        risk: {
          speeding: d.speedingRisk ?? null,
          acceleration: d.accelerationRisk ?? null,
          braking: d.brakingRisk ?? null,
          cornering: d.corneringRisk ?? null
        }
      };
    });
    
    // Update cache
    cachedDrivers.data = driversWithRisk;
    cachedDrivers.timestamp = now;
    
    return driversWithRisk;
  } catch (error) {
    console.error("Error fetching driver data:", error);
    // Clear cache on error to force fresh attempt next time
    cachedDrivers.data = null;
    throw error;
  }
}

module.exports = { authenticateGeotab, getDriverData };