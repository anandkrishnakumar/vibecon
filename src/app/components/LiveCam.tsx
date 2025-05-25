'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

interface LiveCamRef {
  captureSnapshot: () => string | null;
}

interface LiveCamProps {
  onCameraReady?: (ready: boolean) => void;
}

const LiveCam = forwardRef<LiveCamRef, LiveCamProps>(({ onCameraReady }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    }
  }));

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            onCameraReady?.(true);
          };
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
        onCameraReady?.(false);
      }
    };

    setupCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [onCameraReady]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-1/5 h-1/2 object-cover rounded-2xl shadow-lg mx-auto block"
      />
      {/* Hidden canvas for capturing snapshots */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
});

LiveCam.displayName = 'LiveCam';

export default LiveCam;
export type { LiveCamRef };