const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed'
    },
    whatsappLink: { type: String } // pre-built wa.me link with order summary
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
