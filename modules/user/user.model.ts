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
    password: {
      type: String,
      require: [true, "Password is required"],
    },
    avatar: {
      type: String,
      default: "/images/fav-ico.png",
    },
    role: {
      type: String,
      enum: ["candidate", "admin"],
      default: "candidate",
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model<IUser>("user", UserSchema);
