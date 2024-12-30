import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes'; // Use default import
import dotenv from 'dotenv';
import { pool } from './db'; // Import the pool object


dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Use an environment variable for the port

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React frontend
const publicPath = path.join(__dirname, '..', 'public'); // Path to the frontend build
app.use(express.static(publicPath));

// Use auth routes 
app.use('/api', authRoutes); // This sets up the routes under the /api prefix
app.get('/api/players', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM players'); // Adjust the query based on your table structure
        res.status(200).json(result.rows); // Send the rows back as a JSON response
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Endpoint to add a player to user_players
app.post('/api/user_players', async (req, res) => {
  const { userId, playerId } = req.body; // Extract userId and playerId from the request body

  if (!userId || !playerId) {
      return res.status(400).json({ error: 'User ID and Player ID are required.' });
  }

  try {
      // Insert the new player into the user_players table
      const result = await pool.query(`
          INSERT INTO user_players (user_id, id)  -- Use 'id' instead of 'player_id'
          VALUES ($1, $2)
          RETURNING *`, [userId, playerId]);

      const addedPlayer = result.rows[0]; // Get the added player data
      res.status(201).json(addedPlayer); // Send back the added player data
  } catch (error) {
      console.error('Error adding player to roster:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to add a player to user_players
app.get('/api/user_players/:userId', async (req, res) => {
    const { userId } = req.params; // Access userId from the route parameters
    console.log(`Received request for user ID: ${userId}`); // Log the user ID

    try {
        const userPlayers = await pool.query(`
            SELECT p.id, p.playerName, p.position, p.per, p.winShares, p.box, p.team
            FROM user_players up
            JOIN players p ON up.id = p.id
            WHERE up.user_id = $1
        `, [userId]);
        
        if (userPlayers.rows.length === 0) {
            console.log(`No players found for user ID: ${userId}`); // Log if no players found
            res.status(404).json({ error: 'No players found for this user.' });
            console.log('Response sent: 404 Not Found'); // Log the response status
            return;
        }

        console.log(`Found players for user ID: ${userId}`, userPlayers.rows); // Log the found players
        res.setHeader('Content-Type', 'application/json'); // Set content type
        res.json(userPlayers.rows);
        console.log('Response sent: 200 OK'); // Log the response status
    } catch (error) {
        console.error('Error fetching user players:', error);
        res.status(500).json({ error: 'Server error' });
        console.log('Response sent: 500 Internal Server Error'); // Log the response status
    }
});

// Endpoint to fetch top 10 players by PER
app.get('/api/top-players', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM players ORDER BY per DESC LIMIT 10');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching top players:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to fetch top 10 players by PER
app.get('/api/top-winShares', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM players ORDER BY winShares DESC LIMIT 10');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching top players:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to fetch top 10 players by PER
app.get('/api/top-boxScore', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM players ORDER BY box DESC LIMIT 10');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching top players:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// Catch-all handler to serve the React frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html')); // Serve the React app for all non-API routes
});

// Start server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});