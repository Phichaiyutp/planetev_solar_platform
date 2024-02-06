import { Pool } from 'pg';

const pool = new Pool({
  user: 'root',
  host: '192.168.100.53',
  database: 'postgres',
  password: 'pca@123',
  port: 5432,
});
export default pool;