import { Router } from 'express';
import {
  createPayment,
  verifyPayment,
  getPaymentConfig,
} from '../controllers/paymentController';

const router = Router();

router.get('/config', getPaymentConfig);
router.post('/create-order', createPayment);
router.post('/verify', verifyPayment);

export default router;
