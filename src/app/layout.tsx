import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VibeCon",
  description: "Capture your room's vibe and play the perfect Spotify track.",
  openGraph: {
    title: "VibeCon 🎧",
    description: "Let your room choose the music — camera + Spotify powered.",
    url: "https://vibecon.vercel.app/",
    siteName: "VibeCon",
    images: [
      {
        url: "https://vibecon.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vibe Connoisseur preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe Connoisseur 🎧",
    description: "Your room, your vibe, your soundtrack.",
    images: ["https://vibecon.vercel.app/og-image.png"],
  },
  alternates: {
    canonical: "https://vibecon.vercel.app/",
  },
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: "Anand Krishnakumar" }],
  keywords: ["music", "spotify", "vibe", "room", "camera", "ai"],
};

const theme = createTheme({
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5c5f66',
      '#373A40',
      '#2C2E33',
      '#25262b',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
  primaryColor: 'blue',
  defaultRadius: 'md',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MantineProvider theme={theme}>
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}