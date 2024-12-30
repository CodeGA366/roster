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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayerData = void 0;
const db_1 = require("../db");
// get all players
const getPlayerData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const playerName = req.params.playerName; //get playerName from query parameter
    const sortBy = req.query.sortBy;
    const ascending = req.query.ascending === 'true';
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    try {
        const result = yield db_1.pool.query('SELECT * FROM players WHERE "playerName" = $1', [playerName]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        }
        else {
            res.status(404).json({ message: 'Player not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server error' });
    }
});
exports.getPlayerData = getPlayerData;
