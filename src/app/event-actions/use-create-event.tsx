import { useContext, useState } from "react";
import { useSWRConfig } from "swr";

import { type PopulatedEvent } from "../models/event";
import CurrentUserContext from "../users/current-user-context";
import { NewEventForm } from "../components";
import LayoutContext from "../layout-context";
import { type ApiResponse, type WithId } from "../types";

export default function useCreateEvent(events: WithId<PopulatedEvent>[] = []) {
  const [error, setError] = useState("");
  const { user } = useContext(CurrentUserContext);
  const { aside } = useContext(LayoutContext);
  const { mutate } = useSWRConfig();

  if (!user) {
    return () => {};
  }

  return (selectedStartsAt: Date) => {
    const form = (
      <NewEventForm
        coach={user}
        selectedStartsAt={selectedStartsAt}
        callbacks={{
          onCancel: aside.close,
          onCreate: async (startsAt) => {
            const res = await fetch(`/users/${user._id}/events/api`, {
              method: "PUT",
              body: JSON.stringify({ startsAt }),
            });

            const [status, response]: ApiResponse<WithId<PopulatedEvent>> =
              await res.json();

            if (status === "error") {
              setError(response);
              return;
            }

            mutate(`/users/${user._id}/events/api`, [
              "ok",
              [...events, response],
            ]);

            aside.close();
          },
        }}
        errorMessage={error}
      />
    );

    aside.setContent(form);
    aside.open();
  };
}
