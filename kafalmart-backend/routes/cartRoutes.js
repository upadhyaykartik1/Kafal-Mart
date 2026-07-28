const express = require('express');
const { getCart, addItem, updateItem, removeItem, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // every cart route requires login

router.get('/', getCart);
router.post('/items', addItem);
router.put('/items/:menuItemId', updateItem);
router.delete('/items/:menuItemId', removeItem);
router.delete('/', clearCart);

module.exports = router;
