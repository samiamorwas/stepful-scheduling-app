import dbConnect from "@/lib/db-connect";

import Event, {
  type PopulatedCoach,
  type PopulatedStudent,
  type PopulatedReview,
} from "@/app/models/event";
import User from "@/app/models/user";

interface RequestContext {
  params: {
    userId: string;
  };
}

interface NewEventRequest {
  startsAt: Date;
}

export async function GET(_: Request, { params }: RequestContext) {
  try {
    await dbConnect();

    const { userId } = params;
    const user = await User.findById(userId);

    if (!user) {
      return Response.json(["error", "User not found"]);
    }

    const queryParams =
      user.type === "coach"
        ? { coach: userId }
        : { $or: [{ student: userId }, { student: null }] };

    const events = await Event.find(queryParams)
      .populate<PopulatedCoach>("coach")
      .populate<PopulatedStudent>("student")
      .populate<PopulatedReview>("review")
      .lean()
      .exec();

    return Response.json(["ok", events]);
  } catch {
    return Response.json(["error", "Error fetching the user's events"]);
  }
}

export async function PUT(request: Request, { params }: RequestContext) {
  try {
    await dbConnect();

    const { userId } = params;
    const { startsAt }: NewEventRequest = await request.json();
    const user = await User.findById(userId);

    if (!user) {
      return Response.json(["error", "User not found"]);
    }

    const newEvent = new Event({ startsAt, coach: userId });
    await newEvent.save();
    await newEvent.populate<PopulatedCoach>("coach");
    await newEvent.populate<PopulatedStudent>("student");

    return Response.json(["ok", newEvent.toObject()]);
  } catch {
    return Response.json(["error", "Error saving new event"]);
  }
}
