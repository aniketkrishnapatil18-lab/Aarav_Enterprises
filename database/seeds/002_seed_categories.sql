-- ============================================================
-- Seed 002: Default service categories
-- ============================================================

INSERT IGNORE INTO `categories` (`name`, `slug`, `description`, `icon`, `sort_order`) VALUES
('Logo Design',         'logo-design',         'Professional logo and brand identity design',          'Palette',      1),
('Visiting Card',       'visiting-card',        'Business and visiting card designs',                   'CreditCard',   2),
('Brochure Design',     'brochure-design',      'Company and product brochure designs',                 'BookOpen',     3),
('Menu Card Design',    'menu-card-design',     'Restaurant and hotel menu card designs',               'UtensilsCrossed', 4),
('3D Logo Design',      '3d-logo-design',       'Three-dimensional logo and brand concepts',            'Box',          5),
('Banner Design',       'banner-design',        'Promotional and business banner designs',              'Layout',       6),
('Flex & Printing',     'flex-printing',        'Flex banner design and printing services',             'Printer',      7),
('Advertisement',       'advertisement',        'Advertisement creatives and promotional designs',      'Megaphone',    8),
('Social Media Design', 'social-media-design',  'Social media post and story designs',                  'Share2',       9),
('Pamphlet & Flyer',    'pamphlet-flyer',       'Marketing pamphlet and flyer designs',                 'FileText',    10);
