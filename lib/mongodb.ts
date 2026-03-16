import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    console.log("DB Connected");
  } catch (error) {
    console.error("DB Connection Error", error);

    throw new Error("could not connect DB");
  }
};
