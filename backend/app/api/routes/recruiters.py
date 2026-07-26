from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import require_role
from app.models.user import User
from app.models.company import Company
from app.models.recruiter import Recruiter
from app.schemas.recruiter import RecruiterRegisterCompany, RecruiterResponse

router = APIRouter(prefix="/recruiters", tags=["recruiters"])


@router.post("/register-company", response_model=RecruiterResponse, status_code=201)
def register_company(
    payload: RecruiterRegisterCompany,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("recruiter")),
):
    existing = db.query(Recruiter).filter(Recruiter.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Recruiter profile already exists")

    new_company = Company(
        name=payload.company.name,
        description=payload.company.description,
        website=payload.company.website,
        is_approved=False,
    )
    db.add(new_company)
    db.commit()
    db.refresh(new_company)

    new_recruiter = Recruiter(
        user_id=current_user.id,
        company_id=new_company.id,
        designation=payload.designation,
    )
    db.add(new_recruiter)
    db.commit()
    db.refresh(new_recruiter)

    return new_recruiter