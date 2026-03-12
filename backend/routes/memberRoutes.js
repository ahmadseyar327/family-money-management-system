const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', memberController.getAllMembers);
router.post('/', memberController.createMember);
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);

module.exports = router;
