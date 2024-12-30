//import
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

//db connection
const isRender = process.env.DATABASE_URL !== undefined;

const pool = isRender
    ? new Pool({
          connectionString: process.env.DATABASE_URL, // Use the Render database URL
          ssl: {
              rejectUnauthorized: false, // Enable SSL if required by Render
          },
      })
    : new Pool({
          user: process.env.DB_USER,
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          password: process.env.DB_PASSWORD,
          port: parseInt(process.env.DB_PORT || '5432'),
      });

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export { pool };