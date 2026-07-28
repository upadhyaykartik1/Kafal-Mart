const express = require('express');
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // every order route requires login

router.post('/', placeOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', adminOnly, updateOrderStatus);

module.exports = router;
