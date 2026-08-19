---
name: aarav-dev-guide
description: >
  Master development guide for the Aarav Enterprises project.
  Covers the full stack: UI design system, fonts, dual theme, CSS variables,
  color palette, component patterns, routing, API conventions, backend structure,
  the planned home page redesign (e-commerce style), competitor context,
  and all coding rules and decisions made during development sessions.
  READ THIS FIRST before making any change to this project.
---

# Aarav Enterprises — Master Development Guide

## 1. Project Overview

**Aarav Enterprises** is a professional signage, LED boards, and printing company
based in **Pune, Maharashtra**. They sell physical services (not products):
UV Printing, Acrylic Sign Boards, LED Boards, Glow Signs, Roll-Up Standees,
Flex Banners, Letter Sign Boards, LED Acrylic Letters.

**Primary Sales Channel:** WhatsApp (customers enquire via WhatsApp)
**AI Bot:** Google Gemini-powered auto-responder on WhatsApp in English/Hindi/Marathi

### Tech Stack

| Layer     | Technology                                                       |
|-----------|------------------------------------------------------------------|
| Frontend  | React 19 + Vite 8, TailwindCSS v4, Framer Motion, Lucide React  |
| Backend   | Node.js / Express 4, MySQL2, JWT Auth, whatsapp-web.js           |
| AI        | Google Gemini (`@google/genai`)                                  |
| Database  | MySQL (relational, schema in `/database/`)                       |

### Git Branches
- `main` — stable production branch
- `dev` — active development branch (current work goes here)

---

## 2. Directory Structure

```
Aarav_Enterprises/
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Root router — ThemeProvider wraps everything
│   │   ├── index.css            # 🔑 SINGLE source of truth for ALL design tokens
│   │   ├── App.css              # Vite scaffold remnants; largely unused
│   │   ├── main.jsx             # React 19 entry point
│   │   ├── context/
│   │   │   └── ThemeContext.jsx # useTheme() hook + ThemeProvider
│   │   ├── layouts/
│   │   │   ├── PublicLayout.jsx # Navbar + Footer + WhatsAppFloat wrapper
│   │   │   └── AdminLayout.jsx  # Sidebar + Header; JWT-guards /admin/*
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx        # Public top nav
│   │   │   │   ├── Footer.jsx        # Public footer
│   │   │   │   ├── ThemeToggle.jsx   # Sun/Moon theme toggle button
│   │   │   │   └── WhatsAppFloat.jsx # Fixed floating WhatsApp CTA
│   │   │   └── admin/
│   │   │       ├── AdminSidebar.jsx  # Left sidebar with nav items
│   │   │       └── AdminHeader.jsx   # Top bar with hamburger & theme toggle
│   │   ├── pages/               # Public pages
│   │   │   ├── Home.jsx         # 🔑 Primary sales page (being redesigned)
│   │   │   ├── About.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── ServiceDetail.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── admin/           # Admin panel pages
│   │   ├── data/                # Static data files (empty on dev branch)
│   │   ├── services/
│   │   │   └── api.js           # Axios instance + all API modules
│   │   └── utils/
│   │       └── helpers.js       # openWhatsApp, formatPrice, timeAgo, etc.
│   ├── index.html
│   └── package.json
├── backend/
│   └── src/
│       ├── app.js               # Express setup: CORS, Helmet, rate limiting
│       ├── server.js            # HTTP server startup
│       ├── routes/              # All API route handlers
│       ├── controllers/
│       ├── models/
│       ├── services/            # AI, WhatsApp integration logic
│       ├── middleware/          # errorHandler, authMiddleware
│       └── config/
└── database/                    # SQL schema & seed scripts
```

---

## 3. Design System — CSS Variables

> **Critical rule:** ALL colors, shadows, gradients, and border radii MUST use CSS
> custom properties from `index.css`. Never hardcode hex values in JSX unless
> they are fixed brand values (e.g., WhatsApp green `#25D366`).

### 3.1 Light Mode Tokens (`:root`, `[data-theme="light"]`)

