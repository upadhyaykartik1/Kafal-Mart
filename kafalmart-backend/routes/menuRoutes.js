const express = require('express');
const { updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.put('/:id', protect, adminOnly, updateMenuItem);
router.delete('/:id', protect, adminOnly, deleteMenuItem);

module.exports = router;
