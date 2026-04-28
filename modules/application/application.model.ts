import mongoose, { Schema } from "mongoose";
import { IApplication } from "./application.interface";

const applicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job ID is required"],
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Candidate ID is required"],
    },
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewing", "shortlisted", "rejected", "hired"],
      default: "pending",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
applicationSchema.index({ recruiterId: 1, status: 1 });
applicationSchema.index({ candidateId: 1, appliedAt: -1 });
applicationSchema.index({ jobId: 1, status: 1 });

export const ApplicationModel =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", applicationSchema);
