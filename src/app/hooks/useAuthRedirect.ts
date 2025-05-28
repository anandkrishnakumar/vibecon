'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Determine base URL
    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000'
        : 'https://vibecon.onrender.com';

    // Check for existing token
    const existingToken = localStorage.getItem('spotify_access_token');
    if (existingToken) {
      router.replace('/home');
      return;
    }

    // Check URL params for auth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const authError = urlParams.get('error');

    if (code) {
      // Exchange code for token
      fetch(`${baseUrl}/api/auth/spotify/get-token?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            localStorage.setItem('spotify_access_token', data.access_token);
          }
          if (data.refresh_token) {
            localStorage.setItem('spotify_refresh_token', data.refresh_token);
          }
          router.replace('/home');
        })
        .catch(() => {
          router.replace('/');
        });
    } else if (authError) {
      // Redirect back to login on error
      router.replace('/');
    }
  }, [router]);
}
