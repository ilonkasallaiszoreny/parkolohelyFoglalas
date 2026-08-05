import { Request, Response, NextFunction } from 'express';
import { ReservationService, ReservationError } from '../services/reservationService';
import { ReservationStatus } from '../types';

export class ReservationController {
  static async createReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await ReservationService.createReservation(req.body);
      res.status(201).json({
        success: true,
        message: 'Foglalás sikeresen rögzítve.',
        data: reservation,
      });
    } catch (error: any) {
      if (error instanceof ReservationError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      }
      next(error);
    }
  }

  static async getReservations(req: Request, res: Response, next: NextFunction) {
    try {
      const spotId = req.query.spotId as string | undefined;
      const from = req.query.from as string | undefined;
      const to = req.query.to as string | undefined;
      const status = req.query.status as ReservationStatus | undefined;

      const reservations = await ReservationService.getReservations({ spotId, from, to, status });
      res.json({
        success: true,
        count: reservations.length,
        data: reservations,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReservationById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const reservation = await ReservationService.getReservationById(id);
      res.json({ success: true, data: reservation });
    } catch (error: any) {
      if (error instanceof ReservationError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      next(error);
    }
  }

  static async cancelReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const cancelled = await ReservationService.cancelReservation(id);
      res.json({
        success: true,
        message: 'A foglalás sikeresen lemondva.',
        data: cancelled,
      });
    } catch (error: any) {
      if (error instanceof ReservationError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      next(error);
    }
  }
}
