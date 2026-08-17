-- ============================================================
-- Seed 002: Portfolio Sample Images for WhatsApp AI
-- Uses publicly accessible HTTPS images (Unsplash / design samples)
-- These are placeholder samples — replace with real Aarav Enterprises work
-- ============================================================

-- First ensure categories exist (get their IDs)
-- Categories: Logo Design, Visiting Card, Brochure, Banner, Menu Card, Social Media Post

-- ── VISITING CARD SAMPLES ─────────────────────────────────────────────────────
INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Modern Corporate Visiting Card', 'Clean minimal black and white business card design', 
  'https://images.unsplash.com/photo-1541462608143-67571c6738dd.jpg',
  'Sample Client', 1, 1, 1, 'modern,corporate,minimal,black,white,business', 1,
  'Visiting Card Sample 1 — Modern Corporate Style'
FROM categories c WHERE c.slug = 'visiting-card' LIMIT 1;

INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Premium Dark Visiting Card', 'Elegant dark theme premium business card with gold accents',
  'https://images.unsplash.com/photo-1572044162444-ad60f128bdea.jpg',
  'Sample Client', 1, 1, 2, 'premium,dark,gold,elegant,luxury', 1,
  'Visiting Card Sample 2 — Premium Dark Theme'
FROM categories c WHERE c.slug = 'visiting-card' LIMIT 1;

INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Creative Colorful Visiting Card', 'Bold colorful gradient visiting card for creative professionals',
  'https://images.unsplash.com/photo-1586953208448-b95a79798f07.jpg',
  'Sample Client', 0, 1, 3, 'creative,colorful,gradient,bold,modern', 1,
  'Visiting Card Sample 3 — Creative Colorful Style'
FROM categories c WHERE c.slug = 'visiting-card' LIMIT 1;

INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Minimalist White Visiting Card', 'Clean and simple white visiting card with typography focus',
  'https://images.unsplash.com/photo-1611532736597-de2d4265fba3.jpg',
  'Sample Client', 0, 1, 4, 'minimalist,white,clean,typography,simple', 1,
  'Visiting Card Sample 4 — Minimalist White Style'
FROM categories c WHERE c.slug = 'visiting-card' LIMIT 1;

INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Professional Blue Visiting Card', 'Corporate blue visiting card for professional services',
  'https://images.unsplash.com/photo-1568992688065-536aad8a12f6.jpg',
  'Sample Client', 0, 1, 5, 'professional,blue,corporate,clean', 1,
  'Visiting Card Sample 5 — Professional Blue Style'
FROM categories c WHERE c.slug = 'visiting-card' LIMIT 1;

-- ── LOGO DESIGN SAMPLES ───────────────────────────────────────────────────────
INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Modern Minimal Logo Design', 'Clean geometric minimal logo design for tech company',
  'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0.jpg',
  'Sample Client', 1, 1, 1, 'modern,minimal,geometric,tech,clean', 1,
  'Logo Design Sample 1 — Modern Minimal Style'
FROM categories c WHERE c.slug = 'logo-design' LIMIT 1;

INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Bold Restaurant Logo', 'Vibrant and bold logo design for food and restaurant brands',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0.jpg',
  'Sample Client', 1, 1, 2, 'bold,restaurant,food,colorful,vibrant', 1,
  'Logo Design Sample 2 — Bold Restaurant Style'
FROM categories c WHERE c.slug = 'logo-design' LIMIT 1;

INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Luxury Brand Logo', 'Sophisticated luxury logo with premium gold design elements',
  'https://images.unsplash.com/photo-1553835973-dec43bfddbeb.jpg',
  'Sample Client', 0, 1, 3, 'luxury,gold,premium,sophisticated,brand', 1,
  'Logo Design Sample 3 — Luxury Brand Style'
FROM categories c WHERE c.slug = 'logo-design' LIMIT 1;

INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Creative Agency Logo', 'Dynamic creative logo for design and marketing agencies',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0.jpg',
  'Sample Client', 0, 1, 4, 'creative,agency,dynamic,design,marketing', 1,
  'Logo Design Sample 4 — Creative Agency Style'
