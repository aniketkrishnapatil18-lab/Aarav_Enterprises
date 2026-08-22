import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageCircle,
  Palette,
  Zap,
  Shield,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lightbulb,
  Printer,
  Box,
  Star,
  ShoppingCart,
  Award,
  Users,
  Target,
  CheckCircle,
  Truck,
  Tag,
  Clock,
} from "lucide-react";

/* Responsive hero grid: stack on mobile */
const heroGridStyle = `
  @media (max-width: 768px) {
    .hero-carousel-grid {
      grid-template-columns: 1fr !important;
      padding: 2.5rem 0 5rem !important;
      min-height: unset !important;
      gap: 1.5rem !important;
    }
  }
`;
import { productAPI, portfolioAPI, categoryAPI } from "../services/api";
import { openWhatsApp } from "../utils/helpers";

const DEFAULT_CATEGORY_IMAGES = {
  'logo-design': '/assets/portfolio/Logo Design/logo-coffee.jpg',
  'visiting-card': '/assets/portfolio/Visiting Card/visiting-card-design.jpg',
  'brochure-design': '/assets/portfolio/Brochure Design/brochure-trifold.jpg',
  'menu-card-design': '/assets/portfolio/Menu Cards & Brochures/flavors-menu.jpg',
  '3d-logo-design': '/assets/portfolio/3D Logo Design/3d-logo-gold.jpg',
  'banner-design': '/assets/portfolio/Banner Design/banner-furniture.jpg',
  'flex-printing': '/assets/portfolio/Flex Banners/flex-1.jpg',
  'advertisement': 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=400',
  'social-media-design': 'https://images.pexels.com/photos/3178818/pexels-photo-3178818.jpeg?auto=compress&cs=tinysrgb&w=400',
  'pamphlet-flyer': 'https://images.pexels.com/photos/6476254/pexels-photo-6476254.jpeg?auto=compress&cs=tinysrgb&w=400',
  'led-sign-board': '/assets/portfolio/LED Sign Boards/led-1.jpg',
};

function resolveProductImage(service) {
  if (service?.thumbnail_url) return service.thumbnail_url;
  const slug = service?.category_slug || service?.category?.slug || service?.slug;
  return DEFAULT_CATEGORY_IMAGES[slug] || DEFAULT_CATEGORY_IMAGES['logo-design'];
}

