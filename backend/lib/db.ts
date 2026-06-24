import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) console.warn('MONGODB_URI is not configured. Database endpoints will return an error.');

type Cache = { connection: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalWithMongoose = globalThis as typeof globalThis & { mongooseCache?: Cache };
const cache = globalWithMongoose.mongooseCache ?? { connection: null, promise: null };
globalWithMongoose.mongooseCache = cache;

export async function connectDb() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not configured');
  if (cache.connection) return cache.connection;
  cache.promise ??= mongoose.connect(MONGODB_URI, { bufferCommands: false });
  cache.connection = await cache.promise;
  return cache.connection;
}
