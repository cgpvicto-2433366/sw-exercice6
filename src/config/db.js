import mysql from 'mysql2/promise'
import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config();

let pool;

if (process.env.USE_MYSQL) {
    pool = mysql.createPool({
        connectionLimit: process.env.DB_CONNECTION_LIMIT,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
} else {
    pool = new pg.Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT
    });
}

export default pool;