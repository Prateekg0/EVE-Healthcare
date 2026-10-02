import { Router } from 'express';
import { getCurrentUser, loginUser, signupUser } from '../controllers/authController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = Router();
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/me', isLoggedIn, getCurrentUser);

export default router;
