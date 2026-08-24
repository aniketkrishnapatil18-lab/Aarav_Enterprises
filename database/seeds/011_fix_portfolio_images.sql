-- ============================================================
-- Seed 011: Fix broken legacy portfolio images
-- Run AFTER seed 005 (the original 21 placeholder portfolio rows
-- must exist — they shipped with fake/never-uploaded image URLs:
-- sample-*.png files that were never actually placed in
-- backend/uploads/portfolio/, and malformed Unsplash URLs).
--
-- NOTE: these UPDATEs were originally applied directly against the
-- database and never committed. Reconstructed from the live
-- database so it matches exactly. Safe to re-run (idempotent).
-- ============================================================

-- Visiting Card portfolio entries
UPDATE portfolio SET image_url = 'https://printo-s3.dietpixels.net/Soldout/Business%20card/Standard-Business-card_1783508616.jpg' WHERE id = 1;
UPDATE portfolio SET image_url = 'https://printo-s3.dietpixels.net/silver_foil_01_1787225894.png' WHERE id = 2;
UPDATE portfolio SET image_url = 'https://printo-s3.dietpixels.net/Soldout/Business%20card/Rounded-Corner-Visiting-Cards_1784547961.jpg' WHERE id = 3;
UPDATE portfolio SET image_url = 'https://printo-s3.dietpixels.net/Soldout/Business%20card/Matte-Visiting-Cards_1783510289.jpg' WHERE id = 4;
UPDATE portfolio SET image_url = 'https://printo-s3.dietpixels.net/Soldout/Business%20card/Textured-Visiting-Cards_1783508212.jpg' WHERE id = 5;
UPDATE portfolio SET image_url = 'https://printo-s3.dietpixels.net/Soldout/Business%20card/Classic-Rectangle-Visiting-Cards_1783506522.jpg' WHERE id = 14;
UPDATE portfolio SET image_url = 'https://printo-s3.dietpixels.net/Layer_5_1784206067.jpg' WHERE id = 15;

-- Logo Design portfolio entries (reuse existing local asset library)
UPDATE portfolio SET image_url = '/assets/portfolio/Logo Design/logo-wordmark.jpg' WHERE id = 12;
UPDATE portfolio SET image_url = '/assets/portfolio/Logo Design/logo-coffee.jpg' WHERE id = 13;
UPDATE portfolio SET image_url = '/assets/portfolio/Logo Design/logo-monogram.jpg' WHERE id = 6;
UPDATE portfolio SET image_url = '/assets/portfolio/Logo Design/logo-mascot.jpg' WHERE id = 7;
UPDATE portfolio SET image_url = '/assets/portfolio/Logo Design/logo-vintage.jpg' WHERE id = 8;
UPDATE portfolio SET image_url = '/assets/portfolio/Logo Design/logo-redesign.jpg' WHERE id = 9;

-- Banner Design portfolio entries (reuse existing local asset library)
UPDATE portfolio SET image_url = '/assets/portfolio/Banner Design/banner-event.jpg' WHERE id = 10;
UPDATE portfolio SET image_url = '/assets/portfolio/Banner Design/banner-sale.jpg' WHERE id = 11;
UPDATE portfolio SET image_url = '/assets/portfolio/Banner Design/banner-corporate.jpg' WHERE id = 19;

-- Brochure / Menu Card / 3D Logo (reuse existing local asset library)
UPDATE portfolio SET image_url = '/assets/portfolio/Brochure Design/brochure-real-estate.jpg' WHERE id = 16;
UPDATE portfolio SET image_url = '/assets/portfolio/Menu Cards & Brochures/flavors-menu.jpg' WHERE id = 17;
UPDATE portfolio SET image_url = '/assets/portfolio/3D Logo Design/3d-logo-gold.jpg' WHERE id = 18;

-- Social Media / Pamphlet & Flyer (reuse verified web-sourced images)
UPDATE portfolio SET image_url = 'https://graphicvista.in/wp-content/uploads/2023/07/Social-Media-Instagram-Mockups-3-scaled.jpg' WHERE id = 20;
UPDATE portfolio SET image_url = 'https://cms.cloudinary.vpsvc.com/image/upload/if_ar_gt_1.1/c_scale,t_pdpHeroGallery_Gallery/if_else/c_scale,w_816/if_end/f_auto,q_auto:best,dpr_1.0/India%20LOB/Flyers%20Folders%20and%20Marketing%20Materials/FlyersMarquee_03' WHERE id = 21;
