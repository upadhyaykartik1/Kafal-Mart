const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    tags: [{ type: String }] // e.g. ["veg", "bestseller", "spicy"]
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