FROM categories c WHERE c.slug = 'logo-design' LIMIT 1;

-- ── BROCHURE SAMPLES ──────────────────────────────────────────────────────────
INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Corporate Trifold Brochure', 'Professional corporate trifold brochure for business services',
  'https://images.unsplash.com/photo-1586281380349-632531db7ed4.jpg',
  'Sample Client', 1, 1, 1, 'corporate,trifold,professional,business,service', 1,
  'Brochure Sample 1 — Corporate Trifold'
FROM categories c WHERE c.slug = 'brochure' LIMIT 1;

INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Product Launch Brochure', 'Bold and colorful product launch promotional brochure',
  'https://images.unsplash.com/photo-1603302576837-37561b2e2302.jpg',
  'Sample Client', 0, 1, 2, 'product,launch,colorful,bold,promotional', 1,
  'Brochure Sample 2 — Product Launch Style'
FROM categories c WHERE c.slug = 'brochure' LIMIT 1;

INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Gym & Fitness Brochure', 'Energetic brochure design for gym and fitness center',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b.jpg',
  'Sample Client', 0, 1, 3, 'gym,fitness,energetic,sports,health', 1,
  'Brochure Sample 3 — Gym & Fitness Style'
FROM categories c WHERE c.slug = 'brochure' LIMIT 1;

-- ── BANNER SAMPLES ────────────────────────────────────────────────────────────
INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Grand Opening Banner', 'Eye-catching grand opening flex banner design',
  'https://images.unsplash.com/photo-1569025690938-a00729c9e1f9.jpg',
  'Sample Client', 1, 1, 1, 'grand,opening,flex,banner,colorful,celebration', 1,
  'Banner Sample 1 — Grand Opening Style'
FROM categories c WHERE c.slug IN ('banner','banner-flex','banner-design') LIMIT 1;

INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Sale Offer Banner', 'Attractive sale and offer promotional banner design',
  'https://images.unsplash.com/photo-1607082349566-187342175e2f.jpg',
  'Sample Client', 0, 1, 2, 'sale,offer,promotional,discount,bold', 1,
  'Banner Sample 2 — Sale Offer Style'
FROM categories c WHERE c.slug IN ('banner','banner-flex','banner-design') LIMIT 1;

-- ── MENU CARD SAMPLES ─────────────────────────────────────────────────────────
INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Restaurant Menu Card', 'Elegant restaurant menu card design with food photography',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd.jpg',
  'Sample Client', 1, 1, 1, 'restaurant,menu,elegant,food,photography', 1,
  'Menu Card Sample 1 — Restaurant Elegant Style'
FROM categories c WHERE c.slug IN ('menu-card','menu') LIMIT 1;

INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Cafe Menu Board Design', 'Modern cafe-style menu design with warm tones',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  'Sample Client', 0, 1, 2, 'cafe,coffee,menu,warm,modern,board', 1,
  'Menu Card Sample 2 — Cafe Board Style'
FROM categories c WHERE c.slug IN ('menu-card','menu') LIMIT 1;

-- ── SOCIAL MEDIA SAMPLES ──────────────────────────────────────────────────────
INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Instagram Product Post', 'Eye-catching Instagram post design for product promotion',
  'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80',
  'Sample Client', 1, 1, 1, 'instagram,social,product,promotion,creative', 1,
  'Social Media Sample 1 — Instagram Product Post'
FROM categories c WHERE c.slug IN ('social-media','social-media-post') LIMIT 1;

INSERT INTO `portfolio` (category_id, title, description, image_url, client_name, is_featured, is_active, sort_order, tags, whatsapp_sample, caption)
SELECT c.id, 'Festival Offer Post', 'Festive and colorful social media post for festival offers',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
  'Sample Client', 0, 1, 2, 'festival,offer,colorful,celebration,diwali,holi', 1,
  'Social Media Sample 2 — Festival Offer Post'
FROM categories c WHERE c.slug IN ('social-media','social-media-post') LIMIT 1;
