const db = require('../config/db');

class ExpenseService {
    async getAllExpenses(userId, filters = {}) {
        const { member, category, startDate, endDate } = filters;
        let query = 'SELECT e.*, m.name as member_name FROM expenses e LEFT JOIN members m ON e.spent_by_member_id = m.id WHERE e.user_id = $1';
        const params = [userId];

        if (member) {
            params.push(member);
            query += ` AND e.spent_by_member_id = $${params.length}`;
        }
        if (category) {
            params.push(category);
            query += ` AND e.category = $${params.length}`;
        }
        if (startDate) {
            params.push(startDate);
            query += ` AND e.date >= $${params.length}`;
        }
        if (endDate) {
            params.push(endDate);
            query += ` AND e.date <= $${params.length}`;
        }

        query += ' ORDER BY e.date DESC';
        const { rows } = await db.query(query, params);
        return rows;
    }

    async createExpense({ amount, category, description, date, spent_by_member_id }, userId) {
        const { rows } = await db.query(
            'INSERT INTO expenses (amount, category, description, date, spent_by_member_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [amount, category, description, date, spent_by_member_id, userId]
        );
        return rows[0];
    }

    async updateExpense(id, { amount, category, description, date, spent_by_member_id }, userId) {
        const { rows } = await db.query(
            'UPDATE expenses SET amount = $1, category = $2, description = $3, date = $4, spent_by_member_id = $5 WHERE id = $6 AND user_id = $7 RETURNING *',
            [amount, category, description, date, spent_by_member_id, id, userId]
        );
        return rows[0];
    }

    async deleteExpense(id, userId) {
        await db.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2', [id, userId]);
        return { message: 'Expense record deleted successfully' };
    }
}

module.exports = new ExpenseService();
