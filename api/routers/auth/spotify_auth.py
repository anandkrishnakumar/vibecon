import os
import requests

from fastapi import APIRouter, Request, HTTPException, Header
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

SPOTIFY_CLIENT_ID = os.environ["SPOTIPY_CLIENT_ID"]
SPOTIFY_CLIENT_SECRET = os.environ["SPOTIPY_CLIENT_SECRET"]
SPOTIFY_REDIRECT_URI = os.environ["SPOTIPY_REDIRECT_URI"]

@router.get("/spotify/login")
def login_to_spotify():
    scopes = "user-read-playback-state user-modify-playback-state streaming"
    url = (
        "https://accounts.spotify.com/authorize"
        f"?response_type=code"
        f"&client_id={SPOTIFY_CLIENT_ID}"
        f"&scope={scopes}"
        f"&redirect_uri={SPOTIFY_REDIRECT_URI}"
    )
    return RedirectResponse(url)

@router.get("/spotify/get-token")
def spotify_callback(request: Request):
    code = request.query_params.get("code")

    token_url = "https://accounts.spotify.com/api/token"
    response = requests.post(token_url, data={
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": SPOTIFY_REDIRECT_URI,
        "client_id": SPOTIFY_CLIENT_ID,
        "client_secret": SPOTIFY_CLIENT_SECRET
    })

    if response.status_code == 200:
        token_data = response.json()
        return {
            "access_token": token_data["access_token"],
            "refresh_token": token_data.get("refresh_token"),
            "expires_in": token_data.get("expires_in")
        }
    else:
        raise HTTPException(status_code=400, detail="Failed to exchange code for token")
    
async def get_user_access_token(authorization: str = Header(None)):
    """
    Extracts the access token from the Authorization header.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid")
    
    return authorization.replace("Bearer ", "", 1)