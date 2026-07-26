from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.models.student import Student
from app.schemas.user import UserRegister, UserLogin, UserResponse, Token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    if payload.role not in ("student", "recruiter"):
        raise HTTPException(status_code=400, detail="Role must be 'student' or 'recruiter'")

    new_user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
        is_verified=False,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    if payload.role == "student":
        student_profile = Student(
            user_id=new_user.id,
            full_name=payload.full_name or "",
        )
        db.add(student_profile)
        db.commit()

    return new_user


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}