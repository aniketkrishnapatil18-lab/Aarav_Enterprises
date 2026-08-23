const mysql = require('mysql2/promise');
require('dotenv').config();

const REPLICA_CLIENTS = [
  // Column 1
  { name: 'GoDaddy', logo_url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/godaddy.svg', sort_order: 1 },
  { name: 'PayPal', logo_url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/paypal.svg', sort_order: 2 },
  { name: 'MasterCard', logo_url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/mastercard.svg', sort_order: 3 },

  // Column 2
  { name: 'Stripe', logo_url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/stripe.svg', sort_order: 4 },
  { name: 'Groupon', logo_url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/groupon.svg', sort_order: 5 },
  { name: 'Shopify', logo_url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/shopify.svg', sort_order: 6 },
  { name: 'Visa', logo_url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/visa.svg', sort_order: 7 },

  // Column 3
  { name: 'eBay', logo_url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/ebay.svg', sort_order: 8 },
  { name: 'Google', logo_url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/google.svg', sort_order: 9 },
  { name: 'Newegg', logo_url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/newegg.svg', sort_order: 10 },

  // Column 4
  { name: 'Reddit', logo_url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/reddit.svg', sort_order: 11 },
  { name: 'Coursera', logo_url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/coursera.svg', sort_order: 12 },
  { name: 'Lazada', logo_url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/lazada.svg', sort_order: 13 },
  { name: 'Meetup', logo_url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/meetup.svg', sort_order: 14 },

  // Column 5
  { name: 'Wish', logo_url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/wish.svg', sort_order: 15 },
  { name: 'Coinbase', logo_url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/coinbase.svg', sort_order: 16 },
  { name: 'Rakuten', logo_url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/rakuten.svg', sort_order: 17 },
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
