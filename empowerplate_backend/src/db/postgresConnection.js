import { config } from '../config/config.js';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: config.pgUser,
  host: config.pgHost,
  database: config.pgDbName,
  password: config.pgPassword,
  port: config.pgPort,
});

export default pool;