```css
/* Backgrounds */
--bg-main:        #F8FAFC   /* Page background */
--bg-surface:     #FFFFFF   /* Elevated surfaces, modals */
--bg-card:        #FFFFFF   /* Card fill */
--bg-subtle:      #F1F5F9   /* Hover states, table alternating rows */

/* Text */
--text-main:      #0F172A   /* Primary text — very dark navy */
--text-muted:     #475569   /* Secondary / body copy */
--text-subtle:    #64748B   /* Placeholders, labels, hints */

/* Brand Colors */
--brand-violet:   #7C3AED
--brand-pink:     #DB2777
--brand-amber:    #D97706
--brand-emerald:  #059669

/* Gradients */
--grad-primary:   linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)   /* violet → pink */
--grad-secondary: linear-gradient(135deg, #DB2777 0%, #D97706 100%)   /* pink → amber */
--grad-whatsapp:  linear-gradient(135deg, #25D366 0%, #128C7E 100%)   /* WhatsApp green */
--grad-hero:      radial-gradient(ellipse 80% 80% at 50% -20%, rgba(124,58,237,0.1), #F8FAFC)

/* Borders */
--border-light:   #E2E8F0
--border-glow:    rgba(124, 58, 237, 0.35)   /* violet glow on focus/hover */

/* Shadows */
--shadow-sm:      0 1px 3px rgba(0,0,0,0.05)
--shadow-md:      0 4px 15px -2px rgba(15,23,42,0.06), 0 2px 6px -1px rgba(15,23,42,0.04)
--shadow-lg:      0 12px 35px -5px rgba(124,58,237,0.15)
--shadow-glow:    0 0 35px rgba(124,58,237,0.2)

/* Navbar glassmorphism */
--nav-bg:           rgba(255,255,255,0.92)
--nav-pill-bg:      #F1F5F9
--nav-pill-active:  #FFFFFF

/* Purple badge system */
--badge-bg-purple:    #F3E8FF
--badge-text-purple:  #7C3AED
--badge-border-purple:#DDD6FE

/* Border Radius tokens */
--radius-xl:  1.25rem
--radius-lg:  0.875rem
--radius-md:  0.5rem
```

### 3.2 Dark Mode Tokens (`[data-theme="dark"]`)

```css
/* Deep purple-black backgrounds */
--bg-main:    #080413
--bg-surface: #0F0824
--bg-card:    #160C33
--bg-subtle:  #1E1145

/* Text — high contrast on dark */
--text-main:   #F8FAFC
--text-muted:  #CBD5E1
--text-subtle: #94A3B8

/* Brand — slightly lighter for dark backgrounds */
--brand-violet:  #8B5CF6
--brand-pink:    #EC4899
--brand-amber:   #F59E0B
--brand-emerald: #10B981

/* Gradients — same structure, lighter colors */
--grad-primary:  linear-gradient(135deg, #8B5CF6, #EC4899)
--grad-secondary:linear-gradient(135deg, #EC4899, #F59E0B)
--grad-hero:     radial-gradient(ellipse 80% 80% at 50% -20%, rgba(139,92,246,0.25), #080413)

/* Borders — subtle on dark */
--border-light: rgba(255,255,255,0.08)
--border-glow:  rgba(139,92,246,0.4)

/* Shadows — stronger, purple-tinted */
--shadow-sm:   0 2px 8px rgba(0,0,0,0.4)
--shadow-md:   0 10px 30px -5px rgba(0,0,0,0.5)
--shadow-lg:   0 0 50px -10px rgba(139,92,246,0.4)
--shadow-glow: 0 0 40px rgba(139,92,246,0.35)

/* Navbar — dark glassmorphism */
--nav-bg:         rgba(8,4,19,0.88)
--nav-pill-bg:    rgba(255,255,255,0.05)
--nav-pill-active:rgba(139,92,246,0.3)

/* Purple badge — dark variant */
--badge-bg-purple:    rgba(139,92,246,0.15)
--badge-text-purple:  #A78BFA
--badge-border-purple:rgba(139,92,246,0.3)
```

---

