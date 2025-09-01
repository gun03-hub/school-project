import { getPool } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const pool = getPool();

    // Include all columns: state, contact, email, board, description (if any)
    const [rows] = await pool.query(`
  SELECT id, name, address, city, state, contact, email_id AS email, board, image, website
  FROM schools
  ORDER BY id DESC
`);


    res.status(200).json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}
