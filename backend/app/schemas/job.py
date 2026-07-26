import uuid
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class JobCreate(BaseModel):
    title: str
    description: Optional[str] = None
    required_skills: Optional[str] = None
    ctc: Optional[str] = None
    location: Optional[str] = None
    deadline: Optional[date] = None


class JobResponse(BaseModel):
    id: uuid.UUID
    company_id: uuid.UUID
    posted_by: uuid.UUID
    title: str
    description: Optional[str]
    required_skills: Optional[str]
    ctc: Optional[str]
    location: Optional[str]
    deadline: Optional[date]
    created_at: datetime

    class Config:
        from_attributes = True