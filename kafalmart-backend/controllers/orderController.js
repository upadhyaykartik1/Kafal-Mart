const Order = require('../models/Order');
const Cart = require('../models/Cart');

function buildWhatsAppLink(order, customerName) {
  const lines = order.items.map((i) => `${i.quantity} x ${i.name} - Rs.${i.price * i.quantity}`);
  const message = [
    `New order from ${customerName}`,
    ...lines,
    `Total: Rs.${order.total}`,
    `Deliver to: ${order.deliveryAddress}`
  ].join('\n');

  const number = process.env.WHATSAPP_NUMBER || '';
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

// POST /api/orders  { deliveryAddress }
async function placeOrder(req, res, next) {
  try {
    const { deliveryAddress } = req.body;
    if (!deliveryAddress) {
      return res.status(400).json({ message: 'Delivery address is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      restaurant: cart.restaurant,
      items: cart.items,
      total,
      deliveryAddress
    });

    order.whatsappLink = buildWhatsAppLink(order, req.user.name);
    await order.save();

    // Clear the cart after the order is placed
    cart.items = [];
    cart.restaurant = undefined;
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders  (current user's orders)
async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:id
async function getOrderById(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (String(order.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}

// PUT /api/orders/:id/status  { status }  (admin)
async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = { placeOrder, getMyOrders, getOrderById, updateOrderStatus };
