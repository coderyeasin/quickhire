import { CreatedJobType } from "./job.validation";
import { JobModel } from "./job.model";

async function createJobIntoDB(payload: CreatedJobType) {
  const result = await JobModel.create(payload);
  return result;
}

export const jobServices = { createJobIntoDB };
