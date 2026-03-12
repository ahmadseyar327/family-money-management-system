const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function checkConnection() {
    try {
        console.log('Attempting to connect with:', {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
        const res = await pool.query('SELECT NOW()');
        console.log('Connection successful:', res.rows[0]);

        // Also check if tables exist
        const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('Tables found:', tables.rows.map(r => r.table_name));

    } catch (err) {
        console.error('Connection failed:', err);
    } finally {
        await pool.end();
    }
}

checkConnection();
