const db = require('../config/db');

class MemberService {
    async getAllMembers(userId) {
        const { rows } = await db.query('SELECT * FROM members WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        return rows;
    }

    async getMemberById(id, userId) {
        const { rows } = await db.query('SELECT * FROM members WHERE id = $1 AND user_id = $2', [id, userId]);
        return rows[0];
    }

    async createMember({ name, role }, userId) {
        const { rows } = await db.query(
            'INSERT INTO members (name, role, user_id) VALUES ($1, $2, $3) RETURNING *',
            [name, role, userId]
        );
        return rows[0];
    }

    async updateMember(id, { name, role }, userId) {
        const { rows } = await db.query(
            'UPDATE members SET name = $1, role = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
            [name, role, id, userId]
        );
        return rows[0];
    }

    async deleteMember(id, userId) {
        await db.query('DELETE FROM members WHERE id = $1 AND user_id = $2', [id, userId]);
        return { message: 'Member deleted successfully' };
    }
}

module.exports = new MemberService();
