from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
  title="CareerVault API",
  description="Backend API for the CareerVault application.",
  version="0.0.4",
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

@app.get("/", tags=["Root"])
def read_root() -> dict[str, str]:
    return {
        "message": "CareerVault API is running",
        "version": "0.0.4",
    }


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "career-vault-api",
        "version": "0.0.4",
    }