const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const app = express();

// Connect DB helper
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Error:', err);
  }
};

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Ensure DB is connected before every request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Temporary Seed Route
app.get('/api/seed-database', async (req, res) => {
  try {
    const products = [
      { name: 'Obsidian Slim Suit', slug: 'obsidian-slim-suit', description: 'A masterfully tailored slim-fit suit in premium obsidian wool blend. Perfect for boardrooms and black-tie events.', price: 28999, comparePrice: 35000, category: 'Men', subcategory: 'Suits', images: ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80'], sizes: ['S','M','L','XL','XXL'], colors: [{name:'Black',hex:'#1a1a1a'},{name:'Charcoal',hex:'#36454F'}], stock: 45, featured: true, bestseller: true, material: '80% Wool, 20% Polyester', care: 'Dry clean only', tags: ['suit','formal','premium'], rating: 4.8, numReviews: 124 },
      { name: 'Ivory Linen Blazer', slug: 'ivory-linen-blazer', description: 'Breathable linen blazer for sophisticated summer looks. Crafted with Italian linen for ultimate comfort.', price: 14999, comparePrice: 18500, category: 'Men', subcategory: 'Blazers', images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80'], sizes: ['S','M','L','XL'], colors: [{name:'Ivory',hex:'#FFFFF0'},{name:'Beige',hex:'#F5F5DC'}], stock: 30, featured: true, newArrival: true, material: '100% Linen', care: 'Hand wash cold', tags: ['blazer','summer','linen'], rating: 4.6, numReviews: 87 },
      { name: 'Midnight Oxford Shirt', slug: 'midnight-oxford-shirt', description: 'Classic Oxford weave shirt in deep midnight blue. Versatile enough for casual and semi-formal occasions.', price: 5499, comparePrice: 7000, category: 'Men', subcategory: 'Shirts', images: ['https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'], sizes: ['S','M','L','XL','XXL','XXXL'], colors: [{name:'Navy',hex:'#000080'},{name:'White',hex:'#FFFFFF'},{name:'Slate',hex:'#708090'}], stock: 100, bestseller: true, material: '100% Cotton', care: 'Machine wash cold', tags: ['shirt','oxford','casual'], rating: 4.7, numReviews: 203 },
      { name: 'Celestial Silk Dress', slug: 'celestial-silk-dress', description: 'Flowing silk midi dress with celestial print. A breathtaking statement piece for special occasions.', price: 18999, comparePrice: 24000, category: 'Women', subcategory: 'Dresses', images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80'], sizes: ['XS','S','M','L','XL'], colors: [{name:'Emerald',hex:'#50C878'},{name:'Sapphire',hex:'#0F52BA'},{name:'Rose Gold',hex:'#B76E79'}], stock: 35, featured: true, bestseller: true, material: '100% Pure Silk', care: 'Dry clean only', tags: ['dress','silk','formal','luxury'], rating: 4.9, numReviews: 187 },
      { name: 'Golden Hour Maxi Dress', slug: 'golden-hour-maxi-dress', description: 'Stunning maxi dress in rich golden tones perfect for evening events and beach outings alike.', price: 12499, comparePrice: 16000, category: 'Women', subcategory: 'Dresses', images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80'], sizes: ['XS','S','M','L','XL'], colors: [{name:'Gold',hex:'#FFD700'},{name:'Sunset',hex:'#FF4500'},{name:'Coral',hex:'#FF6B6B'}], stock: 50, newArrival: true, featured: true, material: 'Georgette', care: 'Hand wash', tags: ['maxi','evening','summer'], rating: 4.7, numReviews: 142 },
      { name: 'Artisan Leather Tote', slug: 'artisan-leather-tote', description: 'Hand-stitched full-grain leather tote bag. Spacious, structured and effortlessly luxurious.', price: 26999, comparePrice: 35000, category: 'Accessories', subcategory: 'Bags', images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80'], sizes: ['Free Size'], colors: [{name:'Cognac',hex:'#9A4522'},{name:'Black',hex:'#1a1a1a'},{name:'Tan',hex:'#D2B48C'}], stock: 25, featured: true, bestseller: true, material: 'Full-Grain Leather', care: 'Leather conditioner recommended', tags: ['bag','leather','tote','luxury'], rating: 4.9, numReviews: 143 }
    ];
    await Product.deleteMany({});
    await Product.insertMany(products);
    res.json({ message: 'Database seeded successfully! ✨', count: products.length });
  } catch (err) {
    res.status(500).json({ message: 'Seeding failed', error: err.message });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'LUXE Brand API Running ✨', status: 'OK' });
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
});

// Start server locally (not on Vercel)
const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// Export for Vercel Serverless
module.exports = app;
