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
        try {
            const data = await authService.login(req.body);
            res.json(data);
        } catch (err) {
            res.status(401).json({ error: err.message });
        }
    }
}

module.exports = new AuthController();
