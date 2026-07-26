from fastapi import FastAPI

from app.core.config import settings
from app.api.routes.health import router as health_router
from app.api.routes.info import router as info_router

app = FastAPI(
    title = settings.PROJECT_NAME,
    version= settings.VERSION
)

app.include_router(health_router)

app.include_router(info_router)