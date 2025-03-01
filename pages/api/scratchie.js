// pages/api/scratchie.js
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }
  // (Optional) verify user is authenticated via Geotab session cookie
  const cookies = cookie.parse(req.headers.cookie || "");
  if (!cookies.geotabSession) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { driverId } = req.body || {};
  if (!driverId) {
    return res.status(400).json({ error: "Missing driverId" });
  }
  // Prepare Scratchie API request
  const SCRATCHIE_URL = process.env.SCRATCHIE_API_URL;
  const SCRATCHIE_KEY = process.env.SCRATCHIE_API_KEY;
  if (!SCRATCHIE_URL || !SCRATCHIE_KEY) {
    console.error("Scratchie API credentials not configured");
    return res.status(500).json({ error: "Scratchie integration not configured" });
  }

  try {
    // Call the Scratchie API to award a reward to the driver
    const resp = await fetch(SCRATCHIE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SCRATCHIE_KEY}`
      },
      body: JSON.stringify({ driverId: driverId })
    });
    if (!resp.ok) {
      throw new Error(`Scratchie API responded with status ${resp.status}`);
    }
    // Assuming the Scratchie API returns JSON
    const data = await resp.json();
    return res.status(200).json({ success: true, detail: data });
  } catch (err) {
    console.error("Failed to award scratchie:", err);
    return res.status(500).json({ error: "Scratchie API call failed" });
  }
}