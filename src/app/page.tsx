'use client';

import Image from "next/image";

import { createTheme, MantineProvider } from "@mantine/core";
import { Group } from "@mantine/core";

import LiveCam from "./components/LiveCam";
import Spin from "./components/Spin";
import VibeViz from "./components/VibeViz";
import MusicPlayer from "./components/MusicPlayer";

const theme = createTheme({
  colorScheme: 'dark',
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

export default function Home() {
  return (
    <MantineProvider theme={theme}>
      <div className="min-h-screen bg-black text-white">
        <Image
          src="/vibecon.svg"
          alt="VibeCon Logo"
          width={500}
          height={500}
          className="mx-auto pt-10"
          priority
        />
        {/* <LiveCam /> */}
        <Spin />
        <Group grow h={300}>
          <VibeViz />
          <MusicPlayer />
        </Group>
      </div>
    </MantineProvider>
  );
}