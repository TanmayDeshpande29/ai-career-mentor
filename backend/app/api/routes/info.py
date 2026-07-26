from fastapi import APIRouter

router = APIRouter()


@router.get("/info")
def get_info():
    return {
    "project": "AI Career Mentor",
    "version": "1.0.0",
    "author": "Tanmay Deshpande"
    }

