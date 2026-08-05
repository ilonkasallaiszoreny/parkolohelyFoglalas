import { Router } from 'express';
import { ReservationController } from '../controllers/reservationController';

const router = Router();

router.get('/', ReservationController.getReservations);
router.get('/:id', ReservationController.getReservationById);
router.post('/', ReservationController.createReservation);
router.delete('/:id', ReservationController.cancelReservation);

export default router;
