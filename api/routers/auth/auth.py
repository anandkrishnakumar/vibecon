from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
async def login(request: LoginRequest):
    """
    Handle user login.
    This is a placeholder function. In a real application, you would verify the username and password.
    """
    if request.username == "testuser" and request.password == "testpass":
        return {"message": "Login successful", "username": request.username, "token": "fake-jwt-token"}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")