// ── Service Card Component (discount badge + rating + strike price) ──
function ServiceCard({ service }) {
  const filledStars = Math.round(service.rating || 0);
  const detailHref = `/services/${service.slug || service.id}`;
  const imageUrl = resolveProductImage(service);
  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: "1rem",
        boxShadow: "var(--shadow-sm)",
        border: "1px solid var(--border-light)",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link
        to={detailHref}
        style={{ textDecoration: "none", display: "block" }}
      >
        <div
          style={{
            position: "relative",
            aspectRatio: "4 / 3",
            overflow: "hidden",
            background: "var(--bg-subtle)",
          }}
        >
          {service.discount_percent > 0 && (
            <span
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                zIndex: 2,
                background: "#EF4444",
                color: "white",
                fontSize: "0.7rem",
                fontWeight: 800,
                padding: "0.25rem 0.55rem",
                borderRadius: 999,
              }}
            >
              -{service.discount_percent}%
            </span>
          )}
          <img
            src={imageUrl}
            alt={service.name}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              inset: 0,
            }}
          />
        </div>
      </Link>
      <div
        style={{
          padding: "1rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Link to={detailHref} style={{ textDecoration: "none" }}>
          <h3
            style={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "var(--text-main)",
              marginBottom: "0.45rem",
              lineHeight: 1.3,
            }}
          >
            {service.name}
          </h3>
        </Link>
        {service.rating != null && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.6rem",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}
            >
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  color="#F59E0B"
                  fill={i < filledStars ? "#F59E0B" : "none"}
                />
              ))}
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-subtle)",
                  marginLeft: "0.25rem",
                }}
              >
                ({service.review_count?.toLocaleString("en-IN")})
              </span>
            </div>
            <button
              onClick={() =>
                openWhatsApp(
                  `Hi! I'm interested in your ${service.name}.`,
                  service.name,
                )
              }
              aria-label={`Enquire about ${service.name}`}
              style={{
                background: "none",
                border: "none",
                padding: 2,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "var(--text-subtle)",
                flexShrink: 0,
              }}
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0.5rem",
            marginBottom: "0.9rem",
          }}
        >
          <span
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: "var(--text-main)",
            }}
          >
            {service.starting_price > 0
              ? `₹${parseInt(service.starting_price).toLocaleString("en-IN")}`
              : "Configurable"}
          </span>
          {service.original_price > service.starting_price && (
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--text-subtle)",
                textDecoration: "line-through",
              }}
            >
              ₹{service.original_price.toLocaleString("en-IN")}
            </span>
          )}
        </div>
        <Link
          to={detailHref}
          style={{
            marginTop: "auto",
            textDecoration: "none",
            background: "var(--brand-violet)",
            color: "white",
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            borderRadius: "var(--radius-md)",
            padding: "0.7rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          Get Quote <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}

// ── Simple Service Card (Shop by Category strip — image fills full card) ──
function SimpleServiceCard({ service }) {
  const imageUrl = resolveProductImage(service);
  return (
    <Link
      to={`/services/${service.slug || service.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "1rem",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--border-light)",
          overflow: "hidden",
        }}
      >
        {/* Image fills entire top — no padding */}
        <div
          style={{
            aspectRatio: "1 / 1",
            overflow: "hidden",
            position: "relative",
            background: "var(--bg-subtle)",
          }}
        >
          <img
            src={imageUrl}
            alt={service.name}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              inset: 0,
              transition: "transform 0.35s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>
        {/* Text below image */}
        <div style={{ padding: "0.75rem 1rem" }}>
          <h3
            style={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "var(--text-main)",
              marginBottom: "0.2rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {service.name}
          </h3>
          <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)", margin: 0 }}>
            {service.starting_price > 0
              ? `Starting from ₹${service.starting_price}`
              : "Explore"}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ── Portfolio Thumb (Deals of the Day Style) ─────────────────
function PortfolioThumb({ item }) {
  return (
    <Link
      to="/portfolio"
      style={{
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-main)",
        borderRadius: "1.25rem",
        padding: "1.25rem",
        boxShadow: "var(--shadow-sm)",
        position: "relative",
        height: "100%",
        border: "1px solid var(--border-light)",
      }}
    >
      {/* Top Row: Badge & Icon */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.75rem",
        }}
      >
        {item.category_name ? (
          <span
            style={{
              background: "#EF4444",
              color: "white",
              padding: "0.25rem 0.6rem",
              borderRadius: 999,
              fontSize: "0.65rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
            }}
          >
            {item.category_name}
          </span>
        ) : (
          <div />
        )}
        <Eye size={18} color="var(--text-subtle)" style={{ opacity: 0.7 }} />
      </div>

      {/* Center Image */}
      <div
        style={{
          position: "relative",
          borderRadius: "0.85rem",
          overflow: "hidden",
          marginBottom: "0.85rem",
          aspectRatio: "4 / 3",
          width: "100%",
          background: "var(--bg-subtle)",
        }}
      >
        <img
          src={item.image_url}
          alt={item.title}
          loading="lazy"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.src = `https://placehold.co/500x500/160C33/A78BFA?text=${encodeURIComponent(item.category_name || "Design")}`;
          }}
        />
      </div>

      {/* Bottom Content */}
      <div style={{ marginTop: "auto" }}>
        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: 800,
            color: "var(--text-main)",
            marginBottom: "0.2rem",
            lineHeight: 1.3,
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-subtle)",
            marginBottom: "0.65rem",
          }}
        >
          {item.category_name || "Design"}
        </p>

        {/* Bottom row: CTA / Icon */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: "var(--text-main)",
            }}
          >
            Explore
          </span>
          <div
            style={{
              background: "var(--brand-violet)",
              color: "#FFFFFF",
              width: 34,
              height: 34,
              borderRadius: "0.6rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Category Row (horizontal-scroll products for one category) ─
function CategoryRow({ category, products, viewAllHref }) {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -350 : 350,
        behavior: "smooth",
      });
    }
  };

  if (!products.length) return null;

  return (
    <div style={{ marginBottom: "3rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <h3
          style={{
            fontSize: "1.4rem",
            fontWeight: 800,
            color: "var(--text-main)",
            letterSpacing: "-0.01em",
          }}
        >
          {category.name}
        </h3>
        <Link
          to={
            viewAllHref || `/services?category=${category.slug || category.id}`
          }
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--text-muted)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            flexShrink: 0,
          }}
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>

      <div
        ref={scrollRef}
        className="hide-scroll"
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "1.5rem",
          paddingBottom: "0.5rem",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollBehavior: "smooth",
        }}
      >
        {products.slice(0, 7).map((p) => (
          <div key={p.id} style={{ width: "220px", flexShrink: 0 }}>
            <ServiceCard service={p} />
          </div>
        ))}
      </div>

      {products.length > 5 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <button
            onClick={() => scroll("left")}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <ChevronLeft size={16} color="var(--brand-violet)" />
          </button>
          <button
            onClick={() => scroll("right")}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <ChevronRight size={16} color="var(--brand-violet)" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Feature Card ─────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, gradient }) {
  return (
    <div className="glass-card glass-card-hover" style={{ padding: "2rem" }}>
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 16,
          background: gradient || "var(--grad-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.25rem",
          boxShadow: "0 6px 20px rgba(124, 58, 237, 0.25)",
        }}
      >
        <Icon size={26} color="white" />
      </div>
      <h3
        style={{
          fontSize: "1.15rem",
          marginBottom: "0.6rem",
          color: "var(--text-main)",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "0.9rem",
          lineHeight: 1.7,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

// ── Auto Scrolling Features Carousel ─────────────────────────
const featuresData = [
  {
    icon: Palette,
    title: "Original & Custom Designs",
    desc: "Every logo, card, and banner is designed from scratch to match your unique brand identity.",
    gradient: "linear-gradient(135deg, #7C3AED, #DB2777)",
  },
  {
    icon: MessageCircle,
    title: "24/7 AI WhatsApp Assistant",
    desc: "Never wait for quotes. Our AI collects your requirements anytime in English, Hindi, or Marathi.",
    gradient: "linear-gradient(135deg, #059669, #10B981)",
  },
  {
    icon: Zap,
    title: "Fast Express Delivery",
    desc: "Need designs urgently? Get visiting cards and social media posts within 24 to 48 hours.",
    gradient: "linear-gradient(135deg, #D97706, #EF4444)",
  },
  {
    icon: Shield,
    title: "Print & Digital Formats",
    desc: "Receive high-resolution print-ready PDFs, EPS vector sources, PNGs, and JPEGs.",
    gradient: "linear-gradient(135deg, #2563EB, #7C3AED)",
  },
  {
    icon: Award,
    title: "Qualitative Products",
    desc: "We ensure top-tier materials and superior craftsmanship for every product we deliver.",
    gradient: "linear-gradient(135deg, #8B5CF6, #3B82F6)",
  },
  {
    icon: Users,
    title: "Dexterous Team of Professionals",
    desc: "Our skilled experts bring years of industry experience to execute your projects flawlessly.",
    gradient: "linear-gradient(135deg, #EC4899, #8B5CF6)",
  },
  {
    icon: Target,
    title: "Client-Centric Approach",
    desc: "We prioritize your vision, working closely with you to deliver exactly what you need.",
    gradient: "linear-gradient(135deg, #10B981, #059669)",
  },
  {
    icon: CheckCircle,
    title: "Positive Records",
    desc: "A proven track record of successful deliveries and highly satisfied clients.",
    gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
  },
  {
    icon: Truck,
    title: "Excellent Transport & Logistic Facility",
    desc: "Safe, secure, and well-managed logistics to ensure your signage arrives in pristine condition.",
    gradient: "linear-gradient(135deg, #6366F1, #4F46E5)",
  },
  {
    icon: Tag,
    title: "Economical Price Range",
    desc: "Premium quality services offered at highly competitive and transparent prices.",
    gradient: "linear-gradient(135deg, #14B8A6, #0D9488)",
  },
  {
    icon: Clock,
    title: "Prompt Delivery",
    desc: "We respect your deadlines and ensure on-time execution and delivery for every order.",
    gradient: "linear-gradient(135deg, #F43F5E, #E11D48)",
  },
];

const extendedFeatures = [
  ...featuresData,
  ...featuresData,
  ...featuresData,
  ...featuresData,
  ...featuresData,
];

function AutoScrollingFeatures() {
  const originalLength = featuresData.length;
  // Start exactly in the middle of the 5 duplicated arrays
  const [activeIndex, setActiveIndex] = useState(originalLength * 2);
  const scrollRef = useRef(null);
  const isResetting = useRef(false);

  // Initial jump to the middle section without animation
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const card = container.children[originalLength * 2];
      if (card) {
        const scrollLeft =
          card.offsetLeft - container.clientWidth / 2 + card.clientWidth / 2;
        container.style.scrollSnapType = "none";
        container.scrollTo({ left: scrollLeft });

        setTimeout(() => {
          if (scrollRef.current)
            scrollRef.current.style.scrollSnapType = "x mandatory";
        }, 100);
      }
    }
  }, [originalLength]);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && !isResetting.current) {
        const container = scrollRef.current;
        let nextIndex = activeIndex + 1;

        // If getting too close to the end, instantly reset to the middle set
        if (nextIndex > extendedFeatures.length - 3) {
          isResetting.current = true;
          nextIndex = (nextIndex % originalLength) + originalLength * 2;
          const targetCard = container.children[nextIndex];
          if (targetCard) {
            container.style.scrollSnapType = "none";
            const scrollLeft =
              targetCard.offsetLeft -
              container.clientWidth / 2 +
              targetCard.clientWidth / 2;
            container.scrollTo({ left: scrollLeft }); // instant scroll
            setActiveIndex(nextIndex);

            setTimeout(() => {
              if (scrollRef.current)
                scrollRef.current.style.scrollSnapType = "x mandatory";
              isResetting.current = false;
            }, 50);
            return; // skip smooth scrolling for this tick
          }
        }

        const card = container.children[nextIndex];
        if (card) {
          const scrollLeft =
            card.offsetLeft - container.clientWidth / 2 + card.clientWidth / 2;
          container.scrollTo({ left: scrollLeft, behavior: "smooth" });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [activeIndex, originalLength]);

  // Update active index based on scroll position
  const handleScroll = () => {
    if (!scrollRef.current || isResetting.current) return;
    const container = scrollRef.current;
    const centerPosition = container.scrollLeft + container.clientWidth / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(childCenter - centerPosition);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);

      // Infinite loop wrap for manual scrolling
      if (closestIndex <= 2 || closestIndex >= extendedFeatures.length - 3) {
        isResetting.current = true;
        const middleIndex =
          (closestIndex % originalLength) + originalLength * 2;
        const targetCard = container.children[middleIndex];

        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.style.scrollSnapType = "none";
            const scrollLeft =
              targetCard.offsetLeft -
              container.clientWidth / 2 +
              targetCard.clientWidth / 2;
            scrollRef.current.scrollTo({ left: scrollLeft }); // instant scroll
            setActiveIndex(middleIndex);
            setTimeout(() => {
              if (scrollRef.current)
                scrollRef.current.style.scrollSnapType = "x mandatory";
              isResetting.current = false;
            }, 50);
          }
        }, 300); // let current manual smooth scrolling settle
      }
    }
  };

  const scrollCarousel = (dir) => {
    if (scrollRef.current && !isResetting.current) {
      const container = scrollRef.current;
      const targetIndex = dir === "left" ? activeIndex - 1 : activeIndex + 1;
      const card = container.children[targetIndex];
      if (card) {
        const scrollLeft =
          card.offsetLeft - container.clientWidth / 2 + card.clientWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  };

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="hide-scroll"
        style={{
          position: "relative",
          display: "flex",
          overflowX: "auto",
          gap: "2rem",
          paddingTop: "3rem",
          paddingBottom: "3rem",
          paddingLeft: "calc(50% - 190px)",
          paddingRight: "calc(50% - 190px)",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          alignItems: "center",
          scrollSnapType: "x mandatory",
        }}
      >
        {extendedFeatures.map((f, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={i}
              style={{
                minWidth: "380px",
                maxWidth: "380px",
                flexShrink: 0,
                transform: isActive ? "scale(1.08)" : "scale(0.9)",
                opacity: isActive ? 1 : 0.4,
                transition: "all 0.4s ease-out",
                scrollSnapAlign: "center",
              }}
            >
              <FeatureCard
                icon={f.icon}
                title={f.title}
                desc={f.desc}
                gradient={f.gradient}
              />
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <button
          onClick={() => scrollCarousel("left")}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <ChevronLeft size={20} color="var(--brand-violet)" />
        </button>
        <button
          onClick={() => scrollCarousel("right")}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <ChevronRight size={20} color="var(--brand-violet)" />
        </button>
      </div>
    </div>
  );
}

// ── Hero Centered ────────────────────────────────────────────
function HeroCentered() {
  return (
    <section
      className="bg-dots"
      style={{
        position: "relative",
        overflow: "hidden",
        paddingTop: "7rem",
        paddingBottom: "7rem",
        background: "var(--bg-main)",
        minHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <style>{`
        .hero-float-el { display: flex; }
        .hero-float-img { display: block; }
        @media (max-width: 900px) {
          .hero-float-el, .hero-float-img { display: none !important; }
        }
      `}</style>

      {/* Ambient orbs */}
      <div
        className="orb orb-purple"
        style={{ top: "20%", left: "30%", opacity: 0.5 }}
      />
      <div
        className="orb orb-pink"
        style={{ top: "40%", right: "30%", opacity: 0.3 }}
      />

      {/* ── FLOATING ELEMENTS (Quso.ai Style) ── */}
      {/* Top Left Group */}
      <div
        className="animate-float-slow hero-float-el"
        style={{
          position: "absolute",
          top: "12%",
          left: "6%",
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "var(--bg-card)",
            padding: "0.75rem 1.25rem",
            borderRadius: "0.75rem",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--border-light)",
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: "0.8rem",
              color: "var(--text-main)",
            }}
          >
            Custom Sizes
          </span>
        </div>
        <div
          style={{
            background: "var(--bg-card)",
            padding: "0.5rem",
            borderRadius: "0.75rem",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1.5rem",
          }}
        >
          <Zap size={20} color="var(--brand-violet)" />
        </div>
      </div>

      {/* Top Right Group */}
      <div
        className="animate-float-fast hero-float-el"
        style={{
          position: "absolute",
          top: "16%",
          right: "6%",
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "var(--bg-card)",
            padding: "0.5rem",
            borderRadius: "0.75rem",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          <Sparkles size={20} color="var(--brand-pink)" />
        </div>
        <div
          style={{
            background: "var(--bg-card)",
            padding: "0.75rem 1.25rem",
            borderRadius: "0.75rem",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--border-light)",
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: "0.8rem",
              color: "var(--text-main)",
            }}
          >
            Premium Quality
          </span>
        </div>
      </div>

      {/* Mid Left Group */}
      <div
        className="animate-float-fast hero-float-el"
        style={{
          position: "absolute",
          top: "35%",
          left: "12%",
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
          zIndex: 9,
        }}
      >
        <div
          style={{
            background: "var(--bg-card)",
            padding: "0.75rem 1.25rem",
            borderRadius: "0.75rem",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--border-light)",
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: "0.8rem",
              color: "var(--text-main)",
            }}
          >
            Fast Turnaround
          </span>
        </div>
        <div
          style={{
            background: "var(--bg-card)",
            padding: "0.5rem",
            borderRadius: "0.75rem",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          <Lightbulb size={20} color="#F59E0B" />
        </div>
      </div>

      {/* Mid Right Group */}
      <div
        className="animate-float-slow hero-float-el"
        style={{
          position: "absolute",
          top: "38%",
          right: "12%",
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
          zIndex: 9,
        }}
      >
        <div
          style={{
            background: "var(--bg-card)",
            padding: "0.5rem",
            borderRadius: "0.75rem",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1.5rem",
          }}
        >
          <Shield size={20} color="#10B981" />
        </div>
        <div
          style={{
            background: "var(--bg-card)",
            padding: "0.75rem 1.25rem",
            borderRadius: "0.75rem",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--border-light)",
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: "0.8rem",
              color: "var(--text-main)",
            }}
          >
            Eco-Friendly
          </span>
        </div>
      </div>

      {/* Bottom Left Overlapping Cards */}
      <div
        className="animate-float-fast hero-float-img"
        style={{
          position: "absolute",
          bottom: "12%",
          left: "2%",
          zIndex: 10,
          width: 320,
          height: 220,
        }}
      >
        {/* Back Card */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 10,
            background: "var(--bg-card)",
            padding: "0.4rem",
            borderRadius: "1rem",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border-light)",
            width: 220,
            transform: "rotate(-8deg)",
            transformOrigin: "bottom left",
          }}
        >
          <img
            src="/assets/portfolio/LED Sign Boards/led-2.jpg"
            alt="LED Board"
            style={{
              width: "100%",
              height: 130,
              objectFit: "cover",
              borderRadius: "0.6rem",
            }}
          />
        </div>
        {/* Front Card */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 70,
            background: "var(--bg-card)",
            padding: "0.5rem",
            borderRadius: "1rem",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border-light)",
            width: 240,
            transform: "rotate(5deg)",
          }}
        >
          <img
            src="/assets/portfolio/UV Printing/uv-3.jpg"
            alt="UV Printing"
            style={{
              width: "100%",
              height: 140,
              objectFit: "cover",
              borderRadius: "0.75rem",
            }}
          />
          <div
            style={{
              padding: "0.5rem 0.25rem 0.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Printer size={14} color="var(--brand-pink)" />
            <span
              style={{
                fontWeight: 700,
                fontSize: "0.75rem",
                color: "var(--text-main)",
              }}
            >
              UV Printing
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Right Overlapping Cards */}
      <div
        className="animate-float-slow hero-float-img"
        style={{
          position: "absolute",
          bottom: "16%",
          right: "2%",
          zIndex: 10,
          width: 320,
          height: 240,
        }}
      >
        {/* Back Card */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 90,
            background: "var(--bg-card)",
            padding: "0.4rem",
            borderRadius: "1rem",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border-light)",
            width: 200,
            transform: "rotate(6deg)",
          }}
        >
          <div
            style={{
              background: "var(--bg-subtle)",
              height: 120,
              borderRadius: "0.6rem",
              padding: "0.8rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                width: "50%",
                height: 8,
                background: "var(--border-light)",
                borderRadius: 4,
              }}
            ></div>
            <div
              style={{
                width: "90%",
                height: 8,
                background: "var(--border-light)",
                borderRadius: 4,
              }}
            ></div>
            <div
              style={{
                width: "70%",
                height: 8,
                background: "var(--border-light)",
                borderRadius: 4,
              }}
            ></div>
          </div>
        </div>
        {/* Front Card */}
        <div
          style={{
            position: "absolute",
            top: 30,
            right: 10,
            background: "var(--bg-card)",
            padding: "0.5rem",
            borderRadius: "1rem",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border-light)",
            width: 250,
            transform: "rotate(-4deg)",
          }}
        >
          <img
            src="/assets/portfolio/Acrylic Sign Boards/acrylic-2.jpg"
            alt="Acrylic Sign Boards"
            style={{
              width: "100%",
              height: 160,
              objectFit: "cover",
              borderRadius: "0.75rem",
            }}
          />
          <div
            style={{
              padding: "0.5rem 0.25rem 0.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Box size={14} color="var(--brand-violet)" />
            <span
              style={{
                fontWeight: 700,
                fontSize: "0.75rem",
                color: "var(--text-main)",
              }}
            >
              Acrylic Boards
            </span>
          </div>
        </div>
      </div>

      {/* ── CENTRAL CONTENT ── */}
      <div
        className="container"
        style={{ position: "relative", zIndex: 20, maxWidth: 800 }}
      >
        <h1
          style={{
            fontSize: "clamp(3rem, 6.5vw, 4.8rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "var(--text-main)",
            marginBottom: "1rem",
          }}
        >
          Premium Signage &<br />
          <span
            className="gradient-text"
            style={{ backgroundImage: "var(--grad-primary)" }}
          >
            Printing Solutions
          </span>
        </h1>

        <p
          style={{
            fontSize: "1.15rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            maxWidth: 600,
            margin: "0 auto 2.5rem",
          }}
        >
          Custom LED Sign Boards, UV Printing, and Acrylic Letters designed to
          make your brand stand out. Built to last, delivered fast.
        </p>

        {/* Happy Customers Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          <div style={{ display: "flex" }}>
            {["#7C3AED", "#DB2777", "#D97706", "#059669"].map((c, i) => (
              <div
                key={i}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${c} 0%, ${c}99 100%)`,
                  border: "2px solid var(--bg-main)",
                  marginLeft: i > 0 ? -10 : 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  color: "white",
                  fontWeight: 800,
                }}
              >
                {["A", "R", "S", "M"][i]}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--text-main)",
            }}
          >
            500+ Happy Customers
          </div>
        </div>

        <Link
          to="/services"
          className="btn-whatsapp"
          style={{
            padding: "1.1rem 2.5rem",
            fontSize: "1.05rem",
            borderRadius: "var(--radius-lg)",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Explore More
        </Link>

        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.85rem",
            color: "var(--text-subtle)",
            fontWeight: 500,
            marginBottom: "3rem",
          }}
        >
          Free quote available. No upfront costs.
        </p>

        {/* Floating Social Icons (Reference: quso.ai) */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.25rem",
            marginTop: "1rem",
            flexWrap: "wrap",
            maxWidth: 400,
            margin: "0 auto",
          }}
        >
          {[
            {
              color: "#FF0000",
              label: "YouTube",
              svg: (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              ),
            },
            {
              color: "#E1306C",
              label: "Instagram",
              svg: (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              ),
            },
            {
              color: "#0A66C2",
              label: "LinkedIn",
              svg: (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              ),
            },
            {
              color: "#000000",
              label: "X (Twitter)",
              svg: (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              ),
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={
                idx % 2 === 0 ? "animate-float-slow" : "animate-float-fast"
              }
              style={{
                width: 50,
                height: 50,
                borderRadius: "1rem",
                background: "var(--bg-card)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-md)",
                border: "1px solid var(--border-light)",
                transform: `translateY(${idx % 2 === 0 ? "5px" : "-5px"})`,
                color: item.color,
              }}
            >
              {item.svg}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main Home Component ──────────────────────────────────────
export default function Home() {
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [catalogReady, setCatalogReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categoryScrollRef = useRef(null);
  const scrollCategory = (dir) => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({
        left: dir === "left" ? -350 : 350,
        behavior: "smooth",
      });
    }
  };

  const portfolioScrollRef = useRef(null);
  const scrollPortfolio = (dir) => {
    if (portfolioScrollRef.current) {
      portfolioScrollRef.current.scrollBy({
        left: dir === "left" ? -350 : 350,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    document.title =
      "Aarav Enterprises — Signage, LED Boards & Printing in Pune";
    async function load() {
      try {
        const [sRes, pRes, cRes, apRes] = await Promise.all([
          productAPI.list({ featured: true }),
          portfolioAPI.list({ featured: true }),
          categoryAPI.list({ active: true }),
          productAPI.list({ limit: 200 }),
        ]);
        setServices(sRes.data.data || []);
        setPortfolio(pRes.data.data || []);
        setCategories(cRes.data.data || []);
        setAllProducts(apRes.data.data || []);
        setCatalogReady(true);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const displayServices =
    services.length > 0 ? services.slice(0, 6) : FALLBACK_SERVICES;
  const displayPortfolio =
    portfolio.length > 0 ? portfolio.slice(0, 6) : FALLBACK_PORTFOLIO;

  // Group the live catalog into one row per category; fall back to demo
  // rows (offline / catalog not yet populated) so the section never looks empty.
  const categoryRows = [
    ...(catalogReady
      ? categories
          .map((cat) => ({
            category: cat,
            products: allProducts
              .filter((p) => p.category_id === cat.id)
              .map(withDemoStats),
          }))
          .filter((row) => row.products.length > 0)
      : FALLBACK_CATEGORY_ROWS),
    // Core signage/printing products — not part of the backend category
    // taxonomy yet, so shown as standalone rows on every load.
    ...SIGNAGE_PRINTING_ROWS,
  ];

  const visibleCategoryRows =
    categoryFilter === "all"
      ? categoryRows
      : categoryRows.filter((row) => row.category.id === categoryFilter);

  return (
    <>
      {/* ── HERO CENTERED ──────────────────────────────────── */}
      <HeroCentered />

      {/* ── TRUST BAR ──────────────────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
          background: "var(--bg-surface)",
          padding: "1.75rem 0",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              {
                Icon: Palette,
                title: "Custom Designs",
                sub: "100% Original, Made for You",
              },
              {
                Icon: Zap,
                title: "Fast Turnaround",
                sub: "Delivery in 1–5 Days",
              },
              {
                Icon: MessageCircle,
                title: "WhatsApp Support",
                sub: "Chat 24/7 in Hindi & English",
              },
              {
                Icon: Shield,
                title: "Premium Quality",
                sub: "Durable & Print-Ready",
              },
            ].map(({ Icon, title, sub }, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  padding: "0.5rem 1rem",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "var(--badge-bg-purple)",
                    border: "1px solid var(--badge-border-purple)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color="var(--brand-violet)" />
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "var(--text-main)",
                    }}
                  >
                    {title}
                  </div>
                  <div
                    style={{ fontSize: "0.78rem", color: "var(--text-subtle)" }}
                  >
                    {sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED SERVICES (Shop by Category) ───────────── */}
      <section
        className="section"
        id="services"
        style={{ paddingTop: "2.5rem" }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--text-main)",
                letterSpacing: "-0.02em",
              }}
            >
              Shop by Category
            </h2>
            <Link
              to="/services"
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
          <div
            ref={categoryScrollRef}
            className="hide-scroll"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 180px)",
              gap: "1rem",
              paddingBottom: "1rem",
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {[
              {
                id: "cat-1",
                name: "UV Printing Service",
                slug: "uv-printing",
                thumbnail_url: "/assets/portfolio/UV Printing/uv-1.jpg",
                starting_price: 999,
              },
              {
                id: "cat-2",
                name: "Acrylic Sign Board",
                slug: "acrylic-sign-boards",
                thumbnail_url: "/assets/portfolio/Acrylic Sign Boards/acrylic-1.jpg",
                starting_price: 1499,
              },
              {
                id: "cat-3",
                name: "Roll Up Standee",
                slug: "roll-up-standees",
                thumbnail_url: "/assets/portfolio/Roll Up Standees/standee-1.jpg",
                starting_price: 1999,
              },
              {
                id: "cat-4",
                name: "LED Sign Board",
                slug: "led-sign-boards",
                thumbnail_url: "/assets/portfolio/LED Sign Boards/led-1.jpg",
                starting_price: 2499,
              },
              {
                id: "cat-5",
                name: "Glow Sign Board",
                slug: "glow-sign-boards",
                thumbnail_url: "/assets/portfolio/Glow Sign Boards/glow-1.jpg",
                starting_price: 2999,
              },
              {
                id: "cat-6",
                name: "Flex Banner",
                slug: "flex-banners",
                thumbnail_url: "/assets/portfolio/Flex Banners/flex-1.jpg",
                starting_price: 499,
              },
              {
                id: "cat-7",
                name: "Letter Sign Board",
                slug: "letter-sign-boards",
                thumbnail_url: "/assets/portfolio/Letter Sign Boards/letter-1.jpg",
                starting_price: 1299,
              },
              {
                id: "cat-8",
                name: "LED Acrylic Letter",
                slug: "led-acrylic-letters",
                thumbnail_url: "/assets/portfolio/Letter Sign Boards/letter-3.jpg",
                starting_price: 3499,
              },
            ].map((s) => (
              <div key={s.id} style={{ flexShrink: 0 }}>
                <SimpleServiceCard service={s} />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <button
              onClick={() => scrollCategory("left")}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <ChevronLeft size={20} color="var(--brand-violet)" />
            </button>
            <button
              onClick={() => scrollCategory("right")}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <ChevronRight size={20} color="var(--brand-violet)" />
            </button>
          </div>
        </div>
      </section>

      {/* ── RECENT WORK ───────────────────────────────────────── */}
      <section
        className="section"
        style={{ background: "var(--bg-surface)", paddingTop: "2.5rem" }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--text-main)",
                letterSpacing: "-0.02em",
              }}
            >
              Recent work
            </h2>
            <Link
              to="/portfolio"
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div
            ref={portfolioScrollRef}
            className="hide-scroll"
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "1.5rem",
              paddingBottom: "1rem",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollBehavior: "smooth",
            }}
          >
            {displayPortfolio.map((item, i) => (
              <div key={item.id || i} style={{ width: "240px", flexShrink: 0 }}>
                <PortfolioThumb item={item} />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <button
              onClick={() => scrollPortfolio("left")}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <ChevronLeft size={20} color="var(--brand-violet)" />
            </button>
            <button
              onClick={() => scrollPortfolio("right")}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <ChevronRight size={20} color="var(--brand-violet)" />
            </button>
          </div>
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY (one row per category) ────────── */}
      {categoryRows.length > 0 && (
        <section
          className="section"
          style={{
            paddingTop: "2.5rem",
            background: "var(--bg-main)",
            borderTop: "1px solid var(--border-light)",
            borderBottom: "1px solid var(--border-light)",
          }}
        >
          <div className="container">
            <div style={{ marginBottom: "1.5rem" }}>
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "var(--text-main)",
                  letterSpacing: "-0.02em",
                  marginBottom: "0.4rem",
                }}
              >
                Browse by Category
              </h2>
              <p style={{ fontSize: "0.95rem", color: "var(--text-subtle)" }}>
                Explore our full catalog, organized by service type.
              </p>
            </div>

            <div
              className="hide-scroll"
              style={{
                display: "flex",
                gap: "0.6rem",
                overflowX: "auto",
                paddingBottom: "0.5rem",
                marginBottom: "2rem",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <button
                onClick={() => setCategoryFilter("all")}
                style={{
                  flexShrink: 0,
                  padding: "0.55rem 1.25rem",
                  borderRadius: 999,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  border: "1px solid",
                  borderColor:
                    categoryFilter === "all"
                      ? "var(--brand-violet)"
                      : "var(--border-light)",
                  background:
                    categoryFilter === "all"
                      ? "var(--badge-bg-purple)"
                      : "var(--bg-card)",
                  color:
                    categoryFilter === "all"
                      ? "var(--brand-violet)"
                      : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                All
              </button>
              {categoryRows.map((row) => (
                <button
                  key={row.category.id}
                  onClick={() => setCategoryFilter(row.category.id)}
                  style={{
                    flexShrink: 0,
                    padding: "0.55rem 1.25rem",
                    borderRadius: 999,
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    border: "1px solid",
                    borderColor:
                      categoryFilter === row.category.id
                        ? "var(--brand-violet)"
                        : "var(--border-light)",
                    background:
                      categoryFilter === row.category.id
                        ? "var(--badge-bg-purple)"
                        : "var(--bg-card)",
                    color:
                      categoryFilter === row.category.id
                        ? "var(--brand-violet)"
                        : "var(--text-muted)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {row.category.name}
                </button>
              ))}
            </div>

            {visibleCategoryRows.map((row) => (
              <CategoryRow
                key={row.category.id}
                category={row.category}
                products={row.products}
                viewAllHref={row.viewAllHref}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── WHY CHOOSE US ────────────────────────────────────── */}
      <section className="section" style={{ background: "var(--bg-surface)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 className="section-title">
              Why Businesses Trust{" "}
              <span className="gradient-text">Aarav Enterprises</span>
            </h2>
            <p className="section-subtitle">
              We combine artistic creativity, fast turnaround, and automated AI
              assistance for seamless execution.
            </p>
          </div>

          <AutoScrollingFeatures />
        </div>
      </section>

      {/* ── CALL TO ACTION BANNER ────────────────────────────── */}
      <section
        style={{ padding: "5rem 1.5rem", background: "var(--bg-surface)" }}
      >
        <div className="container">
          <div
            className="glass-card"
            style={{
              padding: "4rem 2rem",
              textAlign: "center",
              background: "var(--grad-hero)",
              border: "1px solid var(--border-glow)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                marginBottom: "1rem",
                color: "var(--text-main)",
              }}
            >
              Ready to Upgrade Your{" "}
              <span className="gradient-text">Brand Identity?</span>
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1.15rem",
                maxWidth: 650,
                margin: "0 auto 2.5rem",
                lineHeight: 1.7,
                fontWeight: 500,
              }}
            >
              Chat with our AI assistant on WhatsApp right now to get an instant
              quote and share your design requirements.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => openWhatsApp()}
                className="btn-whatsapp"
                style={{ padding: "1rem 2.5rem", fontSize: "1rem" }}
              >
                <MessageCircle size={20} /> Chat on WhatsApp Now
              </button>
              <Link
                to="/pricing"
                className="btn-secondary"
                style={{ padding: "1rem 2.25rem", fontSize: "1rem" }}
              >
                View Transparent Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Discount/rating/review data isn't in the backend schema yet, so every
// product card (Shop by Category, Browse by Category, Signage rows, and
// live API products alike) gets a deterministic demo rating/discount cycled
// from this small set, purely for visual consistency until real
// rating/discount/review columns exist on `products`.
const DEMO_STATS_CYCLE = [
  { rating: 4.6, review_count: 842, discount_percent: 23 },
  { rating: 4.5, review_count: 528, discount_percent: 21 },
  { rating: 4.4, review_count: 356, discount_percent: 20 },
  { rating: 4.7, review_count: 615, discount_percent: 22 },
  { rating: 4.3, review_count: 1204, discount_percent: 18 },
  { rating: 4.8, review_count: 97, discount_percent: 25 },
  { rating: 4.2, review_count: 463, discount_percent: 17 },
];

function withDemoStats(product, index) {
  const stats = DEMO_STATS_CYCLE[index % DEMO_STATS_CYCLE.length];
  const original_price =
    product.starting_price > 0
      ? Math.round(
          product.starting_price / (1 - stats.discount_percent / 100) / 10,
        ) * 10
      : 0;
  return { ...product, ...stats, original_price };
}

// Fallback data if backend is offline
const FALLBACK_SERVICES = [
  {
    id: 1,
    name: "Logo Design",
    slug: "logo-design",
    short_desc: "Unique 2D & 3D brand logo designs with vector files",
    starting_price: 999,
    price_label: "onwards",
    delivery_days: 3,
    category_name: "Logo",
    is_featured: true,
  },
  {
    id: 2,
    name: "Visiting Card Design",
    slug: "visiting-card",
    short_desc: "Professional single & double side business card designs",
    starting_price: 299,
    price_label: "onwards",
    delivery_days: 2,
    category_name: "Business Card",
    is_featured: true,
  },
  {
    id: 3,
    name: "Social Media Posts",
    slug: "social-media",
    short_desc: "High-converting Instagram & Facebook post creatives",
    starting_price: 299,
    price_label: "onwards",
    delivery_days: 1,
    category_name: "Social Media",
    is_featured: true,
  },
  {
    id: 4,
    name: "Flex & Banner Design",
    slug: "flex-banner",
    short_desc: "Large format outdoor flex banners and hoardings",
    starting_price: 499,
    price_label: "onwards",
    delivery_days: 2,
    category_name: "Printing",
    is_featured: false,
  },
  {
    id: 5,
    name: "3D Logo Design",
    slug: "3d-logo",
    short_desc: "Premium 3D embossed logo design with metallic rendering",
    starting_price: 1499,
    price_label: "onwards",
    delivery_days: 5,
    category_name: "3D Logo",
    is_featured: true,
  },
  {
    id: 6,
    name: "Brochure & Catalog",
    slug: "brochure-design",
    short_desc: "Bi-fold & tri-fold corporate company brochures",
    starting_price: 799,
    price_label: "onwards",
    delivery_days: 4,
    category_name: "Brochure",
    is_featured: false,
  },
];

const FALLBACK_PORTFOLIO = [
  {
    id: 1,
    title: "LED Shop Sign Board",
    category_name: "LED Sign Board",
    image_url: "/assets/portfolio/LED Sign Boards/led-1.jpg",
  },
  {
    id: 2,
    title: "Acrylic Store Board",
    category_name: "Acrylic Sign Board",
    image_url: "/assets/portfolio/Acrylic Sign Boards/acrylic-1.jpg",
  },
  {
    id: 3,
    title: "Premium Glow Sign",
    category_name: "Glow Sign Board",
    image_url: "/assets/portfolio/Glow Sign Boards/glow-1.jpg",
  },
  {
    id: 4,
    title: "Roll Up Standee — Event",
    category_name: "Roll Up Standee",
    image_url: "/assets/portfolio/Roll Up Standees/standee-1.jpg",
  },
  {
    id: 5,
    title: "UV Printed Branding Board",
    category_name: "UV Printing",
    image_url: "/assets/portfolio/UV Printing/uv-1.jpg",
  },
  {
    id: 6,
    title: "Flex Hoarding Banner",
    category_name: "Flex Banner",
    image_url: "/assets/portfolio/Flex Banners/flex-1.jpg",
  },
];

// Fallback per-category rows (offline / catalog not yet populated).
// Category slugs match the real seeded categories so "View All" still
// filters correctly once the backend is reachable.
const FALLBACK_CATEGORY_ROWS = [
  {
    category: { id: "fc-logo", slug: "logo-design", name: "Logo Design" },
    products: [
      {
        id: "fp-1",
        name: "Logo Design",
        slug: "logo-design-service",
        starting_price: 999,
        thumbnail_url: "/assets/portfolio/Logo Design/logo-coffee.jpg",
      },
      {
        id: "fp-2",
        name: "3D Logo Design",
        slug: "3d-logo-design-service",
        starting_price: 1499,
        thumbnail_url: "https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        id: "fp-3",
        name: "Mascot Logo Design",
        slug: "mascot-logo-design",
        starting_price: 1799,
        thumbnail_url: "/assets/portfolio/Logo Design/logo-mascot.jpg",
      },
      {
        id: "fp-4",
        name: "Monogram Logo Design",
        slug: "monogram-logo-design",
        starting_price: 899,
        thumbnail_url: "/assets/portfolio/Logo Design/logo-monogram.jpg",
      },
      {
        id: "fp-5",
        name: "Wordmark Logo Design",
        slug: "wordmark-logo-design",
        starting_price: 999,
        thumbnail_url: "/assets/portfolio/Logo Design/logo-wordmark.jpg",
      },
      {
        id: "fp-6",
        name: "Vintage Logo Design",
        slug: "vintage-logo-design",
        starting_price: 1299,
        thumbnail_url: "/assets/portfolio/Logo Design/logo-vintage.jpg",
      },
      {
        id: "fp-7",
        name: "Logo Redesign & Rebrand",
        slug: "logo-redesign",
        starting_price: 1299,
        thumbnail_url: "/assets/portfolio/Logo Design/logo-redesign.jpg",
      },
    ],
  },
  {
    category: { id: "fc-card", slug: "visiting-card", name: "Visiting Card" },
    products: [
      {
        id: "fp-7",
        name: "Visiting Card Design",
        slug: "visiting-card-design",
        starting_price: 299,
        thumbnail_url: "/assets/portfolio/Visiting Card/visiting-card-design.jpg",
      },
      {
        id: "fp-8",
        name: "Premium Metal Card",
        slug: "premium-metal-card",
        starting_price: 1999,
        thumbnail_url: "/assets/portfolio/Visiting Card/visiting-card-metal.jpg",
      },
      {
        id: "fp-9",
        name: "Foil Stamped Card",
        slug: "foil-stamped-card",
        starting_price: 899,
        thumbnail_url: "/assets/portfolio/Visiting Card/visiting-card-foil.jpg",
      },
      {
        id: "fp-10",
        name: "Double-Sided Card",
        slug: "double-sided-card",
        starting_price: 399,
        thumbnail_url: "https://images.pexels.com/photos/8867432/pexels-photo-8867432.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        id: "fp-11",
        name: "QR Digital Card",
        slug: "qr-digital-card",
        starting_price: 499,
        thumbnail_url: "/assets/portfolio/Visiting Card/visiting-card-qr.jpg",
      },
      {
        id: "fp-12",
        name: "Corporate Business Card",
        slug: "corporate-business-card",
        starting_price: 449,
        thumbnail_url: "https://images.pexels.com/photos/6804100/pexels-photo-6804100.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        id: "fp-13",
        name: "Eco-Friendly Visiting Card",
        slug: "eco-friendly-visiting-card",
        starting_price: 599,
        thumbnail_url: "/assets/portfolio/Visiting Card/visiting-card-eco.jpg",
      },
    ],
  },
  {
    category: { id: "fc-social", slug: "social-media-design", name: "Social Media Design" },
    products: [
      { id: "fp-13", name: "Instagram Post Design", slug: "instagram-post-design", starting_price: 299,
        thumbnail_url: "https://images.pexels.com/photos/3178818/pexels-photo-3178818.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-14", name: "Facebook Cover Design", slug: "facebook-cover-design", starting_price: 399,
        thumbnail_url: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-15", name: "WhatsApp Status Design", slug: "whatsapp-status-design", starting_price: 199,
        thumbnail_url: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-16", name: "YouTube Thumbnail Design", slug: "youtube-thumbnail-design", starting_price: 349,
        thumbnail_url: "https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-17", name: "Festival Post Design", slug: "festival-post-design", starting_price: 299,
        thumbnail_url: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-18", name: "Product Promotion Post", slug: "product-promotion-post", starting_price: 499,
        thumbnail_url: "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=400" },
    ],
  },
  {
    category: { id: "fc-pamphlet", slug: "pamphlet-flyer", name: "Pamphlet & Flyer" },
    products: [
      { id: "fp-19", name: "A4 Pamphlet Design", slug: "a4-pamphlet-design", starting_price: 399,
        thumbnail_url: "https://images.pexels.com/photos/6476254/pexels-photo-6476254.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-20", name: "Event Flyer Design", slug: "event-flyer-design", starting_price: 349,
        thumbnail_url: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-21", name: "Restaurant Pamphlet", slug: "restaurant-pamphlet", starting_price: 499,
        thumbnail_url: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-22", name: "Offer & Sale Flyer", slug: "offer-sale-flyer", starting_price: 299,
        thumbnail_url: "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-23", name: "Real Estate Pamphlet", slug: "real-estate-pamphlet", starting_price: 599,
        thumbnail_url: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-24", name: "Educational Flyer", slug: "educational-flyer", starting_price: 349,
        thumbnail_url: "https://images.pexels.com/photos/5427654/pexels-photo-5427654.jpeg?auto=compress&cs=tinysrgb&w=400" },
    ],
  },
  {
    category: { id: "fc-banner", slug: "banner-design", name: "Banner Design" },
    products: [
      { id: "fp-25", name: "Shop Banner Design", slug: "shop-banner-design", starting_price: 599,
        thumbnail_url: "/assets/portfolio/Banner Design/banner-furniture.jpg" },
      { id: "fp-26", name: "Event Banner Design", slug: "event-banner-design", starting_price: 699,
        thumbnail_url: "/assets/portfolio/Banner Design/banner-event.jpg" },
      { id: "fp-27", name: "Hoarding Banner", slug: "hoarding-banner", starting_price: 999,
        thumbnail_url: "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-28", name: "Sale & Offer Banner", slug: "sale-offer-banner", starting_price: 449,
        thumbnail_url: "/assets/portfolio/Banner Design/banner-sale.jpg" },
      { id: "fp-29", name: "Wedding Banner Design", slug: "wedding-banner-design", starting_price: 799,
        thumbnail_url: "https://images.pexels.com/photos/1456613/pexels-photo-1456613.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-30", name: "Outdoor Hoarding Design", slug: "outdoor-hoarding-design", starting_price: 1299,
        thumbnail_url: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-30b", name: "Website Banner Design", slug: "website-banner-design", starting_price: 499,
        thumbnail_url: "/assets/portfolio/Banner Design/banner-website.jpg" },
      { id: "fp-30c", name: "Social Media Banner Design", slug: "social-media-banner-design", starting_price: 399,
        thumbnail_url: "/assets/portfolio/Banner Design/banner-social.jpg" },
      { id: "fp-30d", name: "Corporate Banner Design", slug: "corporate-banner-design", starting_price: 699,
        thumbnail_url: "/assets/portfolio/Banner Design/banner-corporate.jpg" },
    ],
  },
  {
    category: { id: "fc-flex", slug: "flex-printing", name: "Flex & Printing" },
    products: [
      { id: "fp-31", name: "Flex Printing", slug: "flex-printing-service", starting_price: 499,
        thumbnail_url: "/assets/portfolio/Flex Banners/flex-1.jpg" },
      { id: "fp-32", name: "Vinyl Flex Print", slug: "vinyl-flex-print", starting_price: 599,
        thumbnail_url: "/assets/portfolio/Flex Banners/flex-2.jpg" },
      { id: "fp-33", name: "Star Flex Printing", slug: "star-flex-printing", starting_price: 699,
        thumbnail_url: "/assets/portfolio/Flex Banners/flex-3.jpg" },
      { id: "fp-34", name: "Sunboard Printing", slug: "sunboard-printing", starting_price: 799,
        thumbnail_url: "/assets/portfolio/Flex Banners/flex-4.jpg" },
      { id: "fp-35", name: "ACP Board Printing", slug: "acp-board-printing", starting_price: 1499,
        thumbnail_url: "/assets/portfolio/Flex Banners/flex-5.jpg" },
      { id: "fp-36", name: "One Way Vision Print", slug: "one-way-vision-print", starting_price: 999,
        thumbnail_url: "/assets/portfolio/Flex Banners/flex-6.jpg" },
    ],
  },
  {
    category: { id: "fc-ad", slug: "advertisement", name: "Advertisement" },
    products: [
      { id: "fp-37", name: "Newspaper Ad Design", slug: "newspaper-ad-design", starting_price: 799,
        thumbnail_url: "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-38", name: "Digital Ad Design", slug: "digital-ad-design", starting_price: 499,
        thumbnail_url: "https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-39", name: "Magazine Ad Design", slug: "magazine-ad-design", starting_price: 999,
        thumbnail_url: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-40", name: "Billboard Ad Design", slug: "billboard-ad-design", starting_price: 1499,
        thumbnail_url: "https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-41", name: "Google Display Ad", slug: "google-display-ad", starting_price: 699,
        thumbnail_url: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { id: "fp-42", name: "Festival Sale Ad", slug: "festival-sale-ad", starting_price: 599,
        thumbnail_url: "https://images.pexels.com/photos/5632374/pexels-photo-5632374.jpeg?auto=compress&cs=tinysrgb&w=400" },
    ],
  },
  {
    category: { id: "fc-3dlogo", slug: "3d-logo-design", name: "3D Logo Design" },
    products: [
      { id: "fp-43", name: "3D Brand Logo", slug: "3d-brand-logo", starting_price: 1499,
        thumbnail_url: "/assets/portfolio/3D Logo Design/3d-logo-gold.jpg" },
      { id: "fp-44", name: "3D Metallic Logo", slug: "3d-metallic-logo", starting_price: 1999,
        thumbnail_url: "/assets/portfolio/3D Logo Design/3d-logo-metallic.jpg" },
      { id: "fp-45", name: "3D Wooden Logo Design", slug: "3d-wooden-logo-design", starting_price: 2499,
        thumbnail_url: "/assets/portfolio/3D Logo Design/3d-logo-wooden.jpg" },
      { id: "fp-46", name: "3D Embossed Logo", slug: "3d-embossed-logo", starting_price: 1799,
        thumbnail_url: "/assets/portfolio/3D Logo Design/3d-logo-embossed.jpg" },
      { id: "fp-47", name: "3D Animated Logo", slug: "3d-animated-logo", starting_price: 2999,
        thumbnail_url: "/assets/portfolio/3D Logo Design/3d-logo-animated.jpg" },
      { id: "fp-48", name: "3D Glass Logo", slug: "3d-glass-logo", starting_price: 2199,
        thumbnail_url: "/assets/portfolio/3D Logo Design/3d-logo-glass.jpg" },
    ],
  },
  {
    category: { id: "fc-menu", slug: "menu-card-design", name: "Menu Card Design" },
    products: [
      { id: "fp-49", name: "Restaurant Menu Card", slug: "restaurant-menu-card", starting_price: 599,
        thumbnail_url: "/assets/portfolio/Menu Cards & Brochures/flavors-menu.jpg" },
      { id: "fp-50", name: "Takeaway Menu Design", slug: "takeaway-menu-design", starting_price: 499,
        thumbnail_url: "/assets/portfolio/Menu Cards & Brochures/takeaway-menu.jpg" },
      { id: "fp-51", name: "Wine & Beverage Menu Design", slug: "wine-beverage-menu-design", starting_price: 699,
        thumbnail_url: "/assets/portfolio/Menu Cards & Brochures/wine-menu.jpg" },
      { id: "fp-52", name: "Festive Special Menu Design", slug: "festive-special-menu-design", starting_price: 699,
        thumbnail_url: "/assets/portfolio/Menu Cards & Brochures/festive-menu.jpg" },
      { id: "fp-53", name: "Digital Menu Design", slug: "digital-menu-design", starting_price: 899,
        thumbnail_url: "/assets/portfolio/Menu Cards & Brochures/digital-menu-board.jpg" },
      { id: "fp-54", name: "Multi-Page Menu Booklet", slug: "multi-page-menu-booklet", starting_price: 899,
        thumbnail_url: "/assets/portfolio/Menu Cards & Brochures/menu-booklet.jpg" },
    ],
  },
  {
    category: { id: "fc-brochure", slug: "brochure-design", name: "Brochure Design" },
    products: [
      { id: "fp-55", name: "Bi-Fold Brochure", slug: "bi-fold-brochure", starting_price: 799,
        thumbnail_url: "/assets/portfolio/Brochure Design/brochure-bifold.jpg" },
      { id: "fp-56", name: "Tri-Fold Brochure", slug: "tri-fold-brochure", starting_price: 999,
        thumbnail_url: "/assets/portfolio/Brochure Design/brochure-trifold-creative.jpg" },
      { id: "fp-57", name: "Company Profile Brochure", slug: "corporate-catalog", starting_price: 1299,
        thumbnail_url: "/assets/portfolio/Brochure Design/brochure-company-profile.jpg" },
      { id: "fp-58", name: "Real Estate Brochure", slug: "real-estate-brochure", starting_price: 1499,
        thumbnail_url: "/assets/portfolio/Brochure Design/brochure-real-estate.jpg" },
      { id: "fp-59", name: "Product Catalog Design", slug: "product-catalog-design", starting_price: 1199,
        thumbnail_url: "/assets/portfolio/Brochure Design/catalog-product.jpg" },
      { id: "fp-60", name: "School/College Brochure", slug: "school-college-brochure", starting_price: 899,
        thumbnail_url: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=400" },
    ],
  },
].map((row) => ({ ...row, products: row.products.map(withDemoStats) }));

// Core signage/printing products (not part of the backend category
// taxonomy) — each shown as its own row of 6-7 variant cards, always
// rendered regardless of API state.
const SIGNAGE_PRINTING_ROWS = [
  {
    category: {
      id: "signage-uv-printing",
      slug: "uv-printing",
      name: "UV Printing Service",
    },
    viewAllHref: "/services",
    products: [
      {
        id: "sp-uv-1",
        name: "UV Printing Service",
        slug: "uv-printing-service",
        starting_price: 999,
        thumbnail_url: "/assets/portfolio/UV Printing/uv-1.jpg",
      },
      {
        id: "sp-uv-2",
        name: "UV Printing on Acrylic",
        slug: "uv-printing-acrylic",
        starting_price: 1299,
        thumbnail_url: "/assets/portfolio/UV Printing/uv-2.jpg",
      },
      {
        id: "sp-uv-3",
        name: "UV Printing on Board",
        slug: "uv-printing-board",
        starting_price: 1199,
        thumbnail_url: "/assets/portfolio/UV Printing/uv-3.jpg",
      },
      {
        id: "sp-uv-4",
        name: "UV Printing on PVC",
        slug: "uv-printing-pvc",
        starting_price: 1499,
        thumbnail_url: "/assets/portfolio/UV Printing/uv-4.jpg",
      },
      {
        id: "sp-uv-5",
        name: "UV Printing on Sheet",
        slug: "uv-printing-sheet",
        starting_price: 1399,
        thumbnail_url: "/assets/portfolio/UV Printing/uv-5.jpg",
      },
      {
        id: "sp-uv-6",
        name: "UV Printing — Premium",
        slug: "uv-printing-premium",
        starting_price: 999,
        thumbnail_url: "/assets/portfolio/UV Printing/uv-6.jpg",
      },
      {
        id: "sp-uv-7",
        name: "UV Printing — Custom Size",
        slug: "uv-printing-custom",
        starting_price: 899,
        thumbnail_url: "/assets/portfolio/UV Printing/uv-7.jpg",
      },
    ],
  },
  {
    category: {
      id: "signage-acrylic-board",
      slug: "acrylic-sign-boards",
      name: "Acrylic Sign Board",
    },
    viewAllHref: "/services",
    products: [
      {
        id: "sp-ac-1",
        name: "Acrylic Sign Board",
        slug: "acrylic-sign-board",
        starting_price: 1499,
        thumbnail_url: "/assets/portfolio/Acrylic Sign Boards/acrylic-1.jpg",
      },
      {
        id: "sp-ac-2",
        name: "3D Acrylic Sign Board",
        slug: "3d-acrylic-sign-board",
        starting_price: 2499,
        thumbnail_url: "/assets/portfolio/Acrylic Sign Boards/acrylic-2.jpg",
      },
      {
        id: "sp-ac-3",
        name: "Backlit Acrylic Sign Board",
        slug: "backlit-acrylic-sign-board",
        starting_price: 2999,
        thumbnail_url: "/assets/portfolio/Acrylic Sign Boards/acrylic-3.jpg",
      },
      {
        id: "sp-ac-4",
        name: "Frosted Acrylic Sign Board",
        slug: "frosted-acrylic-sign-board",
        starting_price: 1799,
        thumbnail_url: "/assets/portfolio/Acrylic Sign Boards/acrylic-4.jpg",
      },
      {
        id: "sp-ac-5",
        name: "Colored Acrylic Sign Board",
        slug: "colored-acrylic-sign-board",
        starting_price: 1699,
        thumbnail_url: "/assets/portfolio/Acrylic Sign Boards/acrylic-5.jpg",
      },
      {
        id: "sp-ac-6",
        name: "Acrylic Nameplate",
        slug: "acrylic-nameplate",
        starting_price: 599,
        thumbnail_url: "/assets/portfolio/Acrylic Sign Boards/acrylic-6.jpg",
      },
      {
        id: "sp-ac-7",
        name: "Transparent Acrylic Board",
        slug: "transparent-acrylic-board",
        starting_price: 1399,
        thumbnail_url: "/assets/portfolio/Acrylic Sign Boards/acrylic-7.jpg",
      },
    ],
  },
  {
    category: {
      id: "signage-roll-up",
      slug: "roll-up-standees",
      name: "Roll Up Standee",
    },
    viewAllHref: "/services",
    products: [
      {
        id: "sp-ru-1",
        name: "Roll Up Standee",
        slug: "roll-up-standee",
        starting_price: 1999,
        thumbnail_url: "/assets/portfolio/Roll Up Standees/standee-1.jpg",
      },
      {
        id: "sp-ru-2",
        name: "Premium Roll Up Standee",
        slug: "premium-roll-up-standee",
        starting_price: 2999,
        thumbnail_url: "/assets/portfolio/Roll Up Standees/standee-2.jpg",
      },
      {
        id: "sp-ru-3",
        name: "Retractable Banner Stand",
        slug: "retractable-banner-stand",
        starting_price: 2499,
        thumbnail_url: "/assets/portfolio/Roll Up Standees/standee-3.jpg",
      },
      {
        id: "sp-ru-4",
        name: "X-Banner Stand",
        slug: "x-banner-stand",
        starting_price: 1499,
        thumbnail_url: "/assets/portfolio/Roll Up Standees/standee-4.jpg",
      },
      {
        id: "sp-ru-5",
        name: "Table Top Standee",
        slug: "table-top-standee",
        starting_price: 999,
        thumbnail_url: "/assets/portfolio/Roll Up Standees/standee-5.jpg",
      },
      {
        id: "sp-ru-6",
        name: "Double-Sided Standee",
        slug: "double-sided-standee",
        starting_price: 3499,
        thumbnail_url: "/assets/portfolio/Roll Up Standees/standee-6.jpg",
      },
      {
        id: "sp-ru-7",
        name: "Outdoor Roll Up Standee",
        slug: "outdoor-roll-up-standee",
        starting_price: 3999,
        thumbnail_url: "/assets/portfolio/Roll Up Standees/standee-7.jpg",
      },
    ],
  },
  {
    category: {
      id: "signage-led-board",
      slug: "led-sign-boards",
      name: "LED Sign Board",
    },
    viewAllHref: "/services",
    products: [
      {
        id: "sp-led-1",
        name: "LED Sign Board",
        slug: "led-sign-board",
        starting_price: 2499,
        thumbnail_url: "/assets/portfolio/LED Sign Boards/led-1.jpg",
      },
      {
        id: "sp-led-2",
        name: "LED Backlit Sign Board",
        slug: "led-backlit-sign-board",
        starting_price: 3499,
        thumbnail_url: "/assets/portfolio/LED Sign Boards/led-2.jpg",
      },
      {
        id: "sp-led-3",
        name: "LED Channel Letter Sign",
        slug: "led-channel-letter-sign",
        starting_price: 3999,
        thumbnail_url: "/assets/portfolio/LED Sign Boards/led-3.jpg",
      },
      {
        id: "sp-led-4",
        name: "LED Display Board",
        slug: "led-display-board",
        starting_price: 4999,
        thumbnail_url: "/assets/portfolio/LED Sign Boards/led-4.jpg",
      },
      {
        id: "sp-led-5",
        name: "LED Illuminated Box Sign",
        slug: "led-illuminated-box-sign",
        starting_price: 2999,
        thumbnail_url: "/assets/portfolio/LED Sign Boards/led-5.jpg",
      },
      {
        id: "sp-led-6",
        name: "LED Shop Front Board",
        slug: "led-shop-front-board",
        starting_price: 5999,
        thumbnail_url: "/assets/portfolio/LED Sign Boards/led-6.jpg",
      },
      {
        id: "sp-led-7",
        name: "LED Custom Sign Board",
        slug: "led-custom-sign-board",
        starting_price: 4499,
        thumbnail_url: "/assets/portfolio/LED Sign Boards/led-7.jpg",
      },
    ],
  },
  {
    category: {
      id: "signage-glow-board",
      slug: "glow-sign-boards",
      name: "Glow Sign Board",
    },
    viewAllHref: "/services",
    products: [
      {
        id: "sp-gl-1",
        name: "Glow Sign Board",
        slug: "glow-sign-board",
        starting_price: 2999,
        thumbnail_url: "/assets/portfolio/Glow Sign Boards/glow-1.jpg",
      },
      {
        id: "sp-gl-2",
        name: "Single-Sided Glow Sign",
        slug: "single-sided-glow-sign",
        starting_price: 2499,
        thumbnail_url: "/assets/portfolio/Glow Sign Boards/glow-2.jpg",
      },
      {
        id: "sp-gl-3",
        name: "Double-Sided Glow Sign",
        slug: "double-sided-glow-sign",
        starting_price: 3999,
        thumbnail_url: "/assets/portfolio/Glow Sign Boards/glow-3.jpg",
      },
      {
        id: "sp-gl-4",
        name: "Flex Glow Sign Board",
        slug: "flex-glow-sign-board",
        starting_price: 2199,
        thumbnail_url: "/assets/portfolio/Glow Sign Boards/glow-4.jpg",
      },
      {
        id: "sp-gl-5",
        name: "Acrylic Glow Sign Board",
        slug: "acrylic-glow-sign-board",
        starting_price: 3499,
        thumbnail_url: "/assets/portfolio/Glow Sign Boards/glow-5.jpg",
      },
      {
        id: "sp-gl-6",
        name: "Vinyl Glow Sign Board",
        slug: "vinyl-glow-sign-board",
        starting_price: 1999,
        thumbnail_url: "/assets/portfolio/Glow Sign Boards/glow-6.jpg",
      },
      {
        id: "sp-gl-7",
        name: "Outdoor Glow Sign Board",
        slug: "outdoor-glow-sign-board",
        starting_price: 4299,
        thumbnail_url: "/assets/portfolio/Glow Sign Boards/glow-7.jpg",
      },
    ],
  },
  {
    category: {
      id: "signage-flex-banner",
      slug: "flex-banners",
      name: "Flex Banner",
    },
    viewAllHref: "/services",
    products: [
      {
        id: "sp-fb-1",
        name: "Flex Banner",
        slug: "flex-banner",
        starting_price: 499,
        thumbnail_url: "https://printo-s3.dietpixels.net/Soldout/Large-Format-Banners_1781499483.jpg?quality=70&format=webp&w=1920",
      },
      {
        id: "sp-fb-2",
        name: "Vinyl Flex Banner",
        slug: "vinyl-flex-banner",
        starting_price: 599,
        thumbnail_url: "https://printpeek.in/images/large-format/flex-vinyl-banners.jpeg",
      },
      {
        id: "sp-fb-3",
        name: "Mesh Flex Banner",
        slug: "mesh-flex-banner",
        starting_price: 799,
        thumbnail_url: "https://cdn.printinglimitless.com/media/catalog/product/cache/product_page_image_large/650x650/f/a/fabric-mesh-banners_1.jpg",
      },
      {
        id: "sp-fb-7",
        name: "Event Flex Banner",
        slug: "event-flex-banner",
        starting_price: 699,
        thumbnail_url: "https://deq64r0ss2hgl.cloudfront.net/images/opt/products_gallery_images/flex-banners-12553475664391.jpg?v=7543",
      },
    ],
  },
].map((row) => ({ ...row, products: row.products.map(withDemoStats) }));
