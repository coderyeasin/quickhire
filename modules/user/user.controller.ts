import catchAsync from "@/utils/catchAsync";
import { getAllUsers, updateUserProfile } from "./user.service";
import { updateProfileValidator } from "./UserValidators";
import { withAuth } from "@/lib/withAuth";
import { NextRequest } from "next/server";
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

const updateMyProfile = catchAsync(async (req: NextRequest) => {
  const user = await withAuth();
  const body = await req.json();
  const parsed = updateProfileValidator.safeParse(body);

  if (!parsed.success) {
    return sendResponse({
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: parsed.error.issues[0]?.message ?? "Invalid profile data",
      data: null,
    });
  }

  const updatedUser = await updateUserProfile(user.id, parsed.data);
  return sendResponse({
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

export const userController = {
  getAllUsersFromDB,
  updateMyProfile,
};
