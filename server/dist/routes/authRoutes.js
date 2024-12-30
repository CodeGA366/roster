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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const router = express_1.default.Router();
// Registration route
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body; // Get email from request body
    // Check if username, password, and email are provided
    if (!username || !password || !email) {
        return res.status(400).json({ error: 'Username, password, and email are required' });
    }
    // Hash the password before saving it
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    try {
        // Insert user into the database
        const result = yield db_1.pool.query('INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING *', [username, hashedPassword, email] // Include email in the query
        );
        // Respond with the created user
        res.status(201).json({ user: result.rows[0] });
    }
    catch (error) {
        console.error('Error creating user:', error);
        if (error.code === '23505') { // Unique violation error code for PostgreSQL
            return res.status(409).json({ error: 'Username already exists' });
        }
        res.status(500).json({ error: 'Error creating account' });
    }
}));
// Login a user
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const result = yield db_1.pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        if (user && (yield bcrypt_1.default.compare(password, user.password_hash))) {
            const jwtSecretKey = process.env.JWT_SECRET_KEY;
            if (!jwtSecretKey) {
                return res.status(500).json({ error: 'JWT secret key is not defined' });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.user_id }, jwtSecretKey, { expiresIn: '1h' });
            console.log('Generated Token:', token);
            return res.json({ token });
        }
        else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ error: 'Server error' });
    }
}));
exports.default = router;
