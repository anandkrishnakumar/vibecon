'use client';

import { useState, useEffect } from 'react';
import { Button, Container, Text, Stack, createTheme } from "@mantine/core";
import { MantineProvider } from "@mantine/core";
import { IconBrandSpotify } from "@tabler/icons-react";
import Image from "next/image";

const theme = createTheme({
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5c5f66',
      '#373A40',
      '#2C2E33',
      '#25262b',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
  primaryColor: 'blue',
  defaultRadius: 'md',
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get base URL for API calls
  let baseUrl = "https://vibecon.onrender.com";
  if (process.env.NODE_ENV === 'development') {
    baseUrl = "http://localhost:8000";
  }

  // Check for existing token or auth callback on page load
  useEffect(() => {
    // First check if we already have a token
    const existingToken = localStorage.getItem('spotify_access_token');
    console.log('Existing token:', existingToken);
    if (existingToken) {
      // Already authenticated, redirect to home
      window.location.href = '/home';
      return;
    }

    // No token, check for auth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const authError = urlParams.get('error');

    if (code) {
      // We have a code but no token, exchange it for a token
      exchangeCodeForToken(code);
    } else if (authError) {
      setError('Spotify authentication failed. Please try again.');
    }
  }, []);

  const exchangeCodeForToken = async (code: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/auth/spotify/get-token?code=${code}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        // Store access token
        localStorage.setItem('spotify_access_token', data.access_token);
        console.log('Access token received:', data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('spotify_refresh_token', data.refresh_token);
        }
        // Redirect to home
        window.location.href = '/home';
      } else {
        setError('Failed to get access token');
      }
    } catch (err) {
      console.error('Token exchange error:', err);
      setError('Failed to authenticate with Spotify');
    } finally {
      setLoading(false);
    }
  };

  const handleSpotifyLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Redirect to your backend's Spotify auth endpoint
      window.location.href = `${baseUrl}/api/auth/spotify/login`;
    } catch (err) {
      console.error('Spotify login error:', err);
      setError('Failed to connect to Spotify. Please try again.');
      setLoading(false);
    }
  };

  return (
    <MantineProvider theme={theme}>
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Container size="sm" className="text-center">
          <Stack gap="xl" align="center">
            <Image src="/vibecon.svg" alt="VibeCon" width={400} height={400} />
            
            <Text size="xl" c="dimmed" maw={600}>
              Discover music that matches your vibe
            </Text>
            
            {error && (
              <Text c="red" size="sm">{error}</Text>
            )}
            
            {loading && (
              <Text c="blue" size="sm">Connecting to Spotify...</Text>
            )}
            
            <Button
              size="lg"
              leftSection={<IconBrandSpotify size={24} />}
              onClick={handleSpotifyLogin}
              loading={loading}
              color="green"
              variant="filled"
              radius="xl"
              className="px-8 py-4"
            >
              Connect with Spotify
            </Button>
            
            <Text size="sm" c="dimmed">
                You&apos;ll need a Spotify Premium account to control playback
            </Text>
          </Stack>
        </Container>
      </div>
    </MantineProvider>
  );
}