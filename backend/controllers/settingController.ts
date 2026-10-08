import { Request, Response } from 'express';
import { SettingModel } from '../models/Setting';
import { connectDB, isConnected } from '../config/db';

const defaultSettings = {
  key: 'store_config',
  isAcceptingOrders: true,
  freeShippingThreshold: 699,
  flatShippingRate: 80,
  announcementText:
    'Authentic Regional Indian Delicacies • Fresh Batches Dispatched Daily • Free Shipping on Orders above ₹699 • 100% Traditional & Preservative-Free',
};

let memorySettings = { ...defaultSettings };

/**
 * GET /api/settings
 * Get current store configurations
 */
export async function getSettings(req: Request, res: Response) {
  try {
    await connectDB();
    if (isConnected()) {
      let settings = await SettingModel.findOne({ key: 'store_config' });
      if (!settings) {
        settings = await SettingModel.create(defaultSettings);
      }
      return res.json({ success: true, data: settings });
    }
    return res.json({ success: true, data: memorySettings });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * PATCH /api/admin/settings
 * Admin updates store settings (toggle accepting orders, shipping threshold)
 */
export async function updateSettings(req: Request, res: Response) {
  try {
    await connectDB();
    const updates = req.body;

    if (isConnected()) {
      const updated = await SettingModel.findOneAndUpdate(
        { key: 'store_config' },
        { ...updates },
        { new: true, upsert: true }
      );
      return res.json({ success: true, data: updated });
    }

    memorySettings = { ...memorySettings, ...updates };
    return res.json({ success: true, data: memorySettings });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
