-- ============================================================
-- Seed 005: Sample portfolio items (placeholder URLs)
-- Replace with actual image URLs after upload
-- ============================================================

INSERT IGNORE INTO `portfolio` (`category_id`, `title`, `description`, `image_url`, `client_name`, `is_featured`, `is_active`, `sort_order`)
SELECT c.id, p.title, p.description, p.image_url, p.client_name, p.is_featured, 1, p.sort_order
FROM (
  SELECT 'logo-design' AS cat_slug, 'Modern Tech Company Logo' AS title,
    'Clean and modern logo design for a technology startup' AS description,
    '/uploads/portfolio/sample-logo-1.png' AS image_url,
    'Sample Client' AS client_name, 1 AS is_featured, 1 AS sort_order

  UNION ALL SELECT 'logo-design', 'Restaurant Brand Logo',
    'Warm and inviting logo for a family restaurant',
    '/uploads/portfolio/sample-logo-2.png', 'Sample Client', 0, 2

  UNION ALL SELECT 'visiting-card', 'Executive Business Card',
    'Premium business card design with gold foil effect',
    '/uploads/portfolio/sample-card-1.png', 'Sample Client', 1, 3

  UNION ALL SELECT 'visiting-card', 'Creative Agency Card',
    'Bold and colorful visiting card for a creative agency',
    '/uploads/portfolio/sample-card-2.png', 'Sample Client', 0, 4

  UNION ALL SELECT 'brochure-design', 'Real Estate Brochure',
    'Professional tri-fold brochure for real estate company',
    '/uploads/portfolio/sample-brochure-1.png', 'Sample Client', 1, 5

  UNION ALL SELECT 'menu-card-design', 'Cafe Menu Design',
    'Modern minimalist menu card design for a cafe',
    '/uploads/portfolio/sample-menu-1.png', 'Sample Client', 1, 6

  UNION ALL SELECT '3d-logo-design', '3D Corporate Logo',
    'Stunning 3D logo for a corporate brand',
    '/uploads/portfolio/sample-3dlogo-1.png', 'Sample Client', 1, 7

  UNION ALL SELECT 'banner-design', 'Sale Promotion Banner',
    'Eye-catching promotional banner for festive sale',
    '/uploads/portfolio/sample-banner-1.png', 'Sample Client', 0, 8

  UNION ALL SELECT 'social-media-design', 'Instagram Post Design',
    'Engaging Instagram post for product launch',
    '/uploads/portfolio/sample-social-1.png', 'Sample Client', 1, 9

  UNION ALL SELECT 'pamphlet-flyer', 'Event Flyer Design',
    'Creative flyer design for a music event',
    '/uploads/portfolio/sample-flyer-1.png', 'Sample Client', 0, 10
) AS p
JOIN `categories` c ON c.slug = p.cat_slug;
