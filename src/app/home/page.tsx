'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { createTheme, MantineProvider } from "@mantine/core";
import { Group } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import Spin from "../components/Spin";
import VibeViz from "../components/VibeViz";
import MusicPlayer from "../components/MusicPlayer";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [vibeData, setVibeData] = useState<VibeData[] | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      // Redirect to login if not authenticated
      window.location.href = '/';
      return
    }
    console.log('User is authenticated');
    setIsAuthenticated(true);
  }, []);

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

  if (!isAuthenticated) {
    return (
      <MantineProvider theme={theme}>
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
          <Image
            src="/vibecon.svg"
            alt="VibeCon Logo"
            width={500}
            height={500}
            className="mx-auto pt-10"
            priority
          />
        </div>
      </MantineProvider>
    )}
  else {
    return (
      <MantineProvider theme={theme}>
        <Notifications />
        <div className="min-h-screen bg-black text-white">
          <Image
            src="/vibecon.svg"
            alt="VibeCon Logo"
            width={500}
            height={500}
            className="mx-auto pt-10"
            priority
          />
          <Spin
            onVibeDataChange={handleVibeDataChange}
            onTrackRecommendation={handleTrackRecommendation}
          />
          <Group grow h={300}>
            <VibeViz data={vibeData} />
            <MusicPlayer track={currentTrack} />
          </Group>
        </div>
      </MantineProvider>
    );
  }
}