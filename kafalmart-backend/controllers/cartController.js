const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');

// GET /api/cart
async function getCart(req, res, next) {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

// POST /api/cart/items  { menuItemId, quantity }
async function addItem(req, res, next) {
  try {
    const { menuItemId, quantity = 1 } = req.body;
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        restaurant: menuItem.restaurant,
        items: []
      });
    }

    // Enforce single-restaurant cart, like most food delivery apps
    if (cart.restaurant && String(cart.restaurant) !== String(menuItem.restaurant) && cart.items.length > 0) {
      return res.status(409).json({
        message: 'Your cart has items from another restaurant. Clear the cart to order from here instead.'
      });
    }
    cart.restaurant = menuItem.restaurant;

    const existing = cart.items.find((i) => String(i.menuItem) === String(menuItemId));
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    next(err);
  }
}

// PUT /api/cart/items/:menuItemId  { quantity }
async function updateItem(req, res, next) {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find((i) => String(i.menuItem) === req.params.menuItemId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => String(i.menuItem) !== req.params.menuItemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cart/items/:menuItemId
async function removeItem(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((i) => String(i.menuItem) !== req.params.menuItemId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cart
async function clearCart(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.restaurant = undefined;
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
