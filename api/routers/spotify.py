from typing import Dict
import json

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials, SpotifyOAuth
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

# from backend.utils import mock, load_mocks_json
from routers.auth.spotify_auth import get_user_tokens, refresh_access_token

load_dotenv()
router = APIRouter()


class PlayRequest(BaseModel):
    track_uri: str

# TODO: Handle expired tokens and refresh them - done
# TODO: When play is called, if same track is already playing, just resume it - done
# TODO: Move track exclusion to client side, so that it doesm't affect the server's state
# TODO: Enhance player to allow seeking & skipping tracks
# TODO: Back camera


async def spotify_request(tokens: dict, operation):
    """
    Generic function to handle Spotify requests with automatic token refresh.
    """
    access_token = tokens.get("access_token")
    refresh_token = tokens.get("refresh_token")

    try:
        # Try with current token
        return await operation(access_token)
    except spotipy.exceptions.SpotifyException as e:
        if e.http_status == 401 and "access token expired" in e.msg:
            # Token expired - refresh and retry
            token_data = await refresh_access_token(refresh_token)
            new_access_token = token_data["access_token"]

            result = await operation(new_access_token)
            # Include new tokens in response
            result.update({
                "spotify_access_token": new_access_token,
                "spotify_refresh_token": token_data.get("refresh_token", refresh_token)
            })
            return result
        else:
            raise HTTPException(
                status_code=e.http_status,
                detail=f"Spotify API error: {e.msg}"
            )


@router.post("/play")
async def play_track(request: PlayRequest, tokens: dict = Depends(get_user_tokens)):
    """Play a track on Spotify."""
    uri = request.track_uri

    async def play_operation(access_token):
        sp = setup_spotify_client(token=access_token)
        device_id = get_active_device_id(token=access_token)

        if not device_id:
            raise HTTPException(
                status_code=400,
                detail="No active device found. Please start playing Spotify on any device to activate it."
            )

        # Check if the track is already playing
        current_playback = sp.current_playback()
        if current_playback and current_playback.get('item', {}).get('uri') == uri:
            sp.start_playback(device_id=device_id)  # Resume playback
            return {"message": "Track resumed", "track_uri": uri}
        
        # If not playing, start playback
        sp.start_playback(uris=[uri], device_id=device_id)
        return {"message": "Track is now playing", "track_uri": uri}

    return await spotify_request(tokens, play_operation)


@router.post("/pause")
async def pause_track(tokens: dict = Depends(get_user_tokens)):
    """Pause the currently playing track on Spotify."""

    async def pause_operation(access_token):
        sp = setup_spotify_client(token=access_token)
        device_id = get_active_device_id(token=access_token)

        if not device_id:
            raise HTTPException(
                status_code=400,
                detail="No active device found. Please start playing Spotify on any device to activate it."
            )

        sp.pause_playback(device_id=device_id)
        return {"message": "Playback paused"}

    return await spotify_request(tokens, pause_operation)


def setup_spotify_client(token=None) -> spotipy.Spotify:
    if token:
        sp = spotipy.Spotify(token)
    else:
        # auth_manager = SpotifyClientCredentials()
        auth_manager = SpotifyOAuth(
            scope="user-read-playback-state,user-modify-playback-state")
        sp = spotipy.Spotify(auth_manager=auth_manager)
    return sp


def get_active_device_id(token=None) -> str:
    """
    Get the active device ID from Spotify.
    """
    sp = setup_spotify_client(token)
    devices = sp.devices()
    for device in devices['devices']:
        if device['is_active']:
            return device['id']
    return None


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
