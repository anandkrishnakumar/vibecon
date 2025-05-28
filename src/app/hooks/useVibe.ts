import { useCallback } from 'react';
import type { VibeData } from '../types';

export function useVibe() {
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://vibecon.onrender.com';

  const fetchVibeData = useCallback(
    async (base64Image: string): Promise<VibeData[]> => {
      const response = await fetch(`${baseUrl}/api/vibe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: base64Image }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch vibe data: ${response.status}`);
      }

      const data: VibeData[] = await response.json();
      return data;
    },
    [baseUrl]
  );

  return { fetchVibeData };
}
