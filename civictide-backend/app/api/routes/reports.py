from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import Optional
import cloudinary
import cloudinary.uploader

from app.db.database import get_db
from app.models.report import Report, ReportCategory, ReportStatus
from app.models.user import User
from app.schemas.report import ReportCreate, ReportUpdate, ReportOut, ReportListOut
from app.core.security import get_current_user, get_current_admin
from app.core.config import settings
from app.services.email import send_status_update_email, send_new_report_email

router = APIRouter(prefix="/reports", tags=["Reports"])

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)


def send_email_safe(fn, *args):
    """Send email directly — background threads get killed on Render free tier."""
    try:
        fn(*args)
    except Exception as e:
        print(f"❌ Email error: {e}")


# ── Public routes ──────────────────────────────────────

@router.get("/", response_model=ReportListOut)
def get_all_reports(
    category: Optional[ReportCategory] = None,
    status: Optional[ReportStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Report)
    if category:
        query = query.filter(Report.category == category)
    if status:
        query = query.filter(Report.status == status)

    total = query.count()
    reports = query.order_by(Report.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for r in reports:
        data = ReportOut.model_validate(r)
        data.author_name = r.author.full_name if r.author else None
        result.append(data)

    return ReportListOut(total=total, reports=result)


@router.get("/my/reports", response_model=ReportListOut)
def get_my_reports(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reports = db.query(Report).filter(Report.user_id == current_user.id).order_by(Report.created_at.desc()).all()
    result = [ReportOut.model_validate(r) for r in reports]
    return ReportListOut(total=len(result), reports=result)


@router.get("/{report_id}", response_model=ReportOut)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    data = ReportOut.model_validate(report)
    data.author_name = report.author.full_name if report.author else None
    return data


# ── Authenticated routes ───────────────────────────────

@router.post("/", response_model=ReportOut, status_code=201)
async def create_report(
    title: str = Form(...),
    description: str = Form(...),
    category: ReportCategory = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    address: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    image_url = None
    image_public_id = None

    if image:
        try:
            contents = await image.read()
            upload_result = cloudinary.uploader.upload(
                contents, folder="civictide/reports", resource_type="image"
            )
            image_url = upload_result.get("secure_url")
            image_public_id = upload_result.get("public_id")
        except Exception as e:
            print(f"Image upload failed: {e}")

    report = Report(
        title=title,
        description=description,
        category=category,
        latitude=latitude,
        longitude=longitude,
        address=address,
        image_url=image_url,
        image_public_id=image_public_id,
        user_id=current_user.id
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    # Notify all admins by email
    admins = db.query(User).filter(User.is_admin == True).all()
    for admin in admins:
        send_email_safe(
            send_new_report_email,
            admin.email,
            title,
            category.value,
            current_user.full_name
        )

    data = ReportOut.model_validate(report)
    data.author_name = current_user.full_name
    return data


# ── Admin routes ───────────────────────────────────────

@router.patch("/{report_id}/status", response_model=ReportOut)
def update_report_status(
    report_id: int,
    payload: ReportUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = payload.status
    if payload.resolution_notes:
        report.resolution_notes = payload.resolution_notes

    db.commit()
    db.refresh(report)

    # Email the report author directly
    author = db.query(User).filter(User.id == report.user_id).first()
    if author:
        send_email_safe(
            send_status_update_email,
            author.email,
            author.full_name,
            report.title,
            payload.status.value,
            payload.resolution_notes
        )

    data = ReportOut.model_validate(report)
    data.author_name = report.author.full_name if report.author else None
    return data


@router.delete("/{report_id}", status_code=204)
def delete_report(
    report_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(report)
    db.commit()