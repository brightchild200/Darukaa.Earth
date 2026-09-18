from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm, cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether, PageBreak
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import Flowable

# ── Brand Colors ──────────────────────────────────────────────────────────────
DARK_BG     = colors.HexColor("#0D1117")
GREEN       = colors.HexColor("#22C55E")
GREEN_LIGHT = colors.HexColor("#86EFAC")
GREEN_DARK  = colors.HexColor("#15803D")
TEAL        = colors.HexColor("#14B8A6")
AMBER       = colors.HexColor("#F59E0B")
RED         = colors.HexColor("#EF4444")
BLUE        = colors.HexColor("#3B82F6")
SURFACE     = colors.HexColor("#161B22")
SURFACE2    = colors.HexColor("#1C2333")
BORDER      = colors.HexColor("#30363D")
TEXT_PRI    = colors.HexColor("#F0F6FC")
TEXT_SEC    = colors.HexColor("#8B949E")
TEXT_MUT    = colors.HexColor("#484F58")
WHITE       = colors.white

PAGE_W, PAGE_H = A4
MARGIN = 18*mm


# ── Custom Flowables ───────────────────────────────────────────────────────────
class ColorRect(Flowable):
    def __init__(self, w, h, fill, radius=4):
        super().__init__()
        self.w, self.h, self.fill, self.radius = w, h, fill, radius
    def draw(self):
        self.canv.setFillColor(self.fill)
        self.canv.roundRect(0, 0, self.w, self.h, self.radius, fill=1, stroke=0)

class SectionBadge(Flowable):
    """Full-width section header bar."""
    def __init__(self, number, title, subtitle, w, accent=GREEN):
        super().__init__()
        self.number   = number
        self.title    = title
        self.subtitle = subtitle
        self.w        = w
        self.accent   = accent
        self.height   = 22*mm

    def wrap(self, *_):
        return self.w, self.height

    def draw(self):
        c = self.canv
        # bg
        c.setFillColor(SURFACE)
        c.roundRect(0, 0, self.w, self.height, 6, fill=1, stroke=0)
        # left accent bar
        c.setFillColor(self.accent)
        c.rect(0, 0, 5, self.height, fill=1, stroke=0)
        # number circle
        cx, cy = 18*mm, self.height/2
        c.setFillColor(self.accent)
        c.circle(cx, cy, 7*mm, fill=1, stroke=0)
        c.setFillColor(DARK_BG)
        c.setFont("Helvetica-Bold", 12)
        c.drawCentredString(cx, cy - 4, self.number)
        # title
        c.setFillColor(TEXT_PRI)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(30*mm, self.height/2 + 2*mm, self.title)
        # subtitle
        c.setFillColor(TEXT_SEC)
        c.setFont("Helvetica", 8)
        c.drawString(30*mm, self.height/2 - 4*mm, self.subtitle)

class HeroHeader(Flowable):
    def __init__(self, w):
        super().__init__()
        self.w = w
        self.height = 52*mm

    def wrap(self, *_):
        return self.w, self.height

    def draw(self):
        c = self.canv
        # Main dark bg
        c.setFillColor(DARK_BG)
        c.roundRect(0, 0, self.w, self.height, 8, fill=1, stroke=0)
        # Green top stripe
        c.setFillColor(GREEN)
        c.roundRect(0, self.height - 3, self.w, 3, 2, fill=1, stroke=0)
        # Decorative circles
        c.setFillColor(colors.HexColor("#0F2010"))
        c.circle(self.w - 18*mm, self.height/2, 22*mm, fill=1, stroke=0)
        c.setFillColor(colors.HexColor("#0A1A0C"))
        c.circle(self.w - 8*mm, 8*mm, 14*mm, fill=1, stroke=0)

        # Logo text
        c.setFillColor(GREEN)
        c.setFont("Helvetica-Bold", 18)
        c.drawString(10*mm, self.height - 15*mm, "DARUKAA.EARTH")
        # Badge
        bw = 42*mm
        c.setFillColor(GREEN_DARK)
        c.roundRect(10*mm, self.height - 22*mm, bw, 5*mm, 2, fill=1, stroke=0)
        c.setFillColor(GREEN_LIGHT)
        c.setFont("Helvetica-Bold", 7)
        c.drawString(11*mm, self.height - 20.5*mm, "ELITE HACKATHON STRATEGY  •  15-HOUR EXECUTION PLAYBOOK")

        # Main title
        c.setFillColor(TEXT_PRI)
        c.setFont("Helvetica-Bold", 22)
        c.drawString(10*mm, self.height/2 + 2*mm, "Full-Stack Geospatial Analytics")
        c.setFillColor(GREEN)
        c.drawString(10*mm, self.height/2 - 8*mm, "Winning Roadmap")

        # Bottom stats
        stats = [("15", "Hours"), ("3", "Min Demo"), ("10+", "Win Rate"), ("100%", "Stack Hit")]
        sw = self.w / len(stats)
        for i, (val, lbl) in enumerate(stats):
            x = i * sw + sw/2
            c.setFillColor(GREEN)
            c.setFont("Helvetica-Bold", 14)
            c.drawCentredString(x, 7*mm, val)
            c.setFillColor(TEXT_SEC)
            c.setFont("Helvetica", 7)
            c.drawCentredString(x, 3*mm, lbl)

class PriorityTag(Flowable):
    def __init__(self, label, color, w=14*mm, h=5*mm):
        super().__init__()
        self.label = label
        self.color = color
        self.w = w
        self.h = h

    def wrap(self, *_):
        return self.w, self.h

    def draw(self):
        c = self.canv
        c.setFillColor(self.color)
        c.roundRect(0, 0, self.w, self.h, 2, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 6)
        c.drawCentredString(self.w/2, 1.5*mm, self.label)


# ── Style Factory ──────────────────────────────────────────────────────────────
def styles():
    base = getSampleStyleSheet()

    def ps(name, **kw):
        defaults = dict(fontName="Helvetica", fontSize=9, leading=13,
                        textColor=TEXT_PRI, spaceAfter=3)
        defaults.update(kw)
        return ParagraphStyle(name, parent=base["Normal"], **defaults)

    return {
        "body":      ps("body"),
        "body_sec":  ps("body_sec", textColor=TEXT_SEC, fontSize=8),
        "bold":      ps("bold", fontName="Helvetica-Bold"),
        "green":     ps("green", textColor=GREEN, fontName="Helvetica-Bold", fontSize=8),
        "amber":     ps("amber", textColor=AMBER, fontName="Helvetica-Bold", fontSize=8),
        "red_tag":   ps("red_tag", textColor=RED, fontName="Helvetica-Bold", fontSize=8),
        "center":    ps("center", alignment=TA_CENTER),
        "h3":        ps("h3", fontName="Helvetica-Bold", fontSize=10, textColor=GREEN, spaceAfter=4),
        "mono":      ps("mono", fontName="Courier", fontSize=7.5, textColor=GREEN_LIGHT, backColor=DARK_BG, leading=12),
        "kpi_val":   ps("kpi_val", fontName="Helvetica-Bold", fontSize=20, textColor=GREEN, alignment=TA_CENTER),
        "kpi_lbl":   ps("kpi_lbl", fontSize=7, textColor=TEXT_SEC, alignment=TA_CENTER),
        "table_hdr": ps("tbl_hdr", fontName="Helvetica-Bold", fontSize=8, textColor=GREEN_LIGHT),
        "table_cel": ps("tbl_cel", fontSize=8, textColor=TEXT_PRI, leading=11),
        "table_dim": ps("tbl_dim", fontSize=7.5, textColor=TEXT_SEC, leading=11),
        "wow":       ps("wow", fontName="Helvetica-Bold", fontSize=8, textColor=AMBER),
    }

S = styles()

def sp(n=4):
    return Spacer(1, n*mm)

def hr(color=BORDER, thickness=0.5):
    return HRFlowable(width="100%", thickness=thickness, color=color, spaceAfter=3*mm, spaceBefore=3*mm)

