import { Router } from 'express';
import { cancelBooking, createBooking, getMyBookings } from '../controllers/bookingController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = Router();
router.use(isLoggedIn);
router.get('/', getMyBookings);
router.post('/', createBooking);
router.patch('/:id/cancel', cancelBooking);

export default router;
