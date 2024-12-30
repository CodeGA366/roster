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
const db_1 = require("./db");
const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('JWT_SECRET_KEY', process.env.JWT_SECRET_KEY);
    try {
        //attempt to connect to the database
        const client = yield db_1.pool.connect();
        console.log('Connected to the database');
        const res = yield client.query('SELECT NOW()');
        console.log('Current time from database:', res.rows[0]);
        //release the client back to the pool
        client.release();
    }
    catch (err) {
        console.error('Error connecting to the database:', err);
    }
    finally {
        //close the pool
        yield db_1.pool.end();
    }
});
testConnection();
