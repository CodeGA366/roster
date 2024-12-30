-- User table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Players table
CREATE TABLE players (
    id INT PRIMARY KEY,
    playerName VARCHAR(255) NOT NULL,
    position VARCHAR(30),
    per DECIMAL(5, 2),
    winShares DECIMAL(5, 2),
    "box" DECIMAL(10, 2),
    team VARCHAR(30)
);

-- User_players table
CREATE TABLE user_players (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    id INT REFERENCES players(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, id)
);