-- ============================================================
-- Seed 009: Additional products per category
-- Run AFTER seed 003 (categories + first product per category exist)
-- Brings every category up to 6 products so "Browse by Category"
-- rows on the homepage show a full row instead of a single card.
--
-- NOTE: this recreates a seed that was applied directly to the
-- database earlier and never committed (originally numbered 006).
-- Reconstructed from the live database so it matches exactly.
-- ============================================================

INSERT IGNORE INTO `products`
  (`category_id`, `name`, `slug`, `short_desc`, `description`, `starting_price`, `price_label`, `delivery_days`, `revisions`, `file_formats`, `is_featured`, `is_active`, `sort_order`)
SELECT
  c.id,
  p.name,
  p.slug,
  p.short_desc,
  p.description,
  p.starting_price,
  p.price_label,
  p.delivery_days,
  p.revisions,
  p.file_formats,
  p.is_featured,
  1,
  p.sort_order
FROM (
  -- Logo Design
  SELECT 'logo-design' AS cat_slug, 'Mascot Logo Design' AS name, 'mascot-logo-design' AS slug,
    'Fun, character-based mascot logo for your brand' AS short_desc,
    'A custom illustrated mascot logo designed to give your brand a memorable, friendly personality across packaging, signage, and social media.' AS description,
    1799.00 AS starting_price, 'onwards' AS price_label, 4 AS delivery_days, 2 AS revisions,
    'AI, EPS, PDF, PNG' AS file_formats, 0 AS is_featured, 11 AS sort_order
  UNION ALL SELECT 'logo-design', 'Wordmark Logo Design', 'wordmark-logo-design',
    'Typography-driven logo built around your brand name',
    'A clean, custom-lettered wordmark logo that turns your business name itself into a distinctive, ownable mark.',
    999.00, 'onwards', 3, 2, 'AI, EPS, PDF, PNG', 0, 12
  UNION ALL SELECT 'logo-design', 'Monogram Logo Design', 'monogram-logo-design',
    'Elegant initials-based monogram logo',
    'A refined monogram built from your brand initials, ideal for boutiques, salons, and premium personal brands.',
    899.00, 'onwards', 3, 2, 'AI, EPS, PDF, PNG', 0, 13
  UNION ALL SELECT 'logo-design', 'Vintage Logo Design', 'vintage-logo-design',
    'Retro-styled badge and emblem logo design',
    'A vintage-inspired badge or emblem logo with classic typography and ornamental detailing, popular for cafes and craft brands.',
    1199.00, 'onwards', 4, 2, 'AI, EPS, PDF, PNG', 0, 14
  UNION ALL SELECT 'logo-design', 'Logo Redesign & Rebrand', 'logo-redesign-rebrand',
    'Modernize an existing logo without losing brand recall',
    'We refresh your current logo — cleaner lines, better scalability, updated color palette — while keeping the brand recognizable to existing customers.',
    1299.00, 'onwards', 4, 3, 'AI, EPS, PDF, PNG', 0, 15

  -- Visiting Card
  UNION ALL SELECT 'visiting-card', 'Premium Metal Visiting Card', 'premium-metal-visiting-card',
    'Laser-engraved metal business card design',
    'A luxury metal visiting card design, laser-engraved with your branding for a premium, memorable first impression.',
    1999.00, 'onwards', 5, 2, 'PDF, Print-ready', 0, 16
  UNION ALL SELECT 'visiting-card', 'Foil Stamped Visiting Card', 'foil-stamped-visiting-card',
    'Gold/silver foil stamped premium card design',
    'Business card design prepared for gold or silver foil stamping, adding a reflective, high-end finish to your print run.',
    899.00, 'onwards', 3, 2, 'PDF, Print-ready', 0, 17
  UNION ALL SELECT 'visiting-card', 'Double-Sided Visiting Card', 'double-sided-visiting-card',
    'Front and back business card layout',
    'A coordinated front-and-back visiting card design that fits more information without crowding either side.',
    399.00, 'onwards', 2, 2, 'PDF, PNG, JPG', 0, 18
  UNION ALL SELECT 'visiting-card', 'QR Digital Visiting Card', 'qr-digital-visiting-card',
    'Card design with scannable QR to a digital profile',
    'A visiting card design that includes a QR code linking to your digital business card, portfolio, or WhatsApp chat.',
    499.00, 'onwards', 2, 2, 'PDF, PNG, JPG', 0, 19
  UNION ALL SELECT 'visiting-card', 'Eco-Friendly Visiting Card', 'eco-friendly-visiting-card',
    'Recycled/kraft paper style card design',
    'A visiting card design styled for eco-friendly kraft or recycled paper stock, for brands that want to signal sustainability.',
    449.00, 'onwards', 2, 2, 'PDF, PNG, JPG', 0, 20

  -- Brochure Design
  UNION ALL SELECT 'brochure-design', 'Bi-Fold Brochure Design', 'bi-fold-brochure-design',
    'Classic two-panel folded brochure design',
    'A clean bi-fold brochure layout ideal for services, price lists, or a compact company overview.',
    699.00, 'onwards', 3, 2, 'PDF, AI, PNG', 0, 21
  UNION ALL SELECT 'brochure-design', 'Tri-Fold Brochure Design', 'tri-fold-brochure-design',
    'Three-panel folded brochure design',
    'A tri-fold brochure design with more panels to organize services, testimonials, and contact details clearly.',
    799.00, 'onwards', 4, 2, 'PDF, AI, PNG', 0, 22
  UNION ALL SELECT 'brochure-design', 'Company Profile Brochure', 'company-profile-brochure',
    'Multi-page corporate profile design',
    'A polished multi-page company profile brochure covering your history, services, and achievements for client pitches.',
    1499.00, 'onwards', 6, 2, 'PDF, AI, InDesign', 1, 23
  UNION ALL SELECT 'brochure-design', 'Product Catalog Design', 'product-catalog-design',
    'Multi-page product catalog layout',
    'A structured product catalog design with consistent grid layouts, pricing tables, and category sections.',
    1799.00, 'onwards', 6, 2, 'PDF, AI, InDesign', 0, 24
  UNION ALL SELECT 'brochure-design', 'Real Estate Brochure Design', 'real-estate-brochure-design',
    'Property listing brochure design',
    'A real-estate-focused brochure showcasing floor plans, amenities, and property photography in a premium layout.',
    1299.00, 'onwards', 5, 2, 'PDF, AI, PNG', 0, 25

  -- Menu Card Design
  UNION ALL SELECT 'menu-card-design', 'Digital Menu Board Design', 'digital-menu-board-design',
    'Screen-ready digital menu board layout',
    'A digital menu board design optimized for in-store TV/display screens, with easy-to-update pricing sections.',
    899.00, 'onwards', 3, 2, 'PNG, MP4 (loop)', 0, 26
  UNION ALL SELECT 'menu-card-design', 'Takeaway Menu Design', 'takeaway-menu-design',
    'Compact single-page takeaway/delivery menu',
    'A single-page, print-ready takeaway menu design built for quick scanning and easy folding into packaging.',
    499.00, 'onwards', 2, 2, 'PDF, PNG, Print-ready', 0, 27
  UNION ALL SELECT 'menu-card-design', 'Wine & Beverage Menu Design', 'wine-beverage-menu-design',
    'Dedicated drinks and beverage menu design',
    'A dedicated wine and beverage menu design with elegant typography, separate from the main food menu.',
    699.00, 'onwards', 3, 2, 'PDF, PNG, Print-ready', 0, 28
  UNION ALL SELECT 'menu-card-design', 'Festive Special Menu Design', 'festive-special-menu-design',
    'Limited-time festival/seasonal menu design',
    'A festive or seasonal special menu design to highlight limited-time dishes and promotions.',
    599.00, 'onwards', 2, 2, 'PDF, PNG, Print-ready', 0, 29
  UNION ALL SELECT 'menu-card-design', 'Multi-Page Menu Booklet', 'multi-page-menu-booklet',
    'Full multi-page booklet-style menu design',
    'A full booklet-style menu design with multiple pages for restaurants with large, categorized offerings.',
    1299.00, 'onwards', 5, 2, 'PDF, Print-ready', 0, 30

  -- 3D Logo Design
  UNION ALL SELECT '3d-logo-design', '3D Metallic Logo Design', '3d-metallic-logo-design',
    'Chrome/metallic finish 3D logo render',
    'A 3D logo rendered with a realistic chrome or metallic finish for a premium, high-impact brand mark.',
    1999.00, 'onwards', 5, 2, 'PNG, JPG, MP4', 0, 31
  UNION ALL SELECT '3d-logo-design', '3D Glass Logo Design', '3d-glass-logo-design',
    'Transparent glass-effect 3D logo render',
    'A 3D logo design rendered with a transparent, glass-like material for a modern, sleek brand presence.',
    1899.00, 'onwards', 5, 2, 'PNG, JPG, MP4', 0, 32
  UNION ALL SELECT '3d-logo-design', '3D Animated Logo', '3d-animated-logo',
    'Short animated intro/outro version of your logo',
    'A short animated version of your 3D logo, ideal as a video intro/outro or social media brand sting.',
    2499.00, 'onwards', 6, 2, 'MP4, MOV', 1, 33
  UNION ALL SELECT '3d-logo-design', '3D Embossed Logo', '3d-embossed-logo',
    'Raised, embossed-effect 3D logo render',
    'A 3D logo design with a raised, embossed appearance — great for signage mockups and packaging previews.',
    1599.00, 'onwards', 4, 2, 'PNG, JPG', 0, 34
  UNION ALL SELECT '3d-logo-design', '3D Wooden Logo Design', '3d-wooden-logo-design',
    'Warm wood-texture 3D logo render',
    'A 3D logo rendered with a natural wood-grain texture, well suited to cafes, furniture, and eco-focused brands.',
    1699.00, 'onwards', 5, 2, 'PNG, JPG', 0, 35

  -- Banner Design
  UNION ALL SELECT 'banner-design', 'Event Banner Design', 'event-banner-design',
    'Banner design for conferences, launches & events',
    'A promotional banner design tailored for events, conferences, and product launches, sized for print or backdrop use.',
    599.00, 'onwards', 2, 2, 'PDF, PNG, Print-ready', 0, 36
  UNION ALL SELECT 'banner-design', 'Sale & Offer Banner', 'sale-offer-banner',
    'High-visibility discount/sale banner design',
    'An eye-catching sale or discount banner design built to grab attention in-store or on a storefront.',
    399.00, 'onwards', 1, 2, 'PDF, PNG, Print-ready', 0, 37
  UNION ALL SELECT 'banner-design', 'Website Banner Design', 'website-banner-design',
    'Web-optimized hero/promo banner design',
    'A web-optimized banner design for your website hero section or promotional strips, delivered in web-ready formats.',
    499.00, 'onwards', 2, 2, 'PNG, JPG, WebP', 0, 38
  UNION ALL SELECT 'banner-design', 'Social Media Banner Design', 'social-media-banner-design',
    'Cover/header banner for social platforms',
    'A cover or header banner design sized correctly for Facebook, LinkedIn, YouTube, and other social platforms.',
    349.00, 'onwards', 1, 2, 'PNG, JPG', 0, 39
  UNION ALL SELECT 'banner-design', 'Corporate Banner Design', 'corporate-banner-design',
    'Professional banner for corporate/office use',
    'A professional, brand-consistent banner design suited for office backdrops, seminars, and corporate events.',
    699.00, 'onwards', 3, 2, 'PDF, PNG, Print-ready', 0, 40

  -- Flex & Printing
  UNION ALL SELECT 'flex-printing', 'Vinyl Flex Printing', 'vinyl-flex-printing',
    'Standard vinyl flex banner design & print',
    'Design and print service for standard vinyl flex banners, available in any custom size for indoor or outdoor use.',
    0.00, 'configurable', 3, 1, 'Print-ready', 0, 41
  UNION ALL SELECT 'flex-printing', 'Backlit Flex Printing', 'backlit-flex-printing',
    'Light-box ready backlit flex design & print',
    'Flex banner design and printing optimized for illuminated light-box signage, with adjusted color density for backlighting.',
    0.00, 'configurable', 4, 1, 'Print-ready', 0, 42
  UNION ALL SELECT 'flex-printing', 'Mesh Flex Printing', 'mesh-flex-printing',
    'Wind-resistant mesh flex banner design & print',
    'Perforated mesh flex banner design and printing for large outdoor installations that need wind resistance.',
    0.00, 'configurable', 4, 1, 'Print-ready', 0, 43
  UNION ALL SELECT 'flex-printing', 'Hoarding Flex Printing', 'hoarding-flex-printing',
    'Large-format hoarding/billboard flex design & print',
    'Large-format flex design and printing for hoardings and billboards, built to stay crisp at massive scale.',
    0.00, 'configurable', 5, 1, 'Print-ready', 0, 44
  UNION ALL SELECT 'flex-printing', 'Outdoor Flex Banner', 'outdoor-flex-banner',
    'Weatherproof outdoor flex banner design & print',
    'Weatherproof flex banner design and printing for long-term outdoor display, resistant to sun and rain.',
    0.00, 'configurable', 3, 1, 'Print-ready', 0, 45

  -- Advertisement
  UNION ALL SELECT 'advertisement', 'Newspaper Ad Design', 'newspaper-ad-design',
    'Print-ready newspaper advertisement design',
    'A print-ready advertisement design formatted for newspaper column sizes, optimized for grayscale/newsprint reproduction.',
    599.00, 'onwards', 2, 2, 'PDF, PNG, Print-ready', 0, 46
  UNION ALL SELECT 'advertisement', 'Magazine Ad Design', 'magazine-ad-design',
    'Full-color magazine advertisement design',
    'A full-color, high-resolution advertisement design formatted for magazine placement.',
    799.00, 'onwards', 3, 2, 'PDF, PNG, Print-ready', 0, 47
  UNION ALL SELECT 'advertisement', 'Digital Display Ad', 'digital-display-ad',
    'Web banner ad set for display advertising',
    'A set of digital display ad banners in standard IAB sizes, ready for web and app advertising campaigns.',
    499.00, 'onwards', 2, 2, 'PNG, JPG, GIF', 0, 48
  UNION ALL SELECT 'advertisement', 'Google Ads Creative', 'google-ads-creative',
    'Creative set for Google Display/Search campaigns',
    'A set of creatives sized for Google Display Network campaigns, including responsive ad image assets.',
    599.00, 'onwards', 2, 2, 'PNG, JPG', 0, 49
  UNION ALL SELECT 'advertisement', 'Print Media Advertisement', 'print-media-advertisement',
    'General print advertisement for any publication',
    'A flexible print advertisement design that can be resized for brochures, flyers, or publication inserts.',
    699.00, 'onwards', 3, 2, 'PDF, PNG, Print-ready', 0, 50

  -- Social Media Design
  UNION ALL SELECT 'social-media-design', 'Instagram Story Design', 'instagram-story-design',
    'Vertical story creative for Instagram',
    'A vertical, story-format creative designed for Instagram (and Facebook) Stories, sized for full-screen mobile viewing.',
    249.00, 'onwards', 1, 2, 'PNG, JPG, MP4', 0, 51
  UNION ALL SELECT 'social-media-design', 'Facebook Cover Design', 'facebook-cover-design',
    'Page/profile cover banner for Facebook',
    'A Facebook page or profile cover banner design, correctly sized to avoid cropping on desktop and mobile.',
    299.00, 'onwards', 1, 2, 'PNG, JPG', 0, 52
  UNION ALL SELECT 'social-media-design', 'Reels Cover Design', 'reels-cover-design',
    'Cover thumbnail design for Instagram/YouTube Reels',
    'A custom cover thumbnail design for Reels and Shorts, built to stand out in a vertical video feed.',
    249.00, 'onwards', 1, 2, 'PNG, JPG', 0, 53
  UNION ALL SELECT 'social-media-design', 'Carousel Post Design', 'carousel-post-design',
    'Multi-slide carousel post design set',
    'A multi-slide carousel post design set for Instagram/LinkedIn, keeping a consistent look across every slide.',
    499.00, 'onwards', 2, 2, 'PNG, JPG, PDF', 0, 54
  UNION ALL SELECT 'social-media-design', 'Social Media Ad Creative', 'social-media-ad-creative',
    'Paid-ad creative set for social campaigns',
    'A set of paid social ad creatives (feed + story formats) designed for Instagram/Facebook ad campaigns.',
    599.00, 'onwards', 2, 2, 'PNG, JPG, MP4', 0, 55

  -- Pamphlet & Flyer
  UNION ALL SELECT 'pamphlet-flyer', 'Event Flyer Design', 'event-flyer-design',
    'Single-page flyer for events & launches',
    'A single-page flyer design for events, parties, and launches, built to be printed or shared digitally.',
    399.00, 'onwards', 2, 2, 'PDF, PNG, JPG', 0, 56
  UNION ALL SELECT 'pamphlet-flyer', 'Promotional Pamphlet Design', 'promotional-pamphlet-design',
    'Folded pamphlet for promotions & offers',
    'A folded promotional pamphlet design highlighting offers, services, or a seasonal campaign.',
    449.00, 'onwards', 2, 2, 'PDF, PNG, Print-ready', 0, 57
  UNION ALL SELECT 'pamphlet-flyer', 'Real Estate Flyer', 'real-estate-flyer',
    'Property listing single-page flyer',
    'A single-page real estate flyer design showcasing a property listing with photos, price, and contact details.',
    499.00, 'onwards', 2, 2, 'PDF, PNG, Print-ready', 0, 58
  UNION ALL SELECT 'pamphlet-flyer', 'Restaurant Flyer Design', 'restaurant-flyer-design',
    'Promotional flyer for restaurants & cafes',
    'A promotional flyer design for restaurants and cafes, ideal for new-menu announcements or opening offers.',
    399.00, 'onwards', 2, 2, 'PDF, PNG, Print-ready', 0, 59
  UNION ALL SELECT 'pamphlet-flyer', 'Sale Flyer Design', 'sale-flyer-design',
    'High-visibility sale/discount flyer',
    'A bold, high-visibility flyer design built to promote a sale, clearance, or limited-time discount.',
    349.00, 'onwards', 1, 2, 'PDF, PNG, Print-ready', 0, 60
) AS p
JOIN `categories` c ON c.slug = p.cat_slug;
