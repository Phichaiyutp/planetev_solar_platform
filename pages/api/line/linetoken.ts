import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/pg';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, line_token, line_code } = req.body;
    try {
      const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

      if (existingUser.rows.length > 0) {
        await pool.query('UPDATE users SET line_token = $1, line_code = $2 WHERE username = $3', [line_token, line_code, username]);
      } else {
        await pool.query('INSERT INTO users (username, line_token, line_code) VALUES ($1, $2, $3)', [username, line_token, line_code]);
      }

      res.status(200).json({ message: 'Line token and line code updated/inserted successfully' });
    } catch (error) {
      console.error('Error updating/inserting line token and line code:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
