// backend/seedProducts.js
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./src/models/product');

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not defined in environment');
    }
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');

    // Read products JSON
    const filePath = path.join(__dirname, 'src', 'data', 'products.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const items = JSON.parse(raw);

    // Map data to model schema
    const docs = items.map(item => ({
      name: item.name,
      description: item.description || '',
      price: item.priceCents / 100,
      imageUrl: item.image,
      rating: {
        stars: item.rating?.stars || 0,
        count: item.rating?.count || 0
      }
    }));

    // Clear existing documents and insert new ones
    await Product.deleteMany({});
    const inserted = await Product.insertMany(docs);
    console.log(`Inserted ${inserted.length} products`);
  } catch (err) {
    console.error('Error seeding products:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

seed(); 