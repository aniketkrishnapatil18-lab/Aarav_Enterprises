import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, IndianRupee, Layers, FileText, ArrowUpRight } from 'lucide-react';

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeDonutSlice(x, y, radius, innerRadius, startAngle, endAngle) {
  if (endAngle - startAngle >= 359.99) {
    endAngle = startAngle + 359.99;
  }
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'L', endInner.x, endInner.y,
    'A', innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
    'Z',
  ].join(' ');
}

// ── 1. Revenue & Order Volume Bar Graph ──────────────────────────────
export function RevenueOrderBarChart({ data = [], range = 'yearly' }) {
  const [activeTab, setActiveTab] = useState('revenue'); // 'revenue' | 'orders' | 'both'
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const maxRevenue = Math.max(...data.map(d => d.revenue || 0), 10000);
  const maxOrders = Math.max(...data.map(d => d.orders || 0), 10);

  const totalRevenue = data.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
  const totalOrders = data.reduce((acc, curr) => acc + (curr.orders || 0), 0);
  const avgMonthlyRev = data.length > 0 ? Math.round(totalRevenue / data.length) : 0;

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header with Title & Metric Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit' }}>
              Revenue & Orders Growth
            </h3>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.2rem 0.55rem',
              borderRadius: 999,
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#10B981',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
            }}>
              <ArrowUpRight size={12} /> +18.4% YoY
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            Track total revenue performance and monthly order fulfillment trend
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-subtle)',
          padding: '0.25rem',
          borderRadius: 10,
          border: '1px solid var(--border-light)',
          gap: '0.2rem'
        }}>
          {[
            { id: 'revenue', label: 'Revenue (₹)' },
            { id: 'orders', label: 'Orders' },
            { id: 'both', label: 'Combined' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                border: 'none',
                background: activeTab === tab.id ? 'var(--brand-violet)' : 'transparent',
                color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-subtle)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.78rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 7,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Highlights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: 'var(--bg-subtle)',
        borderRadius: 10,
        marginBottom: '1.5rem',
        border: '1px solid var(--border-light)',
      }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600 }}>
            Period Revenue
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-violet)', fontFamily: 'Outfit' }}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Orders
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit' }}>
            {totalOrders} Orders
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600 }}>
            Monthly Avg
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10B981', fontFamily: 'Outfit' }}>
            ₹{avgMonthlyRev.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Interactive Bar Chart Canvas */}
      <div style={{ flex: 1, minHeight: 240, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
        {/* Background Gridlines */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          pointerEvents: 'none',
          opacity: 0.15,
          borderBottom: '1px solid var(--text-subtle)'
        }}>
          <div style={{ borderTop: '1px dashed var(--text-subtle)' }} />
          <div style={{ borderTop: '1px dashed var(--text-subtle)' }} />
          <div style={{ borderTop: '1px dashed var(--text-subtle)' }} />
        </div>

        {/* Bars Container */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '0.5rem',
          height: 200,
          paddingTop: 20,
          zIndex: 2,
        }}>
          {data.map((item, idx) => {
            const revHeightPct = Math.max((item.revenue / maxRevenue) * 100, 4);
            const ordHeightPct = Math.max((item.orders / maxOrders) * 100, 4);
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    bottom: '105%',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-glow)',
                    boxShadow: 'var(--shadow-lg)',
                    borderRadius: 8,
                    padding: '0.5rem 0.75rem',
                    zIndex: 20,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    textAlign: 'center',
                    animation: 'fadeInUp 0.15s ease',
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 2 }}>
                      {item.label}
                    </div>
                    {(activeTab === 'revenue' || activeTab === 'both') && (
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--brand-violet)', fontFamily: 'Outfit' }}>
                        ₹{item.revenue.toLocaleString('en-IN')}
                      </div>
                    )}
                    {(activeTab === 'orders' || activeTab === 'both') && (
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3B82F6' }}>
                        {item.orders} Orders
                      </div>
                    )}
                  </div>
                )}

                {/* Bars */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, width: '100%', maxWidth: 36, height: '100%', justifyContent: 'center' }}>
                  {/* Revenue Bar */}
                  {(activeTab === 'revenue' || activeTab === 'both') && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${revHeightPct}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.04, ease: 'easeOut' }}
                      style={{
                        flex: 1,
                        background: isHovered
                          ? 'linear-gradient(180deg, #9333EA 0%, #EC4899 100%)'
                          : 'linear-gradient(180deg, #7C3AED 0%, #DB2777 100%)',
                        borderRadius: '6px 6px 2px 2px',
                        boxShadow: isHovered ? '0 0 12px rgba(124, 58, 237, 0.6)' : 'none',
                        transition: 'box-shadow 0.2s, background 0.2s',
                        minWidth: 8,
                      }}
                    />
                  )}

                  {/* Orders Bar */}
                  {(activeTab === 'orders' || activeTab === 'both') && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${ordHeightPct}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.04 + 0.1, ease: 'easeOut' }}
                      style={{
                        flex: 1,
                        background: isHovered
                          ? 'linear-gradient(180deg, #38BDF8 0%, #2563EB 100%)'
                          : 'linear-gradient(180deg, #0284C7 0%, #1D4ED8 100%)',
                        borderRadius: '6px 6px 2px 2px',
                        boxShadow: isHovered ? '0 0 12px rgba(56, 189, 248, 0.6)' : 'none',
                        transition: 'box-shadow 0.2s, background 0.2s',
                        minWidth: 8,
                      }}
                    />
                  )}
                </div>

                {/* X-Axis Label */}
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.72rem',
                  fontWeight: isHovered ? 700 : 500,
                  color: isHovered ? 'var(--brand-violet)' : 'var(--text-subtle)',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s',
                }}>
                  {item.shortLabel || item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── 2. Category Revenue Pie / Donut Chart ───────────────────────────
export function CategoryRevenuePieChart({ data = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const totalRevenue = data.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);

  let currentAngle = 0;
  const slices = data.map((item, idx) => {
    const rev = Number(item.revenue) || 0;
    const percentage = totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0;
    const angle = totalRevenue > 0 ? (rev / totalRevenue) * 360 : 0;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;

    return {
      ...item,
      revenue: rev,
      percentage,
      startAngle,
      endAngle,
      idx,
    };
  });

  const activeItem = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit', marginBottom: '0.2rem' }}>
            Revenue by Service Category
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            Financial contribution across signage, LED & printing verticals
          </p>
        </div>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '0.25rem 0.65rem',
          borderRadius: 999,
          background: 'var(--badge-bg-purple)',
          color: 'var(--brand-violet)',
          border: '1px solid var(--badge-border-purple)'
        }}>
          {data.length} Categories
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', alignItems: 'center', flex: 1 }}>
        {/* SVG Donut */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg
            viewBox="0 0 200 200"
            style={{ width: '100%', maxWidth: 210, height: 'auto', overflow: 'visible' }}
          >
            <defs>
              <filter id="cat-pie-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {slices.map((slice, i) => {
              if (slice.revenue <= 0) return null;
              const isHovered = hoveredIdx === i;
              const r = isHovered ? 88 : 82;
              const innerR = isHovered ? 52 : 54;
              const path = describeDonutSlice(100, 100, r, innerR, slice.startAngle, slice.endAngle);

              return (
                <path
                  key={i}
                  d={path}
                  fill={slice.color || '#7C3AED'}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: hoveredIdx === null || isHovered ? 1 : 0.4,
                    filter: isHovered ? 'url(#cat-pie-glow)' : 'none',
                  }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Center Summary */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {activeItem ? activeItem.category : 'Total Revenue'}
            </span>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)', lineHeight: 1.1 }}>
              ₹{((activeItem ? activeItem.revenue : totalRevenue) / 1000).toFixed(1)}k
            </span>
            {activeItem && (
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: activeItem.color, marginTop: 2 }}>
                {activeItem.percentage.toFixed(1)}% · {activeItem.orders} orders
              </span>
            )}
          </div>
        </div>

        {/* Legend with Revenue Figures */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {slices.map((item, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.4rem 0.6rem',
                  borderRadius: 8,
                  background: isHovered ? 'var(--bg-subtle)' : 'transparent',
                  border: isHovered ? '1px solid var(--border-glow)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    width: 9,
                    height: 9,
                    borderRadius: 3,
                    background: item.color,
                    boxShadow: isHovered ? `0 0 8px ${item.color}` : 'none',
                  }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: isHovered ? 700 : 600, color: 'var(--text-main)' }}>
                      {item.category}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>
                      {item.orders} orders ({item.percentage.toFixed(0)}%)
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--brand-violet)', fontFamily: 'Outfit' }}>
                    ₹{item.revenue.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── 3. Invoice & Billing Status Breakdown ────────────────────────────
export function InvoicingStatusCard({
  totalInvoiced = 0,
  paidAmount = 0,
  pendingAmount = 0,
  paidCount = 0,
  pendingCount = 0,
  totalInvoices = 0,
}) {
  const paidPct = totalInvoiced > 0 ? (paidAmount / totalInvoiced) * 100 : 0;
  const pendingPct = totalInvoiced > 0 ? (pendingAmount / totalInvoiced) * 100 : 0;

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit', marginBottom: '0.2rem' }}>
            Invoicing & Payment Flow
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            Breakdown of collected vs pending client payments
          </p>
        </div>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '0.25rem 0.65rem',
          borderRadius: 999,
          background: 'rgba(16, 185, 129, 0.12)',
          color: '#10B981',
          border: '1px solid rgba(16, 185, 129, 0.25)'
        }}>
          {paidPct.toFixed(1)}% Collected
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{
        height: 14,
        width: '100%',
        background: 'var(--bg-subtle)',
        borderRadius: 999,
        overflow: 'hidden',
        border: '1px solid var(--border-light)',
        display: 'flex',
        marginBottom: '1.25rem',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${paidPct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #10B981, #059669)' }}
          title={`Paid: ₹${paidAmount.toLocaleString('en-IN')}`}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pendingPct}%` }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #F59E0B, #D97706)' }}
          title={`Pending: ₹${pendingAmount.toLocaleString('en-IN')}`}
        />
      </div>

      {/* Summary Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 8, border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600 }}>Total Billed</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit' }}>
            ₹{totalInvoiced.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: 2 }}>
            {totalInvoices} Invoices
          </div>
        </div>

        <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 8, border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <div style={{ fontSize: '0.7rem', color: '#10B981', textTransform: 'uppercase', fontWeight: 700 }}>Paid Amount</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10B981', fontFamily: 'Outfit' }}>
            ₹{paidAmount.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#10B981', marginTop: 2 }}>
            {paidCount} Settled ({paidPct.toFixed(0)}%)
          </div>
        </div>

        <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.08)', borderRadius: 8, border: '1px solid rgba(245, 158, 11, 0.25)' }}>
          <div style={{ fontSize: '0.7rem', color: '#F59E0B', textTransform: 'uppercase', fontWeight: 700 }}>Pending</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F59E0B', fontFamily: 'Outfit' }}>
            ₹{pendingAmount.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#F59E0B', marginTop: 2 }}>
            {pendingCount} Awaiting
          </div>
        </div>
      </div>
    </div>
  );
}
