import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    require: [true, "Name is required"],
  },
  email: {
    type: String,
    require: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "Password is required"],
  },
  confirmPassword: {
    type: String,
    require: [true, "Confirm Password is required"],
  },
  avatar: {
    type: String,
    default: "/images/fav-ico.png",
  },
});

export const UserModel = model<IUser>("user", UserSchema);
