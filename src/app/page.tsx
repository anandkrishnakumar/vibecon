'use client';

import Image from "next/image";
import { useState } from "react";
import { createTheme, MantineProvider } from "@mantine/core";
import { Group } from "@mantine/core";

import Spin from "./components/Spin";
import VibeViz from "./components/VibeViz";
import MusicPlayer from "./components/MusicPlayer";

// Define interfaces at the top
interface VibeData {
  aspect: string;
  value: number;
}

interface Track {
  track_name: string;
  artists: string[];
  uri: string;
  album_art_url: string;
}

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
  const [vibeData, setVibeData] = useState<VibeData[] | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const handleVibeDataChange = (data: VibeData[] | null) => {
    setVibeData(data);
  };

  const handleTrackRecommendation = (track: Track | null) => {
    setCurrentTrack(track);
    if (track) {
      console.log('Recommended track:', track);
    } else {
      console.log('No track recommendation available');
    }
  };

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
        <Spin 
          onVibeDataChange={handleVibeDataChange}
          onTrackRecommendation={handleTrackRecommendation}
        />
        <Group grow h={300}>
          <VibeViz data={vibeData}/>
          <MusicPlayer track={currentTrack} />
        </Group>
      </div>
    </MantineProvider>
  );
}