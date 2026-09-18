Yes. Since **frontend development is already underway**, ab project ko parallel phases mein divide karna best rahega. Main isko **15-hour hackathon + production-quality demo** ke perspective se structure kar raha hoon.

# Darukaa.Earth — Complete Phase-Wise To-Do

## 🔴 PHASE 0 — Project Foundation

**Goal:** Development environment stable karna.

### To-Do

* [ ] Create Git repository
* [ ] Create frontend project
* [ ] Configure TypeScript
* [ ] Configure Tailwind CSS
* [ ] Configure shadcn/ui
* [ ] Configure ESLint
* [ ] Configure Prettier
* [ ] Configure Husky
* [ ] Configure lint-staged
* [ ] Create `.env.example`
* [ ] Configure Mapbox token
* [ ] Configure Supabase credentials
* [ ] Create `.gitignore`
* [ ] Create initial README
* [ ] Establish folder structure
* [ ] Establish Git branching/commit convention

### Folder structure

```text
darukaa-earth/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── lib/
│   ├── types/
│   └── data/
│
├── backend/
│   ├── app/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   └── api/
│
├── supabase/
│   └── migrations/
│
└── README.md
```

---

# 🟠 PHASE 1 — Database + Supabase

**Goal:** Actual persistent data layer ready.

### To-Do

* [ ] Create Supabase project
* [ ] Enable PostgreSQL
* [ ] Enable PostGIS
* [ ] Configure Supabase Auth
* [ ] Create `profiles`
* [ ] Create `projects`
* [ ] Create `sites`
* [ ] Create `site_metrics`
* [ ] Add foreign keys
* [ ] Add constraints
* [ ] Add indexes
* [ ] Add spatial GiST index
* [ ] Configure Row Level Security
* [ ] Create RLS policies
* [ ] Insert seed projects
* [ ] Insert seed sites
* [ ] Insert monthly site metrics
* [ ] Test CRUD operations
* [ ] Test polygon insertion
* [ ] Test polygon retrieval

### Final DB

```text
auth.users
     │
     ▼
profiles
     │
     ▼
projects
     │
     ▼
sites
     │
     ▼
site_metrics
```

### Important

* [ ] Do **not** calculate authoritative area only on frontend
* [ ] Calculate area using PostGIS
* [ ] Validate Polygon geometry
* [ ] Ensure `(site_id, metric_date)` is unique

---

# 🟡 PHASE 2 — Backend Foundation

**Goal:** FastAPI ko proper application layer banana.

### Setup

* [ ] Create Python environment
* [ ] Install FastAPI
* [ ] Install Uvicorn
* [ ] Install Pydantic
* [ ] Install SQLAlchemy
* [ ] Install GeoAlchemy2
* [ ] Configure Supabase PostgreSQL connection
* [ ] Configure environment variables
* [ ] Create application entry point
* [ ] Add CORS
* [ ] Add global error handling
* [ ] Add request validation
* [ ] Add logging

### Architecture

```text
FastAPI
│
├── routers/
│
├── schemas/
│
├── models/
│
├── services/
│
├── repositories/
│
└── core/
```

---

# 🟢 PHASE 3 — Authentication

**Goal:** Secure application access.

If using Supabase Auth:

* [ ] Configure email/password authentication
* [ ] Create login page
* [ ] Create registration page
* [ ] Create logout
* [ ] Create auth state provider/hook
* [ ] Protect dashboard routes
* [ ] Handle expired session
* [ ] Handle unauthorized requests
* [ ] Display user profile

### Test

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Refresh
   ↓
Still authenticated
   ↓
Logout
   ↓
Login page
```

---

# 🔵 PHASE 4 — Frontend Design System

Since Bolt is already developing the frontend, this phase should be treated as the **visual foundation**.

### To-Do

* [ ] Define color tokens
* [ ] Define typography
* [ ] Define spacing scale
* [ ] Define border radius
* [ ] Define shadows
* [ ] Define motion tokens
* [ ] Create Button variants
* [ ] Create Input
* [ ] Create Select
* [ ] Create Badge
* [ ] Create Card
* [ ] Create Dialog
* [ ] Create Drawer
* [ ] Create Tooltip
* [ ] Create Toast
* [ ] Create Skeleton
* [ ] Create Empty State
* [ ] Create Error State

### Motion

* [ ] Page entrance animation
* [ ] Card entrance animation
* [ ] Hover transitions
* [ ] Button interactions
* [ ] Drawer animation
* [ ] Modal animation
* [ ] Chart animation
* [ ] KPI count-up
* [ ] Reduced-motion support

---

# 🟣 PHASE 5 — Application Shell

**Goal:** Entire application ka navigation framework.

### To-Do

* [ ] Create sidebar
* [ ] Create top navigation
* [ ] Create user profile menu
* [ ] Create navigation states
* [ ] Add active route indicator
* [ ] Add collapsed sidebar
* [ ] Add responsive mobile navigation
* [ ] Add page transition
* [ ] Add global toast system

### Navigation

```text
Darukaa.Earth

