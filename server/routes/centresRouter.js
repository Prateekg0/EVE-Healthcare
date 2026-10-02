import { Router } from 'express';
import { getCentreById, getCentres } from '../controllers/centreController.js';

const router = Router();
router.get('/', getCentres);
router.get('/:id', getCentreById);

export default router;
