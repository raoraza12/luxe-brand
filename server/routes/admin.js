const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Protect all admin routes
router.use(verifyToken, isAdmin);

// --- PRODUCT MANAGEMENT ---
router.post('/products', async (req, res) => {
  try {
    const product = await req.prisma.product.create({ data: req.body });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const product = await req.prisma.product.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await req.prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- USER MANAGEMENT ---
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await req.prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await req.prisma.user.create({
      data: { name, email, password: hashedPassword, role }
    });
    res.status(201).json({ _id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await req.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, avatar: true, phone: true, createdAt: true }
    });
    // Add _id field for backwards compatibility if frontend expects it
    const formatted = users.map(u => ({...u, _id: u.id}));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const user = await req.prisma.user.update({
      where: { id: req.params.id },
      data: { role: req.body.role },
      select: { id: true, name: true, email: true, role: true }
    });
    res.json({...user, _id: user.id});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await req.prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- ORDER / PAYMENT / DELIVERY MANAGEMENT ---
router.get('/orders', async (req, res) => {
  try {
    const orders = await req.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/orders/:id', async (req, res) => {
  try {
    const { status, paymentStatus, refundedAmount } = req.body;
    
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    if (refundedAmount !== undefined) updateData.refundedAmount = Number(refundedAmount);

    const order = await req.prisma.order.update({
      where: { id: req.params.id },
      data: updateData
    });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/orders/:id', async (req, res) => {
  try {
    await req.prisma.order.delete({ where: { id: req.params.id } });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- COUPON MANAGEMENT ---
router.get('/coupons', async (req, res) => {
  try {
    const coupons = await req.prisma.coupon.findMany();
    // Add _id for backwards compatibility
    res.json(coupons.map(c => ({...c, _id: c.id})));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/coupons', async (req, res) => {
  try {
    const data = {...req.body};
    if (data.expirationDate) {
      data.expirationDate = new Date(data.expirationDate);
    }
    const coupon = await req.prisma.coupon.create({ data });
    res.status(201).json({...coupon, _id: coupon.id});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/coupons/:id', async (req, res) => {
  try {
    await req.prisma.coupon.delete({ where: { id: req.params.id } });
    res.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- DASHBOARD STATS ---
router.get('/stats', async (req, res) => {
  try {
    const [usersCount, productsCount, ordersCount] = await Promise.all([
      req.prisma.user.count(),
      req.prisma.product.count(),
      req.prisma.order.count()
    ]);

    const lowStockProducts = await req.prisma.product.findMany({
      where: { stock: { lt: 5 } },
      take: 5
    });

    const orders = await req.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    });

    const totalRevenueResult = await req.prisma.order.aggregate({
      where: { paymentStatus: 'paid' },
      _sum: { total: true }
    });
    
    const totalRevenue = totalRevenueResult._sum.total || 0;
    
    // Simulate Average Watchtime (Duration in minutes) for demo
    const avgWatchTime = (Math.random() * 10 + 5).toFixed(1); 

    res.json({ 
      usersCount, 
      productsCount, 
      ordersCount, 
      totalRevenue, 
      orders, 
      lowStockProducts,
      avgWatchTime 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
