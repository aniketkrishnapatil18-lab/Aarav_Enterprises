const { getPool } = require('../config/database');

class Video {
    static async findAll(filters = {}) {
        let query = 'SELECT * FROM videos';
        const params = [];

        if (filters.active !== undefined) {
            // Allow boolean or string 'true'/'false'
            const isActive = filters.active === true || filters.active === 'true' ? 1 : 0;
            query += ' WHERE active = ?';
            params.push(isActive);
        }

        query += ' ORDER BY created_at DESC';
        const [rows] = await getPool().execute(query, params);
        return rows;
    }

    static async create(data) {
        const { title, description, thumbnail_url, video_url, active = 1 } = data;
        const [result] = await getPool().execute(
            'INSERT INTO videos (title, description, thumbnail_url, video_url, active) VALUES (?, ?, ?, ?, ?)',
            [title, description || '', thumbnail_url || '', video_url || '', active]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];

        const allowedFields = ['title', 'description', 'thumbnail_url', 'video_url', 'active'];
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field]);
            }
        });

        if (fields.length === 0) return 0;
        values.push(id);

        const [result] = await getPool().execute(
            `UPDATE videos SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await getPool().execute('DELETE FROM videos WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Video;
