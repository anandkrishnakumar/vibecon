from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import spotify, vibe, db, auth

app = FastAPI(
    title="VibeCon"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

app.include_router(spotify.router, tags=["Spotify"])
app.include_router(vibe.router, tags=["Vibe"])
app.include_router(db.router, tags=["Database"])


@app.get("/")
async def root():
    """
    Root endpoint.
    """
    return {"message": "Welcome to the VibeCon API!"}