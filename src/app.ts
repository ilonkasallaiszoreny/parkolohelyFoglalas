import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import spotRoutes from './routes/spotRoutes';
import reservationRoutes from './routes/reservationRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend dashboard
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/spots', spotRoutes);
app.use('/api/reservations', reservationRoutes);

// Swagger Documentation setup
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Parkolóhely-foglalási Rendszer API',
    version: '1.0.0',
    description: 'Backend REST API parkolóhelyek nyilvántartására, foglalására és lemondására.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Helyi fejlesztői szerver',
    },
  ],
  paths: {
    '/api/spots': {
      get: {
        summary: 'Parkolóhelyek listázása',
        parameters: [
          {
            name: 'type',
            in: 'query',
            schema: { type: 'string', enum: ['STANDARD', 'EV_CHARGING', 'HANDICAPPED', 'VIP'] },
            description: 'Szűrés parkolóhely típus alapján',
          },
        ],
        responses: {
          200: { description: 'Sikeres válasz' },
        },
      },
      post: {
        summary: 'Új parkolóhely felvétele',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'string', example: 'P-501' },
                  name: { type: 'string', example: 'B-01 Normál' },
                  type: { type: 'string', enum: ['STANDARD', 'EV_CHARGING', 'HANDICAPPED', 'VIP'] },
                  location: { type: 'string', example: '2. Emelet' },
                },
                required: ['code', 'name', 'location'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Parkolóhely létrehozva' },
        },
      },
    },
    '/api/spots/{id}/reservations': {
      get: {
        summary: 'Egy adott parkolóhely foglalásainak lekérdezése',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Parkolóhely ID' },
        ],
        responses: {
          200: { description: 'Sikeres válasz a parkolóhely foglalásaival' },
          404: { description: 'Parkolóhely nem található' },
        },
      },
    },
    '/api/reservations': {
      get: {
        summary: 'Foglalások lekérdezése szűréssel',
        parameters: [
          { name: 'spotId', in: 'query', schema: { type: 'string' }, description: 'Parkolóhely ID szerinti szűrés' },
          { name: 'from', in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'Kezdő dátum szűrő' },
          { name: 'to', in: 'query', schema: { type: 'string', format: 'date-time' }, description: 'Záró dátum szűrő' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['CONFIRMED', 'CANCELLED'] } },
        ],
        responses: {
          200: { description: 'Sikeres lekérdezés' },
        },
      },
      post: {
        summary: 'Új foglalás rögzítése',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  spotId: { type: 'string', example: 'UUID-HERE' },
                  requesterName: { type: 'string', example: 'Minta János' },
                  licensePlate: { type: 'string', example: 'ABC-123' },
                  startTime: { type: 'string', format: 'date-time', example: '2026-08-06T09:00:00.000Z' },
                  endTime: { type: 'string', format: 'date-time', example: '2026-08-06T17:00:00.000Z' },
                },
                required: ['spotId', 'requesterName', 'startTime', 'endTime'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Foglalás elfogadva és rögzítve' },
          400: { description: 'Hibás kérés adat' },
          409: { description: 'Időbeli ütközés már meglévő foglalással' },
        },
      },
    },
    '/api/reservations/{id}': {
      delete: {
        summary: 'Foglalás lemondása',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Foglalás ID' },
        ],
        responses: {
          200: { description: 'Foglalás sikeresen lemondva' },
          404: { description: 'Foglalás nem található' },
        },
      },
    },
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Fallback error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Belső szerverhiba történt.',
  });
});

export default app;