Overview
Projects

──────────

Settings
Profile
```

---

# 🔴 PHASE 6 — Dashboard

**Goal:** Judge ko first 10 seconds mein product samajh aa jaana chahiye.

### To-Do

* [ ] Dashboard header
* [ ] Greeting
* [ ] Portfolio summary
* [ ] KPI cards
* [ ] Total projects
* [ ] Total sites
* [ ] Total area
* [ ] Total carbon
* [ ] Projected value
* [ ] Project list
* [ ] Recent activity
* [ ] Map section
* [ ] Loading states
* [ ] Empty states
* [ ] Error states

### KPI calculations

```text
Total Projects
Total Sites
Total Area
Total Carbon
Average Biodiversity
Projected Value
```

---

# 🟠 PHASE 7 — Mapbox Core

**Goal:** Map becomes the centerpiece.

### To-Do

* [ ] Configure Mapbox
* [ ] Create reusable `MapView`
* [ ] Add navigation controls
* [ ] Configure map style
* [ ] Load project sites
* [ ] Render polygons
* [ ] Add polygon fill
* [ ] Add polygon outline
* [ ] Add site labels
* [ ] Add map legend
* [ ] Add zoom controls
* [ ] Add reset/fit bounds
* [ ] Add hover interaction
* [ ] Add selected state
* [ ] Add tooltip

### Interaction

```text
Hover
 ↓
Polygon highlight
 ↓
Tooltip

Click
 ↓
Polygon selected
 ↓
Map flyTo()
 ↓
Site drawer opens
```

---

# 🟡 PHASE 8 — Polygon Drawing

**Goal:** Hackathon ka major "money shot".

### To-Do

* [ ] Install Mapbox Draw
* [ ] Add draw control
* [ ] Add polygon mode
* [ ] Add contextual instructions
* [ ] Capture `draw.create`
* [ ] Capture `draw.update`
* [ ] Capture `draw.delete`
* [ ] Convert polygon → GeoJSON
* [ ] Validate geometry
* [ ] Calculate area
* [ ] Open Save Site dialog
* [ ] Enter site name
* [ ] Enter description
* [ ] Submit site
* [ ] Persist polygon
* [ ] Show success toast
* [ ] Add polygon to map immediately

### Ideal flow

```text
+ Add Site
     ↓
Draw Polygon
     ↓
Polygon Complete
     ↓
1,240 ha
     ↓
Site Name
     ↓
Save Site
     ↓
✓ Site Created
```

---

# 🟢 PHASE 9 — Project Management

**Goal:** Actual CRUD workflow.

### To-Do

* [ ] Project list
* [ ] Project card
* [ ] Create project
* [ ] Project details
* [ ] Edit project
* [ ] Delete/archive project
* [ ] Project status
* [ ] Project type
* [ ] Project dates
* [ ] Project site count
* [ ] Project area
* [ ] Project carbon summary

### Project types

```text
Carbon
Biodiversity
Mixed
```

---

# 🔵 PHASE 10 — Site Management

**Goal:** Site becomes a first-class entity.

### To-Do

* [ ] Site list
* [ ] Site card
* [ ] Site name
* [ ] Site area
* [ ] Site status
* [ ] Parent project
* [ ] Coordinates
* [ ] Last updated
* [ ] Edit site
* [ ] Delete/archive site
* [ ] Zoom to site
* [ ] Select site

---

# 🟣 PHASE 11 — Site Intelligence Drawer

**Goal:** This should be the second major "WOW" moment.

When a polygon is clicked:

```text
MAP
 │
 ├── Polygon selected
 │
 └── Site Intelligence Drawer
