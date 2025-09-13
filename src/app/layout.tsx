import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "SilverAQ",
  description: "AdventureQuest Worlds Private Server - SilverAQ is a free MMORPG game, fully animated and updated weekly with new adventures!",
  applicationName: "SilverAQ",
  keywords: [
    "SilverAQ",
    "Silver AQ",
    "AQWorlds",
    "AdventureQuest Worlds",
    "MMORPG",
    "RPG game",
    "online game",
    "Artix",
    "Dage the Evil",
    "private server",
    "AQW private server",
    "AQW pirata",
    "AQW mobile",
    "AdventureQuest mobile",
    "AQW mobile game",
    "2D games",
    "online RPG",
    "gaming",
    "quest",
    "trade",
    "market",
    "pet system",
    "entertainment",
    "arts",
    "fun online games",
    "adventure",
  ],
  openGraph: {
    locale: "en_US",
    type: "article",
    url: "https://silveraq.xyz",
    siteName: "SilverAQ",
    title: "SilverAQ",
    description:"AdventureQuest Worlds Private Server - SilverAQ is a free MMORPG game, fully animated and updated weekly with new adventures!",
    images: [
      {
        url: "https://silveraq.xyz/assets/images/logo.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "SilverAQ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SilverAQ",
    description:"AdventureQuest Worlds Private Server - SilverAQ is a free MMORPG game, fully animated and updated weekly with new adventures!",
    images: ["https://silveraq.xyz/assets/images/logo.png",],
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
