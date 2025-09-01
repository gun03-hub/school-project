// pages/api/addSchool.js
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, address, city, state, contact, email_id, board, website } = req.body;

    if (!name || !address || !city || !state || !contact || !email_id || !board) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    // Check duplicates
    const existing = await pool.query(
      "SELECT id FROM schools WHERE name = $1 AND address = $2",
      [name, address]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "School already exists" });
    }

    await pool.query(
      `INSERT INTO schools (name, address, city, state, contact, email_id, board, website)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [name, address, city, state, contact, email_id, board, website || ""]
    );

    return res.status(200).json({ message: "School added successfully" });
  } catch (err) {
    console.error("Error adding school:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
