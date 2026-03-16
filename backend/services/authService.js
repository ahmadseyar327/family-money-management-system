const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    async register({ email, password }) {
        const lowerEmail = email.toLowerCase();
        console.log('[AuthService] Register attempt for:', lowerEmail);
        
        // Check if user already exists
        console.log('[AuthService] Checking for existing user:', lowerEmail);
        const { rows: existing } = await db.query('SELECT id FROM users WHERE email = $1', [lowerEmail]);
        console.log('[AuthService] Existing users count:', existing.length);
        
        if (existing.length > 0) {
            console.log('[AuthService] Register failed: Email already exists');
            throw new Error('Email is already registered. Please login instead.');
        }

        const password_hash = await bcrypt.hash(password, 10);
        console.log('[AuthService] Creating user in database...');
        try {
            const { rows } = await db.query(
                'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
                [lowerEmail, password_hash]
            );
            console.log('[AuthService] User created successfully with ID:', rows[0].id);
            return rows[0];
        } catch (dbErr) {
            console.error('[AuthService] Database insert error:', dbErr);
            throw new Error(`Database error: ${dbErr.message}`);
        }
    }

    async login({ email, password }) {
        const lowerEmail = email.toLowerCase();
        console.log('[AuthService] Starting login for:', lowerEmail);
        try {
            console.log('[AuthService] Querying database for user...');
            const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [lowerEmail]);
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
