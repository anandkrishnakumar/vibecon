from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import spotify, vibe, db
from routers.auth import auth
from routers.auth import spotify_auth

app = FastAPI(
    title="VibeCon",
    docs_url="/api/docs",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(spotify_auth.router, prefix="/api/auth", tags=["Spotify Auth"])


app.include_router(spotify.router, prefix="/api", tags=["Spotify"])
app.include_router(vibe.router, prefix="/api", tags=["Vibe"])
app.include_router(db.router, prefix="/api", tags=["Database"])

@app.get("/api/")
async def root():
    """
    Root endpoint.
    """
    return {"message": "Welcome to the VibeCon API!"}