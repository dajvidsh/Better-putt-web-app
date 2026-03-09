from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


# 1. TABULKA UŽIVATELŮ
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key = True, index = True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)  # Hesla se nikdy neukládají čistá!
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Propojení: Jeden uživatel může mít mnoho odehraných her
    sessions = relationship("GameSession", back_populates="user", cascade="all, delete-orphan")


# 2. TABULKA HERNÍCH MÓDŮ (Číselník)
class GameMode(Base):
    __tablename__ = "game_modes"

    id = Column(String, primary_key = True, index = True)  # např. "jyly", "drill", "survival"
    name = Column(String, nullable=False)  # např. "JYLY Putting"
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    # Propojení s hrami
    sessions = relationship("GameSession", back_populates="game_mode")


# 3. TABULKA ODEHRANÝCH HER (Základní info o celém tréninku)
class GameSession(Base):
    __tablename__ = "game_sessions"

    id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    game_mode_id = Column(String, ForeignKey("game_modes.id"), nullable=False)

    # Celkové výsledky (pro rychlé zobrazení v historii a žebříčcích)
    total_score = Column(Integer, default=0)
    total_makes = Column(Integer, default=0)
    total_attempts = Column(Integer, default=0)

    # Flexibilní pole pro specifické nastavení hry (např. v Drillu si sem uložíš {"target_putts": 100})
    settings = Column(JSON, nullable=True)

    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)  # Pokud je null, hra nebyla dokončena

    # Propojení (Vztahy)
    user = relationship("User", back_populates="sessions")
    game_mode = relationship("GameMode", back_populates="sessions")
    rounds = relationship("SessionRound", back_populates="session", cascade="all, delete-orphan")


# 4. TABULKA JEDNOTLIVÝCH KOL / HODŮ (Detailní statistiky)
class SessionRound(Base):
    __tablename__ = "session_rounds"

    id = Column(Integer, primary_key = True, index = True)
    session_id = Column(Integer, ForeignKey("game_sessions.id"), nullable=False)

    round_number = Column(Integer, nullable=False)  # Pořadí kola (1, 2, 3...)
    distance = Column(Float, nullable=False)  # Vzdálenost v metrech (např. 7.5)
    attempts = Column(Integer, nullable=False)  # Kolik disků se házelo (např. 5)
    makes = Column(Integer, nullable=False)  # Kolik jich spadlo do koše (např. 3)
    score_earned = Column(Integer, default=0)  # Kolik bodů za toto kolo hráč získal

    # Propojení zpět na hru
    session = relationship("GameSession", back_populates="rounds")