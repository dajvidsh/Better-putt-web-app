import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# Načte proměnné ze souboru .env
load_dotenv()

# Získá URL databáze
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Vytvoří "motor" (engine), který komunikuje s databází
# Přidali jsme pool_pre_ping a pool_recycle pro stabilní spojení s Neon DB
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,  # Zkontroluje, jestli je spojení živé, než tam něco pošle
    pool_recycle=300     # Každých 5 minut preventivně obnoví spojení
)

# Vytvoří továrnu na databázové relace (sessions)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Základní třída pro tvé databázové tabulky (modely)
Base = declarative_base()

# Funkce pro získání připojení k DB pro jednotlivé požadavky (tzv. Dependency)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()