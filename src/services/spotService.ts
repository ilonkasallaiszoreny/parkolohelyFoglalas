import prisma from '../database/db';
import { CreateSpotDTO } from '../types';

export class SpotService {
  static async getAllSpots(type?: string) {
    const where: any = { isActive: true };
    if (type) {
      where.type = type;
    }
    return prisma.parkingSpot.findMany({
      where,
      orderBy: { code: 'asc' },
    });
  }

  static async getSpotById(id: string) {
    return prisma.parkingSpot.findUnique({
      where: { id },
      include: {
        reservations: {
          where: { status: 'CONFIRMED' },
          orderBy: { startTime: 'asc' },
        },
      },
    });
  }

  static async createSpot(data: CreateSpotDTO) {
    const existing = await prisma.parkingSpot.findUnique({
      where: { code: data.code },
    });
    if (existing) {
      throw new Error(`A parkolóhely az alábbi kóddal már létezik: ${data.code}`);
    }

    return prisma.parkingSpot.create({
      data: {
        code: data.code,
        name: data.name,
        type: data.type || 'STANDARD',
        location: data.location,
      },
    });
  }
}
