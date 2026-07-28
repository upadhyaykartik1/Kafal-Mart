const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// GET /api/restaurants?category=food
async function getRestaurants(req, res, next) {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;

    const restaurants = await Restaurant.find(filter).sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (err) {
    next(err);
  }
}

// GET /api/restaurants/:id
async function getRestaurantById(req, res, next) {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const menu = await MenuItem.find({ restaurant: restaurant._id, isAvailable: true });
    res.json({ ...restaurant.toObject(), menu });
  } catch (err) {
    next(err);
  }
}

// POST /api/restaurants  (admin)
async function createRestaurant(req, res, next) {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (err) {
    next(err);
  }
}

// PUT /api/restaurants/:id  (admin)
async function updateRestaurant(req, res, next) {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/restaurants/:id  (admin)
async function deleteRestaurant(req, res, next) {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json({ message: 'Restaurant removed' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
};
