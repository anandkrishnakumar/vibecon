'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';

// import types
import type { LiveCamRef, LiveCamProps } from "../types";

const LiveCam = forwardRef<LiveCamRef, LiveCamProps>(({ onCameraReady }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>('user');
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);

  const setupCamera = async (facingMode: 'user' | 'environment' = currentFacingMode) => {
    try {
      // Stop existing stream
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: { ideal: facingMode }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          onCameraReady?.(true);
        };
      }
      setCurrentFacingMode(facingMode);
    } catch (err) {
      console.error('Error accessing webcam:', err);
      onCameraReady?.(false);
    }
  };

  const getAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);
    } catch (err) {
      console.error('Error enumerating devices:', err);
    }
  };

  const switchCamera = async () => {
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    await setupCamera(newFacingMode);
  };

  useImperativeHandle(ref, () => ({
    captureSnapshot: () => {
      if (!videoRef.current || !canvasRef.current) return null;

      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return null;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64
      return canvas.toDataURL('image/jpeg', 0.8);
    },
    switchCamera
  }));

  useEffect(() => {
    getAvailableCameras();
    setupCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [onCameraReady]);

  const hasMutipleCameras = availableCameras.length > 1;

  return (
    <div className="w-fit mx-auto -mt-8">
      <p className="text-center text-gray-500 mb-4">What's your vibe today?</p>
      
      {/* Video element for live camera feed */}
      <div className="relative w-3/5 mx-auto">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full object-cover rounded-2xl shadow-lg"
        />

        {/* Camera switch button - now directly on video */}
        {hasMutipleCameras && (
          <button
            onClick={switchCamera}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            title="Switch Camera"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 1l4 4-4 4" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <path d="M7 23l-4-4 4-4" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
        )}
      </div>

      {/* Hidden canvas for capturing snapshots */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
});

LiveCam.displayName = 'LiveCam';

export default LiveCam;
export type { LiveCamRef };