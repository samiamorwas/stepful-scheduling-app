import { Select } from "@mantine/core";
import partition from "lodash/partition";

import { WithId } from "../types";
import { type IUser } from "../models/user";

const formatOption = (user: User) => ({
  label: user.name,
  value: user._id,
});

type User = WithId<IUser>;

interface SelectUserProps {
  onChange: (newUser: User) => void;
  currentUser?: User;
  users?: User[];
}

export default function SelectUser({
  onChange,
  currentUser,
  users = [],
}: SelectUserProps) {
  const [coaches, students] = partition(users, (user) => user.type === "coach");

  return (
    <Select
      data={[
        {
          group: "Coaches",
          items: coaches.map((coach) => formatOption(coach)),
        },
        {
          group: "Students",
          items: students.map((student) => formatOption(student)),
        },
      ]}
      label="Logged in as"
      value={currentUser?._id}
      onChange={(value) => {
        const newCurrentUser = users.find((user) => user._id === value);

        if (newCurrentUser) {
          onChange(newCurrentUser);
        }
      }}
    />
  );
}
