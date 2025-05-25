from typing import Dict
import json

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials, SpotifyOAuth
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel

# from backend.utils import mock, load_mocks_json

load_dotenv()
router = APIRouter()


class PlayRequest(BaseModel):
    track_uri: str


@router.post("/play")
async def play_track(request: PlayRequest):
    """
    Play a track on Spotify.
    """
    sp = setup_spotify_client()
    uri = request.track_uri
    sp.start_playback(uris=[uri])

    return {
        "message": "Track is now playing",
        "track_uri": uri
    }

@router.post("/pause")
async def pause_track():
    """
    Pause the currently playing track on Spotify.
    """
    sp = setup_spotify_client()
    sp.pause_playback()

    return {
        "message": "Playback paused"
    }


def setup_spotify_client() -> spotipy.Spotify:
    # auth_manager = SpotifyClientCredentials()
    auth_manager = SpotifyOAuth(
        scope="user-read-playback-state,user-modify-playback-state")
    sp = spotipy.Spotify(auth_manager=auth_manager)
    return sp


def search_spotify_track(track_name: str, return_first_result=True) -> Dict:
    """
    Search for a track on Spotify.
    """
    sp = setup_spotify_client()
    search_res = sp.search(q=track_name, type="track")
    if return_first_result:
        return search_res['tracks']['items'][0]
    else:
        return search_res


# @mock
# def mock_search_spotify_track(track_name: str) -> Dict:
#     """
#     Mock function to simulate Spotify track search.
#     """
#     data = load_mocks_json()
#     return data["mock_search_spotify_track"]


# def parse_album_art(track: Dict) -> str:
#     """
#     Parse the album art URL from a track.
#     """
#     if track['album']['images']:
#         return track['album']['images'][0]['url']
#     return None


# def parse_track_name(track: Dict, get_href=False) -> str:
#     """
#     Parse the track name from a track.
#     """
#     if get_href:
#         return {"name": track['name'], "href": track['external_urls']['spotify']}
#     return track['name']


# def parse_artists_names(track: Dict, get_href=False) -> str:
#     """
#     Parse the artist names from a track.
#     """
#     if get_href:
#         return [{"name": artist['name'], "href": artist['external_urls']['spotify']} for artist in track['artists']]
#     return [artist['name'] for artist in track['artists']]
