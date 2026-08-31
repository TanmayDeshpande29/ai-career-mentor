from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router
from app.api.routes.health import router as health_router
from app.api.routes.info import router as info_router
from app.api.routes.career_profile import router as career_profile_router 
from app.api.routes.resume import router as resume_router
from app.api.routes.roadmap import router as roadmap_router
from app.api.routes.chat import router as chat_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.settings import router as settings_router

app = FastAPI(title="AI Career Mentor API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(health_router)
app.include_router(info_router)
app.include_router(career_profile_router)
app.include_router(resume_router)
app.include_router(roadmap_router)
app.include_router(chat_router)
app.include_router(dashboard_router)
app.include_router(settings_router)


@app.get("/")
def root():
    return {"message": "AI Career Mentor API is running"}