## 4. Typography

### Fonts (loaded in index.css via Google Fonts CDN)

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Outfit:wght@300..900&display=swap');
```

| Font                  | Role                                  | Weights    |
|-----------------------|---------------------------------------|------------|
| **Plus Jakarta Sans** | Body, paragraphs, UI elements, buttons | 400, 600  |
| **Outfit**            | Headings h1–h6, brand logo, numbers   | 700, 800   |

### Typography Rules

```css
/* Body — set globally */
body {
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: var(--text-main);
  background-color: var(--bg-main);
}

/* All headings */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

/* Section heading — fluid responsive size */
.section-title { font-size: clamp(2.2rem, 5vw, 3.25rem); font-weight: 800; }
.section-subtitle { font-size: 1.1rem; line-height: 1.7; color: var(--text-muted); }
```

---

## 5. Styling Architecture — Two Paradigms

> ⚠️ **This project uses BOTH Tailwind and CSS Variables. Follow these rules exactly.**

### 5.1 Public Pages — Use CSS Variables (NEW STANDARD)
All public pages (Home, Services, Portfolio, About, Pricing, Contact) **MUST use CSS
custom properties** (`var(--bg-card)`, `var(--text-main)`, etc.) so that both
**light and dark mode work correctly** via the `data-theme` toggle.

**DO NOT** use hardcoded Tailwind color classes like `bg-slate-950` or `text-indigo-400`
on public pages — these ignore the theme toggle.

**Correct pattern:**
```jsx
<div style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
<h2 className="section-title gradient-text">Title</h2>
```

**Wrong pattern (old code — do not repeat):**
```jsx
<div className="min-h-screen bg-slate-950 text-slate-200">  {/* ❌ always dark */}
```

### 5.2 Admin Panel — Use CSS Variables
Admin pages already use CSS vars correctly. Continue the same pattern.

### 5.3 Utility Tailwind Classes Are Still OK
Spacing, flex, grid, border-radius, and layout utilities from Tailwind are fine:
`flex`, `items-center`, `gap-4`, `rounded-xl`, `grid`, `col-span-2`, etc.

---

## 6. Theme System

### How It Works
1. `ThemeProvider` reads `ae_theme` from `localStorage` (fallback: OS preference)
2. Sets `document.documentElement.setAttribute('data-theme', theme)` → swaps all CSS vars
3. Adds `'light'` or `'dark'` class to `<html>` (for Tailwind `dark:` variants)
4. `useTheme()` exposes `{ theme, toggleTheme, setTheme }`

### Usage in Components
```jsx
import { useTheme } from '../../context/ThemeContext';

const { theme, toggleTheme } = useTheme();
const isDark = theme === 'dark';
```

### ThemeToggle Drop-in Component
```jsx
import ThemeToggle from '../components/common/ThemeToggle';
<ThemeToggle />  // Sun/Moon icon button, uses CSS vars, works anywhere
```

### localStorage Keys
- `ae_theme` → `'light'` or `'dark'`
- `ae_token` → JWT for admin auth
- `ae_admin` → admin user info JSON

---

## 7. Pre-Built CSS Class Library (index.css)

Always use these instead of writing ad-hoc styles:

### Gradient Text
```jsx
<span className="gradient-text">violet → pink</span>
<span className="gradient-text-sec">pink → amber</span>
```

### Cards
```jsx
<div className="glass-card">Base card (border + shadow + radius)</div>
<div className="glass-card glass-card-hover">Adds hover: lift + glow border</div>
```

### Buttons
```jsx
<button className="btn-primary">Violet→Pink gradient</button>
<button className="btn-secondary">Outlined, subtle</button>
<button className="btn-whatsapp">Green WhatsApp gradient</button>
<a className="btn-whatsapp-navbar">Animated heartbeat WA button (for Navbar)</a>
```

### Layout Containers
```jsx
<div className="container">     {/* max-w: 1240px, centered, 1.5rem pad */}
<section className="section">  {/* 5.5rem top/bottom padding */}
<h2 className="section-title">
<p className="section-subtitle">
```

### Ambient Glow Orbs (decorative)
```jsx
<div className="orb orb-purple" />  {/* top-right, 500px, blur-90 */}
<div className="orb orb-pink" />    {/* bottom-left, 450px */}
<div className="orb orb-amber" />   {/* centered, 350px */}
```

### Service & Portfolio Cards
```jsx
<div className="service-card">           {/* hover: lift 6px + image scale */}
  <div className="img-container" />      {/* 230px height */}
