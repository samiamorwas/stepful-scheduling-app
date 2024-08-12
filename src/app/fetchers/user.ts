import dbConnect from "@/lib/db-connect";

import User from "../models/user";

import { parseObjectIds } from "./utils";

export async function getAllUsers() {
  await dbConnect();
  const users = await User.find().lean();

  return parseObjectIds(users);
}
