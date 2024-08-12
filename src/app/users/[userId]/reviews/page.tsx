"use client";
import { useContext } from "react";
import useSWR from "swr";
import { Group, List, Loader, Rating, Stack, Text, Title } from "@mantine/core";
import { type ApiResponse, type WithId } from "@/app/types";
import { ErrorMessage } from "@/app/components";
import { type IReview } from "@/app/models/review";

import CurrentUserContext from "../../current-user-context";

export default function Page() {
  const { user } = useContext(CurrentUserContext);
  const { data, isLoading } = useSWR<ApiResponse<WithId<IReview>[]>>(
    user ? `/users/${user._id}/reviews/api` : null
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!data || !user) {
    return <ErrorMessage>Error loading user's reviews.</ErrorMessage>;
  }

  const [status, response] = data;

  if (status === "error") {
    return <ErrorMessage>{response}</ErrorMessage>;
  }

  return (
    <Stack>
      <Title order={2}>Your reviews</Title>

      <List>
        {response.map((review) => (
          <List.Item key={review._id}>
            <Group>
              <Rating value={review.rating} readOnly />
              <Text>{review.notes}</Text>
            </Group>
          </List.Item>
        ))}
      </List>
    </Stack>
  );
}
