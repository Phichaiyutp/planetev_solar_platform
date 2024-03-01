import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/pg';

const sendMessage = async (lineToken: string, message: string) => {
    try {
        const response = await fetch('https://notify-api.line.me/api/notify', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${lineToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                message: message
            }).toString()
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { username, message } = req.body; // Retrieve username and message from request body
            const result = await pool.query('SELECT line_token FROM users WHERE username = $1', [username]);
            const lineToken = result.rows[0]?.line_token;
            if (!lineToken) throw new Error('Line token not found for the specified username');

            const response = await sendMessage(lineToken, message);
            res.status(200).json(response);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
