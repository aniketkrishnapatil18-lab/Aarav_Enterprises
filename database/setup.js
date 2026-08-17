// ============================================================
// Aarav Enterprises — Automated Node Database Setup Script
// Executes all schema migrations and seed scripts in order
// ============================================================

const fs = require('fs');
const path = require('path');

// Resolve modules relative to backend directory
const backendNodeModules = path.join(__dirname, '../backend/node_modules');
const mysql = require(path.join(backendNodeModules, 'mysql2/promise'));
require(path.join(backendNodeModules, 'dotenv')).config({ path: path.join(__dirname, '../backend/.env') });

const DB_HOST = process.env.MYSQL_HOST || 'localhost';
const DB_PORT = parseInt(process.env.MYSQL_PORT || '3306', 10);
const DB_USER = process.env.MYSQL_USER || 'root';
const DB_PASS = process.env.MYSQL_PASSWORD || '';
const DB_NAME = process.env.MYSQL_DATABASE || 'aarav_enterprises';

async function runSetup() {
  console.log(`\n==================================================`);
  console.log(`⚙️  Connecting to MySQL server at ${DB_HOST}:${DB_PORT}...`);
  console.log(`==================================================\n`);

  let connection;
  try {
    // 1. Connect without selecting database
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASS,
      multipleStatements: true,
    });

    console.log(`✅ Connected as user '${DB_USER}'`);

    // 2. Create Database
    console.log(`\n📦 Creating database '${DB_NAME}' if not exists...`);
    await connection.query(`
      CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci;
    `);
    await connection.query(`USE \`${DB_NAME}\`;`);
    console.log(`✅ Database '${DB_NAME}' ready`);

    // 3. Run Migrations
    console.log(`\n🔄 Running Database Migrations...`);
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      await connection.query(sql);
      console.log(`  ✔ Migrated: ${file}`);
    }

    // 4. Run Seeds
    console.log(`\n🌱 Running Database Seeds...`);
    const seedsDir = path.join(__dirname, 'seeds');
    const seedFiles = fs.readdirSync(seedsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of seedFiles) {
      const filePath = path.join(seedsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      await connection.query(sql);
      console.log(`  ✔ Seeded: ${file}`);
    }

    console.log(`\n==================================================`);
    console.log(`🎉 Aarav Enterprises database setup complete!`);
    console.log(`==================================================\n`);

  } catch (err) {
    console.error(`\n❌ Setup Error:`, err.message);
    console.error(`Please verify MySQL is running and credentials in backend/.env are correct.\n`);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

runSetup();
