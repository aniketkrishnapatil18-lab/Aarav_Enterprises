-- ============================================================
-- Seed 003: Default services/products with pricing
-- Run AFTER seed 002 (categories must exist)
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
  SELECT 'logo-design' AS cat_slug, 'Logo Design' AS name, 'logo-design-service' AS slug,
    'Professional logo for your business or brand' AS short_desc,
    'We design memorable, scalable, and professional logos that represent your brand identity. Each logo comes with multiple concepts and revisions.' AS description,
    999.00 AS starting_price, 'onwards' AS price_label, 3 AS delivery_days, 3 AS revisions,
    'AI, EPS, PDF, PNG, JPG' AS file_formats, 1 AS is_featured, 1 AS sort_order

  UNION ALL SELECT 'visiting-card', 'Visiting Card Design', 'visiting-card-design',
    'Professional business card design',
    'Stunning and professional visiting card designs that make a great first impression. Front and back design available.' ,
    299.00, 'onwards', 2, 2, 'PDF, PNG, JPG, PSD', 1, 2

  UNION ALL SELECT 'brochure-design', 'Brochure Design', 'brochure-design-service',
    'Business and promotional brochure designs',
    'Eye-catching brochure designs for your business, products, and services. Available in bi-fold, tri-fold and multi-page formats.',
    799.00, 'onwards', 4, 2, 'PDF, AI, InDesign, PNG', 0, 3

  UNION ALL SELECT 'menu-card-design', 'Menu Card Design', 'menu-card-design-service',
    'Restaurant and cafe menu card designs',
    'Beautiful menu card designs for restaurants, cafes and hotels. Includes food photography placement, category sections and pricing layouts.',
    599.00, 'onwards', 3, 2, 'PDF, PNG, Print-ready', 0, 4

  UNION ALL SELECT '3d-logo-design', '3D Logo Design', '3d-logo-design-service',
    'Three-dimensional professional logo design',
    'Premium 3D logo designs with realistic renders and depth effects. Perfect for modern brands and businesses.',
    1499.00, 'onwards', 5, 2, 'PNG, JPG, MP4 (animation optional)', 1, 5

  UNION ALL SELECT 'banner-design', 'Banner Design', 'banner-design-service',
    'Promotional and business banner designs',
    'Professional banner designs for events, promotions, and businesses. Available in various sizes and formats.',
    499.00, 'onwards', 2, 2, 'PDF, PNG, JPG, Print-ready', 0, 6

  UNION ALL SELECT 'flex-printing', 'Flex Design & Printing', 'flex-design-printing',
    'Flex banner design and printing services',
    'Complete flex banner design and printing services. Available in all custom sizes with high-quality printing.',
    0.00, 'configurable', 3, 1, 'PDF, PNG, Print-ready', 0, 7

  UNION ALL SELECT 'advertisement', 'Advertisement Banner', 'advertisement-banner',
    'Creative advertisement banners and creatives',
    'High-impact advertisement banners and promotional creatives for digital and print media.',
    699.00, 'onwards', 2, 2, 'PDF, PNG, JPG, PSD', 0, 8

  UNION ALL SELECT 'social-media-design', 'Social Media Post Design', 'social-media-post-design',
    'Social media post and story designs',
    'Engaging and professional social media designs for Instagram, Facebook, WhatsApp and other platforms.',
    299.00, 'onwards', 1, 2, 'PNG, JPG, MP4', 1, 9

  UNION ALL SELECT 'pamphlet-flyer', 'Pamphlet & Flyer Design', 'pamphlet-flyer-design',
    'Marketing pamphlet and flyer designs',
    'Creative pamphlet and flyer designs for events, promotions, and business marketing.',
    499.00, 'onwards', 2, 2, 'PDF, PNG, JPG, Print-ready', 0, 10
) AS p
JOIN `categories` c ON c.slug = p.cat_slug;
