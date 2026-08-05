import prisma from './db';
import { SpotType, ReservationStatus } from '../types';

export async function seedDatabase() {
  const existingSpotsCount = await prisma.parkingSpot.count();
  if (existingSpotsCount > 0) {
    console.log('Database already initialized with seed data.');
    return;
  }

  console.log('Seeding initial database state...');

  const spots = [
    { code: 'P-101', name: 'A-01 Normál', type: SpotType.STANDARD, location: '1. Emelet - A Zóna' },
    { code: 'P-102', name: 'A-02 Normál', type: SpotType.STANDARD, location: '1. Emelet - A Zóna' },
    { code: 'P-103', name: 'A-03 Normál', type: SpotType.STANDARD, location: '1. Emelet - A Zóna' },
    { code: 'P-104', name: 'A-04 Normál', type: SpotType.STANDARD, location: '1. Emelet - A Zóna' },
    { code: 'P-201', name: 'E-01 Elektromos Töltő (22kW)', type: SpotType.EV_CHARGING, location: '1. Emelet - EV Zóna' },
    { code: 'P-202', name: 'E-02 Elektromos Töltő (50kW Fast)', type: SpotType.EV_CHARGING, location: '1. Emelet - EV Zóna' },
    { code: 'P-301', name: 'H-01 Mozgáskorlátozott', type: SpotType.HANDICAPPED, location: 'Földszint - Bejárat mellett' },
    { code: 'P-302', name: 'H-02 Mozgáskorlátozott', type: SpotType.HANDICAPPED, location: 'Földszint - Bejárat mellett' },
    { code: 'P-401', name: 'V-01 VIP Vezetői Hely', type: SpotType.VIP, location: '2. Emelet - VIP Zóna' },
    { code: 'P-402', name: 'V-02 VIP Vezetői Hely', type: SpotType.VIP, location: '2. Emelet - VIP Zóna' },
  ];

  const createdSpots = [];
  for (const s of spots) {
    const spot = await prisma.parkingSpot.create({
      data: s,
    });
    createdSpots.push(spot);
  }

  // Create sample initial bookings for demonstration
  const now = new Date();
  
  // Tomorrow 09:00 - 17:00
  const tomorrowStart = new Date(now);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  tomorrowStart.setHours(9, 0, 0, 0);

  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setHours(17, 0, 0, 0);

  // Day after tomorrow 10:00 - 14:00
  const dayAfterStart = new Date(now);
  dayAfterStart.setDate(dayAfterStart.getDate() + 2);
  dayAfterStart.setHours(10, 0, 0, 0);

  const dayAfterEnd = new Date(dayAfterStart);
  dayAfterEnd.setHours(14, 0, 0, 0);

  await prisma.reservation.create({
    data: {
      spotId: createdSpots[0].id,
      requesterName: 'Kovács Péter',
      licensePlate: 'ABC-123',
      startTime: tomorrowStart,
      endTime: tomorrowEnd,
      status: ReservationStatus.CONFIRMED,
    },
  });

  await prisma.reservation.create({
    data: {
      spotId: createdSpots[4].id, // EV charging spot
      requesterName: 'Nagy Anna (Tesla)',
      licensePlate: 'EV-999-AA',
      startTime: dayAfterStart,
      endTime: dayAfterEnd,
      status: ReservationStatus.CONFIRMED,
    },
  });

  console.log(`Seeding complete. Created ${createdSpots.length} parking spots and initial demo reservations.`);
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}
