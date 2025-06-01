from pydantic import BaseModel, Field, validator


class Track(BaseModel):
    track_name: str
    artist_name: str


class Vibe(BaseModel):
    danceability: float = Field(
        description="Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.")
    energy: float = Field(description="Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale.")
    speechiness: float = Field(description="Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g., talk show radio), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, but where speech is not dominant. Values below 0.33 most likely represent music and other non-speech-like tracks.")
    acousticness: float = Field(
        description="A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.")
    instrumentalness: float = Field(
        description="Predicts whether a track contains no vocals. The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher for tracks closer to 1.0.")
    valence: float = Field(description="A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g., happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g., sad, depressed, angry).")
    tempo: float = Field(description="The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.")


class VibeSummary(BaseModel):
    text: str = Field(description="""
        Describe the visual aesthetic of the image in max 3 words.
        Don't mention music or emotion directly.
        Don't use generic adjectives like 'chill', 'calm', 'cozy', or 'vibe'.
        Think visually — like someone naming a Tumblr post or moodboard.
        Use unusual, evocative, or cinematic phrasing.
        Examples: 'static motel silence', 'blue plastic dusk', 'humid velvet glow'
    """)
    color: str = Field(
        description="A color representation of the vibe, typically in hex format.")
    emoji: str = Field(description="An emoji representing the vibe.")

    @validator('text')
    def text_must_be_lowercase(cls, v):
        return v.lower()


class VibeData(BaseModel):
    vibe: Vibe
    summary: VibeSummary
