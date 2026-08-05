import app from './app';
import { seedDatabase } from './database/seed';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Seed initial database state if empty
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚗 Parkolóhely-foglaló Backend Szerver Fut!`);
      console.log(`🌐 Web Dashboard: http://localhost:${PORT}`);
      console.log(`📚 API Doksi (Swagger UI): http://localhost:${PORT}/api-docs`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Hiba történt a szerver indítása során:', error);
    process.exit(1);
  }
}

startServer();