```

### To-Do

* [ ] Drawer animation
* [ ] Site header
* [ ] Site status
* [ ] Project name
* [ ] Area
* [ ] Coordinates
* [ ] Carbon KPI
* [ ] Biodiversity KPI
* [ ] NDVI KPI
* [ ] Projected value
* [ ] Trend indicators
* [ ] Last updated
* [ ] Environmental summary

---

# 🟠 PHASE 12 — Analytics

**Goal:** Turn raw metrics into understandable intelligence.

### Highcharts

* [ ] Install Highcharts
* [ ] Create reusable chart component
* [ ] Carbon chart
* [ ] Biodiversity chart
* [ ] NDVI chart
* [ ] Metric selector
* [ ] Date range
* [ ] Interactive tooltip
* [ ] Smooth animation
* [ ] Responsive chart

### Chart interaction

```text
Carbon
Biodiversity
NDVI
     ↓
Select metric
     ↓
Chart transitions
     ↓
Tooltip
     ↓
Monthly performance
```

---

# 🟡 PHASE 13 — Project Analytics

Once site analytics works, aggregate them.

### To-Do

* [ ] Total project carbon
* [ ] Total project area
* [ ] Average biodiversity
* [ ] Average NDVI
* [ ] Projected credit value
* [ ] Site count
* [ ] Active site count
* [ ] Project performance trend

---

# 🟢 PHASE 14 — API Integration

At this stage, mock data should gradually disappear.

### Connect:

```text
Frontend
    ↓
API service
    ↓
FastAPI
    ↓
Supabase PostgreSQL
    ↓
PostGIS
```

### To-Do

* [ ] Connect auth
* [ ] Connect projects GET
* [ ] Connect projects POST
* [ ] Connect projects PATCH
* [ ] Connect sites GET
* [ ] Connect sites POST
* [ ] Connect sites PATCH
* [ ] Connect sites DELETE
* [ ] Connect metrics GET
* [ ] Connect project analytics
* [ ] Replace mock dashboard data
* [ ] Replace mock map data
* [ ] Replace mock charts

---

# 🔴 PHASE 15 — Geospatial Backend

This is where you demonstrate that PostGIS isn't just being used as a checkbox.

### To-Do

* [ ] GeoJSON → PostGIS conversion
* [ ] PostGIS → GeoJSON conversion
* [ ] Polygon validation
* [ ] Area calculation
* [ ] Bounding box calculation
* [ ] Spatial index
* [ ] Project site filtering
* [ ] Map viewport querying if required

Useful operations:

```sql
ST_Area()
ST_AsGeoJSON()
ST_GeomFromGeoJSON()
ST_Intersects()
ST_Contains()
```

For the 15-hour MVP, don't implement complex spatial analytics unless everything else is stable.

---

# 🟣 PHASE 16 — Search + Filters

**Goal:** Make the dashboard feel like a real product.

### To-Do

* [ ] Search projects
* [ ] Search sites
* [ ] Filter by project type
* [ ] Filter by status
* [ ] Map filtering
* [ ] Clear filters
* [ ] Empty filtered state

Example:

```text
All
Carbon
Biodiversity
Mixed
```

---

# 🟠 PHASE 17 — UX Polish

This is where the difference between **"working project"** and **"hackathon-winning presentation"** happens.

### To-Do

* [ ] Skeleton loaders
* [ ] Smooth page transitions
* [ ] Drawer transitions
* [ ] Modal transitions
* [ ] KPI count-up
* [ ] Chart transitions
* [ ] Polygon hover
* [ ] Polygon selection
* [ ] Button feedback
* [ ] Toast animations
* [ ] Success animations
* [ ] Error animations
* [ ] Tooltips
* [ ] Keyboard interactions

### Audit

* [ ] No awkward jumps
* [ ] No layout shifts
* [ ] No flashing content
* [ ] No dead buttons
* [ ] No unexplained icons

---

# 🔵 PHASE 18 — Responsive + Accessibility

### Desktop

* [ ] 1440px
* [ ] 1280px
* [ ] 1024px

### Tablet

* [ ] Sidebar collapse
* [ ] Responsive grid
* [ ] Map resizing

### Mobile

* [ ] Mobile navigation
* [ ] KPI stacking
* [ ] Full-screen map
* [ ] Bottom-sheet site drawer
* [ ] Responsive charts

### Accessibility

* [ ] Keyboard navigation
* [ ] Focus states
* [ ] ARIA labels
* [ ] Color contrast
* [ ] Reduced motion
* [ ] Screen reader labels

---

# 🟡 PHASE 19 — Performance Optimization

### Frontend

* [ ] Lazy-load Mapbox
* [ ] Lazy-load Highcharts
* [ ] Code splitting
* [ ] Memoize expensive calculations
* [ ] Prevent unnecessary map rerenders
* [ ] Prevent unnecessary chart rerenders
* [ ] Optimize images
* [ ] Remove unused dependencies

### Backend

* [ ] Database indexes
* [ ] Avoid N+1 queries
* [ ] Pagination where required
* [ ] Select only required fields
* [ ] Aggregate analytics efficiently

### Database

```text
projects.owner_id       → INDEX
sites.project_id        → INDEX
sites.geometry          → GIST INDEX
site_metrics.site_id    → INDEX
site_metrics.date       → INDEX
```

---

# 🟢 PHASE 20 — Security

### To-Do

* [ ] Environment variables
* [ ] No secrets in Git
* [ ] Supabase RLS
* [ ] Authenticated routes
* [ ] API authorization
* [ ] Input validation
* [ ] Polygon validation
* [ ] CORS configuration
* [ ] Production environment variables
* [ ] Error responses don't leak internals

---

# 🔴 PHASE 21 — Testing

Don't try to achieve huge test coverage in a 15-hour hackathon.

Focus on **critical paths**.

### Frontend

* [ ] Login flow
* [ ] Project rendering
* [ ] Site selection
* [ ] Polygon drawing
* [ ] Site creation
* [ ] Drawer opening
* [ ] Chart rendering

### Backend

* [ ] Auth validation
* [ ] Project creation
* [ ] Site creation
* [ ] Invalid polygon
* [ ] Metrics retrieval
* [ ] Project analytics

### Database

* [ ] FK constraints
* [ ] Unique metrics
* [ ] RLS
* [ ] Spatial data
* [ ] Cascade deletion

---

# 🟣 PHASE 22 — CI/CD

### GitHub Actions

Create:

```text
.github/
└── workflows/
    ├── frontend.yml
    └── backend.yml
