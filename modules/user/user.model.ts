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
    recruiterProfile: {
      jobTitle: { type: String, default: "" },
      companyWebsite: { type: String, default: "" },
      industry: { type: String, default: "" },
      companySize: { type: String, default: "" },
      location: { type: String, default: "" },
      phone: { type: String, default: "" },
      linkedinUrl: { type: String, default: "" },
      hiringFocus: { type: String, default: "" },
      yearsOfExperience: { type: Number, default: null },
      bio: { type: String, default: "" },
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
