// pages/api/getSchools.js
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        address,
        city,
        state,
        contact,
        email_id AS email,
        board,
        image,
        website
      FROM schools
      ORDER BY id DESC
    `);

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching schools:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
