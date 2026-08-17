// ============================================================
// Database Configuration — MySQL connection pool
// ============================================================

require('dotenv').config();
const mysql = require('mysql2/promise');

let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host:               process.env.MYSQL_HOST     || 'localhost',
      port:               parseInt(process.env.MYSQL_PORT || '3306', 10),
      database:           process.env.MYSQL_DATABASE || 'aarav_enterprises',
      user:               process.env.MYSQL_USER     || 'root',
      password:           process.env.MYSQL_PASSWORD || '',
      waitForConnections: true,
      connectionLimit:    10,
      queueLimit:         0,
      timezone:           '+05:30',
      charset:            'utf8mb4',
    });
  }
  return pool;
}

async function testConnection() {
  try {
    const conn = await getPool().getConnection();
    await conn.ping();
    conn.release();
    console.log('✅ MySQL database connected successfully');
    return true;
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    return false;
  }
}

module.exports = { getPool, testConnection };
