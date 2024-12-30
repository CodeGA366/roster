import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

const router = express.Router();

interface LoginRequest {
    username: string;
    password: string;
}
// Registration route
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body; // Get email from request body
  
    // Check if username, password, and email are provided
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Username, password, and email are required' });
    }
  
    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      // Insert user into the database
      const result = await pool.query(
        'INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING *',
        [username, hashedPassword, email] // Include email in the query
      );
  
      // Respond with the created user
      res.status(201).json({ user: result.rows[0] });
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.code === '23505') { // Unique violation error code for PostgreSQL
        return res.status(409).json({ error: 'Username already exists' });
      }
      res.status(500).json({ error: 'Error creating account' });
    }
  });
  
// Login a user
router.post('/login', async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (user && (await bcrypt.compare(password, user.password_hash))) {
            const jwtSecretKey = process.env.JWT_SECRET_KEY;

            if (!jwtSecretKey) {
                return res.status(500).json({ error: 'JWT secret key is not defined' });
            }

            const token = jwt.sign({ userId: user.user_id }, jwtSecretKey, { expiresIn: '1h' });
            console.log('Generated Token:', token); 
            return res.json({ token });
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ error: 'Server error' });
    }
});

export default router;