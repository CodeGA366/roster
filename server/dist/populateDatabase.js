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
const axios_1 = __importDefault(require("axios"));
const db_1 = require("./db");
const fetchAndInsertPlayersFrom2023 = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Starting to fetch and insert players from the 2023 season');
    let client;
    try {
        console.log('Fetching players from the 2023 season');
        const response = yield axios_1.default.get('http://rest.nbaapi.com/api/PlayerDataAdvanced/query', {
            params: {
                season: '2023',
                sortBy: 'playerName',
                ascending: 'true',
                pageSize: '900',
            }
        });
        console.log('Response:', response.data);
        const players = response.data || [];
        console.log(`Number of players fetched: ${players.length}`);
        if (!Array.isArray(players)) {
            console.error('Players is not an array:', players);
            return;
        }
        if (players.length === 0) {
            console.log('No players to fetch');
            return;
        }
        client = yield db_1.pool.connect(); // Acquire a client from the pool
        for (const player of players) {
            const { id, playerName, position, per, winShares, box, team } = player;
            try {
                console.log('Values to insert:', [id, playerName, position, per, winShares, box, team]);
                console.log(`Preparing to insert player: ${playerName} with ID: ${id}`);
                yield client.query(`INSERT INTO players (
            id, playerName, position, per, winShares, box, team
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO NOTHING`, [id, playerName, position, per, winShares, box, team]);
                console.log('Inserted player:', playerName);
            }
            catch (insertError) {
                console.error('Error inserting player:', insertError);
            }
        }
    }
    catch (error) {
        console.error('Error fetching player data:', error);
    }
    finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }
});
fetchAndInsertPlayersFrom2023().then(() => {
    db_1.pool.end(); // End the pool after all operations are complete
}).catch((error) => {
    console.error('Error during database population:', error);
    db_1.pool.end(); // Ensure the pool is ended even if there is an error
});
