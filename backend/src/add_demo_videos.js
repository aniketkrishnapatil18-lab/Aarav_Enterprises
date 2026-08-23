const mysql = require('mysql2/promise');
require('dotenv').config();

const DEMO_VIDEOS = [
    {
        title: 'LED Sign Board Installation Timelapse',
        description: 'Watch our team install a massive illuminated LED sign board for a retail client in Pune from start to finish.',
        thumbnail_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    {
        title: 'HP Latex 560 Large Format Printing',
        description: 'Demonstration of our HP Latex 560 printer producing vibrant, high-quality large-format banners and sunboards.',
        thumbnail_url: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=800&q=80',
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    {
        title: 'CNC Router Machine in Action',
        description: 'Our CNC Router 12x5 carving precision letters and shapes for custom 3D signage and acrylic branding panels.',
        thumbnail_url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    {
        title: 'Neon Sign Fabrication Process',
        description: 'Behind-the-scenes look at how our craftsmen bend and assemble custom neon signs for restaurants and cafes.',
        thumbnail_url: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=800&q=80',
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    {
        title: 'Vehicle Wrapping — Full Car Branding',
        description: 'Complete commercial vehicle wrap project for a corporate fleet, showcasing our precision vinyl application skills.',
        thumbnail_url: 'https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?auto=format&fit=crop&w=800&q=80',
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    {
        title: 'Laser Machine Cutting Showcase',
        description: 'Watch our Laser Machine 8x4 cutting high-precision designs on acrylic, wood, and metal substrates with clean edges.',
        thumbnail_url: 'https://images.unsplash.com/photo-1565814329452-e1e53b1f7c74?auto=format&fit=crop&w=800&q=80',
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
];

async function run() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT || '3306', 10),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'aarav_enterprises',
    });

    console.log('Connected to database.');

    for (const v of DEMO_VIDEOS) {
        await connection.execute(
            'INSERT INTO videos (title, description, thumbnail_url, video_url, active) VALUES (?, ?, ?, ?, 1)',
            [v.title, v.description, v.thumbnail_url, v.video_url]
        );
        console.log('Inserted:', v.title);
    }

    const [rows] = await connection.execute('SELECT COUNT(*) as cnt FROM videos');
    console.log('Total videos in table:', rows[0].cnt);

    await connection.end();
    console.log('Done.');
}

run().catch(err => {
    console.error('Failed:', err.message);
    process.exit(1);
});
