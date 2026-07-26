import uuid
from sqlalchemy import Column, String, Text, ForeignKey, Date, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    posted_by = Column(UUID(as_uuid=True), ForeignKey("recruiters.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    required_skills = Column(String)  # comma-separated for now
    ctc = Column(String)
    location = Column(String)
    deadline = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    company = relationship("Company", backref="jobs")
    recruiter = relationship("Recruiter", backref="jobs_posted")