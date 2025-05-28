'use client';

import { useState, useCallback, useRef } from 'react';
import { Box, Button } from '@mantine/core';
import LiveCam, { LiveCamRef } from './LiveCam';
// Hooks
import { useVibe } from '../hooks/useVibe';
import { useTrackRecommendation } from '../hooks/useTrackRecommendation';
// Types
import type { SpinProps } from "../types";

export default function Spin({ onVibeDataChange, onTrackRecommendation }: SpinProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const liveCamRef = useRef<LiveCamRef>(null);

  const { fetchVibeData } = useVibe();
  const { fetchTrackRecommendation } = useTrackRecommendation();

  const handleSpinStart = useCallback(async () => {
    try {
      setLoading(true);

      // Capture snapshot from LiveCam
      const base64Image = liveCamRef.current?.captureSnapshot();
      if (!base64Image) {
        throw new Error('Failed to capture image from camera');
      }

      // Fetch vibe data first
      const vibeData = await fetchVibeData(base64Image);
      onVibeDataChange?.(vibeData);

      // Then fetch track recommendation based on vibe data
      const track = await fetchTrackRecommendation(vibeData);
      onTrackRecommendation?.(track);

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
        {isSpinning ? 'Stop Spinning' : 'Capture Vibe'}
      </Button>
      
      {!cameraReady && (
        <p className="text-sm text-gray-500 mt-2">
          Waiting for camera to be ready...
        </p>
      )}
    </Box>
  );
}
