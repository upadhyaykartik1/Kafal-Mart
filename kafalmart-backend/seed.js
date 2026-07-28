require('dotenv').config();
const connectDB = require('./config/db');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

const restaurants = [
  {
    name: 'Bhojan Mahal',
    description: 'Home-style thalis and North Indian favourites.',
    category: 'food',
    address: 'Near Thana Kotwali, Pithoragarh',
    openingTime: '9:30 AM',
    closingTime: '10:00 PM'
  },
  {
    name: 'PFC Food',
    description: 'Fried chicken, burgers and fast food.',
    category: 'food',
    address: 'Near Raja Hotel, Pithoragarh',
    openingTime: '9:30 AM',
    closingTime: '10:00 PM'
  },
  {
    name: 'Hot Meal',
    description: 'Quick, hot meals for lunch and dinner.',
    category: 'food',
    address: 'Cantt Road, Pithoragarh',
    openingTime: '9:30 AM',
    closingTime: '10:00 PM'
  }
];

async function seed() {
  await connectDB();

  await MenuItem.deleteMany({});
  await Restaurant.deleteMany({});

  const created = await Restaurant.insertMany(restaurants);
  console.log(`Seeded ${created.length} restaurants`);

  const sampleMenu = [
    { restaurant: created[0]._id, name: 'Veg Thali', price: 140, description: 'Dal, sabzi, rice, roti and salad', tags: ['veg', 'bestseller'] },
    { restaurant: created[0]._id, name: 'Paneer Butter Masala', price: 160, description: 'Served with 2 tandoori rotis', tags: ['veg'] },
    { restaurant: created[1]._id, name: 'Chicken Burger', price: 120, description: 'Crispy fried chicken burger', tags: ['bestseller'] },
    { restaurant: created[1]._id, name: 'French Fries', price: 80, description: 'Salted, crispy fries', tags: ['veg'] },
    { restaurant: created[2]._id, name: 'Egg Curry with Rice', price: 110, description: 'Two eggs, curry, steamed rice' }
  ];

  await MenuItem.insertMany(sampleMenu);
  console.log(`Seeded ${sampleMenu.length} menu items`);

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