</div>

<div className="portfolio-card">         {/* 4:3 aspect ratio */}
  <img ... />
  <div className="overlay">...</div>     {/* gradient fade-in on hover */}
</div>
```

### Status Badges (for admin + inquiry lifecycle)
```jsx
<span className="badge badge-new">New</span>
<span className="badge badge-collected">Collected</span>
<span className="badge badge-review">Review</span>
<span className="badge badge-accepted">Accepted</span>
<span className="badge badge-progress">In Progress</span>
<span className="badge badge-ready">Design Ready</span>
<span className="badge badge-revision">Revision</span>
<span className="badge badge-completed">Completed</span>
<span className="badge badge-cancelled">Cancelled</span>
```

### Form Controls
```jsx
<label className="form-label">Label (uppercase, small)</label>
<input className="form-input" />   {/* focus: violet ring 0 0 0 4px */}
```

### Admin Table
```jsx
<table className="admin-table">
  <thead><tr><th>Column</th></tr></thead>
  <tbody><tr><td>Value</td></tr></tbody>
</table>
```

### Skeleton Loading Shimmer
```jsx
<div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-xl)' }} />
```

### WhatsApp Float Button
```jsx
<div className="whatsapp-float-container">
  <div className="whatsapp-tooltip">Chat with us!</div>
  <a className="whatsapp-float pulse-animation" href={waUrl}>
    {/* WhatsApp SVG */}
  </a>
</div>
```

### CSS Animations
| Class / Keyframe    | Effect                                    |
|---------------------|-------------------------------------------|
| `pulse-animation`   | Green glow pulse ring (WhatsApp button)   |
| `skeleton` shimmer  | Loading left→right shimmer sweep         |
| `fadeIn`            | opacity 0→1 + translateY(10→0)           |
| `navbarWaHeartbeat` | Scale + box-shadow ping cycle            |
| `waIconBounce`      | Bounce + rotate on WA icon               |
| `sheenSlide`        | Glossy sheen sweep across button          |
| `waDotPing`         | White dot scale pulse                    |

---

## 8. Routing Structure

```
Public (PublicLayout: Navbar + Footer + WhatsAppFloat)
├── /               → Home.jsx           ← PRIMARY SALES PAGE
├── /about          → About.jsx
├── /services       → Services.jsx
├── /services/:id   → ServiceDetail.jsx
├── /portfolio      → Portfolio.jsx
├── /pricing        → Pricing.jsx
└── /contact        → Contact.jsx

Admin (standalone login)
└── /admin/login    → AdminLogin.jsx

Admin Panel (AdminLayout: Sidebar + Header, JWT-guarded)
├── /admin                    → AdminDashboard
├── /admin/inquiries          → AdminInquiries
├── /admin/inquiries/:id      → AdminInquiryDetail
├── /admin/customers          → AdminCustomers
├── /admin/customers/:id      → AdminCustomerDetail
├── /admin/conversations      → AdminConversations (WhatsApp)
├── /admin/conversations/:id  → AdminConversationDetail
├── /admin/products           → AdminProducts (Services Catalog)
├── /admin/portfolio          → AdminPortfolio
├── /admin/knowledge          → AdminKnowledge (AI KB)
├── /admin/notifications      → AdminNotifications
├── /admin/reports            → AdminReports
└── /admin/settings           → AdminSettings
```

**Admin JWT Guard:** `AdminLayout` checks `localStorage.getItem('ae_token')` on mount.
Missing → redirect to `/admin/login`.

**API Interceptor:** Auto-attaches `Bearer <token>`. On 401 → clears storage + redirects.

---

## 9. API Client (`src/services/api.js`)

Base URL: `VITE_API_URL` env var (default: `/api`)

```js
import {
  authAPI, productAPI, portfolioAPI, inquiryAPI,
  conversationAPI, knowledgeAPI, reportAPI, settingsAPI
} from '../services/api';

