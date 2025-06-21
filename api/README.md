# VibeCon API (Backend)

This directory contains the backend API for VibeCon, implemented with FastAPI.

## Prerequisites

- Python 3.11+
- Poetry

## Setup

```bash
cd api
poetry install
```

## Environment Variables

Create (or update) a `.env` file in this directory with the following variables:

```env
OPENAI_API_KEY=<your_openai_api_key>
SPOTIPY_CLIENT_ID=<your_spotify_client_id>
SPOTIPY_CLIENT_SECRET=<your_spotify_client_secret>
SPOTIPY_REDIRECT_URI=<your_spotify_redirect_uri>
MUSICBRAINZ_USER=<your_musicbrainz_username>
MUSICBRAINZ_PASS=<your_musicbrainz_password>
LISTENBRAINZ_TOKEN=<your_listenbrainz_token>
LASTFM_API_KEY=<your_lastfm_api_key>
LASTFM_API_SECRET=<your_lastfm_api_secret>
LASTFM_USERNAME=<your_lastfm_username>
```

## Running the Server

Start the development server:

```bash
poetry run python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at [http://localhost:8000/api/](http://localhost:8000/api/) and interactive docs at [http://localhost:8000/api/docs](http://localhost:8000/api/docs).

## Project Structure

```plaintext
api/
├── main.py             # FastAPI application
├── routers/            # API routers for auth, spotify, vibe, db, etc.
├── models.py           # Data models
├── prompts.py          # Prompt templates for OpenAI
├── utils.py            # Utility functions
├── pyproject.toml      # Poetry project file
└── poetry.lock         # Poetry lockfile
```