from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy.sql import func
from datetime import timedelta, datetime
from jose import JWTError, jwt

import models
import schemas
import auth_utils
from database import engine, get_db
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# Tento řádek automaticky vytvoří tabulky v Neon DB podle souboru models.py
models.Base.metadata.create_all(bind=engine)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/gate")
app = FastAPI(title="Better Putt API")

# Nastavení CORS (jako minule)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Vítej v Better Putt API!"}


# Nový testovací endpoint, který ověří, že databáze funguje
@app.get("/api/db-test")
def test_db_connection(db: Session = Depends(get_db)):
    # Pokusíme se načíst všechny uživatele (zatím tam žádní nebudou)
    users = db.query(models.User).all()
    return {"message": "Připojení k Neon DB je funkční!", "user_count": len(users)}


@app.get("/api/seed")
def seed_database(db: Session = Depends(get_db)):
    # 1. Vytvoření testovacího uživatele (pokud ještě neexistuje)
    test_user = db.query(models.User).filter(models.User.id == 1).first()
    if not test_user:
        test_user = models.User(
            id=1,
            username="Dajvid",
            email="dajvid@test.cz",
            hashed_password="zatim-nepotrebujeme-heslo"
        )
        db.add(test_user)

    # 2. Vytvoření seznamu herních módů (číselník)
    game_modes = [
        {"id": "jyly", "name": "JYLY Putting", "description": "Klasická hra na 20 kol"},
        {"id": "drill", "name": "Drill", "description": "Opakování ze stejné vzdálenosti"},
        {"id": "survival", "name": "Survival", "description": "Hraj dokud ti nedojdou životy"}
    ]

    for mode in game_modes:
        # Zkontrolujeme, jestli už tam ten mód není, ať ho nevytváříme dvakrát
        existing_mode = db.query(models.GameMode).filter(models.GameMode.id == mode["id"]).first()
        if not existing_mode:
            new_mode = models.GameMode(
                id=mode["id"],
                name=mode["name"],
                description=mode["description"]
            )
            db.add(new_mode)

    # Uložíme všechny změny do Neon DB
    db.commit()

    return {"message": "Databáze byla úspěšně naplněna startovacími daty!"}


@app.post("/api/join", response_model=schemas.UserOut)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Zkontrolujeme, jestli uživatel už neexistuje
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email už je zaregistrován")

    # Hashování hesla!
    hashed_pwd = auth_utils.get_password_hash(user.password)

    new_user = models.User(
        email=user.email,
        hashed_password=hashed_pwd,
        username=user.username
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/api/gate", response_model=schemas.Token)
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    # 1. Najdeme uživatele podle emailu (OAuth2PasswordRequestForm dává email do pole username)
    user = db.query(models.User).filter(models.User.email == form_data.username).first()

    # 2. Ověříme heslo
    if not user or not auth_utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Nesprávný email nebo heslo",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Vytvoříme token
    access_token_expires = timedelta(minutes=auth_utils.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_utils.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth_utils.SECRET_KEY, algorithms=[auth_utils.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/api/trainings/save", response_model=schemas.GameSessionResponse)
def save_training(session_data: schemas.GameSessionCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = current_user.id

    # 2. Vytvoříme hlavní záznam o hře
    db_session = models.GameSession(
        user_id=user_id,
        game_mode_id=session_data.game_mode_id,
        total_score=session_data.total_score,
        total_makes=session_data.total_makes,
        total_attempts=session_data.total_attempts,
        settings=session_data.settings,
        completed_at=func.now()  # Nastavíme, že byla právě dohrána
    )
    db.add(db_session)
    db.commit()  # Uložíme hru, abychom pro ni získali její ID
    db.refresh(db_session)

    # 3. Uložíme všechny hody (kola), co React poslal, a napojíme je na tuto hru
    for round_data in session_data.rounds:
        db_round = models.SessionRound(
            session_id=db_session.id,  # Napojení na hru z kroku 2
            round_number=round_data.round_number,
            distance=round_data.distance,
            attempts=round_data.attempts,
            makes=round_data.makes,
            score_earned=round_data.score_earned
        )
        db.add(db_round)

    db.commit()  # Uložíme všechna kola naráz
    db.refresh(db_session)

    # 4. FastAPI automaticky vezme db_session a podle GameSessionResponse to pošle zpět do Reactu!
    return db_session


@app.get("/api/statistics")
def get_user_statistics(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = current_user.id

    sessions = db.query(models.GameSession).filter(models.GameSession.user_id == user_id).all()

    total_trainings = len(sessions)
    total_score = sum(session.total_score for session in sessions)
    total_putts = sum(session.total_attempts for session in sessions)

    game_stats_dict = {}

    for session in sessions:
        mode = session.game_mode_id
        if mode not in game_stats_dict:
            game_stats_dict[mode] = {
                "name": mode.upper(),
                "attempts": 0,
                "total_score_sum": 0,
                "total_putts_sum": 0,
                "total_makes_sum": 0,
                "total_attempts_sum": 0,
                "bestScore": 0,
                "best_percentage": 0
            }

        stats = game_stats_dict[mode]
        stats["attempts"] += 1
        stats["total_score_sum"] += session.total_score
        stats["total_putts_sum"] += session.total_attempts
        stats["total_makes_sum"] += session.total_makes
        stats["total_attempts_sum"] += session.total_attempts

        if session.total_score > stats["bestScore"]:
            stats["bestScore"] = session.total_score

        if session.total_attempts > 0:
            pct = round((session.total_makes / session.total_attempts) * 100)
            if pct > stats["best_percentage"]:
                stats["best_percentage"] = pct

    formatted_game_stats = []
    for mode, stats in game_stats_dict.items():
        if mode == "drill":
            avg = round((stats["total_makes_sum"] / stats["total_attempts_sum"]) * 100) if stats["total_attempts_sum"] > 0 else 0
            best = stats["best_percentage"]
        else:
            avg = round(stats["total_score_sum"] / stats["attempts"]) if stats["attempts"] > 0 else 0
            best = stats["bestScore"]

        formatted_game_stats.append({
            "name": stats["name"],
            "attempts": stats["attempts"],
            "avgScore": avg,
            "bestScore": best
        })

    return {
        "overview": {
            "total_score": total_score,
            "total_trainings": total_trainings,
            "total_putts": total_putts,
            "rank": 47,
            "total_time_hours": "12h"
        },
        "gameStats": formatted_game_stats
    }


@app.get('/api/games')
def get_games(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = current_user.id

    sessions = db.query(models.GameSession).filter(models.GameSession.user_id == user_id).order_by(
        models.GameSession.completed_at.desc()).all()
    games_dict = []

    for session in sessions:
        if session.game_mode_id == 'drill':
            pct = round((session.total_makes / session.total_attempts) * 100) if session.total_attempts > 0 else 0
        else:
            pct = session.total_score

        games_dict.append({
            "id": session.id,
            "game_mode_id": session.game_mode_id,
            "game_name": session.game_mode_id.upper(),
            "total_score": pct,
            "total_makes": session.total_makes,
            "total_attempts": session.total_attempts,
            "date": session.completed_at.strftime("%d.%m.%Y") if session.completed_at else "Neznámé datum"
        })

    return games_dict


@app.get('/api/game-modes')
def get_games(db: Session = Depends(get_db)):

    sessions = db.query(models.GameMode).order_by(models.GameMode.id).all()
    game_modes_dict = []

    for session in sessions:

        game_modes_dict.append({
            "id": session.id,
            "name": session.name,
            "description": session.description,
        })

    return game_modes_dict

@app.get("/api/me", response_model=schemas.UserOut)
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    return current_user