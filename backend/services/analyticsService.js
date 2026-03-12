const db = require('../config/db');

class AnalyticsService {
    async getSummary(userId, month, year) {
        let incomeQuery = 'SELECT COALESCE(SUM(amount), 0) as total_income FROM income WHERE user_id = $1';
        let expenseQuery = 'SELECT COALESCE(SUM(amount), 0) as total_expense FROM expenses WHERE user_id = $1';
        const params = [userId];

        if (month && year) {
            incomeQuery += ' AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3';
            expenseQuery += ' AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3';
            params.push(month, year);
        }

        const [incomeRes, expenseRes] = await Promise.all([
            db.query(incomeQuery, params),
            db.query(expenseQuery, params)
        ]);

        const totalIncome = parseFloat(incomeRes.rows[0].total_income);
        const totalExpense = parseFloat(expenseRes.rows[0].total_expense);
        const balance = totalIncome - totalExpense;

        return {
            totalIncome,
            totalExpense,
            balance
        };
    }

    async getMemberSpending(userId, month, year) {
        let query = `
      SELECT m.name, COALESCE(SUM(e.amount), 0) as total_spent
      FROM members m
      LEFT JOIN expenses e ON m.id = e.spent_by_member_id
    `;
        const params = [userId];

        if (month && year) {
            query += ' AND EXTRACT(MONTH FROM e.date) = $2 AND EXTRACT(YEAR FROM e.date) = $3';
            params.push(month, year);
        }

        query += ' WHERE m.user_id = $1 GROUP BY m.id, m.name';

        const { rows } = await db.query(query, params);
        return rows;
    }

    async getMonthlySummary(userId, year) {
        let query = `
      SELECT 
        TO_CHAR(date, 'YYYY-MM') as month,
        SUM(amount) as total_spent
      FROM expenses
      WHERE user_id = $1
    `;
        const params = [userId];
        if (year) {
            query += ' AND EXTRACT(YEAR FROM date) = $2';
            params.push(year);
        }
        query += ' GROUP BY month ORDER BY month ASC';

        const { rows } = await db.query(query, params);
        return rows;
    }

    async getExpensesByCategory(userId, month, year) {
        let query = `
      SELECT category, SUM(amount) as value
      FROM expenses
      WHERE user_id = $1
    `;
        const params = [userId];
        if (month && year) {
            query += ' AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3';
            params.push(month, year);
        }
        query += ' GROUP BY category';

        const { rows } = await db.query(query, params);
        return rows;
    }
}

module.exports = new AnalyticsService();
