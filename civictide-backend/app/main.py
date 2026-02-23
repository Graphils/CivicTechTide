from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.database import Base, engine
from app.api.routes import auth, reports, admin, engagement

# Import all models so SQLAlchemy creates their tables
from app.models import user, report, engagement as engagement_models  # noqa

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CivicTide API",
    description="Backend API for CivicTide — A Community Issue Reporting & Tracking Platform by TechTide Stratum",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ── CORS ───────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────
app.include_router(auth.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(engagement.router, prefix="/api")


# ── Health check ───────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {
        "app": "CivicTide API",
        "company": "TechTide Stratum",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
