import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const initDatabase = async () => {
  let client;
  
  if (process.env.DATABASE_URL) {
    // Use the DATABASE_URL for cloud environment (Render)
    client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
  } else {
    // Use individual DB settings for local environment
    client = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME,
    });
  }

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    await client.query(`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '${process.env.DB_NAME}'
          AND pid <> pg_backend_pid();
      `);

    // Drop and create the database
    await client.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
    await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    console.log(`Database ${process.env.DB_NAME} created`);

    // Disconnect from the initial connection
    await client.end();

    // Create a new client for the new database
    const newClient = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432', 10),
    });

    await newClient.connect();

    // Read and execute the schema SQL file
    const schemaPath = path.join(__dirname, '../db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await newClient.query(schema);
    console.log('Database schema created');

    // Disconnect from the new database
    await newClient.end();

  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

initDatabase();