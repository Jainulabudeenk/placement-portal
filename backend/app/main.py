from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, jobs, recruiters, applications, admin, students
from app.api.deps import get_current_user
from app.models.user import User

app = FastAPI(title="Placement Portal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://placement-portal-nine-tau.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(recruiters.router)
app.include_router(applications.router)
app.include_router(admin.router)
app.include_router(students.router)


@app.get("/")
def read_root():
    return {"message": "Placement Portal API is running"}


@app.get("/me")
def read_current_user(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "role": current_user.role,
    }