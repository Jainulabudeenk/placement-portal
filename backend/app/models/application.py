import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False)
    status = Column(String, default="applied")  # applied, shortlisted, interview, selected, rejected
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    resume_snapshot_url = Column(String)

    student = relationship("Student", backref="applications")
    job = relationship("Job", backref="applications")