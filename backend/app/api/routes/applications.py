from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_user, require_role
from app.models.user import User
from app.models.student import Student
from app.models.job import Job
from app.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationResponse, ApplicantResponse, ApplicationStatusUpdate
router = APIRouter(prefix="/applications", tags=["applications"])


@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_to_job(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Student profile not found")

    job = db.query(Job).filter(Job.id == payload.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    existing = db.query(Application).filter(
        Application.student_id == student.id,
        Application.job_id == payload.job_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already applied to this job")

    new_application = Application(
        student_id=student.id,
        job_id=payload.job_id,
        resume_snapshot_url=student.resume_url,
    )
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return new_application


@router.get("/my", response_model=List[ApplicationResponse])
def my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Student profile not found")

    return db.query(Application).filter(Application.student_id == student.id).all()


@router.get("/job/{job_id}", response_model=List[ApplicationResponse])
def applicants_for_job(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("recruiter")),
):
    return db.query(Application).filter(Application.job_id == job_id).all()


@router.get("/job/{job_id}", response_model=List[ApplicantResponse])
def applicants_for_job(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("recruiter")),
):
    applications = db.query(Application).filter(Application.job_id == job_id).all()
    results = []
    for app in applications:
        student = db.query(Student).filter(Student.id == app.student_id).first()
        results.append(
            ApplicantResponse(
                id=app.id,
                student_id=app.student_id,
                job_id=app.job_id,
                status=app.status,
                applied_at=app.applied_at,
                resume_url=student.resume_url if student else None,
                student_name=student.full_name if student else "Unknown",
            )
        )
    return results