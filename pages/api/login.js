// pages/api/login.js
import { authenticateGeotab } from "../../lib/geotab";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }
  const { username, password, database } = req.body || {};
  // Allow fallback to environment credentials (for development or service account login)
  const user = username || process.env.GEOTAB_USERNAME;
  const pass = password || process.env.GEOTAB_PASSWORD;
  const db = database || process.env.GEOTAB_DATABASE;
  if (!user || !pass || !db) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  try {
    // Authenticate with Geotab API
    const { server, credentials } = await authenticateGeotab(user, pass, db);
    // Store session info (sessionId, userName, database, and server) in a secure, HttpOnly cookie
    const sessionData = {
      sessionId: credentials.sessionId,
      userName: credentials.userName,
      database: credentials.database,
      server: server
    };
    // Serialize cookie (HttpOnly, not accessible via JS, secure in production)
    res.setHeader("Set-Cookie", cookie.serialize("geotabSession", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/"      // cookie valid for all routes
    }));
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Geotab login failed:", err);
    return res.status(401).json({ error: "Invalid Geotab credentials" });
  }
}