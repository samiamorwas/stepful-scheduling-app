"use client";
import { type ReactNode, useState } from "react";
import {
  AppShell as MantineAppShell,
  Burger,
  Group,
  Stack,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import CurrentUserContext from "../users/current-user-context";
import { type IUser } from "../models/user";
import LayoutContext from "../layout-context";
import { type WithId } from "../types";

import SelectUser from "./select-user";

interface AppShellProps {
  users: WithId<IUser>[];
  children: ReactNode;
}

export default function AppShell({ users, children }: AppShellProps) {
  const [currentUser, setCurrentUser] = useState(users[0]);
  const [asideContent, setAsideContent] = useState<ReactNode>();
  const [sidebarOpened, sidebarActions] = useDisclosure();
  const [asideOpened, asideActions] = useDisclosure();

  const [asideRef] = useAutoAnimate();
  const [mainRef] = useAutoAnimate();

  return (
    <CurrentUserContext.Provider
      value={{
        user: currentUser,
        setUser: setCurrentUser,
      }}
    >
      <LayoutContext.Provider
        value={{
          sidebar: {
            opened: sidebarOpened,
            ...sidebarActions,
          },
          aside: {
            opened: asideOpened,
            setContent: (newContent) => setAsideContent(newContent),
            ...asideActions,
          },
        }}
      >
        <MantineAppShell
          header={{ height: 75 }}
          navbar={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !sidebarOpened, desktop: !sidebarOpened },
          }}
          aside={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !asideOpened, desktop: !asideOpened },
          }}
          transitionDuration={0}
        >
          <MantineAppShell.Header>
            <Group className="px-4 h-full">
              <Burger opened={sidebarOpened} onClick={sidebarActions.toggle} />

              <Title order={1}>Stepful scheduling</Title>

              <div className="ml-auto">
                <SelectUser
                  onChange={(newUser) => setCurrentUser(newUser)}
                  currentUser={currentUser}
                  users={users}
                />
              </div>
            </Group>
          </MantineAppShell.Header>

          <MantineAppShell.Navbar>
            <Stack className="p-4">
              <Link href="/">Schedule</Link>
              {currentUser.type === "coach" && (
                <Link href={`/users/${currentUser._id}/reviews`}>Reviews</Link>
              )}
            </Stack>
          </MantineAppShell.Navbar>

          <MantineAppShell.Aside>
            <div className="p-4" ref={asideRef}>
              {asideContent}
            </div>
          </MantineAppShell.Aside>

          <MantineAppShell.Main>
            <div className="p-4 h-full w-full" ref={mainRef}>
              {children}
            </div>
          </MantineAppShell.Main>
        </MantineAppShell>
      </LayoutContext.Provider>
    </CurrentUserContext.Provider>
  );
}