// Auth
authAPI.login({ username, password })
authAPI.me()
authAPI.changePassword({ currentPassword, newPassword })

// Products/Services (admin CRUD)
productAPI.list({ page, limit, category_id, featured: true })
productAPI.create(formData)       // multipart/form-data
productAPI.update(id, formData)
productAPI.toggle(id)             // toggle active/inactive
productAPI.remove(id)

// Portfolio
portfolioAPI.list({ page, limit, featured: true })
portfolioAPI.create(formData)
portfolioAPI.waToggle(id)         // toggle WhatsApp-visible flag

// Inquiries
inquiryAPI.list({ status, page })
inquiryAPI.updateStatus(id, { status, notes })
inquiryAPI.addNote(id, { message })

// WhatsApp Conversations
conversationAPI.list({ status })
conversationAPI.sendMessage(id, { message })
conversationAPI.close(id)

// AI Knowledge Base
knowledgeAPI.list()
knowledgeAPI.bulkUpdate(items)

// Reports
reportAPI.summary()
reportAPI.byService()
reportAPI.byStatus()

// Settings
settingsAPI.getPublic()
settingsAPI.getAdmin()
settingsAPI.update(settingsObject)
```

---

## 10. Utility Functions (`src/utils/helpers.js`)

```js
import { openWhatsApp, buildWhatsAppUrl, formatPrice, timeAgo, formatDate, getStatusConfig, truncate } from '../utils/helpers';

// WhatsApp
openWhatsApp()                                   // default greeting
openWhatsApp('Hi, I need a quote')               // custom message
openWhatsApp('', 'LED Sign Boards')             // service-context message
buildWhatsAppUrl('Hi')                           // returns URL string only

// Pricing
formatPrice(5000)           // "₹5,000 onwards"
formatPrice(0)              // "Configurable"
formatPrice(1500, '')       // "₹1,500"

// Time
timeAgo('2024-01-01')       // "3d ago", "2h ago", etc.
formatDate('2024-01-15')    // "15 Jan 2024"

// Admin
getStatusConfig('NEW')      // { label: 'New', className: 'badge-new', color: '#60A5FA' }
truncate('Long text...', 80)
```

---

## 11. Framer Motion Animation Patterns

### Page entrance (stagger children)
```jsx
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

<motion.div variants={container} initial="hidden" animate="show">
  {items.map(i => <motion.div variants={item} key={i.id}>...</motion.div>)}
</motion.div>
```

### Scroll-triggered
```jsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
```

### Simple fade-in on page load
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
>
```

### Filter gallery (AnimatePresence + layout)
```jsx
<motion.div layout className="grid ...">
  <AnimatePresence>
    {items.map(item => (
      <motion.div
        layout key={item.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4 }}
      />
    ))}
  </AnimatePresence>
</motion.div>
```

---

## 12. Services Data

8 services, each with:
```js
{
  id: 'uv-printing',          // URL slug and anchor ID
  title: 'UV Printing Services',
  description: '...',
  icon: PenTool,              // Lucide React icon component
  features: ['Sun Board Cut Out', 'UV Flatbed Printing', ...],
  images: portfolioImages['UV Printing'] || [],
  color: 'from-blue-500 to-indigo-600'  // Tailwind gradient for icon bg
}
```

**All service IDs:**
`uv-printing` · `acrylic-sign-boards` · `led-sign-boards` · `glow-sign-boards`
· `roll-up-standees` · `flex-banners` · `letter-sign-boards` · `led-acrylic-letters`

---

## 13. Backend API Routes Reference

All prefixed `/api/`:

