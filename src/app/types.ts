export interface VibeData {
  aspect: string;
  value: number;
}

export interface Track {
  track_name: string;
  artists: string[];
  uri: string;
  album_art_url: string;
}

export interface SpinProps {
  onVibeDataChange?: (data: VibeData[] | null) => void;
  onTrackRecommendation?: (track: Track | null) => void;
}

export interface MusicPlayerProps {
  track?: Track | null;
  getTrackRecommendation?: () => Promise<Track | null>;
}

export interface VibeVizProps {
  data?: VibeData[] | null;
}
