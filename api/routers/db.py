from .spotify import search_spotify_track
from models import Vibe
from pydantic import BaseModel
from fastapi import APIRouter
from sklearn.preprocessing import StandardScaler
from scipy.spatial import distance
import pandas as pd
import sys
import os
from typing import List

# add parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


router = APIRouter()

# Load songs dataset
# https://www.kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset
DATASET_REL_PATH = "../../data/dataset.csv"
DATASET_PATH = os.path.join(os.path.dirname(__file__), DATASET_REL_PATH)
df = pd.read_csv(DATASET_PATH)

# Filter to decently popular songs
df = df[df['popularity'] > 50]

cols = Vibe.__annotations__
df_filtered = df[list(cols.keys())]

# Normalize the df
scaler = StandardScaler()
df_scaled = scaler.fit_transform(df_filtered)


class VibeDataRequest(BaseModel):
    vibe: dict
    track_count: int = 1


@router.post("/get-tracks")
async def get_tracks(request: VibeDataRequest) -> List[dict]:
    """
    Get tracks from the library based on the passed vibe.
    """
    # Convert the vibe_data list to a Vibe object
    vibe_dict = {item["aspect"]: item["value"] for item in request.vibe_data}
    vibe = Vibe(**vibe_dict)

    tracks = lookup_track(vibe, request.track_count)
    print(f"Retrieved {len(tracks)} tracks")
    spotify_tracks = []
    for idx, track in tracks.iterrows():
        spotify_tracks.append(search_spotify_track(track.track_name))

    return [{
        "track_name": track['name'],
        "artists": [artist['name'] for artist in track['artists']],
        "uri": track['uri'],
        "album_art_url": track['album']['images'][0]['url']
    } for track in spotify_tracks]


@router.post("/get-track")
async def get_track(request: VibeDataRequest) -> dict:
    """
    Get a track from the library based on the passed vibe.
    """
    # Convert the vibe_data list to a Vibe object
    vibe = Vibe(**request.vibe)

    track = lookup_track(vibe)
    track = search_spotify_track(track.track_name)
    print(track)
    return {
        "track_name": track['name'],
        "artists": [artist['name'] for artist in track['artists']],
        "uri": track['uri'],
        "album_art_url": track['album']['images'][0]['url']
    }


def remove_from_library(idx):
    """
    When a track is used, remove it from the library.
    """
    global df, df_scaled, df_filtered
    df = df.iloc[idx != range(len(df))]
    df_scaled = df_scaled[idx != range(len(df_scaled))]
    df_filtered = df_filtered[idx != range(len(df_filtered))]


def lookup_track(vibe, count=1):
    """
    Lookup a track in the passed df using the various attributes of vibe.
    Finds the 5 closest matches in the df by euclidean distance.
    """
    # Create a new row for the vibe
    vibe_row = pd.DataFrame([vibe.__dict__])

    # Normalize the vibe row
    vibe_row_scaled = scaler.transform(vibe_row)

    # Calculate the euclidean distance
    distances = distance.cdist(
        df_scaled, vibe_row_scaled, 'euclidean').flatten()
    print(f"Distances: {distances.shape}")

    # Get the 5 closest matches
    closest_matches = distances.argsort()[:count]
    print(f"Closest matches: {closest_matches}")
    for closest_match in closest_matches:
        remove_from_library(closest_match)

    return df.iloc[closest_matches]


def generate_query(db_row):
    """
    Generate a query to search on spotify for the passed db_row.
    """
    return db_row['track_name'] + " " + db_row['artists']
