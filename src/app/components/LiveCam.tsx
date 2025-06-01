'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';

// import types
import type { LiveCamRef, LiveCamProps } from "../types";

const LiveCam = forwardRef<LiveCamRef, LiveCamProps>(({ onCameraReady }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>('user');
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [isCameraOn, setIsCameraOn] = useState(true);

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
    if (!isCameraOn) return;
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    await setupCamera(newFacingMode);
  };

  const toggleCamera = async () => {
    if (isCameraOn) {
      // Turn off camera
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
      onCameraReady?.(false);
    } else {
      // Turn on camera
      await setupCamera(currentFacingMode);
      setIsCameraOn(true);
    }
  };

  useImperativeHandle(ref, () => ({
    captureSnapshot: () => {
      if (!videoRef.current || !canvasRef.current || !isCameraOn) return null;

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
      <p className="text-center text-gray-500 mb-4">What&apos;s your vibe today?</p>

      {/* Video element for live camera feed */}
      <div className="relative w-3/5 mx-auto">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full object-cover rounded-2xl shadow-lg"
          style={{ display: isCameraOn ? 'block' : 'none' }}
        />

        {/* Camera off placeholder */}
        {!isCameraOn && (
          <div className="w-full aspect-video bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mx-auto mb-2"
              >
                <path d="M1 1l22 22" />
                <path d="M7 7H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h16" />
                <path d="M9.5 4h5L17 7h3a1 1 0 0 1 1 1v8" />
              </svg>
              <p className="text-sm">Camera Off</p>
            </div>
          </div>
        )}

        {/* Camera toggle switch - top center */}
        <button
          onClick={toggleCamera}
          className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
        >
          {isCameraOn ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v11z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          )}
        </button>

        {/* Camera switch button - now directly on video */}
        {hasMutipleCameras && isCameraOn && (
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