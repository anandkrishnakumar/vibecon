import { useCallback } from 'react';
import { notifications } from '@mantine/notifications';

import type { TokenUpdateData } from '../types';

export function useSpotifyPlayer() {
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api'
      : 'https://vibecon.onrender.com/api';

  const makeAuthenticatedRequest = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const token = localStorage.getItem('spotify_access_token');
      const refreshToken = localStorage.getItem('spotify_refresh_token');
      if (!token) throw new Error('No access token available');

      const res = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          'X-Refresh-Token': refreshToken || '',
          'Content-Type': 'application/json',
        },
      });
      return res;
    },
    [baseUrl]
  );

  const handleTokenUpdate = useCallback((data: TokenUpdateData) => {
    if (data.spotify_access_token) {
      localStorage.setItem('spotify_access_token', data.spotify_access_token);
    }
    if (data.spotify_refresh_token) {
      localStorage.setItem('spotify_refresh_token', data.spotify_refresh_token);
    }
  }, []);

  const playTrack = useCallback(
    async (trackUri: string) => {
      try {
        const response = await makeAuthenticatedRequest('/play', {
          method: 'POST',
          body: JSON.stringify({ track_uris: [trackUri] }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          notifications.show({
            title: 'Playback Error',
            message: errorData.detail || 'Failed to play track',
            color: 'red',
            radius: 'lg',
          });
          return false;
        }
        const data = await response.json();
        handleTokenUpdate(data);
        return true;
      } catch (err) {
        console.error('Error playing track:', err);
        return false;
      }
    },
    [makeAuthenticatedRequest, handleTokenUpdate]
  );

  const pausePlayback = useCallback(async () => {
    try {
      const response = await makeAuthenticatedRequest('/pause', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        handleTokenUpdate(data);
        return true;
      }
    } catch (err) {
      console.error('Error pausing playback:', err);
    }
    return false;
  }, [makeAuthenticatedRequest, handleTokenUpdate]);

  const getCurrentPlayback = useCallback(async () => {
    try {
      const response = await makeAuthenticatedRequest('/current-playback');
      if (response.ok) {
        const data = await response.json();
        handleTokenUpdate(data);
        return data;
      }
    } catch (err) {
      console.error('Error fetching current playback:', err);
    }
    return null;
  }, [makeAuthenticatedRequest, handleTokenUpdate]);

  return {
    baseUrl,
    makeAuthenticatedRequest,
    handleTokenUpdate,
    playTrack,
    pausePlayback,
    getCurrentPlayback,
  };
}
