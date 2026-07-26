from typing import List
from pydantic import BaseModel


class PlacementStats(BaseModel):
    total_students: int
    total_companies: int
    total_jobs: int
    total_applications: int
    total_selected: int
    pending_company_approvals: int