import { Router, Request, Response } from 'express';
import { adminLogin } from '../controllers/authController';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from '../controllers/productController';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} from '../controllers/categoryController';
import { getAllOrders, updateOrderStatus } from '../controllers/orderController';
import { getSettings, updateSettings } from '../controllers/settingController';
import { OrderModel } from '../models/Order';
import { ProductModel } from '../models/Product';
import { connectDB, isConnected } from '../config/db';
import { INITIAL_ORDERS, INITIAL_PRODUCTS } from '../data/initialData';

const router = Router();

// Admin Authentication
router.post('/login', adminLogin);

// Admin Products CRUD
router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Admin Categories CRUD
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Admin Orders Management
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// Admin Store Settings
router.get('/settings', getSettings);
router.patch('/settings', updateSettings);

// Admin Dashboard Summary Stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    await connectDB();

    let totalRevenue = 0;
    let totalOrders = 0;
    let newOrdersCount = 0;
    let lowStockCount = 0;

    if (isConnected()) {
      const orders = await OrderModel.find({});
      totalOrders = orders.length;
      totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
      newOrdersCount = orders.filter(o => o.status === 'New').length;

      const products = await ProductModel.find({});
      lowStockCount = products.filter(p => p.stock < 15).length;
    } else {
      totalOrders = INITIAL_ORDERS.length;
      totalRevenue = INITIAL_ORDERS.reduce((sum, ord) => sum + ord.total, 0);
      newOrdersCount = INITIAL_ORDERS.filter(o => o.status === 'New').length;
      lowStockCount = INITIAL_PRODUCTS.filter(p => p.stock < 15).length;
    }

    return res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        newOrdersCount,
        lowStockCount,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
