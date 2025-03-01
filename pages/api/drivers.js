// pages/api/drivers.js
import { getDriverData } from "../../lib/geotab";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }
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
  const { sessionId, userName, database, server } = session;
  if (!sessionId || !userName || !database || !server) {
    return res.status(401).json({ error: "Invalid session credentials" });
  }

  try {
    // Prepare credentials object for Geotab API call
    const credentials = { sessionId, userName, database };
    // Fetch driver data (using caching to reduce API calls)
    const drivers = await getDriverData(credentials, server);
    res.status(200).json(drivers);
  } catch (err) {
    console.error("Error fetching drivers:", err);
    // If session is expired or invalid, return 401 to force re-login
    return res.status(401).json({ error: "Failed to retrieve driver data" });
  }
}