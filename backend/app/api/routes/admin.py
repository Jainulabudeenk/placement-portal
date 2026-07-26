from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import require_role
from app.models.user import User
from app.models.company import Company
from app.models.student import Student
from app.models.job import Job
from app.models.application import Application
from app.schemas.recruiter import CompanyResponse
from app.schemas.admin import PlacementStats

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/companies/pending", response_model=List[CompanyResponse])
def pending_companies(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    return db.query(Company).filter(Company.is_approved == False).all()


@router.patch("/companies/{company_id}/approve", response_model=CompanyResponse)
def approve_company(
    company_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    company.is_approved = True
    db.commit()
    db.refresh(company)
    return company


@router.get("/students", response_model=List[dict])
def list_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    students = db.query(Student).all()
    return [
        {
            "id": str(s.id),
            "full_name": s.full_name,
            "department": s.department,
            "cgpa": s.cgpa,
        }
        for s in students
    ]


@router.get("/analytics", response_model=PlacementStats)
def placement_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    total_students = db.query(Student).count()
    total_companies = db.query(Company).count()
    total_jobs = db.query(Job).count()
    total_applications = db.query(Application).count()
    total_selected = db.query(Application).filter(Application.status == "selected").count()
    pending_company_approvals = db.query(Company).filter(Company.is_approved == False).count()

    return PlacementStats(
        total_students=total_students,
        total_companies=total_companies,
        total_jobs=total_jobs,
        total_applications=total_applications,
        total_selected=total_selected,
        pending_company_approvals=pending_company_approvals,
    )