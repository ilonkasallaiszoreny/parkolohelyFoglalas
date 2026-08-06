import { Router } from 'express';
import { SpotController } from '../controllers/spotController';

const router = Router();

router.get('/', SpotController.getAllSpots);
router.get('/:id', SpotController.getSpotById);
router.get('/:id/reservations', SpotController.getSpotReservations);
router.post('/', SpotController.createSpot);

export default router;
