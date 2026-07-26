import uuid
from typing import Optional
from pydantic import BaseModel


class CompanyCreate(BaseModel):
    name: str
    description: Optional[str] = None
    website: Optional[str] = None


class RecruiterRegisterCompany(BaseModel):
    designation: Optional[str] = None
    company: CompanyCreate


class RecruiterResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    company_id: uuid.UUID
    designation: Optional[str]

    class Config:
        from_attributes = True


class CompanyResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str]
    website: Optional[str]
    is_approved: bool

    class Config:
        from_attributes = True