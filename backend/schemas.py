from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime


# ==========================================
# UŽIVATEL (User)
# ==========================================
class UserBase(BaseModel):
    username: str
    email: EmailStr  # Pydantic automaticky zkontroluje, jestli je to platný e-mail
    avatar_url: Optional[str] = None


# Tohle přijde z Reactu při registraci
class UserCreate(UserBase):
    password: str


# Tohle vracíme Reactu (bez hesla!)
class UserResponse(UserBase):
    id: int
    created_at: datetime

    # Tento řádek říká Pydanticu, že má číst data ze SQLAlchemy modelů
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