import { Router } from 'express';
import { processMockPayment, receivePaymentWebhook } from '../controllers/paymentController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = Router();
router.post('/', isLoggedIn, processMockPayment);
router.post('/webhook', receivePaymentWebhook);

export default router;
