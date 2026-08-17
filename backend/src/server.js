// ============================================================
// Server Entry Point
// ============================================================

require('dotenv').config();

const app   = require('./app');
const { testConnection } = require('./config/database');

const PORT = parseInt(process.env.PORT || '5000', 10);

async function start() {
  const dbOk = await testConnection();
  if (!dbOk) {
    console.error('⚠️  Running without database — some features will not work.');
    console.error('   Set MYSQL_* environment variables and ensure MySQL is running.');
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Aarav Enterprises API server started`);
    console.log(`   → http://localhost:${PORT}`);
    console.log(`   → Health: http://localhost:${PORT}/health`);
    console.log(`   → Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

start();
