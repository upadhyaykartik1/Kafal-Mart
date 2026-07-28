const express = require('express');
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/restaurantController');
const { getMenuForRestaurant, addMenuItem } = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', protect, adminOnly, createRestaurant);
router.put('/:id', protect, adminOnly, updateRestaurant);
router.delete('/:id', protect, adminOnly, deleteRestaurant);

// nested menu endpoints
router.get('/:restaurantId/menu', getMenuForRestaurant);
router.post('/:restaurantId/menu', protect, adminOnly, addMenuItem);

module.exports = router;
