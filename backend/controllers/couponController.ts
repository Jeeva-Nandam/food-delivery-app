import { Request, Response } from 'express';
import { CouponModel } from '../models/Coupon';
import { connectDB, isConnected } from '../config/db';
import { INITIAL_COUPONS } from '../data/initialData';

let memoryCoupons: any[] = [...INITIAL_COUPONS];

/**
 * GET /api/coupons
 * List all active coupons
 */
export async function getCoupons(req: Request, res: Response) {
  try {
    await connectDB();
    if (isConnected()) {
      const coupons = await CouponModel.find({ isActive: true });
      return res.json({ success: true, count: coupons.length, data: coupons });
    }
    return res.json({ success: true, count: memoryCoupons.length, data: memoryCoupons });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * POST /api/coupons/validate
 * Validates a coupon code against order subtotal
 */
export async function validateCoupon(req: Request, res: Response) {
  try {
    await connectDB();
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const cleanCode = code.trim().toUpperCase();

    let coupon: any = null;
    if (isConnected()) {
      coupon = await CouponModel.findOne({ code: cleanCode, isActive: true });
    } else {
      coupon = memoryCoupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);
    }

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    if (subtotal < coupon.minOrder) {
      return res.status(400).json({
        success: false,
        message: `Requires minimum order value of ₹${coupon.minOrder}`,
      });
    }

    const rawDiscount = (subtotal * coupon.discountPercent) / 100;
    const discountAmount = Math.min(rawDiscount, coupon.maxDiscount);

    return res.json({
      success: true,
      message: `${coupon.code} applied successfully!`,
      data: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        maxDiscount: coupon.maxDiscount,
        discountAmount,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
