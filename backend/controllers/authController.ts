import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { connectDB, isConnected } from '../config/db';
import { INITIAL_USER } from '../data/initialData';

/**
 * POST /api/admin/login
 * Authenticates admin portal with default credentials Jeeva@admin / adminadmin
 */
export async function adminLogin(req: Request, res: Response) {
  try {
    const rawIdentifier = (req.body.username || req.body.email || '').trim();
    const { password } = req.body;

    if (!rawIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username or email and password are required',
      });
    }

    const cleanUsername = rawIdentifier.toLowerCase();
    const isAuthorized = cleanUsername === 'jeeva@admin' && password === 'adminadmin';

    if (!isAuthorized) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials. Use default: Jeeva@admin / adminadmin',
      });
    }

    const adminUser = {
      id: 'usr-admin-jeeva',
      name: 'Jeeva',
      email: 'Jeeva@admin',
      role: 'admin',
      isVerified: true,
      token: `admin-token-${Date.now()}`,
    };

    return res.json({
      success: true,
      message: 'Admin authenticated successfully',
      data: adminUser,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * POST /api/auth/customer-login
 * Handles customer authentication (Google, OTP, or Guest)
 */
export async function customerLogin(req: Request, res: Response) {
  try {
    await connectDB();
    const { type, email, phone, name } = req.body;

    const userProfile = {
      id: `usr-${Date.now()}`,
      name: name || (type === 'guest' ? 'Valued Guest' : 'Ananya Sharma'),
      email: email || 'ananya.sharma@gmail.com',
      phone: phone || '+91 98452 77120',
      role: 'customer',
      isVerified: type !== 'guest',
      rewardCoins: type === 'guest' ? 0 : 50,
      totalOrders: 1,
      totalSpent: 0,
      addresses: INITIAL_USER.addresses,
    };

    if (isConnected()) {
      const existing = await UserModel.findOne({ email: userProfile.email });
      if (existing) {
        return res.json({ success: true, data: existing });
      }
      const created = await UserModel.create(userProfile);
      return res.json({ success: true, data: created });
    }

    return res.json({ success: true, data: userProfile });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
