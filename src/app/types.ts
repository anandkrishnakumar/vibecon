interface VibeAspects {
  danceability: number;
  energy: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  valence: number;
  tempo?: number; // Optional, as it may not always be included
}

interface VibeSummary {
  text: string;
  color: string;
  emoji?: string;
}

export interface VibeData {
  vibe: VibeAspects;
  summary: VibeSummary;
}

export interface Track {
  track_name: string;
  artists: string[];
  uri: string;
  album_art_url: string;
}

export interface SpinProps {
  onVibeDataChange?: (data: VibeData | null) => void;
  onTrackRecommendation?: (track: Track | null) => void;
}

export interface MusicPlayerProps {
  track?: Track | null;
  getTrackRecommendation?: () => Promise<Track | null>;
}

export interface VibeCardProps {
  data?: VibeData | null;
}


export interface LiveCamRef {
  captureSnapshot: () => string | null;
  switchCamera: () => Promise<void>;
}

export interface LiveCamProps {
  onCameraReady?: (ready: boolean) => void;
}

export interface TokenUpdateData {
  spotify_access_token?: string;
  spotify_refresh_token?: string;
}