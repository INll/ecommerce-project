// Taken from https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.js

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

console.log('Initializing a cached connection to db.');

if (!process.env.MONGODB_PATH){
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const MONGODB_PATH = process.env.MONGODB_PATH;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_PATH, opts).then((mongoose) => {
      return mongoose;
    })
  }

  try {
    cached.conn = await cached.promise;
    console.log('Catching connection instance.');
  } catch (e) {
    console.log(`Connection failure: ${e}`);
    cached.promise = null;
    throw e;
  }

  console.log(`Catching successful. (Readystate: ${mongoose.connection.readyState})`);
  console.log('Global in adapter:');
  console.log(global.mongoose);
  return cached.conn;
}

// dbConnect();

export default dbConnect;