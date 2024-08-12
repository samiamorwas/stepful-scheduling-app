import { useContext, useState } from "react";
import { useSWRConfig } from "swr";
import partition from "lodash/partition";

import { type PopulatedEvent } from "../models/event";
import { type IReview } from "../models/review";

import CurrentUserContext from "../users/current-user-context";

import { NewReviewForm, ViewEvent } from "../components";
import LayoutContext from "../layout-context";
import { type ApiResponse, type WithId } from "../types";

export default function useCreateReview(events: WithId<PopulatedEvent>[] = []) {
  const [error, setError] = useState("");
  const { user } = useContext(CurrentUserContext);
  const { aside } = useContext(LayoutContext);
  const { mutate } = useSWRConfig();

  if (!user) {
    return () => {};
  }

  return (event: WithId<PopulatedEvent>) => {
    const form = (
      <NewReviewForm
        callbacks={{
          onCancel: () =>
            aside.setContent(
              <ViewEvent
                event={event}
                userType="coach"
                callbacks={{
                  onClose: aside.close,
                  onBook: async () => {},
                  onComplete: () => aside.setContent(form),
                }}
              />
            ),
          onSubmit: async ({ rating, notes }) => {
            const res = await fetch(`/users/${user._id}/reviews/api`, {
              method: "PUT",
              body: JSON.stringify({
                eventId: event._id,
                rating,
                notes,
              }),
            });

            const [status, response]: ApiResponse<WithId<IReview>> =
              await res.json();

            if (status === "error") {
              setError(response);
              return;
            }

            const [updatedEvent, otherEvents] = partition(
              events,
              (event) => event._id === response._id
            );

            if (updatedEvent[0]) {
              mutate(`/users/${user._id}/events/api`, [
                "ok",
                [
                  ...otherEvents,
                  {
                    ...updatedEvent[0],
                    review: response,
                  },
                ],
              ]);
            } else {
              mutate(`/users/${user._id}/events/api`);
            }

            aside.setContent(
              <ViewEvent
                event={{
                  ...event,
                  review: response,
                }}
                userType="coach"
                callbacks={{
                  onClose: aside.close,
                  onBook: async () => {},
                  onComplete: () => {},
                }}
              />
            );
          },
        }}
        errorMessage={error}
      />
    );

    aside.setContent(form);
    aside.open();
  };
}
