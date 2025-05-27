'use client';

import { useState, useCallback, useRef } from 'react';
import { Box, Button } from '@mantine/core';
import LiveCam, { LiveCamRef } from './LiveCam';

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

interface SpinProps {
  onVibeDataChange?: (data: VibeData[] | null) => void;
  onTrackRecommendation?: (track: Track | null) => void;
}

export default function Spin({ onVibeDataChange, onTrackRecommendation }: SpinProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const liveCamRef = useRef<LiveCamRef>(null);

  let baseUrl = "https://vibecon.onrender.com";
    if (process.env.NODE_ENV === 'development') {
        baseUrl = "http://localhost:3000";
    }

  const fetchVibeData = useCallback(async () => {
    // Capture snapshot from LiveCam
    const base64Image = liveCamRef.current?.captureSnapshot();
    if (!base64Image) {
      throw new Error('Failed to capture image from camera');
    }

    const response = await fetch(`${baseUrl}/api/vibe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_url: base64Image })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch vibe data: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Vibe data:', data);
    return data;
  }, []);

  const fetchTrackRecommendation = useCallback(async (vibeData: VibeData[]) => {
    const response = await fetch(`${baseUrl}/api/get-track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vibe_data: vibeData })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch track recommendation: ${response.status}`);
    }

    const trackData = await response.json();
    console.log('Track recommendation:', trackData);
    return trackData;
  }, []);

  const handleSpinStart = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch vibe data first
      const vibeData = await fetchVibeData();
      onVibeDataChange?.(vibeData);

      // Then fetch track recommendation based on vibe data
      const trackData = await fetchTrackRecommendation(vibeData);
      onTrackRecommendation?.(trackData);

      setIsSpinning(true);
    } catch (error) {
      console.error('Error during spin process:', error);
      onVibeDataChange?.(null);
      onTrackRecommendation?.(null);
    } finally {
      setLoading(false);
    }
  }, [fetchVibeData, fetchTrackRecommendation, onVibeDataChange, onTrackRecommendation]);

  const handleClick = useCallback(async () => {
    if (!isSpinning) {
      if (!cameraReady) {
        alert('Camera is not ready yet. Please wait.');
        return;
      }

      await handleSpinStart();
    } else {
      setIsSpinning(false);
    }
  }, [isSpinning, cameraReady, handleSpinStart]);

  return (
    <Box className="flex flex-col items-center justify-center h-full p-4">
      <LiveCam 
        ref={liveCamRef}
        onCameraReady={setCameraReady}
      />
      
      <Button 
        variant="filled" 
        color={isSpinning ? 'red' : 'blue'}
        onClick={handleClick} 
        loading={loading}
        disabled={loading || !cameraReady}
        size="md"
        className="mb-4 mt-4"
      >
        {isSpinning ? 'Stop Spinning' : 'Start Spinning'}
      </Button>
      
      {!cameraReady && (
        <p className="text-sm text-gray-500 mt-2">
          Waiting for camera to be ready...
        </p>
      )}
    </Box>
  );
}