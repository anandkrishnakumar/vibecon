import { useCallback } from 'react';
import type { VibeData, Track } from '../types';

export function useTrackRecommendation() {
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://vibecon.onrender.com';

  const fetchTrackRecommendation = useCallback(
    async (vibeData: VibeData): Promise<Track> => {
      const response = await fetch(`${baseUrl}/api/get-track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vibe_data: vibeData.vibe }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch track recommendation: ${response.status}`);
      }

      const data: Track = await response.json();
      return data;
    },
    [baseUrl]
  );

  return { fetchTrackRecommendation };
}
