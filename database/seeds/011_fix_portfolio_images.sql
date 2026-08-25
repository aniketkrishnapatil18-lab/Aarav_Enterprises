-- ============================================================
-- Seed 011: Fix broken legacy portfolio images
-- Run AFTER seed 005 (and 002_seed_portfolio.sql, which the
-- db:setup script picks up automatically even though it isn't
-- listed in setup.sql) — the original placeholder portfolio rows
-- must exist. They shipped with fake/never-uploaded image URLs:
-- sample-*.png files that were never actually placed in
-- backend/uploads/portfolio/, and malformed Unsplash URLs that
-- 404 (confirmed).
--
-- IMPORTANT: this matches rows by their OLD broken `image_url`,
-- not by `id`. Auto-increment IDs are NOT stable across databases
-- — 002_seed_portfolio.sql inserts 11 rows before 005 runs, so
-- IDs shift depending on exactly which seeds ran and in what
-- order. image_url is unique per row (enforced by migration 012)
-- and doesn't depend on insertion order, so this is safe to run
-- on any database regardless of its seeding history. Rows already
-- fixed (old URL no longer present) simply match nothing — a
-- harmless no-op.
-- ============================================================

-- From 002_seed_portfolio.sql — Visiting Card samples
UPDATE portfolio SET image_url = 'https://printo-s3.dietpixels.net/Soldout/Business%20card/Standard-Business-card_1783508616.jpg' WHERE image_url = 'https://images.unsplash.com/photo-1541462608143-67571c6738dd.jpg';
UPDATE portfolio SET image_url = 'https://printo-s3.dietpixels.net/silver_foil_01_1787225894.png' WHERE image_url = 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea.jpg';
UPDATE portfolio SET image_url = 'https://printo-s3.dietpixels.net/Soldout/Business%20card/Rounded-Corner-Visiting-Cards_1784547961.jpg' WHERE image_url = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07.jpg';
UPDATE portfolio SET image_url = 'https://printo-s3.dietpixels.net/Soldout/Business%20card/Matte-Visiting-Cards_1783510289.jpg' WHERE image_url = 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3.jpg';
UPDATE portfolio SET image_url = 'https://printo-s3.dietpixels.net/Soldout/Business%20card/Textured-Visiting-Cards_1783508212.jpg' WHERE image_url = 'https://images.unsplash.com/photo-1568992688065-536aad8a12f6.jpg';

-- From 002_seed_portfolio.sql — Logo Design samples
UPDATE portfolio SET image_url = '/assets/portfolio/Logo Design/logo-monogram.jpg' WHERE image_url = 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0.jpg';
UPDATE portfolio SET image_url = '/assets/portfolio/Logo Design/logo-mascot.jpg' WHERE image_url = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0.jpg';
UPDATE portfolio SET image_url = '/assets/portfolio/Logo Design/logo-vintage.jpg' WHERE image_url = 'https://images.unsplash.com/photo-1553835973-dec43bfddbeb.jpg';
UPDATE portfolio SET image_url = '/assets/portfolio/Logo Design/logo-redesign.jpg' WHERE image_url = 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0.jpg';

-- From 002_seed_portfolio.sql — Banner samples
UPDATE portfolio SET image_url = '/assets/portfolio/Banner Design/banner-event.jpg' WHERE image_url = 'https://images.unsplash.com/photo-1569025690938-a00729c9e1f9.jpg';
UPDATE portfolio SET image_url = '/assets/portfolio/Banner Design/banner-sale.jpg' WHERE image_url = 'https://images.unsplash.com/photo-1607082349566-187342175e2f.jpg';

-- From 005_seed_portfolio.sql — Logo Design / Visiting Card
UPDATE portfolio SET image_url = '/assets/portfolio/Logo Design/logo-wordmark.jpg' WHERE image_url = '/uploads/portfolio/sample-logo-1.png';
UPDATE portfolio SET image_url = '/assets/portfolio/Logo Design/logo-coffee.jpg' WHERE image_url = '/uploads/portfolio/sample-logo-2.png';
UPDATE portfolio SET image_url = 'https://printo-s3.dietpixels.net/Soldout/Business%20card/Classic-Rectangle-Visiting-Cards_1783506522.jpg' WHERE image_url = '/uploads/portfolio/sample-card-1.png';
UPDATE portfolio SET image_url = 'https://printo-s3.dietpixels.net/Layer_5_1784206067.jpg' WHERE image_url = '/uploads/portfolio/sample-card-2.png';

-- From 005_seed_portfolio.sql — Brochure / Menu Card / 3D Logo
UPDATE portfolio SET image_url = '/assets/portfolio/Brochure Design/brochure-real-estate.jpg' WHERE image_url = '/uploads/portfolio/sample-brochure-1.png';
UPDATE portfolio SET image_url = '/assets/portfolio/Menu Cards & Brochures/flavors-menu.jpg' WHERE image_url = '/uploads/portfolio/sample-menu-1.png';
UPDATE portfolio SET image_url = '/assets/portfolio/3D Logo Design/3d-logo-gold.jpg' WHERE image_url = '/uploads/portfolio/sample-3dlogo-1.png';

-- From 005_seed_portfolio.sql — Banner / Social Media / Pamphlet & Flyer
UPDATE portfolio SET image_url = '/assets/portfolio/Banner Design/banner-corporate.jpg' WHERE image_url = '/uploads/portfolio/sample-banner-1.png';
UPDATE portfolio SET image_url = 'https://graphicvista.in/wp-content/uploads/2023/07/Social-Media-Instagram-Mockups-3-scaled.jpg' WHERE image_url = '/uploads/portfolio/sample-social-1.png';
UPDATE portfolio SET image_url = 'https://cms.cloudinary.vpsvc.com/image/upload/if_ar_gt_1.1/c_scale,t_pdpHeroGallery_Gallery/if_else/c_scale,w_816/if_end/f_auto,q_auto:best,dpr_1.0/India%20LOB/Flyers%20Folders%20and%20Marketing%20Materials/FlyersMarquee_03' WHERE image_url = '/uploads/portfolio/sample-flyer-1.png';
