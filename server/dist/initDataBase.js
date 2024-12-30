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
const pg_1 = require("pg");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const initDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new pg_1.Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || '5432', 10),
    });
    try {
        yield client.connect();
        console.log('Connected to PostgreSQL');
        yield client.query(`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '${process.env.DB_NAME}'
          AND pid <> pg_backend_pid();
      `);
        // Drop and create the database
        yield client.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
        yield client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
        console.log(`Database ${process.env.DB_NAME} created`);
        // Disconnect from the initial connection
        yield client.end();
        // Create a new client for the new database
        const newClient = new pg_1.Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT || '5432', 10),
        });
        yield newClient.connect();
        // Read and execute the schema SQL file
        const schemaPath = path_1.default.join(__dirname, '../db/schema.sql');
        const schema = fs_1.default.readFileSync(schemaPath, 'utf-8');
        yield newClient.query(schema);
        console.log('Database schema created');
        // Disconnect from the new database
        yield newClient.end();
    }
    catch (err) {
        console.error('Error initializing database:', err);
    }
});
initDatabase();
