const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    category: { type: String, enum: ['food', 'grocery'], default: 'food' },
    address: { type: String, required: true, trim: true },
    openingTime: { type: String, default: '9:30 AM' },
    closingTime: { type: String, default: '10:00 PM' },
    imageUrl: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
