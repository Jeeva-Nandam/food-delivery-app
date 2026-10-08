import { Router } from 'express';
import {
  createOrder,
  getOrderByIdOrNumber,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController';

const router = Router();

// Storefront routes
router.post('/', createOrder);
router.get('/:orderNumber', getOrderByIdOrNumber);

// Admin routes
router.get('/', getAllOrders);
router.patch('/:id/status', updateOrderStatus);

export default router;