```

### Frontend pipeline

```text
Push
 ↓
Install
 ↓
Lint
 ↓
Typecheck
 ↓
Build
 ↓
Deploy
```

### Backend

```text
Push
 ↓
Install
 ↓
Lint
 ↓
Tests
 ↓
Build
```

---

# 🟠 PHASE 23 — Deployment

### Frontend

Deploy to:

```text
Vercel
```

### Backend

Deploy to:

```text
Render
```

### Database

```text
Supabase
```

### To-Do

* [ ] Production frontend
* [ ] Production backend
* [ ] Production Supabase
* [ ] Production Mapbox token
* [ ] Configure CORS
* [ ] Configure environment variables
* [ ] Test production API
* [ ] Test production auth
* [ ] Test production map
* [ ] Test production polygon save

---

# 🔴 PHASE 24 — Demo Data

This deserves its own phase.

### Create

```text
Amazon Rainforest Restoration
├── Site Alpha
├── Site Beta
└── Site Gamma

Kenyan Rangeland Carbon
├── Site Alpha
└── Site Beta

Borneo Biodiversity Reserve
├── Site Alpha
└── Site Beta
```

### Each site

* [ ] Realistic polygon
* [ ] Area
* [ ] Carbon metrics
* [ ] Biodiversity metrics
* [ ] NDVI
* [ ] Credit value
* [ ] 12 months of data

### Important

Data should tell a story.

For example:

```text
Jan → 10K
Feb → 11K
Mar → 13K
Apr → 15K
May → 17K
Jun → 20K
...
```

The chart should visibly show meaningful progression.

---

# 🏆 PHASE 25 — Hackathon Demo Optimization

Now **stop adding features**.

Only improve the demo.

### Demo sequence

* [ ] Login
* [ ] Dashboard opens quickly
* [ ] KPIs visible immediately
* [ ] Map loads correctly
* [ ] Project selected
* [ ] Sites visible
* [ ] Add Site button obvious
* [ ] Draw polygon
* [ ] Save site
* [ ] Site appears instantly
* [ ] Click site
* [ ] Drawer opens
* [ ] KPIs populate
* [ ] Chart animates
* [ ] Change metric
* [ ] Return to map

### Target

The complete story should work in:

**~3 minutes.**

---

# 🚨 PHASE 26 — Final QA / Kill Bugs

### Critical checks

* [ ] Login works
* [ ] Logout works
* [ ] Refresh doesn't break auth
* [ ] Dashboard loads
* [ ] Projects load
* [ ] Map loads
* [ ] Polygon loads
* [ ] Polygon draws
* [ ] Polygon saves
* [ ] Polygon persists after refresh
* [ ] Site click works
* [ ] Drawer works
* [ ] Metrics load
* [ ] Charts load
* [ ] Filters work
* [ ] API doesn't randomly fail
* [ ] Mobile doesn't break

### Visual checks

* [ ] No overlapping text
* [ ] No broken icons
* [ ] No inconsistent spacing
* [ ] No random colors
* [ ] No excessive animations
* [ ] No empty cards
* [ ] No placeholder text
* [ ] No console errors

---

# 📦 PHASE 27 — Submission Package

### GitHub

* [ ] Clean repository
* [ ] Meaningful commits
* [ ] README
* [ ] Architecture diagram
* [ ] ER diagram
* [ ] Setup instructions
* [ ] Environment variables documentation
* [ ] API documentation
* [ ] Database schema
* [ ] CI/CD explanation
* [ ] Trade-offs

### Live deployment

* [ ] Frontend URL
* [ ] Backend URL
* [ ] Demo credentials
* [ ] Supabase configured
* [ ] Production tested

### README

Include:

```text
Darukaa.Earth

