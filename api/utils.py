from time import sleep
import json
from functools import wraps

MOCKS_JSON_PATH = "/Users/anandkrishnakumar/Coding/VibeConnoisseur/backend/mocks.json"

def mock(func):
    """
    Decorator to mock a function.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        sleep(1)
        return func(*args, **kwargs)

    return wrapper

def load_mocks_json() -> dict:
    """
    Load the mocks from a JSON file.
    """
    with open(MOCKS_JSON_PATH, "r") as f:
        data = json.load(f)
    return data