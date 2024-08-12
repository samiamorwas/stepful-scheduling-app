import { useContext, useState } from "react";
import { useSWRConfig } from "swr";
import partition from "lodash/partition";

import { type PopulatedEvent } from "../models/event";
import CurrentUserContext from "../users/current-user-context";
import { ViewEvent } from "../components";
import LayoutContext from "../layout-context";
import { type ApiResponse, type WithId } from "../types";

import useCreateReview from "./use-create-review";

export default function useViewEvent(events: WithId<PopulatedEvent>[] = []) {
  const [error, setError] = useState("");
  const { user } = useContext(CurrentUserContext);
  const { aside } = useContext(LayoutContext);
  const { mutate } = useSWRConfig();
  const createReview = useCreateReview(events);

  if (!user) {
    return () => {};
  }

  return (event: WithId<PopulatedEvent>) => {
    const form = (
      <ViewEvent
        event={event}
        userType={user.type}
        callbacks={{
          onClose: aside.close,
          onBook: async () => {
            const res = await fetch(
              `/users/${user._id}/events/${event._id}/api`,
              {
                method: "POST",
              }
            );

            const [status, response]: ApiResponse<string> = await res.json();

            if (status === "error") {
              setError(response);
              return;
            }

            const [updatedEvent, otherEvents] = partition(
              events,
              (event) => event._id === response
            );

            if (updatedEvent[0]) {
              mutate(`/users/${user._id}/events/api`, [
                "ok",
                [
                  ...otherEvents,
                  {
                    ...updatedEvent[0],
                    student: user,
                  },
                ],
              ]);
            } else {
              mutate(`/users/${user._id}/events/api`);
            }

            aside.close();
          },
          onComplete: () => createReview(event),
        }}
        errorMessage={error}
      />
    );

    aside.setContent(form);
    aside.open();
  };
}
