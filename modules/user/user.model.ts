import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.interface";

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      require: [true, "Name is required"],
    },
    email: {
      type: String,
      require: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    company: {
      type: String,
      required: false,
      default: null,
    },
    password: {
      type: String,
      require: [true, "Password is required"],
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["candidate", "admin", "recruiter"],
      default: "candidate",
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