| Group            | Prefix                 | Auth         |
|------------------|------------------------|--------------|
| Auth             | `/api/auth`            | Public/JWT   |
| Categories       | `/api/categories`      | Admin JWT    |
| Products/Services| `/api/products`        | Admin JWT    |
| Portfolio        | `/api/portfolio`       | Mixed        |
| Customers        | `/api/customers`       | Admin JWT    |
| Inquiries        | `/api/inquiries`       | Mixed        |
| WA Conversations | `/api/conversations`   | Admin JWT    |
| AI Knowledge     | `/api/ai/knowledge`    | Admin JWT    |
| Notifications    | `/api/notifications`   | Admin JWT    |
| Reports          | `/api/reports`         | Admin JWT    |
| Settings         | `/api/settings`        | Mixed        |
| WhatsApp Webhook | `/api/whatsapp`        | Webhook key  |
| Static Uploads   | `/uploads/*`           | Public       |
| Health           | `/health`              | Public       |

**Rate Limits:**
- General: 300 req / 15 min
- WhatsApp webhook: 1000 req / 1 min

---

## 14. Business & Product Context

| Field         | Value                                                          |
|---------------|----------------------------------------------------------------|
| Company       | Aarav Enterprises                                              |
| Industry      | Signage, LED Boards, Printing, Graphic Design                  |
| Address       | Survey No 659/16, Beside Jagtap Dairy, Bibwewadi, Pune 411037  |
| Email         | info@aaraventerprises.com                                      |
| Languages     | English, Hindi, Marathi (WhatsApp multilingual)               |
| AI Bot        | Gemini-powered WhatsApp auto-responder                         |
| Competitor    | Mule Advertising (muleadvertising.com) — same services, Pune  |

### Inquiry / Project Lifecycle
```
NEW → REQUIREMENT_COLLECTED → ADMIN_REVIEW → ACCEPTED
    → IN_PROGRESS → DESIGN_READY → CUSTOMER_REVIEW
    → REVISION (optional loop) → COMPLETED
(CANCELLED possible at any step)
```

---

## 15. Home Page Redesign Plan (PENDING — DO NOT BUILD YET)

> [!IMPORTANT]
> The Home page redesign has been discussed and planned but **NOT YET IMPLEMENTED**.
> Build it ONLY when the user explicitly says "proceed" or "build the home page".

### Concept
The new Home page follows an **e-commerce style layout** (inspired by Shop+/WebstarInfotech reference)
adapted for a signage services business. Goal: when a user lands, they immediately see
what services they can buy/order — like a shop, not a brochure.

### Final Design Decisions (locked)

| Decision | Answer |
|---|---|
| Left sidebar (icon strip) | ❌ NOT wanted — use top Navbar instead |
| Navigation | ✅ TOP NAVBAR — redesigned with CSS vars + violet/pink brand |
| Dual theme (light + dark) | ✅ YES — use CSS vars, both modes must work |
| Service card buttons | ✅ BOTH: "Details" (→ service page) AND "Enquire" (→ WhatsApp) |
| Scope | Home page ONLY for now. Services page will be redesigned separately later |
| Color theme | Use the existing violet/pink/amber design system — NOT blue/slate |
| Layout approach | NO Tailwind hardcoded colors — only CSS vars for theme support |

### Navbar Redesign (done alongside Home page)

The current `Navbar.jsx` uses **Tailwind blue/indigo colors** (`bg-slate-900`, `text-blue-400`)
and does NOT support the light/dark theme toggle. It must be rebuilt when the Home page is built.

**New Navbar spec:**
- Uses **CSS variables only** — `var(--nav-bg)`, `var(--text-main)`, `var(--brand-violet)` etc.
- Glassmorphism: `background: var(--nav-bg)` + `backdrop-filter: blur(12px)`
- Brand: violet gradient logo mark + "Aarav Enterprises" in Outfit font
- Nav links: pill-style active state using `var(--nav-pill-active)` and `var(--brand-violet)`
- Right side: `<ThemeToggle />` + `btn-whatsapp-navbar` animated WhatsApp CTA
- Scroll behavior: compact/shadow on scroll, transparent at top
- Mobile: hamburger → slide-down drawer (AnimatePresence) using CSS vars
- **DO NOT use `bg-slate-900`, `text-blue-400`, or any hardcoded Tailwind colors**

