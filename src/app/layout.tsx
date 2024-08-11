/* eslint-disable @next/next/no-page-custom-font */
import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import { Root } from "@/components/Root/Root";

import "@telegram-apps/telegram-ui/dist/styles.css";
import "normalize.css/normalize.css";
import "./_assets/globals.css";

export const metadata: Metadata = {
  title: "StatsApp",
  description: "Auto-generated points app",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Montserrat+Alternates:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Root>{children}</Root>
      </body>
    </html>
  );
}
