from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.database import Base


class ReportStatus(str, enum.Enum):
    REPORTED = "reported"
    UNDER_REVIEW = "under_review"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    REJECTED = "rejected"


class ReportCategory(str, enum.Enum):
    ROAD_DAMAGE = "road_damage"
    WATER_SUPPLY = "water_supply"
    SANITATION = "sanitation"
    ELECTRICITY = "electricity"
    FLOODING = "flooding"
    ILLEGAL_DUMPING = "illegal_dumping"
    STREETLIGHT = "streetlight"
    OTHER = "other"


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(Enum(ReportCategory), nullable=False)
    status = Column(Enum(ReportStatus), default=ReportStatus.REPORTED, nullable=False)

    # Location
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String(300), nullable=True)  # human-readable address

    # Media
    image_url = Column(String(500), nullable=True)
    image_public_id = Column(String(200), nullable=True)  # Cloudinary public ID

    # Admin notes
    resolution_notes = Column(Text, nullable=True)

    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    author = relationship("User", back_populates="reports")

    def __repr__(self):
        return f"<Report id={self.id} title={self.title} status={self.status}>"
