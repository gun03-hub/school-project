// pages/api/getSchools.js

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Call your backend API hosted on Render
    const response = await fetch(`${process.env.BACKEND_URL}/api/getSchools`);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching schools:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
