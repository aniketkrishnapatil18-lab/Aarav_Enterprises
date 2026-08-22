-- ============================================================
-- Seed 008: Real client LED sign board portfolio photos
-- Run AFTER seed 007 (led-sign-board category must exist)
-- Images live in backend/uploads/portfolio/ (copied from the
-- client's own project photo folder).
-- ============================================================

INSERT IGNORE INTO `portfolio`
  (`category_id`, `title`, `description`, `image_url`, `client_name`, `is_featured`, `is_active`, `sort_order`)
SELECT
  c.id, p.title, p.description, p.image_url, p.client_name, p.is_featured, 1, p.sort_order
FROM (
  SELECT 'led-sign-board' AS cat_slug, 'Aadhar Clinic' AS title,
    'Backlit LED sign board for a multi-specialty hospital and dental clinic.' AS description,
    '/uploads/portfolio/aadhar-clinic.jpg' AS image_url, 'Aadhar Clinic' AS client_name, 1 AS is_featured, 1 AS sort_order
  UNION ALL SELECT 'led-sign-board', 'Aaradhya',
    'Custom illuminated LED sign board installation.',
    '/uploads/portfolio/aaradhya.jpg', 'Aaradhya', 1, 2
  UNION ALL SELECT 'led-sign-board', 'Om Sai Jewelers',
    'Premium LED sign board for a jewelry showroom.',
    '/uploads/portfolio/om-sai-jewelers.jpg', 'Om Sai Jewelers', 1, 3
  UNION ALL SELECT 'led-sign-board', 'Ole Ole',
    'Backlit acrylic letter sign board with illuminated bottle icon for a bar and lounge.',
    '/uploads/portfolio/ole-ole.jpg', 'Ole Ole', 1, 4
  UNION ALL SELECT 'led-sign-board', 'R3',
    'Custom LED sign board installation.',
    '/uploads/portfolio/r3.jpg', 'R3', 1, 5
  UNION ALL SELECT 'led-sign-board', 'Rabadiwala',
    'Custom LED sign board installation.',
    '/uploads/portfolio/rabadiwala.jpg', 'Rabadiwala', 1, 6
  UNION ALL SELECT 'led-sign-board', 'Bobay Misal',
    'LED sign board for a restaurant.',
    '/uploads/portfolio/bobay-misal.jpg', 'Bobay Misal', 0, 7
  UNION ALL SELECT 'led-sign-board', 'Casa Royale',
    'Vertical projecting LED sign board for a premium PG accommodation.',
    '/uploads/portfolio/casa-royale.jpg', 'Casa Royale', 0, 8
  UNION ALL SELECT 'led-sign-board', 'Chocolate Delight',
    'LED sign board for a dessert and chocolate shop.',
    '/uploads/portfolio/chocolate-delight.jpg', 'Chocolate Delight', 0, 9
  UNION ALL SELECT 'led-sign-board', 'Dosa House',
    'LED sign board for a South Indian restaurant.',
    '/uploads/portfolio/dosa-house.jpg', 'Dosa House', 0, 10
  UNION ALL SELECT 'led-sign-board', 'Hartleaf',
    'Custom LED sign board installation.',
    '/uploads/portfolio/hartleaf.jpg', 'Hartleaf', 0, 11
  UNION ALL SELECT 'led-sign-board', 'Jay Kali Mata',
    'LED sign board for a temple/religious establishment.',
    '/uploads/portfolio/jay-kali-mata.jpg', 'Jay Kali Mata', 0, 12
  UNION ALL SELECT 'led-sign-board', 'Kidzee',
    'LED sign board for a preschool.',
    '/uploads/portfolio/kidzee.jpg', 'Kidzee', 0, 13
  UNION ALL SELECT 'led-sign-board', 'Krushna Nivas',
    'Custom LED sign board installation.',
    '/uploads/portfolio/krushna-nivas.jpg', 'Krushna Nivas', 0, 14
  UNION ALL SELECT 'led-sign-board', 'Mahalaxmi',
    'Custom LED sign board installation.',
    '/uploads/portfolio/mahalaxmi.jpg', 'Mahalaxmi', 0, 15
  UNION ALL SELECT 'led-sign-board', 'Nexus',
    'Custom LED sign board installation.',
    '/uploads/portfolio/nexus.jpg', 'Nexus', 0, 16
  UNION ALL SELECT 'led-sign-board', 'Pangat',
    'LED sign board for a restaurant.',
    '/uploads/portfolio/pangat.jpg', 'Pangat', 0, 17
  UNION ALL SELECT 'led-sign-board', 'Priya',
    'Custom LED sign board installation.',
    '/uploads/portfolio/priya.jpg', 'Priya', 0, 18
  UNION ALL SELECT 'led-sign-board', 'Sagar Traders',
    'LED sign board for a retail trading business.',
    '/uploads/portfolio/sagar-traders.jpg', 'Sagar Traders', 0, 19
  UNION ALL SELECT 'led-sign-board', 'Sai Paradise',
    'Custom LED sign board installation.',
    '/uploads/portfolio/sai-paradise.jpg', 'Sai Paradise', 0, 20
  UNION ALL SELECT 'led-sign-board', 'Sarvmanglam',
    'Custom LED sign board installation.',
    '/uploads/portfolio/sarvmanglam.jpg', 'Sarvmanglam', 0, 21
  UNION ALL SELECT 'led-sign-board', 'Shivkrupa Tea',
    'LED sign board for a tea stall.',
    '/uploads/portfolio/shivkrupa-tea.jpg', 'Shivkrupa Tea', 0, 22
  UNION ALL SELECT 'led-sign-board', 'Taste Of Rajyasthan',
    'LED sign board for a Rajasthani restaurant.',
    '/uploads/portfolio/taste-of-rajyasthan.jpg', 'Taste Of Rajyasthan', 0, 23
  UNION ALL SELECT 'led-sign-board', 'Zara Hatke',
    'Custom LED sign board installation.',
    '/uploads/portfolio/zara-hatke.jpg', 'Zara Hatke', 0, 24
) AS p
JOIN `categories` c ON c.slug = p.cat_slug;
