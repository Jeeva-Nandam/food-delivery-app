import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Global interface to hold cached mongoose connection across serverless invocations.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    console.warn(
      '⚠️ [MongoDB] MONGODB_URI environment variable is not defined. Running in fallback memory mode until a URI is provided.'
    );
    return null;
  }

  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    console.log('🔄 [MongoDB] Connecting to MongoDB Atlas cluster...');
    cached.promise = mongoose
      .connect(uri, opts)
      .then(m => {
        console.log('✅ [MongoDB] Successfully connected to MongoDB Atlas database!');
        return m;
      })
      .catch(err => {
        console.error('❌ [MongoDB] Connection error:', err.message);
        cached.promise = null;
        return null;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
