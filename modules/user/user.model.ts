import { model, Schema } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

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
  avatar: {
    type: String,
    default: "/images/fav-ico.png",
  },
});

export const UserModel = model<IUser>("user", UserSchema);
