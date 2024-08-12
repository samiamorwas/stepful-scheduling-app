import dbConnect from "@/lib/db-connect";

import Event from "@/app/models/event";
import Review from "@/app/models/review";

interface RequestContext {
  params: {
    userId: string;
  };
}

interface NewReviewRequest {
  rating: number;
  notes: string;
  eventId: string;
}

export async function GET(_: Request, { params }: RequestContext) {
  try {
    await dbConnect();

    const { userId } = params;
    const reviews = await Review.find({ user: userId });

    return Response.json(["ok", reviews]);
  } catch {
    return Response.json(["error", "Error fetching reviews"]);
  }
}

export async function PUT(request: Request, { params }: RequestContext) {
  try {
    await dbConnect();

    const { userId } = params;
    const { rating, notes, eventId }: NewReviewRequest = await request.json();
    const event = await Event.findById(eventId);

    if (!event) {
      return Response.json(["error", "Event not found"]);
    }

    const review = new Review({ rating, notes, user: userId });
    await review.save();

    event.review = review._id;
    await event.save();

    return Response.json(["ok", review.toObject()]);
  } catch {
    return Response.json(["error", "Error saving review"]);
  }
}
