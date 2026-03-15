const authService = require('../services/authService');

class AuthController {
    async register(req, res) {
        console.log('[AuthController] Register body:', req.body);
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }
            const user = await authService.register({ email, password });
            res.status(201).json(user);
        } catch (err) {
            console.error('[AuthController] Register error:', err.message);
            res.status(400).json({ error: err.message });
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
            console.error('Login error:', err.message);
            res.status(401).json({ error: err.message });
        }
    }

    async crash(req, res) {
        throw new Error('Test crash');
    }
}

module.exports = new AuthController();
