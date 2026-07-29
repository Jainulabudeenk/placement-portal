import cloudinary
import cloudinary.uploader
from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)


def upload_resume(file_bytes: bytes, filename: str) -> str:
    result = cloudinary.uploader.upload(
        file_bytes,
        resource_type="image",
        type="upload",
        format="pdf",
        public_id=f"resumes/{filename.rsplit('.', 1)[0]}",
        overwrite=True,
    )
    return result["secure_url"]