### Planned Page Sections

#### 1. Hero Carousel (3 slides, auto-rotate 4s, manual arrows + dots)
- **Slide 1 — LED Sign Boards:** "Light Up Your Brand" · portfolio image right · WhatsApp CTA
- **Slide 2 — UV Printing:** "Vivid Prints That Last" · image right · Quote CTA
- **Slide 3 — Acrylic Letters:** "3D Presence, Premium Look" · image right · WhatsApp CTA
- Style: large left text, image on right, gradient pill badge, 2 CTA buttons per slide

#### 2. Trust Bar (4 items, horizontal strip below hero)
| Icon | Heading | Sub |
|---|---|---|
| 🎨 Palette | Custom Designs | 100% Original, Made for You |
| ⚡ Zap | Fast Turnaround | Delivery in 1–5 Days |
| 💬 MessageCircle | WhatsApp Support | Chat 24/7 in Hindi & English |
| ✅ Shield | Premium Quality | Durable & Print-Ready |

#### 3. "Browse Our Services" (like "Shop by Category")
- 8 service cards in responsive grid (4 cols desktop, 2 cols tablet, 1 col mobile)
- Each card: service photo thumbnail, name, short description
- Price pill: "Starting ₹X" badge
- Delivery pill: "⚡ X Days" turnaround
- **TWO buttons per card:** `[👁 Details] [💬 Enquire]`
  - Details → `/services/:id`
  - Enquire → `openWhatsApp('', service.name)`
- Data source: `productAPI.list({ featured: true })` with fallback static data
- CSS class: `.service-card` from design system

#### 4. "Our Recent Work" (like "Deals of the Day")
- 6 portfolio images in 3-column grid
- Each card: image, category badge overlay, title
- Hover: dark gradient overlay appears with "Get This for My Business →" WhatsApp button
- Data: `portfolioAPI.list({ featured: true })` with Unsplash fallbacks
- CSS class: `.portfolio-card` + `.overlay`

#### 5. Promo CTA Banner (like "Special Offer")
- Full-width section, `background: var(--grad-primary)` (violet→pink)
- Left: headline "Transform Your Brand Identity" + stats (500+ projects, 100+ clients)
- Right: WhatsApp CTA button + "View Pricing" secondary link
- White text on gradient background

#### 6. Stats Bar (below hero, before services)
- 4 stats: 500+ Projects · 100+ Clients · 24/7 Support · 4.9★ Rating
- Uses `.glass-card glass-card-hover` with gradient text numbers

### Service Card Implementation Template
```jsx
function ServiceCard({ service }) {
  return (
    <div className="service-card">
      <div className="img-container">
        {service.thumbnail_url
          ? <img src={service.thumbnail_url} alt={service.name} loading="lazy" />
          : <div style={{ background: 'var(--grad-hero)', height: '100%' }} />
        }
        {/* Category badge + Popular badge */}
      </div>
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3>{service.name}</h3>
        <p style={{ color: 'var(--text-muted)' }}>{service.short_desc}</p>
        {/* Price + delivery info row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
          <Link to={`/services/${service.slug || service.id}`} style={{
            background: 'var(--badge-bg-purple)', color: 'var(--brand-violet)',
            border: '1px solid var(--badge-border-purple)',
          }}>
            <Eye size={15} /> Details
          </Link>
          <button onClick={() => openWhatsApp('', service.name)} className="btn-whatsapp">
            <MessageCircle size={15} /> Enquire
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Hero Carousel Implementation Notes
```jsx
const [slide, setSlide] = useState(0);
const slides = [
  { id: 'led', title: 'Light Up Your Brand', subtitle: 'LED Sign Boards', ... },
  { id: 'uv', title: 'Vivid Prints That Last', subtitle: 'UV Printing', ... },
  { id: 'acrylic', title: '3D Presence, Premium Look', subtitle: 'Acrylic Letters', ... },
];

