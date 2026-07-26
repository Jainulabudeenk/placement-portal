import uuid
from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    department = Column(String)
    cgpa = Column(Float)
    resume_url = Column(String)
    skills = Column(String)  # comma-separated for now, can normalize later
    phone = Column(String)

    user = relationship("User", backref="student_profile")