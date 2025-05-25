import os
from typing import List, Dict, Union
import sys

# add parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from openai import OpenAI
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel

from prompts import sys_prompt, sys_prompt_0
from models import Track, Vibe
from utils import mock

load_dotenv()
router = APIRouter()

class VibeRequest(BaseModel):
    image_url: str = "https://as2.ftcdn.net/v2/jpg/00/99/26/83/1000_F_99268383_RhULA6sl8wznEIVdih1hDLEo8sNxgpay.jpg"

def setup_openai_client() -> OpenAI:
    # Initialize the OpenAI client with the provided API key
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return client


def construct_message(prompt: Union[str, List], role: str) -> Dict[str, Union[str, List]]:
    """
    Construct a message in the format required by the OpenAI API.

    Example:
        construct_message("Hello, how are you?", "user")
        construct_message([{"type": "input_image", "image_url": "https://example.com/image.jpg"}], "user")
    """
    assert role in ["user", "assistant", "system"], "Invalid role specified"
    return {"role": role, "content": prompt}


def construct_image_prompt(image_url: str) -> List[Dict[str, str]]:
    return [{"type": "input_image", "image_url": image_url}]


def get_song_recommendation(image_url: str = "https://as2.ftcdn.net/v2/jpg/00/99/26/83/1000_F_99268383_RhULA6sl8wznEIVdih1hDLEo8sNxgpay.jpg") -> Track:
    """
    Get a song recommendation based on an image URL.
    """
    client = setup_openai_client()
    messages = [
        construct_message(sys_prompt_0, "system"),
        construct_message(construct_image_prompt(image_url), "user")
    ]

    response = client.responses.parse(
        model="gpt-4.1-mini",
        input=messages,
        text_format=Track,
    )

    return response.output_parsed

@mock
def mock_get_song_recommendation(image_url: str = "https://as2.ftcdn.net/v2/jpg/00/99/26/83/1000_F_99268383_RhULA6sl8wznEIVdih1hDLEo8sNxgpay.jpg") -> Track:
    """
    Mock function to simulate song recommendation.
    """
    return Track(
        track_name="Highway to Hell",
        artist_name="ACDC",
    )

# @router.post("/vibe")
@mock
def mock_get_vibe(request: VibeRequest) -> List[Dict[str, Union[str, float]]]:
    """
    Mock function to simulate vibe extraction.
    """
    return [
        {"aspect": "danceability", "value": 0.6},
        {"aspect": "energy", "value": 0.7},
        {"aspect": "speechiness", "value": 0.1},
        {"aspect": "acousticness", "value": 0.3},
        {"aspect": "instrumentalness", "value": 0.2},
        {"aspect": "valence", "value": 0.6},
    ]

@router.post("/vibe")
def get_vibe(request: VibeRequest) -> List[Dict[str, Union[str, float]]]:
    """
    Get the vibe of a song based on an image URL.
    """
    client = setup_openai_client()
    messages = [
        construct_message(sys_prompt, "system"),
        construct_message(construct_image_prompt(request.image_url), "user")
    ]

    response = client.responses.parse(
        model="gpt-4.1-mini",
        input=messages,
        text_format=Vibe,
    )

    vibe_data = response.output_parsed

    return [
        {"aspect": aspect, "value": value}
        for aspect, value in vibe_data.model_dump().items()
    ]