from pydantic import BaseModel
from datetime import datetime
from typing import Optional

from app.models.report import ReportCategory, ReportStatus


class ReportCreate(BaseModel):
    title: str
    description: str
    category: ReportCategory
    latitude: float
    longitude: float
    address: Optional[str] = None


class ReportUpdate(BaseModel):
    """Admin only — update status and resolution notes."""
    status: ReportStatus
    resolution_notes: Optional[str] = None


class ReportOut(BaseModel):
    id: int
    title: str
    description: str
    category: ReportCategory
    status: ReportStatus
    latitude: float
    longitude: float
    address: Optional[str]
    image_url: Optional[str]
    resolution_notes: Optional[str]
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    # Author info
    author_name: Optional[str] = None

    class Config:
        from_attributes = True


class ReportListOut(BaseModel):
    total: int
    reports: list[ReportOut]
