import { Types } from "mongoose";

export function parseObjectIds<T extends { _id: Types.ObjectId }>(data: T[]) {
  return data.map((obj) => ({
    ...obj,
    _id: obj._id.toString(),
  }));
}
