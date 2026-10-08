import { Request, Response } from 'express';
import {
  createPaymentOrder as createGatewayOrder,
  verifyPaymentSignature,
  getClientPaymentConfig,
} from '../services/paymentGateway';
import { OrderModel } from '../models/Order';
import { connectDB, isConnected } from '../config/db';

/**
 * GET /api/payment/config
 * Returns active gateway configuration (e.g. Razorpay Key ID or Cashfree mode)
 */
export async function getPaymentConfig(req: Request, res: Response) {
  try {
    const config = getClientPaymentConfig();
    return res.json({ success: true, data: config });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * POST /api/payment/create-order
 * Create a payment order via Razorpay / Cashfree / Mock
 */
export async function createPayment(req: Request, res: Response) {
  try {
    const { orderNumber, amount, customerName, customerEmail, customerPhone } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment amount' });
    }

    const result = await createGatewayOrder({
      orderNumber: orderNumber || `#MHF-${Date.now()}`,
      amount,
      customerName: customerName || 'Valued Guest',
      customerEmail: customerEmail || 'guest@miras.com',
      customerPhone: customerPhone || '9845277120',
    });

    return res.json({ success: true, data: result });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * POST /api/payment/verify
 * Verify payment signature and mark order as PAID
 */
export async function verifyPayment(req: Request, res: Response) {
  try {
    await connectDB();
    const { gateway, gatewayOrderId, gatewayPaymentId, gatewaySignature, orderNumber } = req.body;

    const isValid = verifyPaymentSignature({
      gateway: gateway || 'mock',
      gatewayOrderId,
      gatewayPaymentId,
      gatewaySignature,
    });

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Update order in database if orderNumber is provided
    if (orderNumber && isConnected()) {
      await OrderModel.findOneAndUpdate(
        { orderNumber },
        {
          paymentStatus: 'PAID',
          gatewayOrderId,
          gatewayPaymentId,
          gatewaySignature,
          paidAt: new Date(),
        }
      );
    }

    return res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderNumber,
        gatewayPaymentId,
        paymentStatus: 'PAID',
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
