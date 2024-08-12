"use client";
import { useMemo } from "react";

import { type EventClickArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  type DateClickArg,
} from "@fullcalendar/interaction";

import { type PopulatedEvent } from "../models/event";
import { type UserAccountType, type WithId } from "../types";

const getTitle = (event: PopulatedEvent, userType: UserAccountType) => {
  if (userType === "coach") {
    return event.student?.name || "Unbooked";
  } else {
    return event.student
      ? event.coach.name
      : `Available w/ ${event.coach.name}`;
  }
};

const getBackgroundColor = (
  event: PopulatedEvent,
  userType: UserAccountType
) => {
  if (event.review) {
    return "bg-gray-400 border-gray-400";
  }

  if (event.student) {
    return "bg-blue-400 border-blue-400";
  }

  if (userType === "coach") {
    return "bg-yellow-400 border-yellow-400";
  }

  return "bg-green-400 border-green-400";
};

interface CalendarProps {
  events: WithId<PopulatedEvent>[];
  userType: UserAccountType;
  callbacks: {
    onDateClick: (info: DateClickArg) => void;
    onEventClick: (info: EventClickArg) => void;
  };
}

export default function Calendar({
  events,
  userType,
  callbacks,
}: CalendarProps) {
  const { onDateClick, onEventClick } = callbacks;

  const formattedEvents = useMemo(
    () =>
      events.map((event) => ({
        id: event._id,
        title: getTitle(event, userType),
        start: event.startsAt,
        className: `${getBackgroundColor(event, userType)} cursor-pointer`,
      })),
    [events]
  );

  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: "prev,next",
        center: "title",
        right: "timeGridWeek,timeGridDay",
      }}
      height="auto"
      defaultTimedEventDuration="02:00"
      slotMinTime="08:00"
      slotMaxTime="20:00"
      allDaySlot={false}
      dateClick={(info) => onDateClick(info)}
      eventClick={(info) => onEventClick(info)}
      events={formattedEvents}
    />
  );
}
