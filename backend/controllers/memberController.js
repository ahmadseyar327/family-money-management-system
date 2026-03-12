const memberService = require('../services/memberService');

exports.getAllMembers = async (req, res) => {
    try {
        const members = await memberService.getAllMembers(req.user.id);
        res.json(members);
    } catch (error) {
        console.error('Error in getAllMembers:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.createMember = async (req, res) => {
    try {
        const member = await memberService.createMember(req.body, req.user.id);
        res.status(201).json(member);
    } catch (error) {
        console.error('Error in createMember:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateMember = async (req, res) => {
    try {
        const member = await memberService.updateMember(req.params.id, req.body, req.user.id);
        res.json(member);
    } catch (error) {
        console.error('Error in updateMember:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMember = async (req, res) => {
    try {
        const result = await memberService.deleteMember(req.params.id, req.user.id);
        res.json(result);
    } catch (error) {
        console.error('Error in deleteMember:', error);
        res.status(500).json({ error: error.message });
    }
};
