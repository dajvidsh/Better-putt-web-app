from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime


# ==========================================
# UŽIVATEL (User)
# ==========================================
class UserBase(BaseModel):
    username: str
    email: EmailStr
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    email: EmailStr
    password: str
    username: str

class UserOut(BaseModel):
    id: int
    email: str
    username: Optional[str]

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


# Tohle vracíme Reactu (bez hesla!)
class UserResponse(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# JEDNOTLIVÁ KOLA / HODY (SessionRound)
# ==========================================
class SessionRoundBase(BaseModel):
    round_number: int
    distance: float
    attempts: int
    makes: int
    score_earned: int = 0


# Co posílá React na konci hry za každé kolo
class SessionRoundCreate(SessionRoundBase):
    pass


class SessionRoundResponse(SessionRoundBase):
    id: int
    session_id: int

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# ODEHRANÁ HRA / TRÉNINK (GameSession)
# ==========================================
class GameSessionBase(BaseModel):
    game_mode_id: str
    total_score: int = 0
    total_makes: int = 0
    total_attempts: int = 0
    settings: Optional[Dict[str, Any]] = None  # Zde si React může poslat cokoliv navíc (např. cílový počet hodů)


# Co posílá React na konci tréninku (Hra + všechny hody)
class GameSessionCreate(GameSessionBase):
    rounds: List[SessionRoundCreate] = []  # Pole jednotlivých kol, které hráč odehrál


class GameSessionResponse(GameSessionBase):
    id: int
    user_id: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    rounds: List[SessionRoundResponse] = []  # Vrátíme hru i s jejími koly

    model_config = ConfigDict(from_attributes=True)