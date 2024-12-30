"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // Use default import
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db"); // Import the pool object
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000; // Use an environment variable for the port
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files from the React frontend
const publicPath = path_1.default.join(__dirname, '..', 'public'); // Path to the frontend build
app.use(express_1.default.static(publicPath));
// Use auth routes 
app.use('/api', authRoutes_1.default); // This sets up the routes under the /api prefix
app.get('/api/players', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query('SELECT * FROM players'); // Adjust the query based on your table structure
        res.status(200).json(result.rows); // Send the rows back as a JSON response
    }
    catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Endpoint to add a player to user_players
app.post('/api/user_players', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, playerId } = req.body; // Extract userId and playerId from the request body
    if (!userId || !playerId) {
        return res.status(400).json({ error: 'User ID and Player ID are required.' });
    }
    try {
        // Insert the new player into the user_players table
        const result = yield db_1.pool.query(`
          INSERT INTO user_players (user_id, id)  -- Use 'id' instead of 'player_id'
          VALUES ($1, $2)
          RETURNING *`, [userId, playerId]);
        const addedPlayer = result.rows[0]; // Get the added player data
        res.status(201).json(addedPlayer); // Send back the added player data
    }
    catch (error) {
        console.error('Error adding player to roster:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Endpoint to add a player to user_players
app.get('/api/user_players/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params; // Access userId from the route parameters
    console.log(`Received request for user ID: ${userId}`); // Log the user ID
    try {
        const userPlayers = yield db_1.pool.query(`
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
    }
    catch (error) {
        console.error('Error fetching user players:', error);
        res.status(500).json({ error: 'Server error' });
        console.log('Response sent: 500 Internal Server Error'); // Log the response status
    }
}));
// Endpoint to fetch top 10 players by PER
app.get('/api/top-players', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query('SELECT * FROM players ORDER BY per DESC LIMIT 10');
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error fetching top players:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Endpoint to fetch top 10 players by PER
app.get('/api/top-winShares', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query('SELECT * FROM players ORDER BY winShares DESC LIMIT 10');
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error fetching top players:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Endpoint to fetch top 10 players by PER
app.get('/api/top-boxScore', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query('SELECT * FROM players ORDER BY box DESC LIMIT 10');
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error fetching top players:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Catch-all handler to serve the React frontend
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(publicPath, 'index.html')); // Serve the React app for all non-API routes
});
// Start server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
