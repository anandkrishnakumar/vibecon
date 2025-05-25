import sys
import os
from typing import List

# add parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pandas as pd
from scipy.spatial import distance
from sklearn.preprocessing import StandardScaler
from fastapi import APIRouter
from pydantic import BaseModel

from models import Vibe
from .spotify import search_spotify_track

router = APIRouter()

# Load songs dataset
# https://www.kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset
DATASET_PATH = "/Users/anandkrishnakumar/Coding/VibeConnoisseur/data/dataset.csv"
df = pd.read_csv(DATASET_PATH)

# Filter to decently popular songs
df = df[df['popularity'] > 50]

cols = Vibe.__annotations__
df_filtered = df[list(cols.keys())]

# Normalize the df
scaler = StandardScaler()
df_scaled = scaler.fit_transform(df_filtered)

class VibeDataRequest(BaseModel):
    vibe_data: List[dict]

@router.post("/get-track")
async def get_track(request: VibeDataRequest) -> dict:
    """
    Get a track from the library based on the passed vibe.
    """
    # Convert the vibe_data list to a Vibe object
    vibe_dict = {item["aspect"]: item["value"] for item in request.vibe_data}
    vibe = Vibe(**vibe_dict)
    
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

def lookup_track(vibe):
    """
    Lookup a track in the passed df using the various attributes of vibe.
    Finds the 5 closest matches in the df by euclidean distance.
    """
    # Create a new row for the vibe
    vibe_row = pd.DataFrame([vibe.__dict__])

    # Normalize the vibe row
    vibe_row_scaled = scaler.transform(vibe_row)

    # Calculate the euclidean distance
    distances = distance.cdist(df_scaled, vibe_row_scaled, 'euclidean')

    # Get the closest match
    closest_match = distances.argsort(axis=0)[0]    
    remove_from_library(closest_match)

    return df.iloc[closest_match]

def generate_query(db_row):
    """
    Generate a query to search on spotify for the passed db_row.
    """
    return db_row['track_name'] + " " + db_row['artists']