const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT || '3306', 10),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'aarav_enterprises',
    });

    console.log('Connected to database.');

    // Create videos table if not exists
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS videos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      thumbnail_url VARCHAR(500),
      video_url VARCHAR(500),
      active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
    console.log('Videos table ready.');

    // Check if table is already seeded
    const [existing] = await connection.execute('SELECT COUNT(*) as cnt FROM videos');
    if (existing[0].cnt > 0) {
        console.log(`Videos table already has ${existing[0].cnt} rows. Skipping seed.`);
        await connection.end();
        return;
    }

    // Insert demo videos
    const dummyVideos = [
        {
            title: 'Aarav Enterprises Overview',
            description: 'Learn about our journey, values, and the printing services we offer to businesses in Pune.',
            thumbnail_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
            video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        },
        {
            title: 'UV Printing Demo',
            description: 'Watch our advanced UV flatbed printer in action, creating stunning large-format displays.',
            thumbnail_url: 'https://images.unsplash.com/photo-1620601831868-b80c9a444a77?auto=format&fit=crop&w=800&q=80',
            video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        },
        {
            title: 'Manufacturing Facility Tour',
            description: 'Take a virtual tour of our 10,000 sq ft manufacturing warehouse located in the heart of Pune.',
            thumbnail_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
            video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        },
    ];

    for (const v of dummyVideos) {
        await connection.execute(
            'INSERT INTO videos (title, description, thumbnail_url, video_url, active) VALUES (?, ?, ?, ?, ?)',
            [v.title, v.description, v.thumbnail_url, v.video_url, 1]
        );
        console.log(`Inserted: ${v.title}`);
    }

    console.log('Seeding finished successfully.');
    await connection.end();
}

run().catch(err => {
    console.error('Seed failed:', err.message);
    process.exit(1);
});
