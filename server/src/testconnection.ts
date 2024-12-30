import { pool } from './db';

const testConnection = async () => {
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('JWT_SECRET_KEY', process.env.JWT_SECRET_KEY);
    
    try {
        //attempt to connect to the database
        const client = await pool.connect();
        console.log('Connected to the database');

        const res = await client.query('SELECT NOW()');
        console.log('Current time from database:', res.rows[0]);

        //release the client back to the pool
        client.release();
    } catch (err) {
        console.error('Error connecting to the database:', err);
    } finally {
        //close the pool
        await pool.end();
    }
};

testConnection();