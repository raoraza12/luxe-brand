const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Create order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, shippingFee, discount, total } = req.body;
    
    const formattedItems = items.map(item => ({
      productId: item.product, // _id from frontend
      name: item.name,
      image: item.image,
      price: Number(item.price),
      quantity: Number(item.quantity) || 1,
      size: item.size || null,
      color: item.color || null
    }));

    const order = await req.prisma.order.create({
      data: {
        userId: req.user.id,
        shippingAddress,
        paymentMethod,
        subtotal: Number(subtotal),
        shippingFee: Number(shippingFee),
        discount: Number(discount),
        total: Number(total),
        items: {
          create: formattedItems
        }
      },
      include: { items: true }
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my orders
router.get('/mine', verifyToken, async (req, res) => {
  try {
    const orders = await req.prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: { select: { name: true, images: true } } }
        }
      }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single order
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await req.prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { name: true, email: true } },
        items: true
      }
    });
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status (admin)
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const order = await req.prisma.order.update({
      where: { id: req.params.id },
      data: { status: req.body.status }
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all orders (admin)
router.get('/', verifyToken, isAdmin, async (req, res) => {
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

module.exports = router;
