-- ============================================================
-- Seed 005: Sample portfolio items (placeholder URLs)
-- Replace with actual image URLs after upload
-- ============================================================

INSERT IGNORE INTO `portfolio` (`category_id`, `title`, `description`, `image_url`, `client_name`, `is_featured`, `is_active`, `sort_order`)
SELECT c.id, p.title, p.description, p.image_url, p.client_name, p.is_featured, 1, p.sort_order
FROM (
  SELECT 'logo-design' AS cat_slug, 'Modern Tech Company Logo' AS title,
    'Clean and modern logo design for a technology startup' AS description,
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80' AS image_url,
    'Sample Client' AS client_name, 1 AS is_featured, 1 AS sort_order

  UNION ALL SELECT 'logo-design', 'Restaurant Brand Logo',
    'Warm and inviting logo for a family restaurant',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', 'Sample Client', 0, 2

  UNION ALL SELECT 'visiting-card', 'Executive Business Card',
    'Premium business card design with gold foil effect',
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80', 'Sample Client', 1, 3

  UNION ALL SELECT 'visiting-card', 'Creative Agency Card',
    'Bold and colorful visiting card for a creative agency',
    'https://images.unsplash.com/photo-1572044162444-ad60f128bdea.jpg', 'Sample Client', 0, 4

  UNION ALL SELECT 'brochure-design', 'Real Estate Brochure',
    'Professional tri-fold brochure for real estate company',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80', 'Sample Client', 1, 5

  UNION ALL SELECT 'menu-card-design', 'Cafe Menu Design',
    'Modern minimalist menu card design for a cafe',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', 'Sample Client', 1, 6

  UNION ALL SELECT '3d-logo-design', '3D Corporate Logo',
    'Stunning 3D logo for a corporate brand',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', 'Sample Client', 1, 7

  UNION ALL SELECT 'banner-design', 'Sale Promotion Banner',
    'Eye-catching promotional banner for festive sale',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80', 'Sample Client', 0, 8

  UNION ALL SELECT 'social-media-design', 'Instagram Post Design',
    'Engaging Instagram post for product launch',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80', 'Sample Client', 1, 9

  UNION ALL SELECT 'pamphlet-flyer', 'Event Flyer Design',
    'Creative flyer design for a music event',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80', 'Sample Client', 0, 10
) AS p
JOIN `categories` c ON c.slug = p.cat_slug;
