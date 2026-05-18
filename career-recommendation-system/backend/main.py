from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ranking_model import ranker

app = FastAPI()

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
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
    return {"message": "Job Recommendation API Running 🚀"}

@app.post("/recommend")
def recommend_job(user: UserProfile):
    # Pass all relevant textual fields to the recommendation engine
    recommendations = ranker.recommend(
        user_skills=user.skills,
        user_interests=user.interests,
        user_projects=user.projects,
        user_experience=user.experience
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
