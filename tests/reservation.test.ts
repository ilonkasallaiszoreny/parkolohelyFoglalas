import request from 'supertest';
import app from '../src/app';
import prisma from '../src/database/db';
import { seedDatabase } from '../src/database/seed';

describe('Parkolóhely-foglalás Integration & Unit Tests', () => {
  beforeAll(async () => {
    // Sync DB and seed initial data before running test suite
    await seedDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/spots', () => {
    it('should list all active parking spots', async () => {
      const res = await request(app).get('/api/spots');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should filter parking spots by type EV_CHARGING', async () => {
      const res = await request(app).get('/api/spots?type=EV_CHARGING');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.every((s: any) => s.type === 'EV_CHARGING')).toBe(true);
    });
  });

  describe('POST /api/reservations - Overlap & Reservation Logic', () => {
    let testSpotId: string;

    beforeAll(async () => {
      const spot = await prisma.parkingSpot.findFirst();
      testSpotId = spot!.id;
    });

    it('should successfully create a valid non-overlapping reservation', async () => {
      const startTime = new Date('2030-01-01T10:00:00.000Z').toISOString();
      const endTime = new Date('2030-01-01T14:00:00.000Z').toISOString();

      const res = await request(app)
        .post('/api/reservations')
        .send({
          spotId: testSpotId,
          requesterName: 'Teszt Elek',
          licensePlate: 'TST-001',
          startTime,
          endTime,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.requesterName).toBe('Teszt Elek');
    });

    it('should reject overlapping reservation (same time range) with HTTP 409', async () => {
      const startTime = new Date('2030-01-01T11:00:00.000Z').toISOString();
      const endTime = new Date('2030-01-01T13:00:00.000Z').toISOString();

      const res = await request(app)
        .post('/api/reservations')
        .send({
          spotId: testSpotId,
          requesterName: 'Másik Béla',
          licensePlate: 'TST-002',
          startTime,
          endTime,
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('A parkolóhely már foglalt');
    });

    it('should reject invalid time range where startTime >= endTime', async () => {
      const startTime = new Date('2030-01-01T15:00:00.000Z').toISOString();
      const endTime = new Date('2030-01-01T14:00:00.000Z').toISOString();

      const res = await request(app)
        .post('/api/reservations')
        .send({
          spotId: testSpotId,
          requesterName: 'Teszt Elek',
          startTime,
          endTime,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('A kezdő időpontnak korábbinak kell lennie');
    });
  });

  describe('DELETE /api/reservations/:id - Cancellation Logic', () => {
    let reservationId: string;

    beforeAll(async () => {
      const spot = await prisma.parkingSpot.findFirst();
      const created = await prisma.reservation.create({
        data: {
          spotId: spot!.id,
          requesterName: 'Törlés Teszt',
          startTime: new Date('2031-05-01T10:00:00Z'),
          endTime: new Date('2031-05-01T12:00:00Z'),
          status: 'CONFIRMED',
        },
      });
      reservationId = created.id;
    });

    it('should successfully cancel an existing active reservation', async () => {
      const res = await request(app).delete(`/api/reservations/${reservationId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('CANCELLED');
    });

    it('should reject double cancellation with HTTP 400', async () => {
      const res = await request(app).delete(`/api/reservations/${reservationId}`);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('már korábban le lett mondva');
    });
  });
});
