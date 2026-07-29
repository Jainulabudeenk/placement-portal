import uuid
from typing import Optional
from pydantic import BaseModel


class StudentProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    department: Optional[str] = None
    cgpa: Optional[float] = None


class StudentProfileResponse(BaseModel):
    id: uuid.UUID
    full_name: str
    department: Optional[str]
    cgpa: Optional[float]
    resume_url: Optional[str]

    class Config:
        from_attributes = True