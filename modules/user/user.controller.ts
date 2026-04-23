import catchAsync from "@/utils/catchAsync";
import { getAllUsers } from "./user.service";
import sendResponse from "@/utils/sendResponse";

const getAllUsersFromDB = catchAsync(async () => {
  const users = await getAllUsers();
  return sendResponse({
    statusCode: 200,
    message: "Successfully all users are fetched",
    success: true,
    data: users,
  });
});

export const userController = {
  getAllUsersFromDB,
};