def cell(text, style=None):
    return Paragraph(text, style or S["table_cel"])

def bullet(text, color=GREEN):
    return Paragraph(f'<font color="#{color.hexval()[2:]}">▸</font> {text}', S["body"])


def dark_table(data, col_widths, header_rows=1, row_colors=None):
    usable = PAGE_W - 2*MARGIN
    if sum(col_widths) < usable - 1:
        scale = usable / sum(col_widths)
        col_widths = [w * scale for w in col_widths]

    style = [
        ("BACKGROUND", (0, 0), (-1, 0), SURFACE2),
        ("BACKGROUND", (0, 1), (-1, -1), SURFACE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [SURFACE, colors.HexColor("#111820")]),
        ("GRID",       (0, 0), (-1, -1), 0.4, BORDER),
        ("LINEABOVE",  (0, 0), (-1, 0), 1.5, GREEN),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN",     (0, 0), (-1, -1), "TOP"),
    ]
    return Table(data, colWidths=col_widths, style=TableStyle(style), repeatRows=header_rows)


# ── Page background ────────────────────────────────────────────────────────────
def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(colors.HexColor("#090D12"))
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    # footer
    canvas.setFillColor(BORDER)
    canvas.rect(MARGIN, 10*mm, PAGE_W - 2*MARGIN, 0.3, fill=1, stroke=0)
    canvas.setFillColor(TEXT_MUT)
    canvas.setFont("Helvetica", 7)
    canvas.drawString(MARGIN, 7*mm, "DARUKAA.EARTH  •  Elite Full-Stack Hackathon Strategy  •  Confidential")
    canvas.drawRightString(PAGE_W - MARGIN, 7*mm, f"Page {doc.page}")
    canvas.restoreState()


