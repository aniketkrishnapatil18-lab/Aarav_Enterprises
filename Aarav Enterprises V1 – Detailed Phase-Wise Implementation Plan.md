# Aarav Enterprises V1 – Detailed Phase-Wise Implementation Plan

**Reference site analyzed:** [muleadvertising.com](https://www.muleadvertising.com/)  
**Prepared for:** Aarav Enterprises  
**Document version:** 1.0  
**Status legend:** ⬜ Not Started | ⏳ In Progress | ✅ Done | ❌ Blocked

---

## 0. Reference Site Analysis (Source of Truth)

The reference site is a B2B "seller storefront" style catalog website (IndiaMART storefront template pattern) selling signage/printing products. It has the following observed structure:

### Global
- **Top utility strip:** logo + company name/location, GST/verification badge, "Payment Protected" badge, phone number (click-to-call), "Response rate" badge, "Send Email" button.
- **Primary navigation bar:** with a mega-menu ("Our Product Range") that expands into 4+ column categories, each with a heading, 5 sub-links, and a "View All Products" link, plus a "View All Categories" link.
- **Secondary nav items:** "Introduction & Profiles" (dropdown: Testimonial, About the Company, Download Brochure), "Contact Us".
- **Search bar:** in the header.
- **Sticky/secondary call bar:** duplicated (phone + response rate + email) that appears again below nav (visible on scroll).

### Homepage sections (in order)
1. **Category icon strip** — horizontal row of 8 clickable image+label items linking to product categories (logo/icon + label).
2. **Featured product carousel/grid** — "Get Quote" cards with image, title (linked), price, 2–3 spec bullet points, and a "Get Quote" CTA button. Includes a "View Complete Range of Products" promo card.
3. **Welcome/About block** — "WELCOME TO [Company Name]" heading, 2–3 line company description, "Read More..." link, secondary CTA strip ("GET IN TOUCH WITH US FOR BEST DEALS" + Contact Us button).
4. **Company statistics/info grid** — small 2-column label/value cards: Nature of Business, Total Employees, GST Registration Date, Legal Status, Annual Turnover, GST No., CIN No., Trustseal Verified badge.
5. **"Our Product Range" catalog block** — repeated for each category: category heading (linked) + "View All" link, followed by a horizontal scroll/grid of 3–5 product cards (image, title, price, spec bullets, Get Quote button).
6. **Product Videos modal/lightbox** — triggered section showing video thumbnails with title + Get Quote CTA, opened in an "X"-closable overlay.
7. **Contact Us section** — contact person name/designation, company name, full address, "Get Directions" (Google Maps link), "Send Email" button, social share icons (Facebook, LinkedIn, Twitter).
8. **Enquiry / "Get Quote" form (modal, triggered from multiple CTAs)** — salutation radio (Mr/Ms/Mrs/Dr), requirement textarea, mobile number field, email field, name field, client-side validation messages, submit → success/thank-you confirmation state.
9. **Footer** — "Company" link list, "Our Product Range" link list (mirrors nav), social share icons, copyright line, platform attribution line.

### Interactive/functional elements identified
- Click-to-call links (`tel:`), click-to-email links (`mailto:`).
- Mega-menu on hover/click (desktop) collapsing to accordion on mobile.
- Product card CTA ("Get Quote") opens a shared enquiry modal, pre-noting the product of interest.
- Modal/lightbox for product videos with an explicit close ("X") control.
- Horizontally scrollable card rows within category blocks (carousel behavior with overflow/scroll or arrow controls).
- Sticky header on scroll (secondary contact bar appears/persists).
- Form validation (required-field inline error messages) and post-submit "Thank you" confirmation message.
- Social share links (Facebook/LinkedIn/Twitter) using share-intent URLs.
- "Get Directions" opens Google Maps with coordinates.
- Search input in header (site/product search).
- Anchor-link navigation to in-page product sections (URLs use `#slug` fragments).

### Visual/UX characteristics
- Clean, dense, catalog/commerce-first layout; card-based grids throughout.
- Consistent card pattern: image → title (link) → price (bold/colored) → 2–3 spec bullets → full-width or right-aligned CTA button.
- Two-tone brand color usage (a primary accent color for CTAs/links/prices, neutral grays/white for backgrounds and text).
- Repeated horizontal rules/section dividers between category blocks.
- Small badge/verification iconography (Trustseal, Payment Protected).
- Responsive behavior: mega-menu → accordion/drawer; card grids → horizontal scroll or stacked single-column; sticky call bar collapses to icon-only or floating call button on mobile.

This analysis is the baseline for the component inventory and phases below. Because the reference is a live third-party template, "replicate design/structure/UX/functionality" is interpreted as build an equivalent, original implementation for Aarav Enterprises that follows the same information architecture, section order, card patterns, and interaction model, with Aarav's own branding, copy, imagery, and product data (no copied text/images/code from the source).

---

## 1. Project Scope & Tech Stack

### Recommended stack
- **Frontend:** React (Vite) + TypeScript, Tailwind CSS
- **Routing:** React Router (or Next.js if SSR/SEO is required — recommended given catalog/SEO nature)
- **Forms:** React Hook Form + Zod validation
- **Animation:** Framer Motion (page/section transitions, hover/scroll effects) + CSS transitions for micro-interactions
- **Icons:** Lucide React
- **Carousel:** Embla Carousel or Swiper.js (for card rows)
- **Modal/Dialog:** Radix UI Dialog (accessible modal for enquiry form + video lightbox)
- **State/data:** Static JSON/CMS-driven product data (or headless CMS if content team needs self-serve editing)
- **Backend for form submission:** serverless function / API route → email service (e.g., SMTP/SendGrid) + optional lead DB
- **Hosting:** Vercel/Netlify (or client's preferred host)
- **Analytics:** GA4 + basic event tracking on CTA clicks

**Out of scope for V1 (flag for V2):** user accounts, e-commerce checkout/payment, multilingual i18n, CMS admin UI, live chat widget.

---

## 2. Information Architecture (Sitemap)

| Path | Description |
| :--- | :--- |
| `/` | Home - Product Range (all categories overview) |
| `/products/:category` | Category listing page (e.g., `/products/uv-printing-service`) |
| `/products/:category#:slug` | In-page anchor to a specific product within category |
| `/about` | About the Company |
| `/testimonials` | Testimonials |
| `/contact` | Contact Us (also available as modal from any page) |
| `/photos` | Gallery (optional, matches "Photos" footer link) |
| `/sitemap` | HTML sitemap (optional) |

---

## 3. Global Design System

| Token / System | Requirement |
| :--- | :--- |
| **Typography** | 2 font families max (heading + body). Base body size 16px, scale: H1 32–40px / H2 26–28px / H3 20–22px / body 15–16px / small 13px. Line-height 1.4–1.6 for body, 1.2 for headings. |
| **Spacing scale** | 4px base unit → 4/8/12/16/24/32/48/64px. Section vertical padding: 48px mobile / 80px desktop. |
| **Color roles** | `--color-primary` (brand accent, CTA/links/price), `--color-primary-dark` (hover), `--color-text`, `--color-text-muted`, `--color-bg`, `--color-surface` (card bg), `--color-border`, `--color-success`, `--color-error`. |
| **Buttons** | Primary (filled, brand color, white text), Secondary (outlined), Text/Link CTA. All buttons: 4 states — default, hover, focus-visible, disabled. Min height 40px, radius 4–6px. |
| **Cards** | Consistent card shell: image (fixed aspect ratio, object-fit cover), 8–12px internal padding, title (2-line clamp), price, 2–3 bullet spec list, CTA anchored to bottom. Box-shadow on hover (elevation), border 1px default. |
| **Grid** | 12-column responsive grid. Breakpoints: sm 640px / md 768px / lg 1024px / xl 1280px. |
| **Icons** | Consistent icon set (24px default, 16px inline). |

---

## 4. Component Inventory (build once, reuse everywhere)

1. Header (logo, contact strip, search, primary nav)
2. MegaMenu (desktop) / MobileNavAccordion
3. StickyCallBar
4. CategoryIconStrip
5. ProductCard
6. ProductCarouselRow (horizontal scroll + arrow controls)
7. HeroWelcomeSection
8. CompanyStatsGrid + StatCard
9. CategoryBlock (heading + "View All" + ProductCarouselRow)
10. VideoLightboxModal + VideoCard
11. ContactInfoBlock (address, directions, share icons)
12. EnquiryFormModal (salutation radio, textarea, mobile, email, name, validation, success state)
13. SocialShareIcons
14. Footer (link columns, share icons, legal line)
15. Breadcrumbs (category/product pages)
16. Badge (verification/trust badges)
17. Toast/InlineSuccessMessage
18. SkeletonLoader (image/card loading states)
19. ScrollToTopButton
20. FloatingCallButton (mobile)

---

## 5. Phase-Wise Development Plan

### PHASE 0 — Project Setup & Foundations
**Progress:** ⬜ 0% [░░░░░░░░░░]

#### Tasks
- [ ] Initialize repo, tooling (ESLint, Prettier, TypeScript, Tailwind config)
- [ ] Define design tokens (colors, spacing, typography) in Tailwind config
- [ ] Set up routing skeleton and folder structure (`/components`, `/pages`, `/data`, `/hooks`)
- [ ] Set up CI (lint + build check on PR)
- [ ] Set up staging deployment pipeline

**Dependencies:** Node.js LTS, package manager, hosting account, domain/DNS access.

#### Acceptance Criteria & Test Cases
**AC & TC Progress:** ⬜ 0% [░░░░░░░░░░]

1. [ ] **AC0.1: Project builds with zero errors**
   - [ ] **TC0.1.1:** Run `npm run build`, expect exit code 0.
     - [ ] Verified locally
     - [ ] Verified in CI
2. [ ] **AC0.2: Design tokens available globally**
   - [ ] **TC0.2.1:** Import a token in a test component, confirm value renders.
     - [ ] Colors
     - [ ] Spacing
     - [ ] Typography tokens present
3. [ ] **AC0.3: CI blocks broken builds**
   - [ ] **TC0.3.1:** Push a PR with a lint error, confirm CI fails.
     - [ ] CI fails on error
     - [ ] CI passes on clean code

**Definition of Done:** Repo builds, lints, deploys to staging on push to `main`, and all AC test cases pass.

---

### PHASE 1 — Header, Navigation & Mega Menu
**Progress:** ⬜ 0% [░░░░░░░░░░]

**Components:** Header, MegaMenu, MobileNavAccordion, StickyCallBar, Search input.

#### Functional Requirements
- Logo + company name links to Home.
- Click-to-call (`tel:`) and click-to-email (`mailto:`) links functional on all devices.
- "Our Product Range" nav item opens mega-menu on hover (desktop, ≥1024px) and on tap (tablet/mobile) showing 4 category columns, each with 5 sub-links + "View All Products", plus a global "View All Categories" link.
- "Introduction & Profiles" opens dropdown with Testimonial / About / Download Brochure.
- Search input filters/searches product catalog (min: navigates to a search results state).
- Header becomes sticky (or a condensed sticky bar with phone/email persists) after scrolling past hero.

#### UI/UX Requirements
- Mega-menu columns aligned in a grid, max width matches container, closes on outside click / Esc / route change.
- Active nav item indicated visually (underline or color).
- Mobile: nav collapses into hamburger → slide-in drawer; mega-menu becomes accordion (tap category to expand sub-links).

#### Animation/Interaction Requirements
- Mega-menu: fade + slight translate-Y open/close transition, 150–200ms ease-out.
- Sticky bar: smooth show/hide on scroll direction change (`translateY` transition, 200ms).
- Hamburger icon morphs to "X" on open (CSS transform transition).
- Focus-visible outline on all interactive nav elements for keyboard users.

#### Responsive Requirements
- Desktop (≥1024px): full nav + hover mega-menu.
- Tablet (768–1023px): hamburger nav, tap-to-expand mega-menu as full-width drawer.
- Mobile (<768px): hamburger nav, accordion categories, sticky call bar collapses to icon + "Call" label or floating action button.

#### Acceptance Criteria & Test Cases
**AC & TC Progress:** ⬜ 0% [░░░░░░░░░░]

1. [ ] **AC1.1: Mega-menu opens/closes correctly on desktop hover**
   - [ ] **TC1.1.1:** Hover nav item → menu appears within 200ms.
     - [ ] Opens on hover
   - [ ] **TC1.1.2:** Move mouse away → menu closes.
     - [ ] Closes on mouse-out
   - [ ] **TC1.1.3:** Click outside → menu closes.
     - [ ] Closes on outside click
2. [ ] **AC1.2: Mobile nav opens as drawer/accordion**
   - [ ] **TC1.2.1:** Tap hamburger → drawer slides in.
     - [ ] Drawer opens
   - [ ] **TC1.2.2:** Tap category → sub-links expand.
     - [ ] Accordion expands
   - [ ] **TC1.2.3:** Tap "X" → drawer closes.
     - [ ] Drawer closes
3. [ ] **AC1.3: Click-to-call/email links work**
   - [ ] **TC1.3.1:** Tap phone link on mobile → dialer opens with correct number.
     - [ ] `tel:` correct
   - [ ] **TC1.3.2:** Click email link → mail client opens with correct address.
     - [ ] `mailto:` correct
4. [ ] **AC1.4: Sticky bar behavior**
   - [ ] **TC1.4.1:** Scroll down past hero → sticky bar appears.
     - [ ] Appears on scroll
   - [ ] **TC1.4.2:** Scroll up → bar reappears immediately; scroll down → bar hides.
     - [ ] Hides/shows correctly
5. [ ] **AC1.5: Keyboard accessibility**
   - [ ] **TC1.5.1:** Tab through nav using only keyboard, confirm logical order and visible focus.
     - [ ] Tab order correct
     - [ ] Focus visible
   - [ ] **TC1.5.2:** Esc closes open mega-menu.
     - [ ] Esc closes menu
6. [ ] **AC1.6: Search input functions**
   - [ ] **TC1.6.1:** Type a product name, press Enter → navigates to results.
     - [ ] Search submits
   - [ ] **TC1.6.2:** Empty search blocked or shows all.
     - [ ] Empty state handled

**Definition of Done:** All AC1.x pass on Chrome/Firefox/Safari desktop + mobile Safari/Chrome; no console errors; passes keyboard-only navigation audit.

---

### PHASE 2 — Homepage: Category Icon Strip & Hero/Welcome Section
**Progress:** ⬜ 0% [░░░░░░░░░░]

**Components:** CategoryIconStrip, HeroWelcomeSection, ProductCarouselRow (for featured products).

#### Functional Requirements
- Icon strip renders 6–8 category tiles (image/icon + label), each linking to its category page/section.
- Hero section: "WELCOME TO [Company Name]" heading, 2–4 line description, "Read More" link → About page, secondary CTA banner ("Get in touch for best deals" + Contact button).
- Featured product carousel: 4–8 ProductCards including one promo card ("View Complete Range of Products" + Get Quote).

#### UI/UX Requirements
- Icon strip: horizontally scrollable on mobile, evenly distributed grid on desktop.
- Hero: two-column layout on desktop (text + CTA banner), stacked on mobile.
- Carousel: partial next-card peek to indicate scrollability; left/right arrow controls on desktop, swipe on touch devices.

#### Animation/Interaction Requirements
- Icon tiles: scale (1.0 → 1.05) + shadow on hover, 150ms ease.
- Carousel: smooth momentum scroll / snap-to-card; arrow buttons animate scroll with easing (300–400ms).
- Hero CTA button: color shift + subtle scale on hover; press state (scale 0.97) on click.
- Section entrance: fade-in-up on scroll into viewport (Intersection Observer, 400–600ms, once per element).

#### Responsive Requirements
- Icon strip: 4 visible per row mobile (scrollable), 8 per row desktop.
- Hero stacks vertically <768px; CTA banner becomes full-width.
- Carousel: 1.2 cards visible mobile, 2.5 tablet, 4+ desktop.

#### Acceptance Criteria & Test Cases
**AC & TC Progress:** ⬜ 0% [░░░░░░░░░░]

1. [ ] **AC2.1: Category icons link correctly**
   - [ ] **TC2.1.1:** Click each icon → verify correct category page loads.
     - [ ] All links verified (n categories)
2. [ ] **AC2.2: Hero renders dynamic company data**
   - [ ] **TC2.2.1:** Update company name/description in data source → confirm hero reflects change without code edit.
     - [ ] Dynamic binding confirmed
3. [ ] **AC2.3: Carousel scroll/swipe works**
   - [ ] **TC2.3.1:** Desktop — click right arrow, cards scroll one card-width.
     - [ ] Arrow scroll
   - [ ] **TC2.3.2:** Mobile — swipe left/right, cards scroll with momentum.
     - [ ] Touch swipe
     - [ ] Snap alignment
4. [ ] **AC2.4: Scroll entrance animation fires once**
   - [ ] **TC2.4.1:** Scroll section into view → fade-in-up plays once, does not replay on re-scroll.
     - [ ] Animates on first view
     - [ ] No repeat replay
5. [ ] **AC2.5: Promo card CTA opens enquiry modal**
   - [ ] **TC2.5.1:** Click "Get Quote" on promo card → EnquiryFormModal opens.
     - [ ] Modal opens
     - [ ] Correct context passed

**Definition of Done:** Section fully responsive at all breakpoints, animations respect prefers-reduced-motion, all links/CTAs verified.

---

### PHASE 3 — Product Card & Category Block System
**Progress:** ✅ 100% [██████████]

**Components:** ProductCard, CategoryBlock, ProductCarouselRow, Breadcrumbs.

#### Functional Requirements
- ProductCard displays: image, title (links to product/category anchor), price, up to 3 spec bullets, "Get Quote" button.
- CategoryBlock renders category heading (linked), "View All" link, and a row of ProductCards (5–8 per category, from data source).
- Repeated for every category defined in the product data set.
- Clicking a product title scrolls to / navigates to the detailed anchor section with full specs.
- "View All" navigates to the full category listing page.

#### UI/UX Requirements
- Card image: fixed aspect ratio (e.g., 4:3), lazy-loaded, placeholder/skeleton while loading.
- Price styled in brand accent color, bold.
- Title truncates to 2 lines with ellipsis if overflow.
- Consistent card height across a row regardless of content length (flex/grid alignment).

#### Animation/Interaction Requirements
- Card hover: image zoom (scale 1.05, overflow hidden), border/shadow elevation, 200ms ease.
- "Get Quote" button hover: fill/darken transition.
- Category block heading: underline-grow animation on hover of "View All" link.
- Lazy image fade-in on load (opacity 0 → 1, 250ms).

#### Responsive Requirements
- Desktop: 4–5 cards per row visible, horizontal scroll for overflow.
- Tablet: 2–3 cards visible.
- Mobile: 1.2 cards visible (peek), horizontal scroll, snap points.
- Category heading + "View All" wrap gracefully on narrow screens.

#### Acceptance Criteria & Test Cases
**AC & TC Progress:** ✅ 100% [██████████]

1. [x] **AC3.1: Product card renders all required fields**
   - [x] **TC3.1.1:** Render card with full data → image, title, price, 3 bullets, CTA all visible.
     - [x] Full data case
   - [x] **TC3.1.2:** Render card with missing optional fields (e.g., no bullets) → layout doesn't break.
     - [x] Partial data case
2. [x] **AC3.2: Card CTA opens enquiry modal with product context**
   - [x] **TC3.2.1:** Click "Get Quote" on Product X → modal opens and pre-fills/references Product X.
     - [x] Modal opens
     - [x] Context correct
3. [x] **AC3.3: Category block "View All" navigates correctly**
   - [x] **TC3.3.1:** Click "View All" on category → correct category page loads with full list.
     - [x] Navigation correct per category
4. [x] **AC3.4: Images lazy load and degrade gracefully**
   - [x] **TC3.4.1:** Throttle network → confirm skeleton shows, image fades in on load.
     - [x] Lazy load confirmed
   - [x] **TC3.4.2:** Broken image URL → fallback placeholder shown, no layout shift.
     - [x] Fallback confirmed
5. [x] **AC3.5: All category blocks render from data source**
   - [x] **TC3.5.1:** Add a new category to data → new CategoryBlock appears on homepage automatically.
     - [x] New category renders without code change

**Definition of Done:** No layout shift (CLS) from images; all cards keyboard-navigable and screen-reader labeled (image alt text, button labels).

---

### PHASE 4 — Company Info / Stats Section
**Progress:** ✅ 100% [██████████]

**Components:** CompanyStatsGrid, StatCard, Badge.

#### Functional Requirements
- Grid of label/value pairs (e.g., Nature of Business, Employees, Registration Date, Legal Status, Turnover, Registration numbers) sourced from a single company-profile data object.
- Trust badge(s) rendered where applicable (e.g., "Verified").

#### UI/UX Requirements
- 2–4 column responsive grid, each cell: small muted label above, bold value below.
- Divider lines or subtle card backgrounds separating cells.

#### Animation Requirements
- Optional count-up/fade-in for numeric values on scroll into view (respecting reduced-motion).

#### Responsive Requirements
- 4 columns desktop, 2 columns tablet, 1–2 columns mobile.

#### Acceptance Criteria & Test Cases
**AC & TC Progress:** ✅ 100% [██████████]

1. [x] **AC4.1: All stat fields render from data source**
   - [x] **TC4.1.1:** Update a field value in data → reflected on page without code change.
     - [x] Verified for each field
2. [x] **AC4.2: Grid reflows responsively**
   - [x] **TC4.2.1:** Resize viewport across breakpoints → column count adjusts per spec, no overlap/truncation.
     - [x] Desktop
     - [x] Tablet
     - [x] Mobile
3. [x] **AC4.3: Badge renders conditionally**
   - [x] **TC4.3.1:** Toggle verified flag off → badge hidden. Toggle on → badge shown.
     - [x] On state
     - [x] Off state

**Definition of Done:** Section passes visual QA at all breakpoints; content fully data-driven (no hardcoded values in components).

---

### PHASE 5 — Product Video Lightbox
**Progress:** ⬜ 0% [░░░░░░░░░░]

**Components:** VideoLightboxModal, VideoCard.

#### Functional Requirements
- Grid/list of video thumbnails, each with title and "Get Quote" CTA.
- Clicking a thumbnail opens a modal/lightbox playing the video, with an explicit close ("X") control.
- Modal traps focus while open; closes on Esc, "X", or backdrop click.
- Video pauses/unmounts on modal close (no background audio).

#### UI/UX Requirements
- Thumbnail shows a play-icon overlay on hover.
- Modal centers video with max-width constraint and dark backdrop overlay.

#### Animation/Interaction Requirements
- Modal open: fade + scale-in (0.95 → 1), 200ms ease-out; backdrop fade-in.
- Modal close: reverse animation, 150ms.
- Play-icon overlay: opacity/scale transition on thumbnail hover.

#### Responsive Requirements
- Desktop: modal max-width ~800px centered.
- Mobile: modal full-width with safe padding, video scales to viewport width, maintains aspect ratio.

#### Acceptance Criteria & Test Cases
**AC & TC Progress:** ⬜ 0% [░░░░░░░░░░]

1. [ ] **AC5.1: Video modal opens on thumbnail click**
   - [ ] **TC5.1.1:** Click thumbnail → modal opens, correct video loads.
     - [ ] Correct video per thumbnail
2. [ ] **AC5.2: Modal closes via all exit methods**
   - [ ] **TC5.2.1:** Click "X".
     - [ ] X button
   - [ ] **TC5.2.2:** Press Esc.
     - [ ] Esc key
   - [ ] **TC5.2.3:** Click backdrop.
     - [ ] Backdrop click
3. [ ] **AC5.3: Focus trap & accessibility**
   - [ ] **TC5.3.1:** Tab within open modal → focus stays inside modal until closed.
     - [ ] Focus trapped
   - [ ] **TC5.3.2:** Screen reader announces modal role/label.
     - [ ] ARIA role present
4. [ ] **AC5.4: Video stops on close**
   - [ ] **TC5.4.1:** Play video, close modal → audio/video stops immediately (verify via dev tools/player state).
     - [ ] Confirmed stopped

**Definition of Done:** Modal is accessible (WAI-ARIA dialog pattern), no autoplay-with-sound violations, works on iOS Safari (known video/modal edge cases tested).

---

### PHASE 6 — Contact Section & Enquiry Form (Get Quote)
**Progress:** ⬜ 0% [░░░░░░░░░░]

**Components:** ContactInfoBlock, EnquiryFormModal, SocialShareIcons, Toast/InlineSuccessMessage.

#### Functional Requirements
- Contact block: contact person, company name, full address, "Get Directions" (opens Google Maps with correct coordinates/address), click-to-email.
- Social share icons link to Facebook/LinkedIn/Twitter/X share-intent URLs with correct page URL pre-filled.
- EnquiryFormModal fields: Salutation (radio: Mr/Ms/Mrs/Dr), Requirement (textarea, required), Mobile Number (required, numeric validation, min length), Email (required, format validation), Name (required).
- Every "Get Quote" CTA site-wide opens this same modal, optionally passing product context (e.g., pre-filled requirement text mentioning the product).
- Submit sends data to backend/email service; on success show inline "Thank you, your enquiry has been sent successfully" confirmation and close/reset form after a delay.
- On failure, show a clear inline error and allow retry without losing entered data.

#### UI/UX Requirements
- Inline field-level error messages shown on blur/submit (not just on submit).
- Submit button shows loading state while request is in-flight (disabled + spinner).
- Confirmation state visually distinct (success color, checkmark icon).

#### Animation/Interaction Requirements
- Modal open/close: fade + scale transition (same pattern as video modal for consistency).
- Field error: shake or color-transition on invalid submit attempt (150ms).
- Success state: fade/slide transition replacing form content.

#### Responsive Requirements
- Modal: centered dialog desktop, full-screen sheet on mobile with sticky submit button.
- Contact section: two-column (info + map/CTA) desktop, stacked mobile.

#### Acceptance Criteria & Test Cases
**AC & TC Progress:** ⬜ 0% [░░░░░░░░░░]

1. [ ] **AC6.1: Get Directions opens correct map location**
   - [ ] **TC6.1.1:** Click "Get Directions" → Google Maps opens with correct lat/long or address for Aarav Enterprises.
     - [ ] Coordinates correct
2. [ ] **AC6.2: Social share links carry correct URL**
   - [ ] **TC6.2.1:** Click each share icon → verify pre-filled share URL matches current/canonical page URL.
     - [ ] Facebook
     - [ ] LinkedIn
     - [ ] Twitter/X
3. [ ] **AC6.3: Form validates required fields**
   - [ ] **TC6.3.1:** Submit empty form → all required-field errors shown, submission blocked.
     - [ ] Empty submit blocked
   - [ ] **TC6.3.2:** Enter invalid email → email-format error shown.
     - [ ] Email validation
   - [ ] **TC6.3.3:** Enter invalid mobile (letters/too short) → mobile error shown.
     - [ ] Mobile validation
4. [ ] **AC6.4: Successful submission flow**
   - [ ] **TC6.4.1:** Fill all fields correctly, submit → loading state shown → success confirmation shown → form resets.
     - [ ] Loading state
     - [ ] Success message
     - [ ] Reset behavior
5. [ ] **AC6.5: Failed submission handled gracefully**
   - [ ] **TC6.5.1:** Simulate network/API failure → error message shown, entered data retained, retry succeeds.
     - [ ] Error shown
     - [ ] Data retained
     - [ ] Retry works
6. [ ] **AC6.6: Modal reusable from every CTA entry point**
   - [ ] **TC6.6.1:** Trigger modal from header CTA, product card, hero CTA, footer → same modal component opens correctly each time.
     - [ ] Header CTA
     - [ ] Product card CTA
     - [ ] Hero CTA
     - [ ] Footer CTA
7. [ ] **AC6.7: Product context passed correctly**
   - [ ] **TC6.7.1:** Open modal from a specific product's "Get Quote" → requirement field/context references that product.
     - [ ] Context verified for 3+ products

**Definition of Done:** Form passes accessibility audit (labels, error announcements via aria-live), server-side validation mirrors client-side, spam protection (honeypot/CAPTCHA) in place.

---

### PHASE 7 — Footer & Site-Wide Utilities
**Progress:** ⬜ 0% [░░░░░░░░░░]

**Components:** Footer, ScrollToTopButton, FloatingCallButton.

#### Functional Requirements
- Footer link columns: "Company" (About, Testimonials, Sitemap, Photos, Contact) and "Product Range" (mirrors nav categories + "View All").
- Social share icons repeated in footer.
- Copyright line with dynamic current year.
- "Scroll to top" button appears after scrolling past a threshold, animates page to top on click.
- Mobile floating call button persists across scroll.

#### Acceptance Criteria & Test Cases
**AC & TC Progress:** ⬜ 0% [░░░░░░░░░░]

1. [ ] **AC7.1: Footer links match nav/product data source**
   - [ ] **TC7.1.1:** Add/remove a category in data → footer list updates automatically.
     - [ ] In sync with nav
2. [ ] **AC7.2: Copyright year is dynamic**
   - [ ] **TC7.2.1:** Mock system date to next year → footer year updates without code change.
     - [ ] Dynamic year confirmed
3. [ ] **AC7.3: Scroll-to-top button behavior**
   - [ ] **TC7.3.1:** Scroll down >600px → button appears.
     - [ ] Appears correctly
   - [ ] **TC7.3.2:** Click → page smooth-scrolls to top.
     - [ ] Smooth scroll works
4. [ ] **AC7.4: Floating call button (mobile only)**
   - [ ] **TC7.4.1:** View on mobile viewport → button visible, tapping opens dialer.
     - [ ] Mobile visible/functional
   - [ ] **TC7.4.2:** View on desktop → button hidden.
     - [ ] Desktop hidden

**Definition of Done:** Footer fully data-driven, no dead/placeholder links, dynamic year confirmed.

---

### PHASE 8 — Category & Product Listing Pages
**Progress:** ⬜ 0% [░░░░░░░░░░]

#### Functional Requirements
- Dedicated page per category (`/products/:category`) listing all products in that category using ProductCard in a full grid (not carousel).
- Anchor-link support (`#product-slug`) scrolls to and highlights the specific product on load.
- Breadcrumb navigation (Home > Products > Category).
- SEO: unique title/meta description per category page, driven by data.

#### Acceptance Criteria & Test Cases
**AC & TC Progress:** ⬜ 0% [░░░░░░░░░░]

1. [ ] **AC8.1: Category page lists all products in category**
   - [ ] **TC8.1.1:** Navigate to category page → count of rendered cards matches data source count.
     - [ ] Count matches for each category
2. [ ] **AC8.2: Anchor scroll works**
   - [ ] **TC8.2.1:** Visit `/products/uv-printing-service#sun-board-cut-out` → page auto-scrolls to and highlights that product.
     - [ ] Verified for 3+ anchors
3. [ ] **AC8.3: Breadcrumbs accurate**
   - [ ] **TC8.3.1:** Verify breadcrumb trail and links on each category page.
     - [ ] Correct per category
4. [ ] **AC8.4: SEO metadata unique per page**
   - [ ] **TC8.4.1:** Inspect `<title>`/meta description per category page → unique, non-duplicated.
     - [ ] Verified per category

**Definition of Done:** All category pages generated from data (no manual duplication), pass Lighthouse SEO ≥ 90.

---

### PHASE 9 — Responsive, Animation & Interaction Polish Pass
**Progress:** ⬜ 0% [░░░░░░░░░░]

#### Tasks
- [ ] Full-site pass at breakpoints: 320px, 375px, 768px, 1024px, 1280px, 1440px, 1920px.
- [ ] Verify `prefers-reduced-motion` disables/reduces all non-essential animations.
- [ ] Consistency pass on hover/focus states across all interactive elements.
- [ ] Verify touch targets ≥ 44×44px on mobile.
- [ ] Verify no horizontal overflow/scroll-jank at any breakpoint.

#### Acceptance Criteria & Test Cases
**AC & TC Progress:** ⬜ 0% [░░░░░░░░░░]

1. [ ] **AC9.1: No horizontal scroll/overflow at any breakpoint**
   - [ ] **TC9.1.1:** Load every page at each listed breakpoint → confirm no horizontal scrollbar.
     - [ ] All breakpoints checked per page
2. [ ] **AC9.2: Reduced motion respected**
   - [ ] **TC9.2.1:** Enable OS "reduce motion" → confirm animations are removed/minimized site-wide.
     - [ ] Verified on 3+ animated components
3. [ ] **AC9.3: Touch targets meet minimum size**
   - [ ] **TC9.3.1:** Audit all buttons/links on mobile with dev tools → all ≥44×44px.
     - [ ] Nav
     - [ ] Cards
     - [ ] Form
     - [ ] Footer
4. [ ] **AC9.4: Consistent hover/focus states**
   - [ ] **TC9.4.1:** Tab/hover through every interactive element → consistent visual treatment per component type.
     - [ ] Buttons
     - [ ] Links
     - [ ] Cards
     - [ ] Form fields

**Definition of Done:** Full responsive/interaction audit checklist 100% complete and signed off.

---

### PHASE 10 — QA, Cross-Browser & Performance Testing
**Progress:** ⬜ 0% [░░░░░░░░░░]

#### Cross-Browser Testing Matrix
| Browser | Desktop Version | Status |
| :--- | :--- | :--- |
| Chrome | latest 2 | ⬜ |
| Firefox | latest 2 | ⬜ |
| Safari | latest 2 | ⬜ |
| Edge | latest 2 | ⬜ |
| Samsung Internet | latest | ⬜ |

#### Device Testing Matrix
| Category | Devices | Status |
| :--- | :--- | :--- |
| **Mobile** | iPhone SE, iPhone 14/15, Pixel 7, Galaxy S22 | ⬜ |
| **Tablet** | iPad (portrait/landscape), Galaxy Tab | ⬜ |
| **Desktop** | 1366×768, 1440×900, 1920×1080, 4K/ultrawide | ⬜ |

#### Acceptance Criteria & Test Cases
**AC & TC Progress:** ⬜ 0% [░░░░░░░░░░]

1. [ ] **AC10.1: Cross-browser compatibility verified**
   - [ ] **TC10.1.1:** Load and test navigation, forms, and responsiveness on multiple desktop browsers.
     - [ ] Chrome (latest 2 versions)
     - [ ] Firefox (latest 2 versions)
     - [ ] Safari (latest 2 versions)
     - [ ] Edge (latest 2 versions)
     - [ ] Samsung Internet (latest version)
2. [ ] **AC10.2: Device compatibility verified**
   - [ ] **TC10.2.1:** Verify mobile layout and touch target sizing.
     - [ ] iPhone SE, iPhone 14/15, Pixel 7, Galaxy S22
   - [ ] **TC10.2.2:** Verify tablet landscape and portrait responsiveness.
     - [ ] iPad, Galaxy Tab
   - [ ] **TC10.2.3:** Verify multiple desktop aspect ratios.
     - [ ] 1366×768, 1440×900, 1920×1080, 4K/ultrawide
3. [ ] **AC10.3: Performance standards achieved**
   - [ ] **TC10.3.1:** Run Lighthouse audit, ensuring score goals are met.
     - [ ] Performance ≥ 90
     - [ ] Accessibility ≥ 90
     - [ ] Best Practices ≥ 90
     - [ ] SEO ≥ 90
   - [ ] **TC10.3.2:** Verify Core Web Vitals under throttled network conditions.
     - [ ] LCP < 2.5s on 4G
     - [ ] CLS < 0.1
   - [ ] **TC10.3.3:** Enforce bundle sizes and asset delivery efficiency.
     - [ ] Initial JS bundle < 250KB gzipped
     - [ ] WebP/AVIF images + responsive srcsets used
     - [ ] Basic API load test on form endpoint
4. [ ] **AC10.4: Full site functional regression testing passed**
   - [ ] **TC10.4.1:** Verify all interactive flows work correctly on staging.
     - [ ] Re-verify Phase 1–8 acceptance criteria end-to-end
     - [ ] Click-through audit of every nav link, footer link, and CTA
     - [ ] Broken link / 404 audit (zero broken links)
     - [ ] Console log check (zero warnings/errors)
5. [ ] **AC10.5: Accessibility standard conformance**
   - [ ] **TC10.5.1:** Perform accessibility audits and manual checks.
     - [ ] Automated axe/Lighthouse audit shows zero critical issues
     - [ ] Keyboard-only navigation audit (no traps, visible focus)
     - [ ] Screen reader walkthrough (VoiceOver/NVDA)
     - [ ] Color contrast ratio ≥ 4.5:1 for body text

**Definition of Done:** All matrices 100% checked, performance budgets met, zero critical bugs open.

---

### PHASE 11 — Final UAT (User Acceptance Testing)
**Progress:** ⬜ 0% [░░░░░░░░░░]

#### Acceptance Criteria & Test Cases
**AC & TC Progress:** ⬜ 0% [░░░░░░░░░░]

1. [ ] **AC11.1: Content and design validation**
   - [ ] **TC11.1.1:** Stakeholder reviews pages against Figma designs and approved copy.
     - [ ] Stakeholder review of every page layout/design
     - [ ] All product names, prices, and specs verified accurate
     - [ ] Company profile, registration numbers, and stats verified
2. [ ] **AC11.2: End-to-end contact and integration validation**
   - [ ] **TC11.2.1:** Verify customer communication routes and integrations are working properly.
     - [ ] Enquiry form tested end-to-end (submission received in real business email/CRM)
     - [ ] "Get Directions" map link matches physical location
     - [ ] Phone numbers and emails verified correct
     - [ ] Social share previews (OG tags) validated in Facebook/LinkedIn debuggers
     - [ ] Walkthrough on stakeholder's own mobile/desktop devices
3. [ ] **AC11.3: Stakeholder sign-off**
   - [ ] **TC11.3.1:** Obtain final written stakeholder approval to release.
     - [ ] UAT sign-off obtained in writing/ticket system

**Definition of Done:** Written UAT sign-off received; no open blocking issues.

---

### PHASE 12 — Production Readiness & Launch
**Progress:** ⬜ 0% [░░░░░░░░░░]

#### Acceptance Criteria & Test Cases
**AC & TC Progress:** ⬜ 0% [░░░░░░░░░░]

1. [ ] **AC12.1: Domain, certificate, and security configurations**
   - [ ] **TC12.1.1:** Setup production infrastructure.
     - [ ] Domain and DNS configured
     - [ ] Active SSL certificate (HTTPS enforced, HTTP -> HTTPS redirection)
     - [ ] Environment variables and secrets configured on hosting provider
2. [ ] **AC12.2: SEO, tracking, and metadata verification**
   - [ ] **TC12.2.1:** Configure analytics and search optimizations.
     - [ ] Google Analytics (GA4) and conversion tracking live and verified
     - [ ] `robots.txt` and `sitemap.xml` generated and submitted to Search Console
     - [ ] Favicon, meta tags, and OG/Twitter cards finalized
3. [ ] **AC12.3: Operations and legal compliance**
   - [ ] **TC12.3.1:** Prepare site for errors, monitoring, and legal terms.
     - [ ] 404 and error pages styled on-brand
     - [ ] Backups and rollback plan documented
     - [ ] Monitoring active (uptime + error tracking, e.g., Sentry)
     - [ ] Legal pages (Privacy Policy, Terms of Use) linked in footer
4. [ ] **AC12.4: Post-launch deployment validation**
   - [ ] **TC12.4.1:** Verify live deployment operates flawlessly.
     - [ ] Smoke test executed on production URL
     - [ ] Final stakeholder go-live approval logged

**Definition of Done:** Site live on production domain, smoke tests pass, monitoring active, stakeholder go-live approval recorded.

---

## 6. Overall Project Progress Tracker

| Phase | Description | Progress Bar | Status |
| :--- | :--- | :--- | :--- |
| **Phase 0** | Setup & Foundations | `0%` `[░░░░░░░░░░]` | ⬜ |
| **Phase 1** | Header, Nav & Mega Menu | `0%` `[░░░░░░░░░░]` | ⬜ |
| **Phase 2** | Icon Strip & Hero | `0%` `[░░░░░░░░░░]` | ⬜ |
| **Phase 3** | Product Card & Category Blocks | `100%` `[██████████]` | ✅ |
| **Phase 4** | Company Info/Stats | `100%` `[██████████]` | ✅ |
| **Phase 5** | Product Video Lightbox | `0%` `[░░░░░░░░░░]` | ⬜ |
| **Phase 6** | Contact & Enquiry Form | `0%` `[░░░░░░░░░░]` | ⬜ |
| **Phase 7** | Footer & Site Utilities | `0%` `[░░░░░░░░░░]` | ⬜ |
| **Phase 8** | Category/Product Listing Pages | `0%` `[░░░░░░░░░░]` | ⬜ |
| **Phase 9** | Responsive & Interaction Polish | `0%` `[░░░░░░░░░░]` | ⬜ |
| **Phase 10** | QA, Cross-Browser & Performance | `0%` `[░░░░░░░░░░]` | ⬜ |
| **Phase 11** | Final UAT | `0%` `[░░░░░░░░░░]` | ⬜ |
| **Phase 12** | Production Readiness & Launch | `0%` `[░░░░░░░░░░]` | ⬜ |
| **Overall** | Overall Project | `15%` `[█░░░░░░░░░]` | ⏳ |

> **Note on Updates:** Update each phase's percentage and bar as tasks/AC/TC are completed (e.g., 10 total sub-checklist items in a phase, 3 done = 30% → `[███░░░░░░░]`). Overall = average of phase completion weighted by task count.

---

## 7. Risk & Dependency Notes

- Requires final brand assets from Aarav Enterprises (logo, colors, product photography, pricing, company registration details) before Phases 2–4 can be content-complete.
- Requires legal business details (GST/CIN equivalents, registered address, coordinates) for Phase 4 and Phase 6.
- Backend email/CRM integration for the enquiry form needs credentials/API keys before Phase 6 can be fully tested end-to-end.
- Video assets (Phase 5) must be sourced/produced or feature descoped for V1.

---
*End of document — Aarav Enterprises V1 – Detailed Phase-Wise Implementation Plan*
