"use client";
import { useContext } from "react";
import useSWR from "swr";
import { Loader } from "@mantine/core";

import { type PopulatedEvent } from "./models/event";

import CurrentUserContext from "./users/current-user-context";

import { Calendar, ErrorMessage } from "./components";
import { type ApiResponse, type WithId } from "./types";
import { useCreateEvent, useViewEvent } from "./event-actions";

export default function Page() {
  const { user } = useContext(CurrentUserContext);

  const { data, isLoading } = useSWR<ApiResponse<WithId<PopulatedEvent>[]>>(
    user ? `/users/${user._id}/events/api` : null
  );

  const events = typeof data?.[1] === "string" ? [] : data?.[1];

  const createEvent = useCreateEvent(events);
  const viewEvent = useViewEvent(events);

  if (isLoading) {
    return <Loader />;
  }

  if (!data || !user) {
    return <ErrorMessage>Error loading user's events.</ErrorMessage>;
  }

  const [status, response] = data;

  if (status === "error") {
    return <ErrorMessage>{response}</ErrorMessage>;
  }

  return (
    <Calendar
      events={response}
      userType={user.type}
      callbacks={{
        onDateClick: (info) => {
          if (user.type === "student") {
            return;
          }

          createEvent(info.date);
        },
        onEventClick: (info) => {
          const event = response.find((event) => event._id === info.event.id);

          if (!event) {
            return;
          }

          viewEvent(event);
        },
      }}
    />
  );
}
