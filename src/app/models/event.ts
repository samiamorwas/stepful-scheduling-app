import { type Model, Schema, Types, model, models } from "mongoose";

import { type IUser } from "./user";
import { IReview } from "./review";

export interface IEvent {
  startsAt: Date;
  coach: Types.ObjectId;
  student?: Types.ObjectId;
  review?: Types.ObjectId;
}

export interface PopulatedCoach {
  coach: IUser;
}

export interface PopulatedStudent {
  student?: IUser;
}

export interface PopulatedReview {
  review?: IReview;
}

export type PopulatedEvent = Pick<IEvent, "startsAt"> &
  PopulatedCoach &
  PopulatedStudent &
  PopulatedReview;

const eventSchema = new Schema<IEvent>({
  startsAt: {
    type: Date,
    required: [true, "Start date is required"],
  },
  coach: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Event coach is required"],
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  review: {
    type: Schema.Types.ObjectId,
    ref: "Review",
  },
});

const Event =
  (models.Event as Model<IEvent>) || model<IEvent>("Event", eventSchema);
export default Event;
