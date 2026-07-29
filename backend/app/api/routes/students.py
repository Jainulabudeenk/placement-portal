import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import require_role
from app.core.cloudinary_config import upload_resume
from app.models.user import User
from app.models.student import Student
from app.schemas.student import StudentProfileUpdate, StudentProfileResponse

router = APIRouter(prefix="/students", tags=["students"])

ALLOWED_TYPES = {"application/pdf", "application/msword",
                 "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}


@router.post("/upload-resume")
def upload_resume_endpoint(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF or Word documents are allowed")

    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Student profile not found")

    file_bytes = file.file.read()
    unique_name = f"{student.id}_{uuid.uuid4().hex[:8]}"
    resume_url = upload_resume(file_bytes, unique_name)

    student.resume_url = resume_url
    db.commit()
    db.refresh(student)

    return {"resume_url": student.resume_url}
@router.get("/me", response_model=StudentProfileResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Student profile not found")
    return student


@router.put("/me", response_model=StudentProfileResponse)
def update_my_profile(
    payload: StudentProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Student profile not found")

    if payload.full_name is not None:
        student.full_name = payload.full_name
    if payload.department is not None:
        student.department = payload.department
    if payload.cgpa is not None:
        student.cgpa = payload.cgpa

    db.commit()
    db.refresh(student)
    return student