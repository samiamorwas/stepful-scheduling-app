import dbConnect from "@/lib/db-connect";
import { Types } from "mongoose";

import Event from "@/app/models/event";

interface RequestContext {
  params: {
    userId: string;
    eventId: string;
  };
}

export async function POST(_: Request, { params }: RequestContext) {
  try {
    await dbConnect();

    const { userId, eventId } = params;
    const event = await Event.findById(eventId);

    if (!event) {
      return Response.json(["error", "Event not found"]);
    }

    const userObjectId = new Types.ObjectId(userId);

    if (userObjectId !== event.coach) {
      event.student = userObjectId;
    }

    await event.save();

    return Response.json(["ok", event._id]);
  } catch {
    return Response.json(["error", "Error booking event"]);
  }
}
