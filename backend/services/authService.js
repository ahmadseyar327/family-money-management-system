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
        console.log('[AuthService] Starting login for:', email);
        try {
            console.log('[AuthService] Querying database for user...');
            const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = rows[0];
            console.log('[AuthService] User found:', !!user);

            if (!user) {
                console.log('[AuthService] User not found');
                throw new Error('Invalid email or password');
            }

            console.log('[AuthService] Comparing password...');
            const isMatch = await bcrypt.compare(password, user.password_hash);
            console.log('[AuthService] Password match:', isMatch);

            if (!isMatch) {
                console.log('[AuthService] Password mismatch');
                throw new Error('Invalid email or password');
            }

            console.log('[AuthService] Signing JWT...');
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || 'your_jwt_secret',
                { expiresIn: '24h' }
            );
            console.log('[AuthService] Login successful');

            return {
                user: { id: user.id, email: user.email },
                token
            };
        } catch (err) {
            console.error('[AuthService] Error in login:', err);
            throw err;
        }
    }
}

module.exports = new AuthService();
