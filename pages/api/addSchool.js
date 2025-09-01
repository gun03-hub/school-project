// pages/api/addSchool.js
import fs from "fs";
import path from "path";
import { IncomingForm } from "formidable";
import { getPool } from "../../lib/db";

export const config = {
  api: { bodyParser: false }, // required for formidable
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  const form = new IncomingForm({ multiples: false, maxFileSize: 10 * 1024 * 1024 });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: "Error parsing form data" });
    }

    try {
      const { name, address, city, state, contact, email_id, board, website } = fields;

      // Basic validations
      if (!name || !address || !city || !state || !contact || !email_id || !board) {
        return res.status(400).json({ error: "All required fields must be filled" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(email_id))) {
        return res.status(400).json({ error: "Invalid email" });
      }

      const uploadDir = path.join(process.cwd(), "public", "schoolImages");
      ensureDir(uploadDir);

      let imageRelPath = "";
      let imageFile = files.image;

      if (Array.isArray(imageFile)) {
        imageFile = imageFile[0];
      }

      if (imageFile && imageFile.filepath) {
        const ext =
          path.extname(imageFile.originalFilename || "").toLowerCase() || ".jpg";
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
        const destPath = path.join(uploadDir, fileName);

        await fs.promises.copyFile(imageFile.filepath, destPath);
        imageRelPath = `/schoolImages/${fileName}`;
      }

      const pool = getPool();

      // Prevent duplicates: same name + address
      const [existing] = await pool.execute(
        "SELECT id FROM schools WHERE name = ? AND address = ?",
        [String(name), String(address)]
      );

      if (existing.length > 0) {
        return res
          .status(400)
          .json({ error: "School already exists with this name and address" });
      }

      await pool.execute(
        `INSERT INTO schools 
        (name, address, city, state, contact, email_id, board, website, image) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          String(name),
          String(address),
          String(city),
          String(state),
          Number(contact),
          String(email_id),
          String(board),
          String(website || ""), // optional website
          imageRelPath,
        ]
      );

      return res.status(200).json({ message: "School added successfully" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Server error" });
    }
  });
}
