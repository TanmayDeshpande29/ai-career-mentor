from io import BytesIO
from uuid import UUID

from docx import Document
from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile, status
from pypdf import PdfReader
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.database.session import get_db
from app.models.users import User
from app.schemas.resume import EnhancedResumeUpdate, ResumeCreate, ResumeResponse, ResumeUpdate
from app.services.resume_service import ResumeService

router = APIRouter(prefix="/resume", tags=["Resume"])


def extract_resume_text(file_name: str, content: bytes) -> str:
    extension = file_name.lower().rsplit(".", 1)[-1]
    if extension == "pdf":
        return "\n".join(page.extract_text() or "" for page in PdfReader(BytesIO(content)).pages).strip()
    if extension == "docx":
        document = Document(BytesIO(content))
        return "\n".join(paragraph.text for paragraph in document.paragraphs).strip()
    raise HTTPException(status_code=422, detail="Only PDF and DOCX files are supported")


@router.get("/me", response_model=list[ResumeResponse])
def get_resume(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return ResumeService.get(db, current_user.id)


@router.post("/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(status_code=422, detail="A resume file is required")
    content = file.file.read()
    try:
        raw_text = extract_resume_text(file.filename, content)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=422, detail="Unable to read this resume file")
    data = ResumeCreate(
        title=file.filename.rsplit(".", 1)[0][:200],
        file_name=file.filename,
        raw_text=raw_text,
    )
    return ResumeService.save_uploaded(db, current_user.id, data, content, file.content_type)


@router.post("", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
def save_resume(data: ResumeCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return ResumeService.save(db, current_user.id, data)


@router.put("/{resume_id}", response_model=ResumeResponse)
def update_resume(resume_id: UUID, data: ResumeUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        return ResumeService.update(db, current_user.id, resume_id, data)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(resume_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        ResumeService.delete(db, current_user.id, resume_id)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.put("/{resume_id}/enhanced", response_model=ResumeResponse)
def save_enhanced_resume(resume_id: UUID, data: EnhancedResumeUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        return ResumeService.save_enhanced(db, current_user.id, resume_id, data)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.get("/{resume_id}/download")
def download_resume(resume_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = ResumeService.get_one(db, current_user.id, resume_id)
    if not resume or resume.is_deleted:
        raise HTTPException(status_code=404, detail="Resume not found")
    if not resume.file_content:
        raise HTTPException(status_code=404, detail="Original file is not available")
    return Response(content=resume.file_content, media_type=resume.content_type or "application/octet-stream", headers={"Content-Disposition": f'attachment; filename="{resume.file_name or resume.title}"'})


@router.get("/{resume_id}/preview-file")
def preview_file(resume_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = ResumeService.get_one(db, current_user.id, resume_id)
    if not resume or resume.is_deleted:
        raise HTTPException(status_code=404, detail="Resume not found")
    if not resume.file_content or resume.content_type != "application/pdf":
        raise HTTPException(status_code=404, detail="A PDF preview is not available for this resume")
    return Response(content=resume.file_content, media_type="application/pdf", headers={"Content-Disposition": "inline"})


@router.get("/{resume_id}/preview")
def preview_resume(resume_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = ResumeService.get_one(db, current_user.id, resume_id)
    if not resume or resume.is_deleted:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {"id": resume.id, "title": resume.title, "file_name": resume.file_name, "raw_text": resume.raw_text}