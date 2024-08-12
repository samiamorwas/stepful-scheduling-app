"use client";
import { useState } from "react";
import { Button, Group, Rating, Stack, Textarea, Title } from "@mantine/core";

import ErrorMessage from "./error-message";

interface ReviewFormProps {
  callbacks: {
    onCancel: () => void;
    onSubmit: ({
      rating,
      notes,
    }: {
      rating: number;
      notes: string;
    }) => Promise<void>;
  };
  errorMessage?: string;
}

export default function ReviewForm({
  callbacks,
  errorMessage,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { onCancel, onSubmit } = callbacks;

  return (
    <Stack>
      <Title order={2}>Review event</Title>

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <Rating value={rating} onChange={setRating} />

      <Textarea
        resize="vertical"
        placeholder="Include any notes for the event"
        value={notes}
        onChange={({ target }) => setNotes(target.value)}
      />

      <Group grow>
        <Button variant="light" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          loading={loading}
          onClick={async () => {
            setLoading(true);
            await onSubmit({ rating, notes });
            setLoading(false);
          }}
        >
          Submit
        </Button>
      </Group>
    </Stack>
  );
}
