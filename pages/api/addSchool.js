// pages/api/addSchool.js
import { IncomingForm } from "formidable";
import pkg from "pg";

const { Pool } = pkg;

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Render DB
});

export const config = {
  api: { bodyParser: false }, // required for formidable
};

// Convert formidable parse to promise
const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: false, maxFileSize: 10 * 1024 * 1024 });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);
    const { name, address, city, state, contact, email_id, board, website } = fields;

    // Basic validations
    if (!name || !address || !city || !state || !contact || !email_id || !board) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email_id))) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // Handle image upload (optional, needs cloud storage for persistence)
    let imageRelPath = "";
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
    if (imageFile && imageFile.filepath) {
      imageRelPath = imageFile.originalFilename || "";
    }

    // Prevent duplicates: same name + address
    const existing = await pool.query(
      "SELECT id FROM schools WHERE name = $1 AND address = $2",
      [name, address]
    );

    if (existing.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "School already exists with this name and address" });
    }

    // Insert into PostgreSQL
    await pool.query(
      `INSERT INTO schools 
       (name, address, city, state, contact, email_id, board, website, image) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        name,
        address,
        city,
        state,
        contact,
        email_id,
        board,
        website || "",
        imageRelPath,
      ]
    );

    return res.status(200).json({ message: "School added successfully" });
  } catch (err) {
    console.error("❌ Error in addSchool:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
