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
  const body = {
    method,
    params,
    id: 1,
    jsonrpc: "2.0"
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (json.error) {
    // Throw an error with message if API returned an error
    const msg = json.error.message || "Geotab API error";
    throw new Error(msg);
  }
  return json.result;
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
  // Initial authentication call to the base server (e.g., my.geotab.com).
  const loginParams = { userName: username, password: password, database: database };
  const loginResult = await geotabApiCall(GEOTAB_API_BASE, "Authenticate", loginParams);
  // Determine the server to use: if loginResult.path is "ThisServer", remain on GEOTAB_API_BASE, otherwise use the provided path.
  let server = GEOTAB_API_BASE;
  if (loginResult.path && loginResult.path !== "ThisServer") {
    server = loginResult.path;
  }
  const credentials = loginResult.credentials;  // { userName, sessionId, database }
  return { server, credentials };
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
    return cachedDrivers.data;
  }
  // Otherwise, fetch from Geotab API
  const params = {
    typeName: "User",
    search: { isDriver: true, activeFrom: { "--gt": 0 } },  // isDriver = true (and activeFrom > 0 filters active users)
    credentials
  };
  const drivers = await geotabApiCall(server, "Get", params);
  // Attach risk rating data if available (here we assume no direct fields, so this could be extended if an API existed for risk metrics)
  // For now, just include placeholder or default values for risk categories if none present:
  const driversWithRisk = drivers.map(d => {
    return {
      id: d.id,
      name: d.name || d.firstName + " " + d.lastName || d.userName,
      companyGroups: d.companyGroups,  // group membership if needed
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
}

module.exports = { authenticateGeotab, getDriverData };