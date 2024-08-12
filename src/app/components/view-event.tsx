"use client";
import { useState } from "react";
import { Button, Group, Rating, Stack, Text, Title } from "@mantine/core";
import { format } from "date-fns";

import { type PopulatedEvent } from "../models/event";
import { UserAccountType } from "../types";

import ErrorMessage from "./error-message";

interface ViewEventProps {
  event: PopulatedEvent;
  userType: UserAccountType;
  callbacks: {
    onClose: () => void;
    onBook: () => Promise<void>;
    onComplete: () => void;
  };
  errorMessage?: string;
}

export default function ViewEvent({
  event,
  userType,
  callbacks,
  errorMessage,
}: ViewEventProps) {
  const [loading, setLoading] = useState(false);
  const isBooked = !!event.student;
  const { onClose, onBook, onComplete } = callbacks;

  return (
    <Stack>
      <Title order={2}>Event w/ {event.coach.name}</Title>

      <Stack gap="1">
        <Title order={6}>Date & time</Title>
        <Text>{format(event.startsAt, "hh:mm bb · MMM dd, yyyy")}</Text>
      </Stack>

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

      {isBooked && (
        <Stack gap="1">
          <Title order={6}>Contact number</Title>
          <Text>
            {userType === "coach"
              ? event.student?.phoneNumber
              : event.coach.phoneNumber}
          </Text>
        </Stack>
      )}

      {userType === "coach" && event.review && (
        <Stack>
          <Title order={3}>Review</Title>

          <Stack gap="1">
            <Title order={6}>Rating</Title>
            <Rating value={event.review.rating} readOnly />
          </Stack>

          <Stack gap="1">
            <Title order={6}>Notes</Title>
            <Text>{event.review.notes}</Text>
          </Stack>
        </Stack>
      )}

      <Group grow>
        <Button variant="light" onClick={onClose}>
          Close
        </Button>

        {userType === "coach" && isBooked && !event.review && (
          <Button onClick={onComplete}>Complete</Button>
        )}

        {userType === "student" && !isBooked && (
          <Button
            onClick={async () => {
              setLoading(true);
              await onBook();
              setLoading(false);
            }}
            loading={loading}
          >
            Book
          </Button>
        )}
      </Group>
    </Stack>
  );
}
