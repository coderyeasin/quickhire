import catchAsync from "@/utils/catchAsync";
import { getAllUsers } from "./user.service";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";

const getAllUsersFromDB = catchAsync(async () => {
  const users = await getAllUsers();
  return sendResponse({
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully all users are fetched",
    data: users,
  });
});

export const userController = {
  getAllUsersFromDB,
};
