import React, { useState, useEffect, useRef } from 'react';

/*
 * Using Brandfetch CDN + Wikipedia SVG as fallback sources
 * These are the most reliable free logo sources
 */
const CLIENTS = [
  // Col 1 — 3 cards
  { id: 1, col: 1, name: 'Grameenphone', logo: 'https://asset.brandfetch.io/idCCLNTRZC/idQ5UrjeSE.svg' },
  { id: 2, col: 1, name: 'Prex', logo: 'https://asset.brandfetch.io/idE5yrBOE5/idKH8Zf7r-.png' },
  { id: 3, col: 1, name: 'eZCash', logo: 'https://asset.brandfetch.io/idF7bYwsJq/idapIDDDLO.png' },

  // Col 2 — 4 cards
  { id: 4, col: 2, name: 'OTP Bank', logo: 'https://asset.brandfetch.io/id-s0qMgR0/id0haMk7uc.svg' },
  { id: 5, col: 2, name: 'Groupon', logo: 'https://asset.brandfetch.io/idMH7QOOBZ/idUv3cMaBt.svg' },
  { id: 6, col: 2, name: 'Shopify', logo: 'https://asset.brandfetch.io/idnrCPuv87/idmWbAULkB.svg' },
  { id: 7, col: 2, name: 'Up Bank', logo: 'https://asset.brandfetch.io/idHZ4qF9oF/id7hDjXoTW.png' },

  // Col 3 — 4 cards
  { id: 8, col: 3, name: 'eBay', logo: 'https://asset.brandfetch.io/idnrCPuv87/idYxBeiFRy.svg' },
  { id: 9, col: 3, name: 'Google', logo: 'https://asset.brandfetch.io/id6O2oGzv6/idm22mB7O5.svg' },
  { id: 10, col: 3, name: 'Lazada', logo: 'https://asset.brandfetch.io/id6HTUH3v8/idD1cGd7R4.svg' },
  { id: 11, col: 3, name: 'Newegg', logo: 'https://asset.brandfetch.io/idknSqTFXn/idkdZ4r0Ps.svg' },

  // Col 4 — 3 cards
  { id: 12, col: 4, name: 'Real', logo: 'https://asset.brandfetch.io/idw0_0UXWL/id0n10Q1M5.png' },
  { id: 13, col: 4, name: 'Coursera', logo: 'https://asset.brandfetch.io/id7BPnEVTX/iduXKTp0-f.svg' },
  { id: 14, col: 4, name: 'Meetup', logo: 'https://asset.brandfetch.io/idKmOO1pR8/id8bfrTmSe.svg' },

  // Col 5 — 3 cards (very faded)
  { id: 15, col: 5, name: 'Wish', logo: 'https://asset.brandfetch.io/idqkIgJPOr/idFNHn3ZnZ.svg' },
  { id: 16, col: 5, name: 'Coinbase', logo: 'https://asset.brandfetch.io/id-nyoAB_X/idgHnfLzN7.svg' },
  { id: 17, col: 5, name: 'Rakuten', logo: 'https://asset.brandfetch.io/idxTbBTuM0/idC6aTyFRq.svg' },
];

// Depth-fade from center outward, matching reference image
const COL_OPACITY = [0.5, 0.85, 1.0, 0.7, 0.22];

function LogoCard({ client, delay, opacity }) {
  const [errored, setErrored] = useState(false);

  // Fallback: generate colored initial avatar when logo fails
  const fallbackSrc = `https://placehold.co/120x120/160C33/A78BFA?text=${encodeURIComponent((client?.name || 'NA').slice(0, 2).toUpperCase())}&font=montserrat`;

  return (
    <div className="oc-card" style={{ '--d': delay, '--op': opacity }}>
      <img
        src={errored ? fallbackSrc : client.logo}
        alt={client.name}
        className="oc-img"
        onError={() => setErrored(true)}
        loading="lazy"
      />
    </div>
  );
}

