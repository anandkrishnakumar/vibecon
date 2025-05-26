'use client';

import { useState } from 'react';
import { Image, Box, ActionIcon, Text } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface Track {
  track_name: string;
  artists: string[];
  uri: string;
  album_art_url: string;
}

interface MusicPlayerProps {
  track?: Track | null;
}

export default function MusicPlayer({ track }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let baseUrl = "https://vibecon.onrender.com";
  if (process.env.NODE_ENV === 'development') {
    baseUrl = "http://localhost:3000";
  }

  // Create a utility function for authenticated requests
  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('spotify_access_token');

    if (!token) {
      throw new Error('No access token available');
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  };

  const handlePlayPause = async () => {
    if (!track) return;

    setIsLoading(true);

    try {
      if (isPlaying) {
        // Call pause endpoint
        const response = await makeAuthenticatedRequest(`${baseUrl}/api/pause`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setIsPlaying(false);
        } else {
          console.error('Failed to pause playback');
        }
      } else {
        // Call play endpoint with track URI
        const response = await makeAuthenticatedRequest(`${baseUrl}/api/play`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ track_uri: track.uri })
        });

        if (response.ok) {
          setIsPlaying(true);
        } else {
          const errorData = await response.json();
          if (response.status === 400) {
            console.log('Showing error notification for 400 response');
            notifications.show({
              title: 'Playback Error',
              message: errorData.detail,
              color: 'red',
              radius: 'lg',
              withCloseButton: true,
            })
          } else {
            notifications.show({
              title: 'Playback Error',
              message: errorData.detail || 'Failed to play track',
              color: 'red',
              radius: 'lg',
            });
          }
          // console.error('Failed to start playback');
          // console.error('Response status:', response.status);
        }
      }
    } catch (error) {
      console.error('Error calling API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Default track info when no track is provided
  const defaultTrack = {
    track_name: "No track selected",
    artists: ["Select a track to play"],
    album_art_url: "https://via.placeholder.com/400x400?text=No+Track"
  };

  const displayTrack = track || defaultTrack;

  return (
    <Box
      pos="relative"
      w="100%"
      style={{ aspectRatio: '1/1' }}
      maw="400px"
      mx="auto"
    >

      {/* Main album art */}
      <Image
        radius="md"
        src={displayTrack.album_art_url}
        h="100%"
        fit="cover"
      />

      {/* Track info overlay */}
      <Box
        pos="absolute"
        top={0}
        left={0}
        right={0}
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
          borderRadius: '8px 8px 0 0'
        }}
        p="md"
      >
        <Text size="lg" fw={600} c="white" truncate>
          {displayTrack.track_name}
        </Text>
        <Text size="sm" c="rgba(255,255,255,0.8)" truncate>
          {displayTrack.artists.join(', ')}
        </Text>
      </Box>

      {/* Play button overlay */}
      <ActionIcon
        size={60}
        radius="xl"
        variant="filled"
        color="rgba(0, 0, 0, 0.7)"
        pos="absolute"
        top="50%"
        left="50%"
        style={{ transform: 'translate(-50%, -50%)' }}
        onClick={handlePlayPause}
        loading={isLoading}
        disabled={!track}
      >
        {isPlaying ? (
          <IconPlayerPause size={30} color="white" />
        ) : (
          <IconPlayerPlay size={30} color="white" />
        )}
      </ActionIcon>

      {/* Up next image - keeping as placeholder for now */}
      <Box
        pos="absolute"
        bottom={16}
        right={16}
        w={80}
        h={80}
      >
        <Image
          radius="sm"
          src="https://i.scdn.co/image/ab67616d0000b2731bfa23b13d0504fb90c37b39"
          h="100%"
          fit="cover"
        />
      </Box>
    </Box>
  );
}