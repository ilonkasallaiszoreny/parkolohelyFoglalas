import prisma from '../database/db';
import { CreateReservationDTO, QueryReservationsDTO, ReservationStatus } from '../types';

export class ReservationError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ReservationService {
  static async createReservation(data: CreateReservationDTO) {
    const { spotId, requesterName, licensePlate, startTime, endTime } = data;

    if (!spotId || !requesterName || !startTime || !endTime) {
      throw new ReservationError('A parkolóhely, kérelmező neve, kezdő és záró időpont megadása kötelező.', 400);
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new ReservationError('Érvénytelen dátum formátum (ISO-8601 elvárt).', 400);
    }

    if (start >= end) {
      throw new ReservationError('A kezdő időpontnak korábbinak kell lennie a záró időpontnál.', 400);
    }

    // Use Prisma transaction to ensure race-condition safety
    return prisma.$transaction(async (tx) => {
      // 1. Verify spot existence and active status
      const spot = await tx.parkingSpot.findUnique({
        where: { id: spotId },
      });

      if (!spot || !spot.isActive) {
        throw new ReservationError('A megadott parkolóhely nem található vagy inaktív.', 444);
      }

      // 2. Check overlap logic: start < existing.endTime AND end > existing.startTime AND status == CONFIRMED
      const overlappingReservations = await tx.reservation.findMany({
        where: {
          spotId,
          status: ReservationStatus.CONFIRMED,
          startTime: { lt: end },
          endTime: { gt: start },
        },
      });

      if (overlappingReservations.length > 0) {
        const overlap = overlappingReservations[0];
        const formattedStart = new Date(overlap.startTime).toLocaleString('hu-HU');
        const formattedEnd = new Date(overlap.endTime).toLocaleString('hu-HU');
        throw new ReservationError(
          `A parkolóhely már foglalt a megadott időintervallumban (Ütközés: ${formattedStart} - ${formattedEnd}).`,
          409
        );
      }

      // 3. Create confirmed reservation
      const reservation = await tx.reservation.create({
        data: {
          spotId,
          requesterName: requesterName.trim(),
          licensePlate: licensePlate ? licensePlate.trim().toUpperCase() : null,
          startTime: start,
          endTime: end,
          status: ReservationStatus.CONFIRMED,
        },
        include: {
          spot: true,
        },
      });

      return reservation;
    });
  }

  static async getReservations(query: QueryReservationsDTO) {
    const { spotId, from, to, status } = query;
    const where: any = {};

    if (spotId) {
      where.spotId = spotId;
    }

    if (status) {
      where.status = status;
    }

    if (from || to) {
      where.AND = [];
      if (from) {
        where.AND.push({ endTime: { gte: new Date(from) } });
      }
      if (to) {
        where.AND.push({ startTime: { lte: new Date(to) } });
      }
    }

    return prisma.reservation.findMany({
      where,
      include: {
        spot: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  static async getReservationById(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { spot: true },
    });

    if (!reservation) {
      throw new ReservationError('A foglalás nem található.', 404);
    }

    return reservation;
  }

  static async cancelReservation(id: string) {
    const existing = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new ReservationError('A törölni kívánt foglalás nem található.', 404);
    }

    if (existing.status === ReservationStatus.CANCELLED) {
      throw new ReservationError('Ez a foglalás már korábban le lett mondva.', 400);
    }

    return prisma.reservation.update({
      where: { id },
      data: { status: ReservationStatus.CANCELLED },
      include: { spot: true },
    });
  }
}
