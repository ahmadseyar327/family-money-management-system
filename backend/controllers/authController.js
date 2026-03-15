const authService = require('../services/authService');

class AuthController {
    async register(req, res) {
        try {
            const user = await authService.register(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async login(req, res) {
        console.log('Login attempt for:', req.body.email);
        try {
            const data = await authService.login(req.body);
            console.log('Login successful for:', req.body.email);
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
