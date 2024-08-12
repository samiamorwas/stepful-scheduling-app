"use client";
import { useEffect, useState } from "react";
import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { format, getHours, getMinutes, setHours, setMinutes } from "date-fns";

import { IUser } from "../models/user";
import { WithId } from "../types";

import ErrorMessage from "./error-message";

function dateToTime(date: Date) {
  const formatter = new Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  const hours = getHours(date);
  const minutes = getMinutes(date);
  return `${formatter.format(hours)}:${formatter.format(minutes)}`;
}

function timeToDate(time: string, date: Date) {
  const [hours, minutes] = time.split(":");
  const withHours = setHours(date, parseInt(hours));
  return setMinutes(withHours, parseInt(minutes));
}

interface NewEventFormProps {
  coach: WithId<IUser>;
  selectedStartsAt: Date;
  callbacks: {
    onCancel: () => void;
    onCreate: (startsAt: Date) => Promise<void>;
  };
  errorMessage?: string;
}

export default function NewEventForm({
  coach,
  selectedStartsAt,
  callbacks,
  errorMessage,
}: NewEventFormProps) {
  const { onCancel, onCreate } = callbacks;
  const [startsAt, setStartsAt] = useState(dateToTime(selectedStartsAt));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStartsAt(dateToTime(selectedStartsAt));
  }, [selectedStartsAt]);

  return (
    <Stack>
      <Title order={2}>Create event</Title>
      <Text>All availability blocks are two hours long.</Text>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <Stack gap="1">
        <Title order={6}>Coach</Title>
        <Text>{coach.name}</Text>
      </Stack>

      <Stack gap="1">
        <Title order={6}>Date</Title>
        <Text>{format(selectedStartsAt, "MMM dd, yyyy")}</Text>
      </Stack>

      <TimeInput
        label="Starts at"
        value={startsAt}
        onChange={({ target }) => setStartsAt(target.value)}
      />

      <Group>
        <Button onClick={onCancel} variant="light">
          Cancel
        </Button>
        <Button
          onClick={async () => {
            setLoading(true);
            await onCreate(timeToDate(startsAt, selectedStartsAt));
            setLoading(false);
          }}
          loading={loading}
        >
          Create
        </Button>
      </Group>
    </Stack>
  );
}
