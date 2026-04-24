const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const newProducts = [
  {
    name: 'Emerald Evening Gown',
    slug: 'emerald-evening-gown',
    description: 'A breathtaking emerald green silk gown featuring a delicate trail and hand-embroidered details. Perfect for royal events.',
    price: 45000,
    comparePrice: 55000,
    category: 'Women',
    images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80'],
    sizes: ['S', 'M', 'L'],
    stock: 12,
    featured: true,
    tags: ['Luxury', 'Formal', 'Silk'],
    material: '100% Silk',
    care: 'Dry clean only'
  },
  {
    name: 'Royal Navy Tuxedo',
    slug: 'royal-navy-tuxedo',
    description: 'Precision-tailored slim fit tuxedo in royal navy blue. Features satin lapels and a signature gold lining.',
    price: 32000,
    comparePrice: 38000,
    category: 'Men',
    images: ['https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800&q=80'],
    sizes: ['M', 'L', 'XL'],
    stock: 8,
    bestseller: true,
    tags: ['Premium', 'Formal', 'Wedding'],
    material: 'Super 120s Wool',
    care: 'Professional dry clean'
  },
  {
    name: 'Cashmere Camel Coat',
    slug: 'cashmere-camel-coat',
    description: 'Ultra-soft cashmere blend coat in classic camel. A timeless piece for the modern sophisticated woman.',
    price: 28000,
    comparePrice: 35000,
    category: 'Women',
    images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80'],
    sizes: ['S', 'M', 'L'],
    stock: 15,
    newArrival: true,
    tags: ['Luxury', 'Winter', 'Cashmere'],
    material: 'Cashmere Blend',
    care: 'Dry clean only'
  },
  {
    name: 'Midnight Velvet Blazer',
    slug: 'midnight-velvet-blazer',
    description: 'Lustrous midnight blue velvet blazer. Features a sharp silhouette and custom gold buttons.',
    price: 18000,
    comparePrice: 22000,
    category: 'Men',
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80'],
    sizes: ['M', 'L', 'XL'],
    stock: 10,
    tags: ['Premium', 'Formal', 'Nightwear'],
    material: 'Premium Velvet',
    care: 'Hand wash cold or dry clean'
  },
  {
    name: 'Silk Heritage Scarf',
    slug: 'silk-heritage-scarf',
    description: 'Hand-painted silk scarf with traditional motifs. Can be worn as a necktie or a headwrap.',
    price: 4500,
    comparePrice: 6000,
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=800&q=80'],
    sizes: ['Free Size'],
    stock: 45,
    tags: ['Accessories', 'Silk', 'Hand-painted'],
    material: 'Pure Silk',
    care: 'Delicate wash'
  },
  {
    name: 'Golden Buckle Loafers',
    slug: 'golden-buckle-loafers',
    description: 'Handcrafted leather loafers with an iconic golden buckle. Designed for maximum comfort and style.',
    price: 12500,
    comparePrice: 15000,
    category: 'Men',
    images: ['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80'],
    sizes: ['8', '9', '10', '11'],
    stock: 20,
    bestseller: true,
    tags: ['Premium', 'Leather', 'Casual'],
    material: 'Full Grain Leather',
    care: 'Use leather conditioner'
  },
  {
    name: 'Kids Royal Sherwani',
    slug: 'kids-royal-sherwani',
    description: 'Elegant miniature sherwani for young princes. Features intricate thread work and comfortable inner lining.',
    price: 8500,
    comparePrice: 11000,
    category: 'Kids',
    images: ['https://images.unsplash.com/photo-1621454523226-eb4f5256af20?w=800&q=80'],
    sizes: ['4Y', '6Y', '8Y', '10Y'],
    stock: 15,
    newArrival: true,
    tags: ['Kids', 'Formal', 'Traditional'],
    material: 'Cotton Silk Blend',
    care: 'Hand wash'
  },
  {
    name: 'Pearl Embellished Clutch',
    slug: 'pearl-embellished-clutch',
    description: 'Handcrafted clutch with genuine pearl embellishments. A perfect companion for evening galas.',
    price: 7500,
    comparePrice: 9500,
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1566150905458-1bf1fd113f0d?w=800&q=80'],
    sizes: ['Free Size'],
    stock: 18,
    tags: ['Accessories', 'Luxury', 'Party'],
    material: 'Satin & Pearls',
    care: 'Wipe with soft cloth'
  }
];

async function seed() {
  console.log('📦 Adding Premium Product Inventory...');
  
  for (const p of newProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p
    });
  }
  
  console.log('✅ Inventory updated with high-fashion pieces.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
