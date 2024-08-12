import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";

import { AppShell } from "./components";
import SWRProvider from "./swr-provider";
import { getAllUsers } from "./fetchers/user";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  fontFamily: "inherit",
});

export const metadata: Metadata = {
  title: "Stepful Assignment",
  description: "Scheduling app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const users = await getAllUsers();

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${inter.className}`}>
        <MantineProvider theme={theme}>
          <SWRProvider>
            <AppShell users={users}>{children}</AppShell>
          </SWRProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
