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
    const refreshToken = localStorage.getItem('spotify_refresh_token');

    if (!token) {
      throw new Error('No access token available');
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'X-Refresh-Token': refreshToken || '',
        'Content-Type': 'application/json',
      },
    });
  };

  // If response contains a new token, update localStorage
  const handleTokenUpdate = (data: { spotify_access_token?: string; spotify_refresh_token?: string }) => {
    if (data.spotify_access_token) {
      localStorage.setItem('spotify_access_token', data.spotify_access_token);
    }
    if (data.spotify_refresh_token) {
      localStorage.setItem('spotify_refresh_token', data.spotify_refresh_token);
    }
  }

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
          const data = await response.json();
          handleTokenUpdate(data);
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
          const data = await response.json();
          handleTokenUpdate(data);
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
    track_name: "No track",
    artists: ["Capture vibe to start"],
    album_art_url: ""
  };

  const displayTrack = track || defaultTrack;

  return (
    <Box
      pos="relative"
      w="100%"
      style={{ aspectRatio: '1/1' }}
      maw="350px"
      mx="auto"
    >

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

      {/* Main album art */}
      {/* Play button overlay */}
      {displayTrack.album_art_url && (
        <Box>
          <Image
            radius="md"
            src={displayTrack.album_art_url}
            h="100%"
            fit="cover"
          />
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
        </Box>
      )}




      {/* Up next image - keeping as placeholder for now
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
      </Box> */}
    </Box>
  );
}