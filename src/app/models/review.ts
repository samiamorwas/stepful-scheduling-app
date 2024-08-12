import { type Model, Schema, Types, model, models } from "mongoose";

import { type IUser } from "./user";

export interface IReview {
  user: Types.ObjectId;
  rating: number;
  notes: string;
}

export interface PopulatedUser {
  user: IUser;
}

export type PopulatedReview = Omit<IReview, "user"> & PopulatedUser;

const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
  },
  notes: {
    type: String,
    required: [true, "Notes are required"],
  },
});

const Review =
  (models.Review as Model<IReview>) || model<IReview>("Review", reviewSchema);
export default Review;
