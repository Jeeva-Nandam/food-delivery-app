import { Request, Response } from 'express';
import { OrderModel } from '../models/Order';
import { connectDB, isConnected } from '../config/db';
import { INITIAL_ORDERS } from '../data/initialData';
import { createPaymentOrder } from '../services/paymentGateway';

let memoryOrders: any[] = [...INITIAL_ORDERS];

async function ensureOrdersSeeded() {
  if (isConnected()) {
    const count = await OrderModel.countDocuments();
    if (count === 0) {
      console.log('🌱 [MongoDB] Seeding initial orders into MongoDB collection...');
      await OrderModel.insertMany(INITIAL_ORDERS);
      console.log('✅ [MongoDB] Orders seeded successfully.');
    }
  }
}

/**
 * POST /api/orders
 * Create and place a new order
 */
export async function createOrder(req: Request, res: Response) {
  try {
    await connectDB();
    const orderData = req.body;

    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    if (!orderData.deliveryAddress) {
      return res.status(400).json({ success: false, message: 'Delivery address is required' });
    }

    // Determine sequence number
    let orderCount = 0;
    if (isConnected()) {
      orderCount = await OrderModel.countDocuments();
    } else {
      orderCount = memoryOrders.length;
    }

    const nextNum = 8822 + orderCount;
    const orderNumber = orderData.orderNumber || `#MHF-${nextNum}`;
    const id = orderData.id || `ord-${Date.now()}`;
    const trackingId = orderData.trackingId || `BD-EXP-${Math.floor(10000 + Math.random() * 90000)}`;

    const paymentMethod = orderData.paymentMethod || 'UPI';
    const isOnlinePayment = paymentMethod === 'UPI' || paymentMethod === 'Card' || paymentMethod === 'NetBanking';

    // Initiate payment gateway order (Razorpay / Cashfree / Mock)
    const paymentResult = await createPaymentOrder({
      orderNumber,
      amount: orderData.total || 0,
      customerName: orderData.customerName || 'Customer',
      customerEmail: orderData.customerEmail || 'customer@miras.com',
      customerPhone: orderData.customerPhone || '9845277120',
    });

    const newOrder = {
      ...orderData,
      id,
      orderNumber,
      trackingId,
      status: 'New',
      paymentMethod,
      paymentGateway: paymentResult.gateway,
      paymentStatus: isOnlinePayment ? 'PAID' : 'PENDING',
      paymentDetails: orderData.paymentDetails || `${paymentMethod} Verified`,
      gatewayOrderId: paymentResult.gatewayOrderId,
      paidAt: isOnlinePayment ? new Date() : undefined,
      isGIDirect: true,
      createdAt: new Date(),
    };

    if (isConnected()) {
      const created = await OrderModel.create(newOrder);
      return res.status(201).json({
        success: true,
        data: created,
        paymentGateway: paymentResult,
      });
    }

    memoryOrders.unshift(newOrder);
    return res.status(201).json({
      success: true,
      data: newOrder,
      paymentGateway: paymentResult,
    });
  } catch (err: any) {
    console.error('Error creating order:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * GET /api/orders/:orderNumber
 * Lookup order details by order number (e.g. #MHF-8821 or MHF-8821) or trackingId
 */
export async function getOrderByIdOrNumber(req: Request, res: Response) {
  try {
    await connectDB();
    const rawParam = decodeURIComponent(req.params.orderNumber).trim();
    const cleanParam = rawParam.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    if (isConnected()) {
      await ensureOrdersSeeded();

      // Flexible search regex
      const orders = await OrderModel.find({});
      const matched = orders.find(o => {
        const normNum = o.orderNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const normId = o.id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const normTrack = (o.trackingId || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        return (
          normNum === cleanParam ||
          normId === cleanParam ||
          normTrack === cleanParam ||
          normNum.endsWith(cleanParam) ||
          cleanParam.endsWith(normNum)
        );
      });

      if (!matched) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      return res.json({ success: true, data: matched });
    }

    const matched = memoryOrders.find(o => {
      const normNum = o.orderNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const normId = o.id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const normTrack = (o.trackingId || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      return (
        normNum === cleanParam ||
        normId === cleanParam ||
        normTrack === cleanParam ||
        normNum.endsWith(cleanParam) ||
        cleanParam.endsWith(normNum)
      );
    });

    if (!matched) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, data: matched });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * GET /api/admin/orders
 * Admin lists all orders with search and status filtering
 */
export async function getAllOrders(req: Request, res: Response) {
  try {
    await connectDB();
    const { status, search } = req.query;

    if (isConnected()) {
      await ensureOrdersSeeded();

      const query: any = {};
      if (status && typeof status === 'string' && status !== 'All') {
        query.status = status;
      }
      if (search && typeof search === 'string' && search.trim()) {
        const q = search.trim();
        query.$or = [
          { orderNumber: { $regex: q, $options: 'i' } },
          { customerName: { $regex: q, $options: 'i' } },
          { customerPhone: { $regex: q, $options: 'i' } },
          { customerEmail: { $regex: q, $options: 'i' } },
        ];
      }

      const orders = await OrderModel.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    }

    let results = [...memoryOrders];
    if (status && typeof status === 'string' && status !== 'All') {
      results = results.filter(o => o.status === status);
    }
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter(
        o =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q)
      );
    }

    return res.json({ success: true, count: results.length, data: results });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * PATCH /api/admin/orders/:id/status
 * Admin updates order fulfillment status
 */
export async function updateOrderStatus(req: Request, res: Response) {
  try {
    await connectDB();
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['New', 'Preparing', 'Dispatched', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    if (isConnected()) {
      const updated = await OrderModel.findOneAndUpdate({ id }, { status }, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      return res.json({ success: true, data: updated });
    }

    const index = memoryOrders.findIndex(o => o.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    memoryOrders[index].status = status;
    return res.json({ success: true, data: memoryOrders[index] });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
