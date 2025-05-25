'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@mantine/core';
import LiveCam, { LiveCamRef } from './LiveCam';

interface VibeData {
  aspect: string;
  value: number;
}

interface SpinProps {
  onVibeDataChange?: (data: VibeData[] | null) => void;
  onSpinStateChange?: (isSpinning: boolean) => void;
}

export default function Spin({ onVibeDataChange, onSpinStateChange }: SpinProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const liveCamRef = useRef<LiveCamRef>(null);

  const fetchVibeData = useCallback(async () => {
    try {
      setLoading(true);

      // Capture snapshot from LiveCam
      const base64Image = liveCamRef.current?.captureSnapshot();
      if (!base64Image) {
        throw new Error('Failed to capture image from camera');
      }

      const response = await fetch('http://localhost:8000/vibe', {
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
      onVibeDataChange?.(data);
      
      return data;
    } catch (error) {
      console.error('Error fetching vibe data:', error);
      onVibeDataChange?.(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [onVibeDataChange]);

  const handleClick = useCallback(async () => {
    if (!isSpinning) {
      if (!cameraReady) {
        alert('Camera is not ready yet. Please wait.');
        return;
      }

      try {
        await fetchVibeData();
        setIsSpinning(true);
        onSpinStateChange?.(true);
      } catch (error) {
        console.error('Failed to start spinning:', error);
      }
    } else {
      setIsSpinning(false);
      onSpinStateChange?.(false);
    }
  }, [isSpinning, cameraReady, fetchVibeData, onSpinStateChange]);

  return (
    <div className="flex flex-col items-center mt-4">
      {/* <LiveCam 
        ref={liveCamRef}
        onCameraReady={setCameraReady}
      /> */}
      
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
    </div>
  );
}