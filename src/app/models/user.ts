import { type Model, Schema, model, models } from "mongoose";

import { type UserAccountType } from "../types";

export interface IUser {
  name: string;
  type: UserAccountType;
  phoneNumber: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  type: {
    type: String,
    required: [true, "Type is required"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
  },
});

const User = (models.User as Model<IUser>) || model<IUser>("User", userSchema);
export default User;
