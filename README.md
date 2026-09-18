# Darukaa.Earth

 **A Premium Geospatial Environmental Intelligence Platform** 

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PostGIS](https://img.shields.io/badge/PostGIS-3.4-336791?logo=postgresql&logoColor=white)](https://postgis.net)
[![Supabase](https://img.shields.io/badge/Supabase-2.10-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Mapbox GL JS](https://img.shields.io/badge/Mapbox_GL_JS-3.31-FF3366?logo=mapbox&logoColor=white)](https://mapbox.com)
[![Highcharts](https://img.shields.io/badge/Highcharts-13.0-007BFF?logo=highcharts&logoColor=white)](https://highcharts.com)

---

## 🎯 Vision & Problem Statement

Carbon and biodiversity projects are inherently geographic — yet traditional dashboards strip away spatial context. Darukaa.Earth bridges this gap by combining **interactive geospatial mapping** with **environmental time-series analytics** in a single, polished interface.

**The Core User Journey:**
```
Create Project → Add Geographic Sites → Draw Polygon Boundaries → 
Persist to PostGIS → Select Site → View Site Intelligence → 
Analyze Environmental Performance
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DARUKAA.EARTH   ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐     HTTPS/REST/JWT      ┌──────────────┐                  │
│  │   VERCEL     │ ──────────────────────► │    RENDER    │                  │
│  │  (Frontend)  │                         │  (FastAPI)   │                  │
│  │ React + Vite │                         │              │                  │
│  └──────────────┘                         └──────┬───────┘                  │
│                                                   │ SQLAlchemy + GeoAlchemy2 │
│                                                   ▼                          │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                            SUPABASE                                    │   │
│  │  ┌─────────────┐  ┌──────────────────┐  ┌────────────────────────┐  │   │
│  │  │ PostgreSQL  │  │     PostGIS      │  │      Supabase Auth     │  │   │
│  │  │   16.x      │  │     3.4+         │  │   (JWT + Email/Pass)   │  │   │
│  │  └─────────────┘  └──────────────────┘  └────────────────────────┘  │   │
│  │         │                 │                     │                    │   │
│  │         └─────────────────┼─────────────────────┘                    │   │
│  │                           ▼                                          │   │
│  │              ┌────────────────────────┐                              │   │
│  │              │  Spatial Data Tables   │                              │   │
│  │              │  projects, sites,      │                              │   │
│  │              │  site_metrics          │                              │   │
│  │              └────────────────────────┘                              │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architecture Decisions & Rationale

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Frontend Framework** | React 18 + TypeScript + Vite | Mature ecosystem, excellent TypeScript support, fast HMR |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first, consistent design system, accessible components |
| **Mapping** | Mapbox GL JS + Mapbox Draw | Industry-standard, performant WebGL rendering, built-in drawing tools |
| **Charts** | Highcharts + highcharts-react-official | Professional time-series viz, export capabilities, accessibility |
| **Backend** | FastAPI + SQLAlchemy 2.0 + GeoAlchemy2 | Async-first, automatic OpenAPI docs, native PostGIS support |
| **Database** | Supabase (PostgreSQL 16 + PostGIS 3.4) | Managed infrastructure, built-in Auth, realtime, dashboard |
| **Authentication** | Supabase Auth (JWT) | Battle-tested, email/password + OAuth ready, RLS support |
| **Deployment** | Vercel (FE) + Render (BE) + Supabase (DB) | Zero-config deployments, generous free tiers, GitHub integration |

---

## 📁 Project Structure

```
Daruka_full_stack/
├── .github/
│   └── workflows/              # CI/CD pipelines
├── .skills/                    # Opencode skills (design, engineering, PM, productivity)
├── backend/                    # FastAPI Application
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── auth.py
│   │   │   │   │   ├── projects.py
│   │   │   │   │   ├── sites.py
│   │   │   │   │   └── analytics.py
│   │   │   │   └── router.py
│   │   │   └── deps.py
│   │   ├── core/
│   │   │   ├── config.py       # Pydantic Settings
│   │   │   ├── database.py     # Async engine + session
│   │   │   └── security.py     # JWT handling
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   ├── site.py
│   │   │   └── metrics.py
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── project.py
│   │   │   ├── site.py
│   │   │   └── analytics.py
│   │   ├── services/
│   │   │   ├── geospatial.py   # PostGIS operations
│   │   │   └── analytics.py    # Aggregation logic
│   │   └── main.py
│   ├── alembic/                # Database migrations
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                   # React + Vite Application (Supabase Auth)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   └── ui/             # shadcn/ui components
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   └── supabase.ts
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── frontend/                   # React + Vite Application (Mapbox + Leaflet + Mock Data)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/         # Highcharts wrappers
│   │   │   ├── layout/         # AppShell, Sidebar, Topbar, PageHeader
│   │   │   ├── map/            # MapView, MapToolbar, MapLegend
│   │   │   ├── projects/       # ProjectCard
│   │   │   ├── sites/          # SiteDrawer, CreateSiteDialog, SiteMetrics
│   │   │   └── ui/             # Design system (Button, Card, KpiCard, etc.)
│   │   ├── data/
│   │   │   └── mockData.ts     # Realistic environmental demo data
│   │   ├── hooks/
│   │   │   ├── useToast.ts
│   │   │   └── useCountUp.ts
│   │   ├── lib/
│   │   │   └── utils.ts        # Geospatial utilities
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   ├── Login/
│   │   │   └── Project/
│   │   ├── types/
│   │   │   └── index.ts        # Core TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── project_guide/
│   ├── prd.txt                 # Product Requirements Document
│   ├── phasewise_todolist.md   # 27-phase implementation plan
│   └── *.pdf                   # Reference documents
├── .env                        # Environment variables (not committed)
├── .env.example                # Environment template
└── README.md                   # This file
```

> **Note:** The `frontend/` directory contains the primary hackathon implementation with Mapbox/Leaflet integration and realistic mock data. The `backend/` directory contains the FastAPI service with full PostGIS support.

---

## 🗄️ Data Models

### Entity Relationship Diagram

```
┌─────────────────────┐
│      auth.users     │
├─────────────────────┤
│ PK id (UUID)        │
│ email               │
└──────────┬──────────┘
           │ 1:N (owner_id)
           ▼
┌─────────────────────┐
│      projects       │
├─────────────────────┤
│ PK id (UUID)        │
│ FK owner_id         │
│ name                │
│ project_type        │  ───► 'Carbon' | 'Biodiversity' | 'Mixed'
│ status              │  ───► 'draft' | 'active' | 'completed' | 'archived'
│ description         │
│ location            │
│ start_date          │
│ end_date            │
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │ 1:N (project_id)
           ▼
┌─────────────────────┐
│        sites        │  ◄─── POSTGIS GEOMETRY(POLYGON, 4326)
├─────────────────────┤
│ PK id (UUID)        │
│ FK project_id       │
│ name                │
│ description         │
│ geometry            │  ◄─── ST_GeomFromGeoJSON() / ST_Area(geography)
│ area_ha             │
│ status              │  ───► 'active' | 'inactive' | 'pending' | 'archived'
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │ 1:N (site_id)
           ▼
┌─────────────────────┐
│    site_metrics     │
├─────────────────────┤
│ PK id (UUID)        │
│ FK site_id          │
│ metric_date         │  ◄─── UNIQUE(site_id, metric_date)
│ carbon_tco2e        │
│ biodiversity_index  │
│ ndvi                │
│ projected_credit_usd│
│ created_at          │
└─────────────────────┘
```

### Spatial Indexing Strategy

```sql
-- Critical for geospatial query performance
CREATE INDEX idx_sites_geometry 
ON sites USING GIST (geometry);

-- Time-series query optimization
CREATE INDEX idx_site_metrics_site_date 
ON site_metrics(site_id, metric_date);
```

### Area Calculation (Server-Side)

```sql
-- Never trust frontend area calculations
SELECT ST_Area(geometry::geography) / 10000 AS area_ha
FROM sites;
```

---

## ✨ Key Features

### P0 — Must Have (Implemented)

| Feature | Implementation | Location |
|---------|----------------|----------|
| **Authentication** | Supabase Auth (email/password) + JWT | `frontend/src/context/AuthContext.tsx` |
| **Project CRUD** | Create, list, filter by type/status | `frontend/src/pages/Dashboard/` |
| **Interactive Map** | Mapbox GL JS / Leaflet with dark theme | `frontend/src/components/map/MapView.tsx` |
| **Polygon Drawing** | Mapbox Draw / Leaflet custom implementation | `frontend/src/components/map/MapView.tsx` (drawing mode) |
| **Polygon Persistence** | GeoJSON → PostGIS `ST_GeomFromGeoJSON()` | `backend/app/services/geospatial.py` |
| **PostGIS Integration** | Geometry(POLYGON, 4326) + GIST index | `backend/app/models/site.py` |
| **Site Selection** | Click polygon → flyTo + highlight | `frontend/src/components/map/MapView.tsx` |
| **Site Intelligence Drawer** | Animated slide-out with metrics | `frontend/src/components/sites/SiteDrawer.tsx` |
| **Environmental Metrics** | Carbon, Biodiversity, NDVI, Credit Value | `frontend/src/types/index.ts` |
| **Time-Series Charts** | Highcharts area charts with trend lines | `frontend/src/components/charts/AnalyticsChart.tsx` |
| **Project KPIs** | Aggregated dashboard metrics | `frontend/src/pages/Dashboard/DashboardPage.tsx` |

### P1 — Should Have (Partially Implemented)

| Feature | Status | Notes |
|---------|--------|-------|
| Dashboard KPIs | ✅ | Real-time calculated from mock data |
| Map Filters | ✅ | By project type (Carbon/Biodiversity/Mixed) |
| Project Filtering | ✅ | Filter bar in dashboard header |
| Smooth Animations | ✅ | Framer Motion + CSS transitions |
| Loading States | ✅ | Skeleton loaders throughout |
| Empty States | ✅ | Custom EmptyState component |
| Responsive Layout | ✅ | Mobile-first Tailwind breakpoints |

### P2 — Nice to Have (Future)

- CSV/GeoJSON export
- Report generation (PDF)
- Site sharing via link
- Advanced temporal filters
- Audit history / versioning
- Multi-user project collaboration
- Webhook integrations

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (frontend)
- **Python** 3.11+ (backend)
- **Supabase Account** (free tier sufficient)
- **Mapbox Account** (free tier: 50k map loads/month)
- **Git** & **GitHub** account

### 1. Clone & Configure

```bash
git clone <repository-url>
cd Daruka_full_stack

# Copy environment template
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` with your credentials:

```env
# Supabase (Project Settings → API)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (Settings → Database → Connection String)
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# Mapbox (Account → Access Tokens)
MAPBOX_ACCESS_TOKEN=pk.your-mapbox-token

# Frontend (Vite requires VITE_ prefix)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_MAPBOX_ACCESS_TOKEN=pk.your-mapbox-token
VITE_API_URL=http://localhost:8000

# Backend
SECRET_KEY=generate-with-openssl-rand-base64-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Supabase Database Setup

1. Create new Supabase project
2. Enable **PostGIS** extension: `CREATE EXTENSION IF NOT EXISTS postgis;`
3. Run migrations (when available) or apply schema from `project_guide/prd.txt`
4. Enable **Email/Password** auth provider
5. Configure **Row Level Security** policies for projects/sites tables

### 4. Install Dependencies

```bash
# Frontend (project folder - main implementation)
cd project
npm install

# Backend
cd ../backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 5. Run Development Servers

```bash
# Terminal 1: Frontend (Vite dev server)
cd project
npm run dev
# → http://localhost:5173

# Terminal 2: Backend (FastAPI with hot reload)
cd backend
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000 (API)
# → http://localhost:8000/docs (Swagger UI)
```

---

## 🛠️ Development Workflow

### Code Quality Standards

```bash
# Frontend
cd project
npm run lint          # ESLint
npm run typecheck     # TypeScript strict mode
npm run build         # Production build verification

# Backend
cd backend
ruff check .          # Fast Python linting
ruff format .         # Code formatting
mypy app/             # Type checking
pytest                # Unit/integration tests
```

### Git Workflow

```bash
# Feature branches
git checkout -b feat/polygon-drawing

# Conventional commits
git commit -m "feat(map): add polygon drawing with Mapbox Draw"

# PR template includes:
# - Description of changes
# - Screenshots for UI changes
# - Test plan
# - Performance impact note
```

### Adding a New Feature (Example: Site Filtering)

1. **Define Types** → `frontend/src/types/index.ts`
2. **Create Schema** → `backend/app/schemas/site.py`
3. **Add Model** → `backend/app/models/site.py`
4. **Create Migration** → `alembic revision --autogenerate -m "add site filter"`
5. **Implement Service** → `backend/app/services/geospatial.py`
6. **Add Endpoint** → `backend/app/api/v1/endpoints/sites.py`
7. **Build UI Component** → `frontend/src/components/map/MapFilters.tsx`
8. **Integrate in Page** → `frontend/src/pages/Dashboard/DashboardPage.tsx`
9. **Add Tests** → `backend/tests/test_sites.py`
10. **Update Documentation** → This README

---

## 🧪 Testing Strategy

### Testing Pyramid

```
         /  E2E Tests  \        ← Playwright: Critical user journeys
        / Integration  \       ← API contracts, DB operations
       /   Unit Tests  \      ← Pure functions, utilities, hooks
```

### Test Organization

```
backend/tests/
├── unit/
│   ├── test_geospatial.py      # Area calc, centroid, validation
│   ├── test_analytics.py       # Aggregation logic
│   └── test_auth.py            # JWT encoding/decoding
├── integration/
│   ├── test_projects_api.py    # CRUD endpoints
│   ├── test_sites_api.py       # Geometry handling
│   └── test_analytics_api.py   # Time-series queries
└── conftest.py                 # Fixtures: async client, test DB

frontend/src/
├── components/**/__tests__/    # Component tests (React Testing Library)
├── hooks/__tests__/            # Custom hook tests
└── lib/__tests__/              # Utility function tests
```

### Key Test Scenarios

| Scenario | Type | Priority |
|----------|------|----------|
| Invalid polygon (self-intersecting) rejected | Unit | P0 |
| Area calculation matches PostGIS | Integration | P0 |
| Auth token expiry handled gracefully | E2E | P0 |
| Map renders without Mapbox token | E2E | P1 |
| Chart handles missing monthly data | Unit | P1 |
| Responsive breakpoints work correctly | E2E | P2 |

---

## 📦 Deployment

### Production Checklist

- [ ] Environment variables set in Vercel/Render/Supabase dashboards
- [ ] Mapbox token restricted to production domains
- [ ] Supabase RLS policies enabled and tested
- [ ] Database migrations applied
- [ ] SSL/TLS certificates valid
- [ ] CORS origins configured for production domain
- [ ] Error monitoring (Sentry) configured
- [ ] Analytics/telemetry enabled

### Vercel (Frontend)

```bash
# Automatic on push to main
# Build command: npm run build
# Output directory: dist
# Environment variables: VITE_* prefixed
```

### Render (Backend)

```yaml
# render.yaml
services:
  - type: web
    name: darukaa-api
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        fromDatabase: darukaa-db
      - key: SECRET_KEY
        generateValue: true
```

### Supabase (Database)

- **Branching**: Use Supabase branching for preview deployments
- **Backups**: Daily automated + point-in-time recovery
- **Connection Pooling**: Enable PgBouncer for production

---

## 🔒 Security Considerations

| Layer | Measures |
|-------|----------|
| **Authentication** | Supabase Auth (bcrypt, JWT, refresh tokens) |
| **Authorization** | Row Level Security (RLS) on all tables |
| **API** | Pydantic validation, SQLAlchemy ORM (no raw SQL) |
| **Geospatial** | `ST_IsValid()` + `ST_MakeValid()` on ingest |
| **Frontend** | Content Security Policy, no `dangerouslySetInnerHTML` |
| **Secrets** | Environment variables only, never committed |
| **Transport** | HTTPS everywhere, secure cookies |

### RLS Policy Example

```sql
-- Users can only access their own projects
CREATE POLICY "Users own their projects" ON projects
  FOR ALL USING (auth.uid() = owner_id);

-- Sites inherit project ownership
CREATE POLICY "Sites via project ownership" ON sites
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = sites.project_id 
      AND projects.owner_id = auth.uid()
    )
  );
```

---

## 📊 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **First Contentful Paint** | < 1.5s | Lighthouse CI |
| **Time to Interactive** | < 3s | Lighthouse CI |
| **Map Initial Load** | < 2s | Custom metric |
| **Polygon Save (API)** | < 500ms | APM |
| **Analytics Query** | < 300ms | APM |
| **Bundle Size (gzipped)** | < 200KB | `npm run build` |

### Optimizations Implemented

- **Code Splitting**: Lazy-loaded map/chart components
- **Memoization**: `React.memo`, `useMemo`, `useCallback` for expensive renders
- **Spatial Indexes**: GIST on geometry columns
- **Connection Pooling**: SQLAlchemy async pool + PgBouncer
- **Tile Caching**: Mapbox vector tiles with long TTL
- **Virtualization**: Large site lists (future)

---

## 🗺️ Roadmap (Post-Hackathon)

### Phase 1: Production Hardening (Week 1-2)
- [ ] Complete FastAPI backend with full CRUD
- [ ] Alembic migrations for all tables
- [ ] Comprehensive test suite (>80% coverage)
- [ ] CI/CD pipeline with staging environment
- [ ] Error tracking (Sentry) + logging (Structlog)

### Phase 2: Data Pipeline (Week 3-4)
- [ ] Automated environmental data ingestion (satellite APIs)
- [ ] Scheduled metric computation jobs (Celery + Redis)
- [ ] Data validation & anomaly detection
- [ ] Historical backfill for demo projects

### Phase 3: Advanced Analytics (Month 2)
- [ ] Comparative project analytics
- [ ] Predictive modeling (carbon projection)
- [ ] Custom dashboard builder
- [ ] Export API (GeoJSON, CSV, PDF reports)

### Phase 4: Collaboration & Scale (Month 3+)
- [ ] Team workspaces with RBAC
- [ ] Real-time collaboration (Supabase Realtime)
- [ ] Public project sharing
- [ ] API for third-party integrations
- [ ] Mobile-responsive PWA

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/amazing-feature`)
3. **Commit** with conventional messages (`git commit -m 'feat: add amazing feature'`)
4. **Push** to branch (`git push origin feat/amazing-feature`)
5. **Open** a Pull Request

### Code Review Checklist

- [ ] Types are strict (no `any`, proper generics)
- [ ] Components are memoized where appropriate
- [ ] API endpoints have OpenAPI docs (auto from FastAPI)
- [ ] Database changes have migrations
- [ ] Tests cover new functionality
- [ ] Accessibility verified (WCAG 2.1 AA)
- [ ] Performance impact assessed

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Supabase** — For making PostgreSQL + PostGIS + Auth trivial to operate
- **Mapbox** — For best-in-class mapping SDK
- **Highcharts** — For professional charting library
- **shadcn/ui** — For accessible, beautiful component primitives
- **Leaflet** — For lightweight mapping alternative
- **OpenStreetMap & CARTO** — For free basemap tiles

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/your-org/darukaa-earth/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/darukaa-earth/discussions)
- **Email**: team@darukaa.earth

---

> **Built with ❤️ for the planet** — Every polygon drawn is a commitment to understanding and protecting our ecosystems.