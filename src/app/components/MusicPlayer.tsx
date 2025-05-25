'use client';

import { useState } from 'react';
import { Image, Box, ActionIcon, Text } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Add track info (you can make this dynamic later)
  const trackInfo = {
    title: "Chateau",
    artist: "Angus & Julia Stone",
  };

  const handlePlayPause = async () => {
  setIsLoading(true);
  
  try {
    const endpoint = isPlaying ? '/pause' : '/play';
    
    if (isPlaying) {
      // Call pause endpoint
      const response = await fetch(`http://localhost:8000/pause`, {
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
      // Call play endpoint with track_id
      const response = await fetch(`http://localhost:8000/play`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ track_uri: 'spotify:track:1tQtURCQmQnY5ZxJNTgXKR' }) // Replace with actual track ID
      });
      
      if (response.ok) {
        setIsPlaying(true);
      } else {
        console.error('Failed to start playback');
      }
    }
  } catch (error) {
    console.error('Error calling API:', error);
  } finally {
    setIsLoading(false);
  }
};

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
        src="https://i.scdn.co/image/ab67616d0000b2736567f18f9a164a51e933cdad"
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
          {trackInfo.title}
        </Text>
        <Text size="sm" c="rgba(255,255,255,0.8)" truncate>
          {trackInfo.artist}
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
      >
        {isPlaying ? (
          <IconPlayerPause size={30} color="white" />
        ) : (
          <IconPlayerPlay size={30} color="white" />
        )}
      </ActionIcon>
      
      {/* Up next image */}
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