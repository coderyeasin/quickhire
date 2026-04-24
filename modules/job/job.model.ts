import mongoose, { Schema } from "mongoose";
import { IJob } from "./job.interface";

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
    },
    companyLogo: {
      type: String,
      required: [true, "Company logo is required"],
    },
    category: {
      type: [String],
      required: true,
      default: [],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "remote", "intern"],
      required: [true, "Job type is required"],
    },
    salary: {
      type: String,
      default: "Negotiable",
    },
    skills: {
      type: [String],
      required: true,
      default: [],
    },
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      //   required: [true, "Recruiter ID is required"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    deadline: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

// index for fast filtering
jobSchema.index({ recruiterId: 1 });
jobSchema.index({ skills: 1 });

export const JobModel =
  mongoose.models.Job || mongoose.model<IJob>("Job", jobSchema);