# ══════════════════════════════════════════════════════════════════════════════
# BUILD STORY
# ══════════════════════════════════════════════════════════════════════════════
def build():
    path = "/mnt/user-data/outputs/Darukaa_Earth_Winning_Roadmap.pdf"
    doc  = SimpleDocTemplate(
        path, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN, bottomMargin=18*mm,
    )
    story = []
    usable = PAGE_W - 2*MARGIN

    # ── HERO ──────────────────────────────────────────────────────────────────
    story.append(HeroHeader(usable))
    story.append(sp(5))

    # ── KPI STRIP ─────────────────────────────────────────────────────────────
    kpis = [
        ("P0", "Auth + JWT",      "Required Day-1"),
        ("P0", "Mapbox + Draw",   "Core Wow Feature"),
        ("P0", "PostGIS CRUD",    "Technical Proof"),
        ("P0", "Highcharts",      "Analytics Layer"),
        ("P1", "CI/CD + Deploy",  "Judge Signal"),
        ("P1", "Pre-commit",      "DX Excellence"),
    ]
    col_w = usable / len(kpis)
    kpi_data = [[
        Table([
            [Paragraph(p, ParagraphStyle("kp", fontName="Helvetica-Bold", fontSize=7,
                       textColor=GREEN if p=="P0" else AMBER, alignment=TA_CENTER))],
            [Paragraph(v, ParagraphStyle("kv", fontName="Helvetica-Bold", fontSize=8,
                       textColor=TEXT_PRI, alignment=TA_CENTER))],
            [Paragraph(l, ParagraphStyle("kl", fontSize=6.5, textColor=TEXT_SEC, alignment=TA_CENTER))],
        ], colWidths=[col_w - 4], style=TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), SURFACE),
            ("TOPPADDING", (0,0), (-1,-1), 3),
            ("BOTTOMPADDING", (0,0), (-1,-1), 3),
            ("BOX", (0,0), (-1,-1), 1, GREEN if p=="P0" else AMBER),
            ("LINEABOVE", (0,0), (-1,0), 3, GREEN if p=="P0" else AMBER),
        ]))
        for p, v, l in kpis
    ]]
    story.append(Table(kpi_data, colWidths=[col_w]*len(kpis),
                       style=TableStyle([("LEFTPADDING",(0,0),(-1,-1),2),
                                         ("RIGHTPADDING",(0,0),(-1,-1),2)])))
    story.append(sp(6))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 1 — EXECUTIVE STRATEGY
    # ══════════════════════════════════════════════════════════════════════════
    story.append(SectionBadge("01", "EXECUTIVE STRATEGY", "How to dominate judging in 15 hours", usable, GREEN))
    story.append(sp(3))

    thesis = [
        ("WINNING THESIS", GREEN, [
            "Judges spend <b>3 minutes</b> on your demo — build ONE unforgettable interaction, not ten mediocre ones.",
            "A beautiful interactive map with real polygon draw + analytics drawer = <b>80% of perceived value</b>.",
            "JWT auth + clean project CRUD + polished analytics panel beats an incomplete multi-page app every time.",
            "Pre-commit hooks + green GitHub Actions badge + live deploy = <b>automatic technical excellence points</b>.",
            "Mock realistic carbon/biodiversity time-series. Real satellite pipelines are a <b>15-hour trap</b>.",
        ]),
        ("JUDGE PSYCHOLOGY", TEAL, [
            "Judges pattern-match in seconds: dark satellite map + smooth animations = production-grade signal.",
            "They click 'Add Site', draw a polygon, and watch the analytics panel animate open — that's the hire signal.",
            "CI/CD green badge in README is worth more than 3 extra feature pages that are half-broken.",
            "Clean architecture folders (features/, routers/, services/) tell them you've shipped real software before.",
            "Trade-off articulation in README scores higher than complexity — explain <i>why</i> you chose FastAPI over Django.",
        ]),
    ]

    for title, color, points in thesis:
        col1 = Table([[Paragraph(title, ParagraphStyle("tt", fontName="Helvetica-Bold", fontSize=9,
                                                         textColor=color))]],
                     colWidths=[35*mm],
                     style=TableStyle([("BACKGROUND",(0,0),(-1,-1), SURFACE2),
                                       ("LINEABOVE",(0,0),(-1,0),3,color),
                                       ("TOPPADDING",(0,0),(-1,-1),5),
                                       ("BOTTOMPADDING",(0,0),(-1,-1),5),
                                       ("LEFTPADDING",(0,0),(-1,-1),4),]))
        col2_items = [[Paragraph(f'<font color="#22C55E">▸</font> {p}', S["body"])] for p in points]
        col2 = Table(col2_items, colWidths=[usable - 40*mm],
                     style=TableStyle([("BACKGROUND",(0,0),(-1,-1),SURFACE),
                                       ("TOPPADDING",(0,0),(-1,-1),3),
                                       ("BOTTOMPADDING",(0,0),(-1,-1),3),
                                       ("LEFTPADDING",(0,0),(-1,-1),5),]))
        row = Table([[col1, col2]], colWidths=[37*mm, usable-37*mm],
                    style=TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),
                                      ("LEFTPADDING",(0,0),(-1,-1),0),
                                      ("RIGHTPADDING",(0,0),(-1,-1),0),
                                      ("TOPPADDING",(0,0),(-1,-1),0),
                                      ("BOTTOMPADDING",(0,0),(-1,-1),2),]))
        story.append(row)
        story.append(sp(2))

    story.append(sp(4))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 2 — CORE FEATURES (MVP)
    # ══════════════════════════════════════════════════════════════════════════
    story.append(SectionBadge("02", "CORE FEATURES — MVP PRIORITY", "Only build what creates a memorable 3-minute wow", usable, TEAL))
    story.append(sp(3))

    features = [
        ("P0", GREEN,  "Authentication & JWT",
         "Register / Login with email + password. JWT access token in memory/httpOnly cookie. Protected routes on frontend and backend. Pre-seed a demo account — judges must never need to type credentials during the live demo.",
         "Fast, frictionless entry. Green lock icon + user avatar in navbar = instant credibility signal."),
        ("P0", GREEN,  "Project Management Dashboard",
         "Create Project (name, description, type: Carbon / Biodiversity / Mixed). List all projects as a card grid with aggregate KPIs (total area ha, estimated tCO2e, site count, biodiversity score). Click project → open map view.",
         "Shows real business workflow. Card hover lift animations make it feel production-grade immediately."),
        ("P0", GREEN,  "Interactive Geospatial Map + Polygon Draw",
         "Mapbox GL JS with satellite-streets hybrid style. Mapbox Draw for polygon creation. Store geometry as GeoJSON in PostGIS (ST_Area for auto area_ha). Sites in distinct colors per project. Hover tooltips with site name + area.",
         "THIS IS THE MONEY SHOT. Judges lean forward when a polygon appears on a satellite map. Nothing else comes close."),
        ("P0", GREEN,  "Site Intelligence Drawer",
         "Click any polygon → smooth 300ms slide-in right panel. KPI cards: Total Area (ha), Estimated tCO2e, Biodiversity Score, NDVI, Last Updated. 3-4 Highcharts: Carbon Sequestration over time, Biodiversity Index, NDVI trend, Projected Credit Value. Skeleton loaders while fetching.",
         "The 30-second clincher. Transforms geometry into business insight visually — this is what gets remembered."),
        ("P0", GREEN,  "Time-Series Analytics",
         "Seeded site_metrics table with 12 realistic data points per site. API aggregation endpoint. Highcharts with built-in entrance animations. Tooltips showing exact values on hover. Carbon trend label ('↑ 12% vs last quarter').",
         "Makes the dashboard feel analytical, not just a CRM. Environmental score formula in tooltip = extra judge WOW."),
        ("P1", AMBER,  "Project Summary KPIs",
         "Aggregate area, carbon metric, biodiversity metric, and site count at the project level. Animated counter transitions when switching projects (CountUp.js or CSS animation). Top-bar always visible.",
         "Creates executive-level narrative. Judges understand the product purpose in 5 seconds."),
        ("P1", AMBER,  "Filters + Map Controls",
         "Project / status / type filters affecting both the map layers and the KPI cards. Layer toggle (satellite vs streets). Mini-legend for site status encoding. Search by site name.",
         "Signals scalable, data-driven UX. One filter demo proves this is not a hardcoded mockup."),
        ("P1", AMBER,  "Production Polish Layer",
         "Loading skeletons for all async operations. Toast notifications for save/error/success. Empty states with contextual CTAs. API error boundaries. Disabled states during save. Confirmation after polygon creation.",
         "Separates 'student project' from 'I would hire this person'. Never show a white screen or console error."),
        ("P2", RED,    "Export / Share (SKIP unless P0+P1 complete)",
         "Optional screenshot export or shareable site view link. Only add if the entire P0/P1 scope is stable and tested 90 minutes before deadline.",
         "Nice-to-have. Do NOT sacrifice CI/CD setup or demo hardening for this."),
    ]

    hdr = [cell("PRI", S["table_hdr"]), cell("FEATURE", S["table_hdr"]),
           cell("WHAT MUST WORK", S["table_hdr"]), cell("JUDGE WOW FACTOR", S["table_hdr"])]
    rows = [hdr]
    for pri, col, feat, desc, wow in features:
        color_hex = col.hexval()[2:]
        rows.append([
            Paragraph(f'<font color="#{color_hex}"><b>{pri}</b></font>', S["center"]),
            Paragraph(f'<b>{feat}</b>', S["bold"]),
            Paragraph(desc, S["table_cel"]),
            Paragraph(f'<font color="#F59E0B">★</font> {wow}', S["table_dim"]),
        ])

    story.append(dark_table(rows, [12*mm, 38*mm, 72*mm, 48*mm]))
    story.append(sp(5))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 3 — TECHNICAL REQUIREMENTS
    # ══════════════════════════════════════════════════════════════════════════
    story.append(PageBreak())
    story.append(SectionBadge("03", "TECHNICAL REQUIREMENTS", "Exact stack + implementation notes — zero ambiguity", usable, BLUE))
    story.append(sp(3))

    # Stack table
    stack_hdr = [cell("LAYER", S["table_hdr"]), cell("REQUIRED", S["table_hdr"]),
                 cell("EXACT IMPLEMENTATION", S["table_hdr"]), cell("WHY THIS CHOICE", S["table_hdr"])]
    stack_rows = [stack_hdr,
        [cell("Frontend", S["bold"]), cell("React"), cell("Vite + React 18 + TypeScript. Tailwind CSS. react-map-gl wrapper."), cell("Fastest scaffold. Auto TS support. Tailwind for rapid polished UI.")],
        [cell("Maps", S["bold"]), cell("Mapbox GL JS"), cell("react-map-gl + @mapbox/mapbox-gl-draw. Satellite-streets style. Free token."), cell("Official, battle-tested. Satellite style looks premium in 0 effort.")],
        [cell("Charts", S["bold"]), cell("Highcharts"), cell("highcharts-react-official. 4 chart configs with realistic mock series. Built-in animations."), cell("More impressive visuals than Chart.js. Built-in time-series support.")],
        [cell("Backend", S["bold"]), cell("FastAPI"), cell("Python 3.11 + FastAPI + Pydantic v2. Automatic OpenAPI docs. Uvicorn."), cell("Fastest to scaffold. Auto docs impress judges. Perfect for 15h scope.")],
        [cell("Database", S["bold"]), cell("PostgreSQL + PostGIS"), cell("Neon or Render free Postgres. PostGIS enabled. SQLAlchemy + GeoAlchemy2."), cell("Required by brief. ST_Area, ST_AsGeoJSON, geometry(Polygon,4326).")],
        [cell("Auth", S["bold"]), cell("JWT"), cell("python-jose + passlib[bcrypt]. /auth/login + /auth/register. Bearer token."), cell("Required by brief. Simple, stateless, works perfectly for single-user demo.")],
        [cell("CI/CD", S["bold"]), cell("GitHub Actions"), cell("lint.yml: on push/PR → black + isort + flake8 + ESLint. deploy.yml: on main push → auto deploy."), cell("Green badge in README = automatic technical excellence signal.")],
        [cell("Code Quality", S["bold"]), cell("Pre-commit hooks"), cell("Frontend: Husky + lint-staged + Prettier + ESLint. Backend: pre-commit + black + isort + flake8."), cell("Explicitly required. Show a failed commit attempt in demo = big judge signal.")],
        [cell("Deploy", S["bold"]), cell("Render + Vercel"), cell("Vercel (frontend). Render (FastAPI + Postgres). One push → live. Zero-ops."), cell("Actually stays up during judging. No Docker complexity on a 15h timeline.")],
    ]
    story.append(dark_table(stack_rows, [22*mm, 25*mm, 75*mm, 50*mm]))
    story.append(sp(5))

    # Database Schema
    story.append(Paragraph("DATABASE SCHEMA — MINIMAL & SCALABLE", S["h3"]))

    schema_code = [
        "-- Users",
        "users(id UUID PK, email TEXT UNIQUE, hashed_password TEXT, created_at TIMESTAMPTZ)",
        "",
        "-- Projects",
        "projects(id UUID PK, name TEXT, description TEXT,",
        "         project_type TEXT CHECK IN ('Carbon','Biodiversity','Mixed'),",
        "         owner_id UUID FK→users, status TEXT DEFAULT 'active', created_at TIMESTAMPTZ)",
        "",
        "-- Sites (PostGIS geometry column)",
        "sites(id UUID PK, project_id UUID FK→projects, name TEXT,",
        "      geometry GEOMETRY(Polygon, 4326),   -- ST_Area(geography) → area_ha",
        "      area_ha FLOAT GENERATED ON INSERT,",
        "      status TEXT DEFAULT 'active', created_at TIMESTAMPTZ)",
        "",
        "-- Time-series metrics",
        "site_metrics(id UUID PK, site_id UUID FK→sites, metric_date DATE,",
        "             carbon_tco2e FLOAT, biodiversity_index FLOAT,",
        "             ndvi FLOAT, projected_credit_usd FLOAT)",
        "",
        "-- Indexes",
        "CREATE INDEX ON sites USING GIST(geometry);",
        "CREATE INDEX ON site_metrics(site_id, metric_date);",
    ]
    code_rows = [[Paragraph(line or " ", S["mono"])] for line in schema_code]
    code_table = Table(code_rows, colWidths=[usable],
                       style=TableStyle([
                           ("BACKGROUND",(0,0),(-1,-1), colors.HexColor("#0D1117")),
                           ("BOX",(0,0),(-1,-1),1,GREEN_DARK),
                           ("LEFTPADDING",(0,0),(-1,-1),5),
                           ("RIGHTPADDING",(0,0),(-1,-1),5),
                           ("TOPPADDING",(0,0),(-1,-1),2),
                           ("BOTTOMPADDING",(0,0),(-1,-1),2),
                       ]))
    story.append(code_table)
    story.append(sp(5))

    # API Contract
    story.append(Paragraph("API CONTRACT — SMALL AND COMPLETE", S["h3"]))
    api_hdr = [cell("METHOD", S["table_hdr"]), cell("ENDPOINT", S["table_hdr"]),
               cell("PURPOSE", S["table_hdr"]), cell("RESPONSE", S["table_hdr"])]
    api_rows = [api_hdr,
        [Paragraph('<font color="#22C55E"><b>POST</b></font>', S["center"]), cell("/auth/login"), cell("Authenticate user"), cell("{ access_token, token_type }")],
        [Paragraph('<font color="#22C55E"><b>POST</b></font>', S["center"]), cell("/auth/register"), cell("Create user account (optional)"), cell("{ user_id, email }")],
        [Paragraph('<font color="#3B82F6"><b>GET</b></font>',  S["center"]), cell("/projects"), cell("List all projects + aggregate KPIs"), cell("[ { id, name, site_count, area_ha, carbon_tco2e } ]")],
        [Paragraph('<font color="#22C55E"><b>POST</b></font>', S["center"]), cell("/projects"), cell("Create new project"), cell("{ id, name, type, status }")],
        [Paragraph('<font color="#3B82F6"><b>GET</b></font>',  S["center"]), cell("/projects/{id}/sites"), cell("All sites + GeoJSON geometries"), cell("GeoJSON FeatureCollection")],
        [Paragraph('<font color="#22C55E"><b>POST</b></font>', S["center"]), cell("/projects/{id}/sites"), cell("Persist drawn polygon from browser"), cell("{ site_id, area_ha, geometry }")],
        [Paragraph('<font color="#3B82F6"><b>GET</b></font>',  S["center"]), cell("/sites/{id}"), cell("Site metadata + KPI summary"), cell("{ name, area_ha, carbon, biodiversity, ndvi }")],
        [Paragraph('<font color="#3B82F6"><b>GET</b></font>',  S["center"]), cell("/sites/{id}/metrics"), cell("Time-series analytics data for charts"), cell("[ { date, carbon_tco2e, biodiversity, ndvi } ]")],
    ]
    story.append(dark_table(api_rows, [15*mm, 50*mm, 55*mm, 52*mm]))
    story.append(sp(5))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 4 — 15-HOUR BUILD PLAN
    # ══════════════════════════════════════════════════════════════════════════
    story.append(PageBreak())
    story.append(SectionBadge("04", "15-HOUR BUILD PLAN", "Hour-by-hour execution with exit criteria — follow this exactly", usable, AMBER))
    story.append(sp(3))

    timeline = [
        ("0:00–0:45", GREEN,  "Architecture + Repo Setup",
         "Create private GitHub repo. Vite+React+TS frontend. FastAPI backend skeleton. Postgres+PostGIS on Render/Neon. Basic .env files. Install Husky + pre-commit. Push first commit. Confirm CI config file exists.",
         "Repo exists with folder structure. DB connected. First GitHub Actions run (even if minimal)."),
        ("0:45–2:15", GREEN,  "Backend Foundation",
         "FastAPI app with CORS. SQLAlchemy models: User, Project, Site, SiteMetrics. Alembic migrations. JWT auth: /login + /register. Health endpoint /ping. Seed script: 2 projects, 4-6 sites, 12 metrics/site.",
         "curl /auth/login returns JWT. curl /projects returns seeded data. PostGIS geometry column exists."),
        ("2:15–3:30", TEAL,   "Project APIs + Validation",
         "GET /projects (with aggregate KPIs). POST /projects. GET /projects/{id}/sites (returns GeoJSON FeatureCollection). POST /projects/{id}/sites (accepts GeoJSON, stores in PostGIS). Pydantic validation on all inputs.",
         "Postman / curl confirms all 4 endpoints return correct shapes. GeoJSON persists and re-reads."),
        ("3:30–5:00", TEAL,   "React Shell + Mapbox Setup",
         "Tailwind config. Layout: sidebar + top nav + main content area. Mapbox GL JS loads with satellite-streets style. Project list in sidebar. Clicking project fetches sites and renders them as polygon layers on map. Hover tooltips.",
         "Map renders. Clicking a project highlights its sites. Tooltips show site name + area."),
        ("5:00–6:30", AMBER,  "Polygon Draw + Persistence",
         "Install @mapbox/mapbox-gl-draw. Draw mode toggle button. On polygon complete: calculate area client-side, POST GeoJSON to API, persist to PostGIS, re-fetch and re-render the new polygon on map. Success toast on save.",
         "Draw a polygon. Save. Refresh page. Polygon re-appears from database. Area is correct."),
        ("6:30–8:00", AMBER,  "Dashboard UX + Project Cards",
         "Project card grid on dashboard (name, type badge, site count, area, carbon metric). Animated card hover (shadow lift). KPI bar at top (total area, tCO2e, biodiversity score). Empty state if no projects. Consistent 8px grid, Inter font.",
         "Dashboard looks polished. Cards animate on hover. KPIs update when project filter changes."),
        ("8:00–9:30", BLUE,   "Site Intelligence Panel",
         "Click polygon → slide-in right drawer (300ms ease-out). KPI cards: Area (ha), tCO2e, Biodiversity Score, NDVI. Fetch /sites/{id} + /sites/{id}/metrics. Framer Motion or CSS transition. Skeleton loaders during fetch.",
         "Click site → drawer animates open with real API data. Skeleton shows during load. Panel closes cleanly."),
        ("9:30–10:30", BLUE,  "Highcharts Time-Series",
         "4 charts in drawer: Carbon Sequestration (area chart), Biodiversity Index (line), NDVI Trend (line), Projected Credit USD (bar). Highcharts built-in entrance animations. Responsive. Tooltips with exact values. Trend label above chart.",
         "All 4 charts render with real seeded data. Animations play on first load. Tooltips work on hover."),
        ("10:30–11:30", TEAL, "Polish Pass",
         "Smooth polygon draw feedback. Green pulse on successful save. Panel open/close micro-interaction. Chart skeleton during load. Error toast on API failure. Disabled 'Save Site' button during POST. Confirm modal on site delete (if built). Typography consistency.",
         "Full demo journey has zero jarring moments. Every async action has a loading + success + error state."),
        ("11:30–12:15", GREEN, "Reliability + Error Handling",
         "API error boundaries in React. Network failure toast with retry. Empty map state if no sites. Backend 422 validation errors surface cleanly in UI. Demo Mode flag: seeds perfect data, suppresses network errors. Second tab pre-logged-in as backup.",
         "Intentionally disconnect network. App shows error toast gracefully. Re-connect — recovers without refresh."),
        ("12:15–13:00", AMBER, "CI/CD + Deploy",
         "GitHub Actions: lint.yml (ESLint + black + flake8 on every push). deploy.yml (auto-deploy frontend to Vercel, backend to Render on main push). Verify green badge in GitHub. Commit pre-commit hook demo (show a forced failure). Live URL accessible.",
         "Push a commit. GitHub Actions turns green. Live URL works in incognito. README shows green CI badge."),
        ("13:00–14:00", RED,   "Demo Hardening",
         "Script the exact 3-minute flow. Run it 3 times. Fix any stutter or loading delay. Pre-draw 1-2 polygons in seed data so map is never empty. Record 60-sec Loom backup video. Verify live URL 30 min before presentation in incognito.",
         "Full 3-min demo runs without hesitation twice in a row on the live deployed URL."),
        ("14:00–15:00", RED,   "README + Final QA",
         "Architecture diagram (Mermaid). Schema diagram. API summary. Local setup (2 commands). CI/CD explanation. Demo credentials. Design trade-offs section. Word document with all links. Grant repo access to 4 hiring team emails.",
         "README is comprehensive and impressive. Word doc is ready. Repo access granted. Final browser/mobile check done."),
    ]

    tl_hdr = [cell("TIME", S["table_hdr"]), cell("PHASE", S["table_hdr"]),
              cell("WHAT TO BUILD", S["table_hdr"]), cell("EXIT CRITERIA ✓", S["table_hdr"])]
    tl_rows = [tl_hdr]
    for time, col, phase, desc, exit_c in timeline:
        chex = col.hexval()[2:]
        tl_rows.append([
            Paragraph(f'<font color="#{chex}"><b>{time}</b></font>', S["center"]),
            Paragraph(f'<b>{phase}</b>', S["bold"]),
            Paragraph(desc, S["table_cel"]),
            Paragraph(f'<font color="#22C55E">✓</font> {exit_c}', S["table_dim"]),
        ])
    story.append(dark_table(tl_rows, [20*mm, 40*mm, 75*mm, 37*mm]))
    story.append(sp(5))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 5 — 3-MINUTE WOW DEMO SCRIPT
    # ══════════════════════════════════════════════════════════════════════════
    story.append(PageBreak())
    story.append(SectionBadge("05", "3-MINUTE JUDGE DEMO SCRIPT", "Script this word for word — rehearse until it flows", usable, GREEN))
    story.append(sp(3))

    demo_steps = [
        ("0:00–0:20", GREEN,  "The Hook — Login",
         'Open directly on a populated dashboard with project KPIs visible. Say: "Darukaa.Earth is a geospatial command center for managing carbon and biodiversity projects — it turns satellite site data into actionable environmental analytics."',
         "Login with pre-seeded demo@darukaa.earth / Demo1234. Show the JWT token exists (brief DevTools flash). Show the project dashboard with 3 real cards."),
        ("0:20–0:55", TEAL,   "Project Exploration",
         'Click the "Amazon Rainforest Restoration" project. The map flies to South America and renders the site polygons in green. Hover a polygon — tooltip shows "Site Alpha — 1,240 ha". Say: "Each project groups geospatial sites with real-time environmental metrics."',
         "Use the project type filter to show only Carbon projects — proves the UI is data-driven, not hardcoded."),
        ("0:55–1:35", AMBER,  "Polygon Draw — THE MONEY SHOT",
         'Click "Add Site". Draw a polygon on the map. Finish it. Say: "The GeoJSON geometry is computed client-side, validated by the FastAPI backend, and persisted to PostGIS." Watch the polygon appear instantly in the project color with a green success toast.',
         "Show the area auto-calculated (e.g., '847 ha'). The polygon persists after a quick browser refresh — proves real database persistence."),
        ("1:35–2:20", BLUE,   "Site Intelligence Drawer",
         'Click the new polygon. The analytics drawer slides in smoothly from the right. Say: "Clicking any site instantly surfaces its environmental intelligence." Point to the KPI cards (tCO2e, Biodiversity Score, NDVI). Walk through 2 charts.',
         "Highcharts entrance animations play. Point to the trend label: 'Carbon sequestration up 18% vs last quarter.' Show tooltip on hover — exact values visible."),
        ("2:20–2:45", GREEN,  "Engineering Proof",
         'Say: "The full system: React SPA → FastAPI → PostgreSQL/PostGIS. Every commit runs automated lint, format, and type checks via GitHub Actions. Pre-commit hooks enforce code quality before anything reaches the repo."',
         "Flip to GitHub briefly — show the green CI badge. Optionally show the Actions tab with passing runs. This is worth 15 seconds maximum."),
        ("2:45–3:00", AMBER,  "The Close",
         'Return to the project dashboard. Say: "Project → Site → Geospatial data → Analytics → Decision support. A complete environmental intelligence loop, built production-ready in 15 hours."',
         "Pause on the dashboard with all KPIs visible. Smile. Stop talking. The visual does the work."),
    ]

    demo_hdr = [cell("TIMING", S["table_hdr"]), cell("MOMENT", S["table_hdr"]),
                cell("WHAT TO SAY + DO", S["table_hdr"]), cell("TECHNICAL PROOF", S["table_hdr"])]
    demo_rows = [demo_hdr]
    for time, col, moment, say, proof in demo_steps:
        chex = col.hexval()[2:]
        demo_rows.append([
            Paragraph(f'<font color="#{chex}"><b>{time}</b></font>', S["center"]),
            Paragraph(f'<font color="#{chex}"><b>{moment}</b></font>', S["bold"]),
            Paragraph(say, S["table_cel"]),
            Paragraph(proof, S["table_dim"]),
        ])
    story.append(dark_table(demo_rows, [20*mm, 38*mm, 70*mm, 44*mm]))
    story.append(sp(5))

    # Visuals box
    story.append(Paragraph("VISUAL & ANIMATION REQUIREMENTS — JUDGES NOTICE THESE", S["h3"]))
    visual_items = [
        ("Map Style", "Mapbox satellite-streets hybrid. Dark UI theme with earth-tone accents (#22C55E green, #14B8A6 teal). Never default blue pins."),
        ("Polygon Draw", "Real-time vertex snap feedback. Success toast with green checkmark + 'Site saved to PostGIS' message."),
        ("Drawer Animation", "300ms ease-out slide from right + 150ms fade-in. Framer Motion: <code>initial={{x:400}} animate={{x:0}}</code>."),
        ("Chart Entrance", "Highcharts series animation: 400ms. Stagger chart mounts so they cascade in (not all at once)."),
        ("Skeleton Loaders", "Show grey animated skeleton cards while fetching site metrics. Never show empty white space."),
        ("KPI Transitions", "CountUp.js or CSS animation on number change when switching sites. 600ms ease-out."),
        ("Typography", "Inter font stack. 8px spacing grid. Consistent size scale: 24/20/16/14/12px. No mixed font sizes."),
        ("Color Coding", "Green = good/Carbon. Teal = Biodiversity. Amber = Mixed. Red = error only. Never use raw green for errors."),
    ]
    vis_rows = [[Paragraph(k, S["bold"]), Paragraph(v, S["body"])] for k, v in visual_items]
    story.append(dark_table(
        [[cell("ELEMENT", S["table_hdr"]), cell("IMPLEMENTATION", S["table_hdr"])]] + vis_rows,
        [35*mm, usable - 35*mm]
    ))
    story.append(sp(5))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 6 — HACKATHON OPTIMIZATION
    # ══════════════════════════════════════════════════════════════════════════
    story.append(PageBreak())
    story.append(SectionBadge("06", "HACKATHON OPTIMIZATION", "What to build vs. skip — ruthless prioritization", usable, AMBER))
    story.append(sp(3))

    build_skip = [
        ("BUILD — Non-Negotiable",           GREEN,  [
            "End-to-end polygon creation + PostGIS persistence + re-render on refresh",
            "Site intelligence drawer with real API data (not hardcoded)",
            "Highcharts with seeded time-series (12 points per site minimum)",
            "JWT auth with protected routes on both frontend and backend",
            "GitHub Actions CI that actually passes green on every push",
            "Pre-commit hooks (Husky + black) — demonstrate a failed commit in demo",
            "Vercel + Render public deployment with live URL in README",
            "Seed data: 2 projects, 5+ sites, realistic names (Amazon Rainforest, Kenyan Rangeland)",
        ]),
        ("BUILD LIGHTWEIGHT — If Time Allows", TEAL, [
            "User registration (can skip if demo account suffices)",
            "Project editing (Create + Read is enough for judging)",
            "Map filters (one type filter is sufficient)",
            "Mobile responsiveness (desktop-first; tablet passable; mobile — don't crash)",
            "Project deletion (empty state is fine without it)",
        ]),
        ("SKIP — 15-Hour Traps",             RED,    [
            "Real satellite data pipelines or external APIs (days of work, not hours)",
            "Role-based access control beyond basic admin (over-engineering for scope)",
            "PDF export / complex reporting (zero judge value for this challenge)",
            "WebSockets / real-time collaboration (fragile and un-demonstrable in 3 min)",
            "ML prediction models (no time to train + validate in 15h)",
            "Docker Compose on VPS (use Render/Vercel — it actually stays up)",
            "Multi-tenant architecture (single user flow is sufficient + cleaner demo)",
            "Offline mode / PWA (irrelevant to judging criteria)",
        ]),
        ("NEVER FAKE — Instant Disqualifier", AMBER, [
            "Core map save flow — polygon must persist to a real database",
            "API calls — all chart data must come from real backend endpoints",
            "Authentication — JWT must be real, not a localStorage flag",
            "Pre-commit hooks — judges will check if they actually run",
            "GitHub Actions — a green badge on a broken pipeline is worse than no badge",
        ]),
    ]

    for title, col, items in build_skip:
        chex = col.hexval()[2:]
        item_rows = [[Paragraph(f'<font color="#{chex}">▸</font> {item}', S["body"])] for item in items]
        content = Table(item_rows, colWidths=[usable - 42*mm],
                        style=TableStyle([("BACKGROUND",(0,0),(-1,-1), SURFACE),
                                          ("LEFTPADDING",(0,0),(-1,-1),5),
                                          ("TOPPADDING",(0,0),(-1,-1),3),
                                          ("BOTTOMPADDING",(0,0),(-1,-1),3)]))
        header = Table([[Paragraph(f'<font color="#{chex}"><b>{title}</b></font>',
                                    ParagraphStyle("bsh", fontName="Helvetica-Bold", fontSize=9, textColor=col))]],
                        colWidths=[40*mm],
                        style=TableStyle([("BACKGROUND",(0,0),(-1,-1), SURFACE2),
                                          ("LINEABOVE",(0,0),(-1,0), 3, col),
                                          ("TOPPADDING",(0,0),(-1,-1),5),
                                          ("BOTTOMPADDING",(0,0),(-1,-1),5),
                                          ("LEFTPADDING",(0,0),(-1,-1),5)]))
        row = Table([[header, content]], colWidths=[42*mm, usable-42*mm],
                    style=TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),
                                      ("LEFTPADDING",(0,0),(-1,-1),0),
                                      ("RIGHTPADDING",(0,0),(-1,-1),0),
                                      ("TOPPADDING",(0,0),(-1,-1),0),
                                      ("BOTTOMPADDING",(0,0),(-1,-1),2)]))
        story.append(row)
        story.append(sp(2))

    story.append(sp(4))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 7 — TRADE-OFFS (JUDGE ARTICULATION)
    # ══════════════════════════════════════════════════════════════════════════
    story.append(SectionBadge("07", "TRADE-OFF ARTICULATION", "Judges score candidates who explain WHY — prepare these answers", usable, TEAL))
    story.append(sp(3))

    tradeoffs = [
        ("FastAPI over Django/Flask",
         "Django is production-proven but heavy to scaffold in 15 hours. Flask is lighter but lacks automatic OpenAPI docs. FastAPI gives automatic /docs, Pydantic validation, async support, and is the fastest to write clean REST endpoints at hackathon pace.",
         "Speed + correctness + automatic documentation in one choice."),
        ("Mock time-series over real satellite APIs",
         "Real data pipelines (Sentinel-2, Planet API) require account setup, API rate limits, preprocessing pipelines, and take days to validate. Seeded realistic mock data that follows real-world ranges (NDVI 0.3–0.8, carbon tCO2e realistic for forest hectarage) is statistically credible and demonstrable in 3 minutes.",
         "Documented mock = stronger than broken real pipeline. Judges read the README."),
        ("Mapbox Draw over custom geometry editor",
         "Building a custom polygon editor from scratch is 2+ days of work. Mapbox Draw is the official, battle-tested library — it handles vertex snapping, polygon closure, editing, and GeoJSON export out of the box. Zero reinvention of solved problems.",
         "Ship in 2 hours vs. 2 days. Use the right tool, not the hard tool."),
        ("Highcharts over D3.js",
         "D3.js offers maximum flexibility but requires writing every axis, scale, and transition from scratch — easily 8 hours for 4 charts. Highcharts provides production-grade charts with built-in animations, responsive containers, and time-series support in 2 hours of configuration.",
         "Highcharts React wrapper = 4 polished animated charts in 90 minutes."),
        ("Single analytics drawer over multi-page dashboard",
         "A multi-page dashboard fragments the 3-minute demo and risks navigation confusion. A single site intelligence drawer concentrates the entire analytical value into one smooth interaction — draw polygon → click → analytics appears. Maximum impact, minimum navigation.",
         "Focused wow > broad mediocrity in a 3-minute window."),
        ("Render + Vercel over Docker on VPS",
         "Setting up Docker, nginx, SSL, and a VPS takes 3-4 hours and has a higher risk of deployment failure during judging. Render and Vercel are zero-ops: one push deploys both frontend and backend automatically and the URLs stay up reliably.",
         "No ops complexity. No 2am SSL debugging. Judging actually works."),
        ("GeoAlchemy2 over raw PostGIS SQL",
         "Raw PostGIS SQL is verbose and error-prone in Python. GeoAlchemy2 integrates natively with SQLAlchemy, provides Pythonic geometry types, and handles CRS (SRID 4326) automatically. ST_Area(geography) for area computation is one line.",
         "Geospatial operations in Python with type safety and ORM integration."),
    ]

    to_hdr = [cell("DECISION", S["table_hdr"]), cell("REASONING (WHAT TO SAY)", S["table_hdr"]),
              cell("ONE-LINE VERDICT", S["table_hdr"])]
    to_rows = [to_hdr]
    for dec, reason, verdict in tradeoffs:
        to_rows.append([
            Paragraph(f'<b>{dec}</b>', S["bold"]),
            Paragraph(reason, S["table_cel"]),
            Paragraph(f'<font color="#22C55E"><b>{verdict}</b></font>', S["table_dim"]),
        ])
    story.append(dark_table(to_rows, [40*mm, 90*mm, 42*mm]))
    story.append(sp(5))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 8 — PRODUCTION-READY CHECKLIST
    # ══════════════════════════════════════════════════════════════════════════
    story.append(PageBreak())
    story.append(SectionBadge("08", "PRODUCTION-READY PROTOTYPE CHECKLIST", "Every item that separates hire from no-hire", usable, GREEN))
    story.append(sp(3))

    checklist_groups = [
        ("AUTHENTICATION & SECURITY", GREEN, [
            ("JWT issued on /auth/login and verified on every protected endpoint", True),
            ("Protected routes on frontend redirect unauthenticated users to /login", True),
            ("Demo credentials documented in README (demo@darukaa.earth / Demo1234)", True),
            ("Passwords hashed with bcrypt (passlib) — never stored plaintext", True),
        ]),
        ("GEOSPATIAL CORRECTNESS", TEAL, [
            ("Polygon drawn in browser → GeoJSON validated in Pydantic → stored in PostGIS geometry(Polygon,4326)", True),
            ("SRID explicitly set to 4326 on all geometry columns", True),
            ("area_ha computed server-side with ST_Area(ST_Transform(geometry, 3857)) / 10000", True),
            ("Spatial index: CREATE INDEX ON sites USING GIST(geometry)", True),
            ("Polygon re-renders from DB after page refresh — proves real persistence", True),
        ]),
        ("DATA QUALITY", AMBER, [
            ("Seed data: Amazon Rainforest Restoration, Kenyan Rangeland Carbon, Borneo Biodiversity Reserve", True),
            ("Minimum 12 time-series metric points per site, spanning 12 months", True),
            ("NDVI values in realistic range 0.3–0.85, carbon tCO2e proportional to area_ha", True),
            ("Seed script is idempotent — running twice does not duplicate data", True),
        ]),
        ("CI/CD & CODE QUALITY", GREEN, [
            ("GitHub Actions: lint.yml runs on every push (ESLint + Prettier + black + isort + flake8)", True),
            ("GitHub Actions: deploy.yml auto-deploys on push to main branch only", True),
            ("Green CI badge displayed prominently in README", True),
            ("Husky pre-commit hook runs Prettier + ESLint before every frontend commit", True),
            ("Python pre-commit hook runs black + isort + flake8 before every backend commit", True),
            ("Demo a failed commit attempt during presentation (intentional lint error)", True),
        ]),
        ("FRONTEND PRODUCTION SIGNALS", BLUE, [
            ("Loading skeletons for project list, site panel, and charts", True),
            ("Toast notifications: success (green), error (red), saving (amber)", True),
            ("Empty states with contextual CTAs (no blank white panels)", True),
            ("API error boundaries — app never shows unhandled JS exception to judges", True),
            ("Smooth polygon draw feedback (vertex snap, line preview, success pulse)", True),
            ("Analytics drawer: 300ms ease-out slide animation (Framer Motion or CSS)", True),
            ("Chart entrance animations play on every panel open (Highcharts built-in)", True),
        ]),
        ("DEPLOYMENT & RELIABILITY", RED, [
            ("Vercel frontend build passes with zero TypeScript errors", True),
            ("Render backend health endpoint /ping returns 200 within 2 seconds", True),
            ("Live URL accessible in incognito window without any CORS errors", True),
            ("Environment variables (.env) are NOT committed to git (.gitignore configured)", True),
            ("Demo Mode flag in code: seeds perfect data, suppresses external API errors", True),
            ("Backup: second browser tab pre-logged-in on demo day", True),
            ("Backup: 60-second Loom video recorded and ready if live demo fails", True),
        ]),
        ("README & SUBMISSION", TEAL, [
            ("Architecture diagram (Mermaid or PNG) showing React → FastAPI → PostGIS data flow", True),
            ("Database schema diagram with all tables, columns, types, and relationships", True),
            ("Local setup: two commands maximum to run the full stack locally", True),
            ("CI/CD explanation: what each GitHub Actions workflow does and why", True),
            ("Design trade-offs section: at least 4 decisions explained with reasoning", True),
            ("Demo credentials clearly visible (not buried in the README)", True),
            ("Word document: repo link + live URL + README summary + credentials", True),
            ("Repo access granted to all 4 hiring team emails before submission", True),
            ("Logical commit history: 12+ meaningful commits (not one giant push)", True),
        ]),
    ]

    for group_title, col, items in checklist_groups:
        chex = col.hexval()[2:]
        story.append(Paragraph(f'<font color="#{chex}">▰▰▰</font>  {group_title}',
                                ParagraphStyle("gh", fontName="Helvetica-Bold", fontSize=9,
                                               textColor=col, spaceAfter=3*mm, spaceBefore=4*mm)))
        check_rows = []
        for item, _ in items:
            check_rows.append([
                Paragraph(f'<font color="#{chex}">■</font>', S["center"]),
                Paragraph(item, S["body"]),
            ])
        t = Table(check_rows, colWidths=[8*mm, usable - 8*mm],
                  style=TableStyle([
                      ("BACKGROUND",(0,0),(-1,-1), SURFACE),
                      ("ROWBACKGROUNDS",(0,0),(-1,-1), [SURFACE, colors.HexColor("#111820")]),
                      ("LEFTPADDING",(0,0),(-1,-1),5),
                      ("RIGHTPADDING",(0,0),(-1,-1),5),
                      ("TOPPADDING",(0,0),(-1,-1),3),
                      ("BOTTOMPADDING",(0,0),(-1,-1),3),
                      ("BOX",(0,0),(-1,-1),0.5, col),
                  ]))
        story.append(t)
        story.append(sp(2))

    story.append(sp(5))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 9 — SEED DATA STRATEGY
    # ══════════════════════════════════════════════════════════════════════════
    story.append(PageBreak())
    story.append(SectionBadge("09", "SEED DATA STRATEGY", "Realistic data = credible product — judges read the numbers", usable, TEAL))
    story.append(sp(3))

    seed_hdr = [cell("PROJECT", S["table_hdr"]), cell("SITES", S["table_hdr"]),
                cell("REALISTIC KPIs", S["table_hdr"]), cell("COORDINATES", S["table_hdr"])]
    seed_rows = [seed_hdr,
        [cell("Amazon Rainforest\nRestoration"), cell("3 sites\n(Alpha, Beta, Gamma)"),
         cell("Area: 1,200–2,400 ha\ntCO2e: 8,400–16,800/yr\nBiodiversity: 0.78–0.91\nNDVI: 0.72–0.86"),
         cell("Lat: -3.5 to -2.8\nLon: -60.2 to -59.1\n(Amazonas, Brazil)")],
        [cell("Kenyan Rangeland\nCarbon"), cell("2 sites\n(Mara North, Laikipia)"),
         cell("Area: 850–1,450 ha\ntCO2e: 3,400–5,800/yr\nBiodiversity: 0.62–0.74\nNDVI: 0.41–0.59"),
         cell("Lat: -1.2 to -0.8\nLon: 36.4 to 37.1\n(Rift Valley, Kenya)")],
        [cell("Borneo Biodiversity\nReserve"), cell("2 sites\n(Sabah North, Sarawak)"),
         cell("Area: 3,200–4,800 ha\ntCO2e: 22,400–33,600/yr\nBiodiversity: 0.88–0.95\nNDVI: 0.81–0.93"),
         cell("Lat: 4.2 to 5.1\nLon: 116.8 to 118.2\n(Sabah, Malaysia)")],
    ]
    story.append(dark_table(seed_rows, [32*mm, 25*mm, 65*mm, 50*mm]))
    story.append(sp(3))

    story.append(Paragraph("TIME-SERIES GENERATION LOGIC (Python seed script pattern)", S["h3"]))
    ts_code = [
        "import random, math",
        "from datetime import date, timedelta",
        "",
        "def generate_metrics(site_id, base_carbon=8400, base_bio=0.78, months=12):",
        "    metrics = []",
        "    for i in range(months):",
        "        d = date(2024, 1, 1) + timedelta(days=30*i)",
        "        # Realistic upward trend + seasonal variation",
        "        carbon = base_carbon * (1 + 0.015*i) + random.uniform(-200, 200)",
        "        bio    = min(0.99, base_bio + 0.008*i + random.uniform(-0.02, 0.02))",
        "        ndvi   = 0.72 + 0.04*math.sin(2*math.pi*i/12) + random.uniform(-0.02, 0.02)",
        "        credit = carbon * 18.5  # ~$18.5/tCO2e market rate",
        "        metrics.append({'site_id': site_id, 'metric_date': d,",
        "                        'carbon_tco2e': round(carbon,1), 'biodiversity_index': round(bio,3),",
        "                        'ndvi': round(ndvi,3), 'projected_credit_usd': round(credit,2)})",
        "    return metrics",
    ]
    code_rows2 = [[Paragraph(line or " ", S["mono"])] for line in ts_code]
    story.append(Table(code_rows2, colWidths=[usable],
                       style=TableStyle([("BACKGROUND",(0,0),(-1,-1), colors.HexColor("#0D1117")),
                                         ("BOX",(0,0),(-1,-1),1,TEAL),
                                         ("LEFTPADDING",(0,0),(-1,-1),6),
                                         ("TOPPADDING",(0,0),(-1,-1),2),
                                         ("BOTTOMPADDING",(0,0),(-1,-1),2)])))
    story.append(sp(5))

    # ══════════════════════════════════════════════════════════════════════════
    # SECTION 10 — README TEMPLATE
    # ══════════════════════════════════════════════════════════════════════════
    story.append(SectionBadge("10", "README EXCELLENCE TEMPLATE", "The README is a judge deliverable — treat it as product documentation", usable, GREEN))
    story.append(sp(3))

    readme_sections = [
        ("Architecture Overview", "One paragraph. React SPA → FastAPI REST API → PostgreSQL/PostGIS. Include a Mermaid diagram: Browser → API → DB. Mention JWT flow, GeoJSON pipeline, and PostGIS geometry storage."),
        ("Database Schema", "Table for each model: column name, type, constraints. Show the GIST index on geometry. Mention ST_Area computation. Include a schema diagram (screenshot or Mermaid ERD)."),
        ("Local Setup (2 commands)", "git clone → copy .env.example → pip install -r requirements.txt → npm install → docker-compose up (or manual Postgres setup) → npm run dev + uvicorn. Maximum 6 steps total."),
        ("Environment Variables", "List every .env key with a placeholder. MAPBOX_TOKEN, DATABASE_URL, JWT_SECRET_KEY, etc. Never commit actual secrets."),
        ("CI/CD Pipeline", "Explain each workflow file: what triggers it, what it runs (lint/test/build), and what it deploys. Show the GitHub Actions badge. Explain pre-commit hooks and how to run them."),
        ("Design Trade-offs", "Minimum 4 decisions: FastAPI vs Django, Mock data vs real APIs, Mapbox Draw vs custom, Highcharts vs D3. Explain the WHY for each — judges score this directly."),
        ("Demo Credentials", "Display prominently at the top of README. Email: demo@darukaa.earth, Password: Demo1234. Live URL in a badge. GitHub repo link."),
        ("Dataset Rationale", "Explain why mock data was used. State the realistic ranges and formulas. Note that the data model supports real satellite API integration as a future enhancement."),
    ]

    rm_rows = [[cell("README SECTION", S["table_hdr"]), cell("WHAT TO WRITE", S["table_hdr"])]]
    for section, content in readme_sections:
        rm_rows.append([Paragraph(f'<b>{section}</b>', S["bold"]), Paragraph(content, S["table_cel"])])
    story.append(dark_table(rm_rows, [45*mm, usable - 45*mm]))
    story.append(sp(5))

    # ══════════════════════════════════════════════════════════════════════════
    # FINAL PAGE — SUBMISSION CHECKLIST + SUCCESS CRITERIA
    # ══════════════════════════════════════════════════════════════════════════
    story.append(PageBreak())
    story.append(SectionBadge("11", "FINAL PRE-SUBMISSION CHECKLIST", "Run this 30 minutes before deadline — in this exact order", usable, RED))
    story.append(sp(3))

    final_items = [
        "Private GitHub repo with 12+ logical commits (not one mega-push)",
        "Repo access granted: ankita.dasgupta@darukaa.com, harsh.kumar@darukaa.com, utkarsh.gauniyal@darukaa.com, guneet.mutreja@darukaa.com",
        "Vercel frontend live URL works in incognito — login with demo credentials succeeds",
        "Render backend /ping returns 200 within 3 seconds from a cold start",
        "Full 3-minute demo flow tested on the live URL — not localhost",
        "Map loads, polygon draw works, site intelligence drawer opens with charts",
        "GitHub Actions CI badge is green on latest main branch commit",
        "Pre-commit hooks are installed and documented (show a forced failure example in README)",
        "README: architecture, schema, setup, CI/CD, trade-offs, credentials — all present",
        "Word document: repo link + live URL + README summary + credentials",
        "Seed data reset mechanism verified (running seed script restores clean demo state)",
        "60-second Loom backup video recorded and accessible",
        "Zero console errors on the main demo journey in deployed URL",
        "Second browser tab pre-logged-in and ready as backup during presentation",
    ]

    final_rows = [[
        Paragraph(f'<font color="#EF4444">■</font>',
                  ParagraphStyle("fc", fontName="Helvetica-Bold", fontSize=10, textColor=RED, alignment=TA_CENTER)),
        Paragraph(item, S["body"])
    ] for item in final_items]

    story.append(Table(final_rows, colWidths=[8*mm, usable - 8*mm],
                       style=TableStyle([
                           ("BACKGROUND",(0,0),(-1,-1), SURFACE),
                           ("ROWBACKGROUNDS",(0,0),(-1,-1), [SURFACE, colors.HexColor("#111820")]),
                           ("BOX",(0,0),(-1,-1),1,RED),
                           ("LINEABOVE",(0,0),(-1,0),3,RED),
                           ("LEFTPADDING",(0,0),(-1,-1),5),
                           ("TOPPADDING",(0,0),(-1,-1),4),
                           ("BOTTOMPADDING",(0,0),(-1,-1),4),
                       ])))
    story.append(sp(6))

    # Success criteria
    story.append(Paragraph("SUCCESS CRITERIA — WHAT JUDGES SEE AT THE 3-MINUTE MARK", S["h3"]))
    success_items = [
        ("Polished React product", "Professional UI with consistent design system, animations, and responsive layout"),
        ("Interactive Mapbox map", "Satellite-style map with real polygon layers, hover tooltips, and draw interaction"),
        ("Real polygon draw + persist", "Drawn polygon appears instantly, persists to PostGIS, re-renders after refresh"),
        ("Site intelligence analytics", "Slide-in drawer with KPI cards and 4 animated Highcharts on real API data"),
        ("Python/PostGIS backend", "FastAPI with proper schema, JWT auth, GeoAlchemy2, and geospatial queries"),
        ("CI/CD discipline", "Green GitHub Actions badge, pre-commit hooks, and documented pipeline in README"),
        ("Trade-off reasoning", "README articulates 4+ technical decisions with clear rationale — not just what, but WHY"),
    ]
    sc_rows = [[cell("✓ CRITERION", S["table_hdr"]), cell("WHAT IT PROVES TO THE JUDGE", S["table_hdr"])]]
    for criterion, proof in success_items:
        sc_rows.append([
            Paragraph(f'<font color="#22C55E"><b>✓</b></font> {criterion}', S["bold"]),
            Paragraph(proof, S["table_cel"]),
        ])
    story.append(dark_table(sc_rows, [55*mm, usable - 55*mm]))
    story.append(sp(6))

    # Footer motto
    motto_data = [[
        Paragraph("STRATEGIC PRINCIPLE", ParagraphStyle("mp", fontName="Helvetica-Bold", fontSize=10, textColor=GREEN, alignment=TA_CENTER)),
    ], [
        Paragraph(
            "Do not attempt to bypass competitors through gimmicks or scope creep. "
            "In a 15-hour build, the practical advantage is a <b>tighter scope</b>, "
            "a more <b>coherent user journey</b>, <b>stronger visual proof</b>, "
            "and a <b>genuinely working technical spine</b>. "
            "A focused, polished, correctly-stacked MVP that demonstrates the exact required technologies "
            "will beat an ambitious but half-finished platform every single time.",
            ParagraphStyle("mb", fontSize=9, textColor=TEXT_SEC, alignment=TA_CENTER, leading=14)
        ),
    ]]
    motto_table = Table(motto_data, colWidths=[usable],
                        style=TableStyle([
                            ("BACKGROUND",(0,0),(-1,-1), SURFACE2),
                            ("BOX",(0,0),(-1,-1),1.5,GREEN),
                            ("LINEABOVE",(0,0),(-1,0),4,GREEN),
                            ("TOPPADDING",(0,0),(-1,-1),6),
                            ("BOTTOMPADDING",(0,0),(-1,-1),6),
                            ("LEFTPADDING",(0,0),(-1,-1),10),
                            ("RIGHTPADDING",(0,0),(-1,-1),10),
                        ]))
    story.append(motto_table)

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"PDF built → {path}")

build()