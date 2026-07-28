const MenuItem = require('../models/MenuItem');

// GET /api/restaurants/:restaurantId/menu
async function getMenuForRestaurant(req, res, next) {
  try {
    const menu = await MenuItem.find({
      restaurant: req.params.restaurantId,
      isAvailable: true
    });
    res.json(menu);
  } catch (err) {
    next(err);
  }
}

// POST /api/restaurants/:restaurantId/menu  (admin)
async function addMenuItem(req, res, next) {
  try {
    const item = await MenuItem.create({
      ...req.body,
      restaurant: req.params.restaurantId
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

// PUT /api/menu/:id  (admin)
async function updateMenuItem(req, res, next) {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/menu/:id  (admin)
async function deleteMenuItem(req, res, next) {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Menu item removed' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMenuForRestaurant, addMenuItem, updateMenuItem, deleteMenuItem };
