# CivicTide Backend API
**By TechTide Stratum** | BSc Software Engineering Final Year Project | GCTU 2027

## 🚀 Getting Started

### 1. Clone & enter the project
```bash
cd civictide-backend
```

### 2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Set up environment variables
```bash
cp .env.example .env
# Edit .env and fill in your DATABASE_URL, SECRET_KEY, Cloudinary keys, etc.
```

### 5. Set up PostgreSQL database
Make sure PostgreSQL is running, then create your database:
```sql
CREATE DATABASE civictide;
```

### 6. Run the development server
```bash
uvicorn app.main:app --reload
```

### 7. Open the API docs
Visit http://localhost:8000/docs — you'll see the full interactive Swagger UI.

---

## 📁 Project Structure

```
civictide-backend/
├── app/
│   ├── main.py              ← FastAPI app entry point
│   ├── api/
│   │   └── routes/
│   │       ├── auth.py      ← Register, login, /me
│   │       ├── reports.py   ← CRUD for reports
│   │       └── admin.py     ← Admin dashboard stats
│   ├── core/
│   │   ├── config.py        ← App settings from .env
│   │   └── security.py      ← JWT auth & password hashing
│   ├── db/
│   │   └── database.py      ← SQLAlchemy engine & session
│   ├── models/
│   │   ├── user.py          ← User DB model
│   │   └── report.py        ← Report DB model
│   └── schemas/
│       ├── user.py          ← Pydantic schemas for User
│       └── report.py        ← Pydantic schemas for Report
├── tests/                   ← Unit & integration tests
├── .env.example             ← Environment variable template
├── requirements.txt
└── README.md
```

---

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Register new user |
| POST | /api/auth/login | ❌ | Login & get token |
| GET | /api/auth/me | ✅ User | Get my profile |
| GET | /api/reports/ | ❌ | Get all reports (public map) |
| GET | /api/reports/{id} | ❌ | Get single report |
| POST | /api/reports/ | ✅ User | Submit new report |
| GET | /api/reports/my/reports | ✅ User | Get my reports |
| PATCH | /api/reports/{id}/status | ✅ Admin | Update report status |
| DELETE | /api/reports/{id} | ✅ Admin | Delete report |
| GET | /api/admin/stats | ✅ Admin | Dashboard statistics |

---

## 🛠 Tech Stack
- **FastAPI** — Web framework
- **SQLAlchemy** — ORM
- **PostgreSQL** — Database
- **JWT (python-jose)** — Authentication
- **Cloudinary** — Image uploads
- **Uvicorn** — ASGI server
