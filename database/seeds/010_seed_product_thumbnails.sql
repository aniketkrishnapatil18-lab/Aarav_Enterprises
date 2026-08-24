-- ============================================================
-- Seed 010: Product thumbnail images
-- Run AFTER seed 009 (all 60 products across the 10 graphic-design
-- categories must exist).
--
-- NOTE: these UPDATEs were originally applied directly against the
-- database and never committed. Reconstructed from the live
-- database so it matches exactly. Safe to re-run (idempotent —
-- every run sets the same values).
--
-- Logo Design / 3D Logo Design / Visiting Card / Brochure Design /
-- Menu Card Design / Banner Design point at the local asset library
-- in frontend/public/assets/portfolio/ (already committed).
-- Flex & Printing / Advertisement / Social Media Design /
-- Pamphlet & Flyer point at verified real Indian print/design
-- vendor photos found via web search.
-- ============================================================

-- Logo Design
UPDATE products SET thumbnail_url = '/assets/portfolio/Logo Design/logo-coffee.jpg' WHERE slug = 'logo-design-service';
UPDATE products SET thumbnail_url = '/assets/portfolio/Logo Design/logo-mascot.jpg' WHERE slug = 'mascot-logo-design';
UPDATE products SET thumbnail_url = '/assets/portfolio/Logo Design/logo-wordmark.jpg' WHERE slug = 'wordmark-logo-design';
UPDATE products SET thumbnail_url = '/assets/portfolio/Logo Design/logo-monogram.jpg' WHERE slug = 'monogram-logo-design';
UPDATE products SET thumbnail_url = '/assets/portfolio/Logo Design/logo-vintage.jpg' WHERE slug = 'vintage-logo-design';
UPDATE products SET thumbnail_url = '/assets/portfolio/Logo Design/logo-redesign.jpg' WHERE slug = 'logo-redesign-rebrand';

-- 3D Logo Design
UPDATE products SET thumbnail_url = '/assets/portfolio/3D Logo Design/3d-logo-gold.jpg' WHERE slug = '3d-logo-design-service';
UPDATE products SET thumbnail_url = '/assets/portfolio/3D Logo Design/3d-logo-metallic.jpg' WHERE slug = '3d-metallic-logo-design';
UPDATE products SET thumbnail_url = '/assets/portfolio/3D Logo Design/3d-logo-glass.jpg' WHERE slug = '3d-glass-logo-design';
UPDATE products SET thumbnail_url = '/assets/portfolio/3D Logo Design/3d-logo-animated.jpg' WHERE slug = '3d-animated-logo';
UPDATE products SET thumbnail_url = '/assets/portfolio/3D Logo Design/3d-logo-embossed.jpg' WHERE slug = '3d-embossed-logo';
UPDATE products SET thumbnail_url = '/assets/portfolio/3D Logo Design/3d-logo-wooden.jpg' WHERE slug = '3d-wooden-logo-design';

-- Visiting Card
UPDATE products SET thumbnail_url = '/assets/portfolio/Visiting Card/visiting-card-design.jpg' WHERE slug = 'visiting-card-design';
UPDATE products SET thumbnail_url = '/assets/portfolio/Visiting Card/visiting-card-metal.jpg' WHERE slug = 'premium-metal-visiting-card';
UPDATE products SET thumbnail_url = '/assets/portfolio/Visiting Card/visiting-card-foil.jpg' WHERE slug = 'foil-stamped-visiting-card';
UPDATE products SET thumbnail_url = '/assets/portfolio/Visiting Card/visiting-card-design.jpg' WHERE slug = 'double-sided-visiting-card';
UPDATE products SET thumbnail_url = '/assets/portfolio/Visiting Card/visiting-card-qr.jpg' WHERE slug = 'qr-digital-visiting-card';
UPDATE products SET thumbnail_url = '/assets/portfolio/Visiting Card/visiting-card-eco.jpg' WHERE slug = 'eco-friendly-visiting-card';

-- Brochure Design
UPDATE products SET thumbnail_url = '/assets/portfolio/Brochure Design/brochure-trifold.jpg' WHERE slug = 'brochure-design-service';
UPDATE products SET thumbnail_url = '/assets/portfolio/Brochure Design/brochure-bifold.jpg' WHERE slug = 'bi-fold-brochure-design';
UPDATE products SET thumbnail_url = '/assets/portfolio/Brochure Design/brochure-trifold-creative.jpg' WHERE slug = 'tri-fold-brochure-design';
UPDATE products SET thumbnail_url = '/assets/portfolio/Brochure Design/brochure-company-profile.jpg' WHERE slug = 'company-profile-brochure';
UPDATE products SET thumbnail_url = '/assets/portfolio/Brochure Design/catalog-product.jpg' WHERE slug = 'product-catalog-design';
UPDATE products SET thumbnail_url = '/assets/portfolio/Brochure Design/brochure-real-estate.jpg' WHERE slug = 'real-estate-brochure-design';

