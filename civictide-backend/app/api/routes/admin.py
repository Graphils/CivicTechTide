from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.database import get_db
from app.models.report import Report, ReportStatus, ReportCategory
from app.models.user import User
from app.core.security import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
def get_dashboard_stats(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Admin dashboard — summary statistics."""
    total_reports = db.query(Report).count()
    total_users = db.query(User).filter(User.is_admin == False).count()
    resolved = db.query(Report).filter(Report.status == ReportStatus.RESOLVED).count()
    in_progress = db.query(Report).filter(Report.status == ReportStatus.IN_PROGRESS).count()
    under_review = db.query(Report).filter(Report.status == ReportStatus.UNDER_REVIEW).count()
    pending = db.query(Report).filter(Report.status == ReportStatus.REPORTED).count()

    # Reports per category
    category_counts = (
        db.query(Report.category, func.count(Report.id))
        .group_by(Report.category)
        .all()
    )

    return {
        "total_reports": total_reports,
        "total_users": total_users,
        "by_status": {
            "reported": pending,
            "under_review": under_review,
            "in_progress": in_progress,
            "resolved": resolved,
        },
        "by_category": {cat.value: count for cat, count in category_counts},
        "resolution_rate": round((resolved / total_reports * 100), 1) if total_reports else 0
    }
