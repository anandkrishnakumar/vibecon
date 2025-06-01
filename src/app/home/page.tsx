'use client';

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { Group, Stack, Box } from "@mantine/core";

import Spin from "../components/Spin";
import VibeCard from "../components/VibeCard";
import MusicPlayer from "../components/MusicPlayer";

// Types
import type { VibeData, Track } from "../types";

// Hooks
import { useTrackRecommendation } from "../hooks/useTrackRecommendation";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [vibeData, setVibeData] = useState<VibeData | null>(null);
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

  const handleVibeDataChange = (data: VibeData | null) => {
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

  // Use the hook to get the recommendation function
  const { fetchTrackRecommendation } = useTrackRecommendation();

  // Create a recommendation function that uses current vibe data
  const getTrackRecommendation = useCallback(async (): Promise<Track | null> => {
    if (!vibeData) {
      console.log('No vibe data available for recommendation');
      return null;
    }

    try {
      const track = await fetchTrackRecommendation(vibeData);
      console.log('Continuous track recommendation:', track);
      return track;
    } catch (error) {
      console.error('Error getting track recommendation:', error);
      return null;
    }
  }, [vibeData, fetchTrackRecommendation]);

  if (!isAuthenticated) {
    return (
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
    );
  } else {
    // ...existing code...

return (
    <div className="min-h-screen bg-black text-white">
      <Image
        src="/vibecon.svg"
        alt="VibeCon Logo"
        width={400}
        height={400}
        className="mx-auto pt-0"
        priority
      />
      <Spin
        onVibeDataChange={handleVibeDataChange}
        onTrackRecommendation={handleTrackRecommendation}
      />
      
      {/* Mobile: Stack vertically */}
      <Box hiddenFrom="md" px="lg">
        <Stack gap="lg">
          <div style={{ 
            transition: 'all 0.6s ease-in-out',
            opacity: vibeData ? 1 : 0,
            transform: vibeData ? 'translateY(0)' : 'translateY(20px)',
          }}>
            <VibeCard data={vibeData} />
          </div>
          <div style={{ 
            transition: 'all 0.6s ease-in-out',
            opacity: currentTrack ? 1 : 0,
            transform: currentTrack ? 'translateY(0)' : 'translateY(20px)',
          }}>
            <MusicPlayer track={currentTrack} getTrackRecommendation={getTrackRecommendation} />
          </div>
        </Stack>
      </Box>

      {/* Desktop: Side by side */}
      <Box visibleFrom="md" px="lg">
        <Group 
          grow
          style={{ transition: 'all 0.6s ease-in-out' }}
          align="flex-start"
          gap="lg"
        >
          <div style={{ 
            transition: 'all 0.6s ease-in-out',
            opacity: vibeData ? 1 : 0,
            transform: vibeData ? 'translateX(0)' : 'translateX(50px)',
          }}>
            <VibeCard data={vibeData} />
          </div>
          <div style={{ 
            transition: 'all 0.6s ease-in-out',
            opacity: currentTrack ? 1 : 0,
            transform: currentTrack ? 'translateX(0)' : 'translateX(-50px)',
          }}>
            <MusicPlayer track={currentTrack} getTrackRecommendation={getTrackRecommendation} />
          </div>
        </Group>
      </Box>
    </div>
  );
  }
}