export default function AdminAccessSection({ isPageTab = false, dynamicClients = null }) {
  const [visible, setVisible] = useState(isPageTab);
  const ref = useRef(null);

  useEffect(() => {
    if (visible) return; // Already visible (e.g. isPageTab is true)
    const el = ref.current;
    if (!el) return;
    // Trigger immediately if already visible (e.g. tab switch)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { setVisible(true); return; }

    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  let columns = [];
  if (dynamicClients && dynamicClients.length > 0) {
    const grouped = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    const apiBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : '';

    dynamicClients.forEach((client, idx) => {
      const col = (idx % 5) + 1;
      let logoUrl = client.logo_url || '';
      if (logoUrl && !logoUrl.startsWith('http')) logoUrl = `${apiBase}${logoUrl}`;

      grouped[col].push({
        id: client.id,
        col,
        name: client.name,
        logo: logoUrl || `https://placehold.co/120x120/160C33/A78BFA?text=${encodeURIComponent((client.name || '').slice(0, 2).toUpperCase())}&font=montserrat`
      });
    });
    columns = [1, 2, 3, 4, 5].map(c => grouped[c]);
  } else {
    columns = [1, 2, 3, 4, 5].map(c => CLIENTS.filter(x => x.col === c));
  }

  return (
    <div
      ref={ref}
      className={`oc-root${visible ? ' oc-in' : ''}${isPageTab ? ' oc-tab' : ''}`}
    >
      <style>{`
        /* ── Light-theme island regardless of page dark mode ── */
        .oc-root {
          width: 100%;
          padding: 20px 0 32px;
          display: flex;
          justify-content: center;
          overflow: hidden;
        }

        /* ── Grid container ─────────────────────────────────── */
        .oc-grid {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          width: 100%;
          max-width: 660px;
        }
        .oc-tab .oc-grid {
          max-width: 620px;
          gap: 18px;
          margin: 0 auto;
        }

        /* ── Column ─────────────────────────────────────────── */
        .oc-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex: 1;
          min-width: 0;
        }
        .oc-tab .oc-col { gap: 10px; }
        /* Even cols (2nd, 4th) shift UP to create alternating stagger */
        .oc-col:nth-child(2),
        .oc-col:nth-child(4) { margin-top: -28px; }

        /* ── Card ───────────────────────────────────────────── */
        .oc-card {
          width: 100%;
          aspect-ratio: 1 / 1;
          position: relative;
          overflow: hidden;
          background: var(--bg-card);
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 22%;
          /* Neumorphic shadow — looks great on both light and dark pages */
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-light);
          opacity: 0;
          transform: translateY(22px) scale(0.9);
          transition:
            opacity 0.55s cubic-bezier(0.16,1,0.3,1),
            transform 0.55s cubic-bezier(0.16,1,0.3,1),
            border-color 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          will-change: opacity, transform;
        }

        /* Reveal on viewport enter */
        .oc-in .oc-card {
          opacity: var(--op, 1);
          transform: translateY(0) scale(1);
          transition-delay: calc(var(--d, 0) * 1s);
        }

        .oc-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 20%, rgba(139, 92, 246, 0.15) 35%, rgba(139, 92, 246, 0.3) 50%, rgba(139, 92, 246, 0.15) 65%, transparent 80%);
          transform: translateX(-150%);
          transition: transform 0.6s cubic-bezier(0.2, 1, 0.2, 1);
          pointer-events: none;
          z-index: 1;
        }
        .oc-card:hover::before {
          transform: translateX(150%);
        }

        /* Hover lift */
        .oc-in .oc-card:hover {
          transform: translateY(-8px) scale(1.08) rotate(3deg) !important;
          box-shadow: var(--shadow-lg) !important;
          border-color: var(--border-glow) !important;
          opacity: 1 !important;
          z-index: 4;
        }

        /* Press */
        .oc-in .oc-card:active {
          transform: translateY(1px) scale(0.97) !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
        }

        /* ── Logo image ─────────────────────────────────────── */
        .oc-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          transition: transform 0.2s ease;
        }
        .oc-card:hover .oc-img { transform: scale(1.1); }

        /* ── Float animations ───────────────────────────────── */
        .oc-in .oc-col:nth-child(odd) {
          animation: ocA 8s ease-in-out infinite alternate;
        }
        .oc-in .oc-col:nth-child(even) {
          animation: ocB 9.5s ease-in-out 0.5s infinite alternate;
        }
        .oc-in .oc-col:nth-child(3) { animation-duration: 10s; animation-delay: 0.2s; }

        @keyframes ocA {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-14px); }
        }
        @keyframes ocB {
          /* Start from margin-top:-28px state */
          0%   { transform: translateY(-28px); }
          100% { transform: translateY(calc(-28px - 14px)); }
        }

        /* ── Responsive ─────────────────────────────────────── */
        @media (max-width: 700px) {
          .oc-col:nth-child(4), .oc-col:nth-child(5) { display: none; }
          .oc-in .oc-col { animation: none !important; transform: none !important; }
          .oc-col:nth-child(2), .oc-col:nth-child(4) { margin-top: 0; }
        }
        @media (max-width: 430px) {
          .oc-col:nth-child(3) { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .oc-card, .oc-col {
            transition: none !important;
            animation: none !important;
            transform: none !important;
            opacity: var(--op, 1) !important;
          }
        }
      `}</style>

      <div className="oc-grid">
        {columns.map((col, ci) => (
          <div className="oc-col" key={ci}>
            {col.map((client, ri) => (
              <LogoCard
                key={client.id}
                client={client}
                delay={ci * 0.1 + ri * 0.14}
                opacity={COL_OPACITY[ci]}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
