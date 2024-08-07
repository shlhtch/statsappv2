"use client";

import { Section, Cell, Image, List } from "@telegram-apps/telegram-ui";

export default function Home() {
  return (
    <List>
      <Section
        header="Features"
        footer="You can use these pages to learn more about features, provided by Telegram Mini Apps and other useful projects"
      >
      </Section>
      <Section
        header="Application Launch Data"
        footer="These pages help developer to learn more about current launch information"
      >
      </Section>
    </List>
  );
}
