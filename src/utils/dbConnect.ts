import mongoose from 'mongoose';

/**
 * @Database_Architecture
 * Implementation of the Singleton Pattern for MongoDB connections.
 * In a Serverless environment (like Next.js), this prevents opening 
 * multiple redundant connections during hot reloads and concurrent requests.
 */

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('⚠️ Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents memory leaks and exhausted database connection pools.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If a connection already exists, return the cached instance
  if (cached.conn) {
    // console.log("✅ Using cached DB connection");
    return cached.conn;
  }

  // If no connection is in progress, initiate a new promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // High-performance setting for faster fail-over
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise on failure to allow retry
    throw e;
  }

  return cached.conn;
}

export default dbConnect;