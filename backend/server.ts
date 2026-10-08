import app from './app';
import { connectDB } from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Attempt database connection on server boot
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 [Backend Server] Miras Heritage Foods API running on http://localhost:${PORT}`);
      console.log(`📡 [Endpoints Available] http://localhost:${PORT}/api/health`);
    });
  } catch (err: any) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
