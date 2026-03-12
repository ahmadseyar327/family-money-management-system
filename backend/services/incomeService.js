const db = require('../config/db');

class IncomeService {
    async getAllIncome(userId) {
        const { rows } = await db.query(
            'SELECT i.*, m.name as member_name FROM income i LEFT JOIN members m ON i.added_by_member_id = m.id WHERE i.user_id = $1 ORDER BY i.date DESC',
            [userId]
        );
        return rows;
    }

    async createIncome({ amount, source, description, date, added_by_member_id }, userId) {
        const { rows } = await db.query(
            'INSERT INTO income (amount, source, description, date, added_by_member_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [amount, source, description, date, added_by_member_id, userId]
        );
        return rows[0];
    }

    async updateIncome(id, { amount, source, description, date, added_by_member_id }, userId) {
        const { rows } = await db.query(
            'UPDATE income SET amount = $1, source = $2, description = $3, date = $4, added_by_member_id = $5 WHERE id = $6 AND user_id = $7 RETURNING *',
            [amount, source, description, date, added_by_member_id, id, userId]
        );
        return rows[0];
    }

    async deleteIncome(id, userId) {
        await db.query('DELETE FROM income WHERE id = $1 AND user_id = $2', [id, userId]);
        return { message: 'Income record deleted successfully' };
    }
}

module.exports = new IncomeService();