-- Menu Card Design
UPDATE products SET thumbnail_url = '/assets/portfolio/Menu Cards & Brochures/menu-1.jpg' WHERE slug = 'menu-card-design-service';
UPDATE products SET thumbnail_url = '/assets/portfolio/Menu Cards & Brochures/digital-menu-board.jpg' WHERE slug = 'digital-menu-board-design';
UPDATE products SET thumbnail_url = '/assets/portfolio/Menu Cards & Brochures/takeaway-menu.jpg' WHERE slug = 'takeaway-menu-design';
UPDATE products SET thumbnail_url = '/assets/portfolio/Menu Cards & Brochures/wine-menu.jpg' WHERE slug = 'wine-beverage-menu-design';
UPDATE products SET thumbnail_url = '/assets/portfolio/Menu Cards & Brochures/festive-menu.jpg' WHERE slug = 'festive-special-menu-design';
UPDATE products SET thumbnail_url = '/assets/portfolio/Menu Cards & Brochures/menu-booklet.jpg' WHERE slug = 'multi-page-menu-booklet';

-- Banner Design
UPDATE products SET thumbnail_url = '/assets/portfolio/Banner Design/banner-furniture.jpg' WHERE slug = 'banner-design-service';
UPDATE products SET thumbnail_url = '/assets/portfolio/Banner Design/banner-event.jpg' WHERE slug = 'event-banner-design';
UPDATE products SET thumbnail_url = '/assets/portfolio/Banner Design/banner-sale.jpg' WHERE slug = 'sale-offer-banner';
UPDATE products SET thumbnail_url = '/assets/portfolio/Banner Design/banner-website.jpg' WHERE slug = 'website-banner-design';
UPDATE products SET thumbnail_url = '/assets/portfolio/Banner Design/banner-social.jpg' WHERE slug = 'social-media-banner-design';
UPDATE products SET thumbnail_url = '/assets/portfolio/Banner Design/banner-corporate.jpg' WHERE slug = 'corporate-banner-design';

-- Flex & Printing
UPDATE products SET thumbnail_url = 'https://printo-s3.dietpixels.net/Soldout/Large-Format-Banners_1781499483.jpg?quality=70&format=webp&w=1920' WHERE slug = 'flex-design-printing';
UPDATE products SET thumbnail_url = 'https://printpeek.in/images/large-format/flex-vinyl-banners.jpeg' WHERE slug = 'vinyl-flex-printing';
UPDATE products SET thumbnail_url = 'https://tiimg.tistatic.com/fp/1/001/839/backlit-flex-print-signage-855.jpg' WHERE slug = 'backlit-flex-printing';
UPDATE products SET thumbnail_url = 'https://cdn.printinglimitless.com/media/catalog/product/cache/product_page_image_large/650x650/f/a/fabric-mesh-banners_1.jpg' WHERE slug = 'mesh-flex-printing';
UPDATE products SET thumbnail_url = 'https://printpeek.in/images/large-format/hoarding-prints-advertising.jpeg' WHERE slug = 'hoarding-flex-printing';
UPDATE products SET thumbnail_url = 'https://printo-s3.dietpixels.net/Soldout/Non-Tearable-Banner_1781499483.jpg?quality=70&format=webp&w=1920' WHERE slug = 'outdoor-flex-banner';

-- Advertisement
UPDATE products SET thumbnail_url = 'https://5.imimg.com/data5/SELLER/Default/2024/5/419537358/EG/CX/RE/73485238/print-media-advertising-services-250x250.jpg' WHERE slug = 'advertisement-banner';
UPDATE products SET thumbnail_url = 'https://5.imimg.com/data5/SELLER/Default/2024/9/453360302/DY/KH/WF/11478085/newspaper-ad-service-250x250.jpg' WHERE slug = 'newspaper-ad-design';
UPDATE products SET thumbnail_url = 'https://5.imimg.com/data5/SELLER/Default/2026/5/605794599/UJ/KV/YY/265935576/print-magazine-article-services-250x250.jpg' WHERE slug = 'magazine-ad-design';
UPDATE products SET thumbnail_url = 'https://5.imimg.com/data5/ANDROID/Default/2026/3/592128465/NF/ER/YL/236310465/product-jpeg-250x250.jpg' WHERE slug = 'digital-display-ad';
UPDATE products SET thumbnail_url = 'https://5.imimg.com/data5/SELLER/Default/2026/6/618106746/CS/GK/FT/90773772/print-media-advertising-services-250x250.jpg' WHERE slug = 'google-ads-creative';
UPDATE products SET thumbnail_url = 'https://5.imimg.com/data5/SELLER/Default/2024/4/413048618/IB/UO/VH/86235209/print-media-service-250x250.jpg' WHERE slug = 'print-media-advertisement';

