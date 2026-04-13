const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Attach Prisma to Req so routes can use it without importing everywhere
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Temporary Seed Route (Prisma version)
app.get('/api/seed-database', async (req, res) => {
  try {
    const products = [
      { name: 'Obsidian Slim Suit', slug: 'obsidian-slim-suit', description: 'Premium obsidian wool blend suit.', price: 28999, comparePrice: 35000, category: 'Men', subcategory: 'Suits', images: ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80'], sizes: ['S','M','L','XL','XXL'], colors: [{name:'Black',hex:'#1a1a1a'},{name:'Charcoal',hex:'#36454F'}], stock: 45, featured: true, bestseller: true, material: '80% Wool, 20% Polyester', care: 'Dry clean only' },
      { name: 'Ivory Linen Blazer', slug: 'ivory-linen-blazer', description: 'Breathable linen blazer.', price: 14999, comparePrice: 18500, category: 'Men', subcategory: 'Blazers', images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80'], sizes: ['S','M','L','XL'], colors: [{name:'Ivory',hex:'#FFFFF0'}], stock: 30, featured: true, newArrival: true, material: '100% Linen', care: 'Hand wash cold' }
    ];
    
    await prisma.product.deleteMany({});
    
    for (const p of products) {
      await prisma.product.create({ data: p });
    }

    res.json({ message: 'Supabase Database seeded successfully! ✨', count: products.length });
  } catch (err) {
    console.error(err);
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
