import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI as string;

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    let cached = global.mongoose as {
      conn: typeof mongoose | null;
      promise: Promise<typeof mongoose> | null;
    };

    if (!cached) {
      cached = global.mongoose = { conn: null, promise: null };
    }

    if (cached.conn) return cached.conn;
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
      });
    }
    cached.conn = await cached.promise;
    console.log("DB Connected");
    return cached.conn;
  } catch (error) {
    console.error("Database Connection Failed", error);

    throw new Error("could not connect DB");
  }
};
