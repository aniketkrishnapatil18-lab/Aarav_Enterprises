const mysql = require('mysql2/promise');
require('dotenv').config();

const REPLICA_CLIENTS = [
  // Column 1
  { name: 'GoDaddy', logo_url: 'https://logo.clearbit.com/godaddy.com', sort_order: 1 },
  { name: 'PayPal', logo_url: 'https://logo.clearbit.com/paypal.com', sort_order: 2 },
  { name: 'MasterCard', logo_url: 'https://logo.clearbit.com/mastercard.com', sort_order: 3 },

  // Column 2
  { name: 'OTP Bank', logo_url: 'https://logo.clearbit.com/otpbank.hu', sort_order: 4 },
  { name: 'Groupon', logo_url: 'https://logo.clearbit.com/groupon.com', sort_order: 5 },
  { name: 'Shopify', logo_url: 'https://logo.clearbit.com/shopify.com', sort_order: 6 },
  { name: 'Visa', logo_url: 'https://logo.clearbit.com/visa.com', sort_order: 7 },

  // Column 3
  { name: 'eBay', logo_url: 'https://logo.clearbit.com/ebay.com', sort_order: 8 },
  { name: 'Google', logo_url: 'https://logo.clearbit.com/google.com', sort_order: 9 },
  { name: 'Newegg', logo_url: 'https://logo.clearbit.com/newegg.com', sort_order: 10 },

  // Column 4
  { name: 'Reddit', logo_url: 'https://logo.clearbit.com/reddit.com', sort_order: 11 },
  { name: 'Coursera', logo_url: 'https://logo.clearbit.com/coursera.org', sort_order: 12 },
  { name: 'Lazada', logo_url: 'https://logo.clearbit.com/lazada.com', sort_order: 13 },
  { name: 'Meetup', logo_url: 'https://logo.clearbit.com/meetup.com', sort_order: 14 },

  // Column 5
  { name: 'Wish', logo_url: 'https://logo.clearbit.com/wish.com', sort_order: 15 },
  { name: 'Coinbase', logo_url: 'https://logo.clearbit.com/coinbase.com', sort_order: 16 },
  { name: 'Rakuten', logo_url: 'https://logo.clearbit.com/rakuten.co.jp', sort_order: 17 },
];

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || 'aarav_enterprises',
  });

  console.log('Connected to database.');

  // Clear existing clients
  await connection.execute('DELETE FROM clients');
  console.log('Cleared existing clients.');

  // Seed replica clients
  for (const client of REPLICA_CLIENTS) {
    await connection.execute(
      'INSERT INTO clients (name, logo_url, sort_order, is_active) VALUES (?, ?, ?, 1)',
      [client.name, client.logo_url, client.sort_order]
    );
    console.log(`Inserted client: ${client.name}`);
  }

  console.log('Seeding finished successfully.');
  await connection.end();
}

run().catch(console.error);
