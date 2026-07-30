import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ApplicationCreate(BaseModel):
    job_id: uuid.UUID


class ApplicationResponse(BaseModel):
    id: uuid.UUID
    student_id: uuid.UUID
    job_id: uuid.UUID
    status: str
    applied_at: datetime
    resume_snapshot_url: Optional[str]

    class Config:
        from_attributes = True


class ApplicantResponse(BaseModel):
    id: uuid.UUID
    student_id: uuid.UUID
    job_id: uuid.UUID
    status: str
    applied_at: datetime
    resume_url: Optional[str]
    student_name: str

    class Config:
        from_attributes = True


class ApplicationStatusUpdate(BaseModel):
    status: str