-- Social Media Design
UPDATE products SET thumbnail_url = 'https://colorwhistle.com/wp-content/uploads/2023/08/Social-Media-Design-Services-Company-ColorWhistle.jpg' WHERE slug = 'social-media-post-design';
UPDATE products SET thumbnail_url = 'https://graphicvista.in/wp-content/uploads/2023/07/Social-Media-Instagram-Mockups-4-scaled.jpg' WHERE slug = 'instagram-story-design';
UPDATE products SET thumbnail_url = 'https://graphicvista.in/wp-content/uploads/2023/07/09-scaled.jpg' WHERE slug = 'facebook-cover-design';
UPDATE products SET thumbnail_url = 'https://graphicvista.in/wp-content/uploads/2023/07/Social-Media-Instagram-Mockups-3-scaled.jpg' WHERE slug = 'reels-cover-design';
UPDATE products SET thumbnail_url = 'https://graphicvista.in/wp-content/uploads/2023/07/Social-Media-Instagram-Mockups-2-scaled.jpg' WHERE slug = 'carousel-post-design';
UPDATE products SET thumbnail_url = 'https://colorwhistle.com/wp-content/uploads/2023/08/One-Stop-Graphic-Solution-on-Marketing-Materials-and-Digital-Creatives-for-All-Niche-Colorwhistle.jpg' WHERE slug = 'social-media-ad-creative';

-- Pamphlet & Flyer
UPDATE products SET thumbnail_url = 'https://cms.cloudinary.vpsvc.com/image/upload/if_ar_gt_1.1/c_scale,t_pdpHeroGallery_Gallery/if_else/c_scale,w_816/if_end/f_auto,q_auto:best,dpr_1.0/India%20LOB/Flyers%20Folders%20and%20Marketing%20Materials/FlyersMarquee_01' WHERE slug = 'pamphlet-flyer-design';
UPDATE products SET thumbnail_url = 'https://cms.cloudinary.vpsvc.com/image/upload/if_ar_gt_1.1/c_scale,t_pdpHeroGallery_Gallery/if_else/c_scale,w_816/if_end/f_auto,q_auto:best,dpr_1.0/India%20LOB/Flyers%20Folders%20and%20Marketing%20Materials/FlyersMarquee_03' WHERE slug = 'event-flyer-design';
UPDATE products SET thumbnail_url = 'https://cms.cloudinary.vpsvc.com/image/upload/if_ar_gt_1.1/c_scale,t_pdpHeroGallery_Gallery/if_else/c_scale,w_816/if_end/f_auto,q_auto:best,dpr_1.0/India%20LOB/Flyers%20Folders%20and%20Marketing%20Materials/FlyersMarquee_04' WHERE slug = 'promotional-pamphlet-design';
UPDATE products SET thumbnail_url = 'https://cms.cloudinary.vpsvc.com/image/upload/if_ar_gt_1.1/c_scale,t_pdpHeroGallery_Gallery/if_else/c_scale,w_816/if_end/f_auto,q_auto:best,dpr_1.0/India%20LOB/Flyers%20Folders%20and%20Marketing%20Materials/FlyersMarquee_05' WHERE slug = 'real-estate-flyer';
UPDATE products SET thumbnail_url = 'https://cms.cloudinary.vpsvc.com/image/upload/if_ar_gt_1.1/c_scale,t_pdpHeroGallery_Gallery/if_else/c_scale,w_816/if_end/f_auto,q_auto:best,dpr_1.0/India%20LOB/marketing%20Materials/Flyers/IN_flyers_002' WHERE slug = 'restaurant-flyer-design';
UPDATE products SET thumbnail_url = 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_300/India%20LOB/marketing%20Materials/Flyers/flyers_overview-tab' WHERE slug = 'sale-flyer-design';
