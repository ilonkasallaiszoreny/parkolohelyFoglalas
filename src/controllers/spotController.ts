import { Request, Response, NextFunction } from 'express';
import { SpotService } from '../services/spotService';

export class SpotController {
  static async getAllSpots(req: Request, res: Response, next: NextFunction) {
    try {
      const type = req.query.type as string | undefined;
      const spots = await SpotService.getAllSpots(type);
      res.json({ success: true, count: spots.length, data: spots });
    } catch (error) {
      next(error);
    }
  }

  static async getSpotById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const spot = await SpotService.getSpotById(id);
      if (!spot) {
        return res.status(404).json({ success: false, error: 'A parkolóhely nem található.' });
      }
      res.json({ success: true, data: spot });
    } catch (error) {
      next(error);
    }
  }

  static async createSpot(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, name, type, location } = req.body;
      if (!code || !name || !location) {
        return res.status(400).json({ success: false, error: 'Kód, név és elhelyezkedés megadása kötelező.' });
      }
      const newSpot = await SpotService.createSpot({ code, name, type, location });
      res.status(201).json({ success: true, data: newSpot });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