1. Problem
2. Solution
3. Features
4. Architecture
5. Tech Stack
6. Database Schema
7. Geospatial Architecture
8. API
9. Authentication
10. Local Setup
11. Environment Variables
12. CI/CD
13. Deployment
14. Trade-offs
15. Demo Credentials
```

---

# ⏱️ 15-HOUR EXECUTION PRIORITY

If you're actually under the **15-hour constraint**, don't treat all 27 phases equally.

Use this priority:

| Phase              | Priority |   Time |
| ------------------ | -------- | -----: |
| Foundation         | P0       | 30 min |
| Supabase + DB      | P0       |   1 hr |
| FastAPI            | P0       |   1 hr |
| Auth               | P0       | 45 min |
| Design System      | P0       | 45 min |
| Dashboard          | P0       |   1 hr |
| Mapbox             | **P0**   | 1.5 hr |
| Polygon Drawing    | **P0**   |   1 hr |
| Project/Site CRUD  | P0       |   1 hr |
| Site Drawer        | **P0**   |   1 hr |
| Analytics          | **P0**   |   1 hr |
| API Integration    | P0       |   1 hr |
| Polish + Animation | **P0**   |   1 hr |
| CI/CD              | P1       | 30 min |
| QA + Demo          | **P0**   |   1 hr |

---

# 🧭 The Overall Development Order

If you want the **single source of truth checklist**, follow this:

```text
PHASE 0
Foundation
   ↓
PHASE 1
Supabase + PostgreSQL + PostGIS
   ↓
PHASE 2
FastAPI
   ↓
PHASE 3
Authentication
   ↓
PHASE 4
Design System
   ↓
PHASE 5
App Shell
   ↓
PHASE 6
Dashboard
   ↓
PHASE 7
Mapbox
   ↓
PHASE 8
Polygon Drawing
   ↓
PHASE 9
Project Management
   ↓
PHASE 10
Site Management
   ↓
PHASE 11
Site Intelligence Drawer
   ↓
PHASE 12
Highcharts Analytics
   ↓
PHASE 13
Project Analytics
   ↓
PHASE 14
API Integration
   ↓
PHASE 15
PostGIS
   ↓
PHASE 16
Filters
   ↓
PHASE 17
UX + Animation Polish
   ↓
PHASE 18
Responsive + Accessibility
   ↓
PHASE 19
Performance
   ↓
PHASE 20
Security
   ↓
PHASE 21
Testing
   ↓
PHASE 22
CI/CD
   ↓
PHASE 23
Deployment
   ↓
PHASE 24
Demo Data
   ↓
PHASE 25
3-MINUTE DEMO
   ↓
PHASE 26
FINAL QA
   ↓
PHASE 27
SUBMISSION
```

#