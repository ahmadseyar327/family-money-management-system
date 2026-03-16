const authService = require('../services/authService');

class AuthController {
    async register(req, res) {
        console.log('[AuthController] Register body:', req.body);
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                console.log('[AuthController] Register failed: Missing email or password');
                return res.status(400).json({ error: 'Email and password are required' });
            }
            const user = await authService.register({ email, password });
            res.status(201).json(user);
        } catch (err) {
            console.error('[AuthController] Register error:', err);
            // Handle database connection errors specifically
            if (err.code === 'ENETUNREACH' || err.code === 'ECONNREFUSED' || err.syscall === 'connect') {
                return res.status(503).json({ error: 'Database connection failed. Please check your Supabase/Render networking.' });
            }
            // Return specific error message for debugging (e.g., "Email already exists")
            res.status(400).json({ 
                error: err.message, 
                details: process.env.NODE_ENV === 'development' ? err.stack : undefined 
            });
        }
    }

    async login(req, res) {
        console.log('[AuthController] Login body:', req.body);
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }
            const data = await authService.login({ email, password });
            console.log('Login successful for:', email);
            res.json(data);
        } catch (err) {
            console.error('[AuthController] Login error:', err);
            // Handle database connection errors specifically
            if (err.code === 'ENETUNREACH' || err.code === 'ECONNREFUSED' || err.syscall === 'connect') {
                return res.status(503).json({ error: 'Database connection failed. Please check your Supabase/Render networking.' });
            }
            res.status(401).json({ error: err.message });
        }
    }

    async crash(req, res) {
        throw new Error('Test crash');
    }
}

module.exports = new AuthController();
