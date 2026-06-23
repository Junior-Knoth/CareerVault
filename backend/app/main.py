from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import check_database_connection
from app.routers import saves, teams

app = FastAPI(
  title="CareerVault API",
  description="Backend API for the CareerVault application.",
  version="0.2.2",
)

development_origins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=development_origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(saves.router)
app.include_router(teams.router)

@app.get("/", tags=["Root"])
def read_root() -> dict[str, str]:
    return {
        "message": "CareerVault API is running",
        "version": "0.2.2",
    }


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    database_status = "ok" if check_database_connection() else "error"

    return {
        "status": "ok",
        "service": "career-vault-api",
        "version": "0.2.2",
        "database": database_status,
    }
