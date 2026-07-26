from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_user, require_role
from app.models.user import User
from app.models.job import Job
from app.models.recruiter import Recruiter
from app.schemas.job import JobCreate, JobResponse

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("/", response_model=List[JobResponse])
def list_jobs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    jobs = db.query(Job).order_by(Job.created_at.desc()).all()
    return jobs


@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    payload: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("recruiter")),
):
    recruiter = db.query(Recruiter).filter(Recruiter.user_id == current_user.id).first()
    if not recruiter:
        raise HTTPException(status_code=400, detail="Recruiter profile not found")

    new_job = Job(
        company_id=recruiter.company_id,
        posted_by=recruiter.id,
        title=payload.title,
        description=payload.description,
        required_skills=payload.required_skills,
        ctc=payload.ctc,
        location=payload.location,
        deadline=payload.deadline,
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job
@router.get("/my", response_model=List[JobResponse])
def my_posted_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("recruiter")),
):
    recruiter = db.query(Recruiter).filter(Recruiter.user_id == current_user.id).first()
    if not recruiter:
        raise HTTPException(status_code=400, detail="Recruiter profile not found")

    return db.query(Job).filter(Job.posted_by == recruiter.id).order_by(Job.created_at.desc()).all()


@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job