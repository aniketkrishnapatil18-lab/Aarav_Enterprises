-- ============================================================
-- Seed 004: AI Knowledge Base default entries
-- ============================================================

INSERT IGNORE INTO `ai_knowledge_base` (`key_name`, `label`, `value`, `category`) VALUES

-- Company Info
('company_name',        'Company Name',         'Aarav Enterprises',                              'company'),
('company_tagline',     'Company Tagline',      'Creative Designs. Professional Branding. Powerful Visuals.', 'company'),
('company_description', 'Company Description',  'Aarav Enterprises is a professional graphic design, multimedia, branding and printing services company. We provide high-quality design solutions for businesses of all sizes.', 'company'),
('business_location',   'Business Location',    'Pune, Maharashtra, India',                       'company'),
('business_email',      'Business Email',       'info@aaraventerprises.com',                      'company'),
('business_phone',      'Business Phone',       '+91-XXXXXXXXXX',                                 'company'),
('whatsapp_number',     'WhatsApp Number',      '+91-XXXXXXXXXX',                                 'company'),

-- Business Hours
('business_hours',      'Business Hours',       'Monday to Saturday: 10:00 AM – 7:00 PM\nSunday: Closed', 'hours'),
('response_time',       'Response Time',        'We typically respond within 1–2 hours during business hours.', 'hours'),

-- Pricing Policy
('pricing_policy',      'Pricing Policy',       'All prices shown are starting prices. Final price depends on the complexity, size, and specific requirements of the project. Custom quotations are provided for bulk or special orders.', 'pricing'),
('payment_methods',     'Payment Methods',      'UPI (PhonePe, GPay, Paytm), Bank Transfer, Cash', 'pricing'),
('advance_payment',     'Advance Payment',      '50% advance payment required before starting the design work. Balance payment after design approval.', 'pricing'),

-- Delivery Policy
('delivery_policy',     'Delivery Policy',      'Designs are delivered digitally via WhatsApp or email. Physical printing is delivered as per printing timeline.', 'delivery'),
('rush_order',          'Rush Orders',          'Rush orders (within 24 hours) may attract additional charges depending on complexity.', 'delivery'),

-- Revision Policy
('revision_policy',     'Revision Policy',      'Each service includes a set number of free revisions as mentioned in the service details. Additional revisions beyond the free limit may be charged.', 'revision'),

-- Services Summary
('services_list',       'Services List',        'Logo Design, Visiting Card Design, Brochure Design, Menu Card Design, 3D Logo Design, Banner Design, Flex Design & Printing, Advertisement Banner, Social Media Post Design, Pamphlet & Flyer Design', 'services'),

-- FAQs
('faq_file_formats',    'FAQ: File Formats',    'We provide designs in PDF, PNG, JPG, AI, EPS, and PSD formats depending on the service.', 'faq'),
('faq_source_files',    'FAQ: Source Files',    'Source files (AI, PSD, InDesign) are provided at an additional charge.', 'faq'),
('faq_printing',        'FAQ: Printing',        'We offer printing services for flex banners, visiting cards, brochures, and other materials. Printing charges are separate from design charges.', 'faq'),
('faq_bulk_orders',     'FAQ: Bulk Orders',     'Bulk orders are available at special rates. Please share your requirements and we will provide a custom quotation.', 'faq'),
('faq_samples',         'FAQ: Portfolio',       'You can view our portfolio on the website or ask us to share relevant samples on WhatsApp.', 'faq'),

-- AI Behavior Instructions
('ai_tone',             'AI Conversation Tone', 'Friendly, professional, helpful, and concise. Never rude or dismissive.', 'ai'),
('ai_language_note',    'AI Language Note',     'Detect and respond in the customer''s language (English, Hindi, or Marathi). Support mixed-language conversations naturally.', 'ai'),
('ai_no_fabricate',     'AI No Fabricate Rule', 'Never invent prices, delivery timelines, or services. If unsure, say the team will confirm and create an inquiry.', 'ai');


-- ============================================================
-- Seed: Default settings
-- ============================================================

INSERT IGNORE INTO `settings` (`key_name`, `value`, `label`, `type`) VALUES
('business_name',       'Aarav Enterprises',        'Business Name',        'text'),
('business_phone',      '',                          'Business Phone',       'text'),
('business_email',      '',                          'Business Email',       'text'),
('business_address',    '',                          'Business Address',     'text'),
('business_hours',      'Mon-Sat: 10AM-7PM',         'Business Hours',       'text'),
('currency',            'INR',                       'Currency',             'text'),
('currency_symbol',     '₹',                         'Currency Symbol',      'text'),
('default_language',    'en',                        'Default Language',     'text'),
('wa_phone_number_id',  '',                          'WhatsApp Phone Number ID', 'secret'),
('wa_access_token',     '',                          'WhatsApp Access Token','secret'),
('wa_verify_token',     'aarav_verify_token_2025',   'WhatsApp Verify Token','text'),
('ai_provider',         'mock',                      'AI Provider (mock/openai/gemini)', 'text'),
('ai_api_key',          '',                          'AI API Key',           'secret'),
('ai_model',            'gpt-4o-mini',               'AI Model',             'text');
