//imports 
import { Request, Response } from 'express';
import { pool } from '../db';
import { PlayerData } from '../models/playerModel';


// get all players
export const getPlayerData = async (req: Request, res: Response) => {
    const playerName = req.params.playerName as string; //get playerName from query parameter
    const sortBy = req.query.sortBy as string;
    const ascending = req.query.ascending === 'true';
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    try{
        const result = await pool.query('SELECT * FROM players WHERE "playerName" = $1', [playerName]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({message: 'Player not found'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server error'});
    }

};