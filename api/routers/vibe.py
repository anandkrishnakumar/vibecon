from utils import mock
from models import Track, VibeData
from prompts import sys_prompt, sys_prompt_0
from pydantic import BaseModel
from fastapi import APIRouter
from dotenv import load_dotenv
from openai import OpenAI
import os
from typing import List, Dict, Union
import sys

# add parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


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
        construct_message(
            [{"type": "input_image", "image_url": "https://example.com/image.jpg"}], "user")
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
def mock_get_vibe(request: VibeRequest) -> Dict[str, Union[Dict, List]]:
    """
    Mock function to simulate vibe extraction.
    """
    return {
        "vibe": {
            "danceability": 0.2,
            "energy": 0.15,
            "speechiness": 0.05,
            "acousticness": 0.85,
            "instrumentalness": 0.6,
            "valence": 0.3,
            "tempo": 60.0
        },
        "summary": {
            "text": "happy",
            "color": "#0000FF",
            "emoji": "😊"
        }
    }


@router.post("/vibe")
def get_vibe(request: VibeRequest) -> Dict[str, Union[Dict, List]]:
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
        text_format=VibeData,
    )

    vibe_data = response.output_parsed

    return vibe_data.model_dump()