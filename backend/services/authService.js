const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    async register({ email, password }) {
        const password_hash = await bcrypt.hash(password, 10);
        const { rows } = await db.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
            [email, password_hash]
        );
        return rows[0];
    }

    async login({ email, password }) {
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '24h' }
        );

        return {
            user: { id: user.id, email: user.email },
            token
        };
    }
}

module.exports = new AuthService();
