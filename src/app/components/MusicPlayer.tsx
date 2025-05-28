'use client';

import { useState, useEffect, useRef } from 'react';
import { Image, Box, ActionIcon, Text } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause, IconPlayerTrackNext } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import type { Track, MusicPlayerProps } from "../types";
import { useSpotifyPlayer } from "../hooks/useSpotifyPlayer";

export default function MusicPlayer({ track, getTrackRecommendation }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trackQueue, setTrackQueue] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentlyPlayingTrack, setCurrentlyPlayingTrack] = useState<Track | null>(null); // Add this!
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { makeAuthenticatedRequest, handleTokenUpdate, playTrack, pausePlayback } = useSpotifyPlayer();

  // Update currently playing track when the prop changes
  useEffect(() => {
    if (track) {
      setCurrentlyPlayingTrack(track);
    }
  }, [track]);

  // If the current track is the last in the queue, get a new recommendation
  useEffect(() => {
    if (currentTrackIndex === trackQueue.length - 1) {
      getTrackRecommendation?.().then(nextTrack => {
        if (nextTrack) {
          setTrackQueue(prev => [...prev, nextTrack]);
        }
      }
      ).catch(error => {
        console.error('Error getting track recommendation:', error);
        notifications.show({
          title: 'Track Recommendation Error',
          message: 'Failed to get next track recommendation.',
          color: 'red',
          radius: 'lg',
        });
      });
    }
  }, [currentlyPlayingTrack, trackQueue, currentTrackIndex, getTrackRecommendation]);

  // Add this helper function to get the next track
  const getNextTrack = () => {
    if (trackQueue.length > currentTrackIndex + 1) {
      return trackQueue[currentTrackIndex + 1];
    }
    return null;
  };

  // Skip function
  const handleSkip = async () => {
    if (!getTrackRecommendation) return;

    setIsTransitioning(true); // Prevent duplicate skips
    await playNextTrack();
    setIsTransitioning(false); // Reset flag after completion
  };


  // Play next track using getTrackRecommendation
  const playNextTrack = async () => {
    if (trackQueue.length > currentTrackIndex + 1) {
      // Play next track in queue
      const nextTrack = trackQueue[currentTrackIndex + 1];
      setCurrentTrackIndex(prev => prev + 1);
      setCurrentlyPlayingTrack(nextTrack); // Update display track!
      await playTrack(nextTrack.uri);
    } else if (getTrackRecommendation) {
      // Queue is empty, get new recommendation
      try {
        const nextTrack = await getTrackRecommendation();
        if (nextTrack) {
          setTrackQueue(prev => [...prev, nextTrack]);
          setCurrentlyPlayingTrack(nextTrack); // Update display track!
          await playTrack(nextTrack.uri);
          setCurrentTrackIndex(trackQueue.length);
        }
      } catch (error) {
        console.error('Error getting track recommendation:', error);
      }
    }
  };


  // Handle play/pause button
  const handlePlayPause = async () => {
    if (!currentlyPlayingTrack) return;

    setIsLoading(true);
    try {
      if (isPlaying) {
        await pausePlayback();
      } else {
        // Initialize queue if empty
        if (trackQueue.length === 0) {
          setTrackQueue([currentlyPlayingTrack]);
          setCurrentTrackIndex(0);
        }
        setCurrentlyPlayingTrack(currentlyPlayingTrack); // Update display track!
        await playTrack(currentlyPlayingTrack.uri);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Use currentlyPlayingTrack for display instead of the prop
  const displayTrack = currentlyPlayingTrack || track || {
    track_name: "No track",
    artists: ["Capture vibe to start"],
    album_art_url: ""
  };

  // Add a flag to prevent duplicate calls
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Check playback state and handle track endings
  const checkPlaybackState = async () => {
    if (isTransitioning) return; // Prevent duplicate calls

    try {
      const response = await makeAuthenticatedRequest('/current-playback');

      if (response.ok) {
        const data = await response.json();
        const isCurrentlyPlaying = data.is_playing;
        const currentTrackUri = data.uri;
        const progressMs = data.progress_ms;
        const durationMs = data.duration_ms;

        // Check if track is ending (within 3 seconds of completion)
        if (progressMs && durationMs && (durationMs - progressMs < 3000) && isCurrentlyPlaying && !isTransitioning) {
          setIsTransitioning(true); // Set flag to prevent duplicates
          await playNextTrack();
          setIsTransitioning(false); // Reset flag after completion
          return;
        }

        // Update playing state based on current track
        if (currentlyPlayingTrack && currentTrackUri === currentlyPlayingTrack.uri) {
          setIsPlaying(isCurrentlyPlaying);
        } else if (track && currentTrackUri === track.uri) {
          setIsPlaying(isCurrentlyPlaying);
        } else {
          setIsPlaying(false);
        }

        handleTokenUpdate(data);
      }
    } catch (error) {
      console.error('Error checking playback state:', error);
      setIsTransitioning(false); // Reset flag on error
    }
  };

  // Set up polling for playback state
  useEffect(() => {
    if (!track) return;

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Check immediately
    checkPlaybackState();

    // Poll every second to catch track endings
    intervalRef.current = setInterval(checkPlaybackState, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [track, trackQueue, currentTrackIndex]);

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

      {/* Album art with play button */}
      {displayTrack.album_art_url && (
        <Box>
          <Image
            radius="md"
            src={displayTrack.album_art_url}
            h="100%"
            fit="cover"
          />

          {/* Play/Pause button - centered */}
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

          {/* Skip button - positioned to the right */}
          <ActionIcon
            size={50}
            radius="xl"
            variant="filled"
            color="rgba(0, 0, 0, 0.6)"
            pos="absolute"
            top="50%"
            right="70px"
            style={{ transform: 'translateY(-50%)' }}
            onClick={handleSkip}
            loading={isTransitioning}
            disabled={!getTrackRecommendation}
          >
            <IconPlayerTrackNext size={24} color="white" />
          </ActionIcon>

          {/* Next track preview - bottom right */}
          {getNextTrack() && (
            <Box
              pos="absolute"
              bottom="12px"
              right="12px"
              w="60px"
              h="60px"
              style={{
                borderRadius: '8px',
                border: '0px solid rgba(255, 255, 255, 0.8)',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
            >
              <Image
                src={getNextTrack()?.album_art_url}
                w="100%"
                h="100%"
                fit="cover"
                alt="Next track"
              />

              {/* Small "NEXT" label overlay */}
              <Box
                pos="absolute"
                bottom={0}
                left={0}
                right={0}
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  padding: '2px 4px'
                }}
              >
                <Text
                  size="xs"
                  c="white"
                  fw={600}
                  ta="center"
                  style={{ fontSize: '10px', lineHeight: 1 }}
                >
                  UP NEXT
                </Text>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
