# CivicTide Frontend
**By TechTide Stratum** | React + TypeScript | Vite

## 🚀 Getting Started

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Run the dev server
```bash
npm run dev
```
Open http://localhost:5173

> Make sure your backend is running on port 8000 — the Vite proxy will forward /api requests automatically.

### 3. Build for production
```bash
npm run build
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── main.tsx              ← Entry point
│   ├── App.tsx               ← Router & layout
│   ├── index.css             ← Global styles + Tailwind
│   │
│   ├── pages/
│   │   ├── HomePage.tsx      ← Landing page
│   │   ├── LoginPage.tsx     ← Sign in
│   │   ├── RegisterPage.tsx  ← Create account
│   │   ├── MapPage.tsx       ← Live community map
│   │   ├── ReportsPage.tsx   ← Browse all reports
│   │   ├── SubmitReportPage.tsx ← Report an issue
│   │   ├── DashboardPage.tsx ← User's own reports
│   │   └── AdminPage.tsx     ← Admin dashboard
│   │
│   ├── components/
│   │   ├── layout/           ← Navbar, Footer
│   │   ├── ui/               ← Badge components
│   │   ├── reports/          ← ReportCard
│   │   └── map/              ← CivicMap (Leaflet)
│   │
│   ├── services/             ← API calls
│   ├── hooks/                ← Zustand auth store
│   ├── types/                ← TypeScript interfaces
│   └── utils/                ← Helpers, labels, colors
│
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## 🛠 Tech Stack
- **React 18** + **TypeScript**
- **Vite** — fast dev server & build tool
- **Tailwind CSS** — utility-first styling
- **React Router v6** — client-side routing
- **Zustand** — lightweight state management
- **React Hook Form** — form handling
- **Leaflet.js** — interactive maps
- **Axios** — HTTP client
- **React Hot Toast** — notifications
- **Lucide React** — icons

## 🎨 Brand
- **Fonts:** Syne (headings) + DM Sans (body)
- **Colors:** Ocean Blue `#0a3a66` + Wave `#1a8fe8` + Teal `#148f7a`
- **Tagline:** *"Your Voice. Your Community. Your Change."*
