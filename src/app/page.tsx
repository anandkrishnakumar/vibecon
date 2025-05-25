'use client';

import { useState } from 'react';
import { Button, Container, Text, Stack, TextInput, PasswordInput, createTheme } from "@mantine/core";
import { MantineProvider } from "@mantine/core";
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let baseUrl = "https://vibecon.vercel.app";
    if (process.env.NODE_ENV === 'development') {
        baseUrl = "http://localhost:3000";
    }

    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store token in localStorage or cookies
        localStorage.setItem('token', data.token);
        // Redirect to dashboard
        window.location.href = '/home';
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
        console.error('Login error:', error);
        setError('Login failed. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <MantineProvider theme={theme}>
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Container size="sm" className="text-center">
          <Stack gap="xl" align="center">
            <Image src="/vibecon.svg" alt="VibeCon" width={300} height={300} />
            
            <Text size="xl" c="dimmed">
              Discover music that matches your vibe
            </Text>
            
            <form onSubmit={handleLogin} className="w-full max-w-sm">
              <Stack gap="md">
                <TextInput
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <PasswordInput
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                
                {error && (
                  <Text c="red" size="sm">{error}</Text>
                )}
                
                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  color="blue"
                  fullWidth
                >
                  Sign In
                </Button>
              </Stack>
            </form>
          </Stack>
        </Container>
      </div>
    </MantineProvider>
  );
}