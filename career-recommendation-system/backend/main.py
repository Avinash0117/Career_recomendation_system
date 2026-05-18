import os

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ranking_model import ranker


def _cors_settings():
    """
    CORS_ORIGINS: comma-separated list, e.g. https://myapp.vercel.app,https://www.mydomain.com
    Use * for development only (browsers disallow credentials with *).
    """
    raw = os.environ.get("CORS_ORIGINS", "*").strip()
    if raw == "*":
        return ["*"], False
    origins = [o.strip() for o in raw.split(",") if o.strip()]
    if not origins:
        return ["*"], False
    return origins, True


_cors_origins, _cors_credentials = _cors_settings()

app = FastAPI(title="CareerPath.AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=_cors_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserProfile(BaseModel):
    name: str
    phone: str = ""
    year_passed: str = ""
    college: str = ""
    skills: str
    interests: str
    projects: str = ""
    experience: str = ""


@app.get("/")
def root():
    return {"message": "CareerPath.AI API", "docs": "/docs", "health": "/health"}


@app.get("/health")
def health():
    return {"status": "ok", "model_ready": bool(ranker.is_ready)}


@app.post("/recommend")
def recommend_job(user: UserProfile):
    recommendations = ranker.recommend(
        user_skills=user.skills,
        user_interests=user.interests,
        user_projects=user.projects,
        user_experience=user.experience,
    )

    if not recommendations:
        return jsonable_encoder(
            {
                "message": "No direct matches found.",
                "recommendations": [],
            }
        )

    return jsonable_encoder(
        {
            "user_profile": user.model_dump(),
            "recommendations": recommendations,
        }
    )
