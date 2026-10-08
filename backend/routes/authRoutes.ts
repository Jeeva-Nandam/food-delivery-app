import { Router } from 'express';
import { adminLogin, customerLogin } from '../controllers/authController';

const router = Router();

router.post('/login', adminLogin);
router.post('/admin-login', adminLogin);
router.post('/customer-login', customerLogin);

export default router;