// Auto-rotate
useEffect(() => {
  const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 4000);
  return () => clearInterval(t);
}, []);
```

### Fallback Data (when backend is offline)
The dev branch has an empty `data/` folder. Always include `FALLBACK_SERVICES` and
`FALLBACK_PORTFOLIO` arrays directly in `Home.jsx` to handle offline/API-down scenarios.

---

## 16. Coding Rules & Conventions

### General Rules
1. **CSS vars for ALL public page colors** — never `bg-slate-950` or hardcoded hex
2. **Framer Motion** for all page entrance / filter / transition animations
3. **Lucide React** is the only icon library — no emoji icons in components
4. **react-hot-toast** for all notifications (pre-themed in App.jsx)
5. **axios via `api.js`** — never raw `fetch()` for backend calls
6. **Both buttons** on any service card: detail link + WhatsApp enquire button
7. **Always include fallback data** arrays when fetching from API

### File Naming
- Components → `PascalCase.jsx`
- Utilities / data → `camelCase.js`

### Public Page Template (correct pattern for new pages)
```jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productAPI } from '../services/api';

export default function MyPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Page Title — Aarav Enterprises';
    async function load() {
      try {
        const res = await productAPI.list();
        setData(res.data.data || FALLBACK_DATA);
      } catch {
        setData(FALLBACK_DATA);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    // ✅ Use CSS vars — NOT Tailwind color classes
    <div style={{ background: 'var(--bg-main)', color: 'var(--text-main)', paddingTop: 70 }}>
      <div className="container section">
        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Page <span className="gradient-text">Title</span>
        </motion.h1>
        {loading
          ? <div className="skeleton" style={{ height: 400 }} />
          : <div>...content...</div>
        }
      </div>
    </div>
  );
}

const FALLBACK_DATA = [...]; // Always define fallback
```

### Admin Page Template
```jsx
import { useState, useEffect } from 'react';
import { someAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminSomePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      setLoading(true);
      const res = await someAPI.list();
      setData(res.data.data);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, color: 'var(--text-main)' }}>
        Page Title
      </h1>
      {loading
        ? <div className="skeleton" style={{ height: 200 }} />
        : <table className="admin-table">...</table>
      }
    </div>
  );
}
```

### WhatsApp Integration
```jsx
import { openWhatsApp } from '../utils/helpers';

// Generic
<button onClick={() => openWhatsApp()}>Chat with us</button>

// Service-specific (always include both buttons on cards)
<Link to={`/services/${service.slug}`}>View Details</Link>
<button onClick={() => openWhatsApp('', service.name)}>Enquire on WhatsApp</button>
```

---

## 17. Key Gotchas & Decisions

1. **Dev branch `data/` is empty.** There is no `images.js` or `services.js` on dev.
   All static data must be fallback arrays inside the component file itself.

2. **Public pages MUST support both light and dark theme.** This means ONLY CSS vars
   for colors. The current Home.jsx on dev already does this correctly (uses CSS vars).

3. **No left sidebar on public pages.** The icon sidebar was considered but rejected.
   The Navbar handles all navigation on all pages.

4. **Admin sidebar uses an embedded `<style>` block** inside `AdminSidebar.jsx` for
   `.admin-nav-item` — this is intentional, do not move it.

5. **react-hot-toast is pre-styled** in App.jsx to use CSS vars:
   `background: var(--bg-surface), color: var(--text-main), border: 1px solid var(--border-light)`

6. **WhatsApp number** from `VITE_WA_NUMBER` env var. Default: `15551960714` (test).

7. **Custom scrollbar** uses `--grad-primary` (violet→pink gradient) globally.

8. **Container widths:** CSS `.container` = max 1240px. Use this consistently on
   all public pages. The old Tailwind `max-w-7xl` (1280px) is being replaced.

9. **Service cards always have TWO buttons:** Details (link to page) + Enquire (WhatsApp).
   This is a locked design decision from the product discussions.

10. **Competitor reference:** muleadvertising.com is the main competitor (same city,
    same services, IndiaMart hosted). Their website is outdated — our goal is to look
    dramatically more modern and professional.
