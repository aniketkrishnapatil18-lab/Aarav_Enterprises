import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee, TrendingUp, BarChart3, PieChart, Download,
  Printer, Calendar, ArrowUpRight, ArrowDownRight, ShieldCheck,
  CreditCard, Wallet, Building2, Users, FileText, CheckCircle,
  Clock, AlertCircle, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import { reportAPI } from '../../services/api';
import { formatPrice } from '../../utils/helpers';
import { RevenueOrderBarChart, CategoryRevenuePieChart, InvoicingStatusCard } from '../../components/admin/DashboardCharts';

// ── Financial Data Mock & Model ─────────────────────────────
const FISCAL_MONTHS = [
  { month: 'Apr 2025', short: 'Apr', gross: 49800, collected: 46000, pending: 3800, orders: 14, tax: 5976 },
  { month: 'May 2025', short: 'May', gross: 61400, collected: 56000, pending: 5400, orders: 18, tax: 7368 },
  { month: 'Jun 2025', short: 'Jun', gross: 58000, collected: 52500, pending: 5500, orders: 17, tax: 6960 },
  { month: 'Jul 2025', short: 'Jul', gross: 68500, collected: 64000, pending: 4500, orders: 20, tax: 8220 },
  { month: 'Aug 2025', short: 'Aug', gross: 74200, collected: 68000, pending: 6200, orders: 22, tax: 8904 },
  { month: 'Sep 2025', short: 'Sep', gross: 81500, collected: 75000, pending: 6500, orders: 24, tax: 9780 },
  { month: 'Oct 2025', short: 'Oct', gross: 89000, collected: 82000, pending: 7000, orders: 26, tax: 10680 },
  { month: 'Nov 2025', short: 'Nov', gross: 95400, collected: 88500, pending: 6900, orders: 28, tax: 11448 },
  { month: 'Dec 2025', short: 'Dec', gross: 104500, collected: 96000, pending: 8500, orders: 31, tax: 12540 },
  { month: 'Jan 2026', short: 'Jan', gross: 38500, collected: 36000, pending: 2500, orders: 11, tax: 4620 },
  { month: 'Feb 2026', short: 'Feb', gross: 44200, collected: 41000, pending: 3200, orders: 13, tax: 5304 },
  { month: 'Mar 2026', short: 'Mar', gross: 52000, collected: 48000, pending: 4000, orders: 16, tax: 6240 },
];

const CATEGORY_CONTRIBUTION = [
  { category: 'LED Sign Boards & Acrylic Letters', revenue: 265000, orders: 48, percentage: 39.1, color: '#8B5CF6', margin: '42%' },
  { category: 'Acrylic Sign Boards & Glow Signs', revenue: 178000, orders: 36, percentage: 26.2, color: '#EC4899', margin: '38%' },
  { category: 'Large Format UV Printing & Flex', revenue: 112000, orders: 29, percentage: 16.5, color: '#3B82F6', margin: '34%' },
  { category: 'Roll-Up Standees & Promo Canopies', revenue: 74500, orders: 22, percentage: 11.0, color: '#10B981', margin: '45%' },
  { category: 'Logo Design & Brand Identity', revenue: 48500, orders: 13, percentage: 7.2, color: '#F59E0B', margin: '68%' },
];

const PAYMENT_METHODS = [
  { method: 'UPI / Razorpay / QR Code', amount: 366120, share: 54, count: 82, color: '#10B981', icon: Wallet },
  { method: 'Bank Transfer (NEFT / RTGS)', amount: 216960, share: 32, count: 28, color: '#3B82F6', icon: Building2 },
  { method: 'Cheque Deposit', amount: 61020, share: 9, count: 9, color: '#8B5CF6', icon: CreditCard },
  { method: 'Cash on Delivery / Pickup', amount: 33900, share: 5, count: 5, color: '#F59E0B', icon: IndianRupee },
];

const TOP_CLIENTS = [
  { name: 'Kiran Signage Corp', business: 'Commercial Retail Chains', orders: 8, totalSpend: 98000, status: 'Active VIP', lastOrder: '2026-09-01' },
  { name: 'Nexus Cowork Pune', business: 'Coworking & IT Spaces', orders: 6, totalSpend: 78500, status: 'Active VIP', lastOrder: '2026-08-25' },
  { name: 'Shree Balaji Jewelers', business: 'Luxury Jewelry Showroom', orders: 4, totalSpend: 62000, status: 'Regular', lastOrder: '2026-08-22' },
  { name: 'Aniket Krishna Patil', business: 'Creative Studio', orders: 3, totalSpend: 34500, status: 'Regular', lastOrder: '2026-09-02' },
  { name: 'Pooja Wellness Clinic', business: 'Healthcare & Wellness', orders: 5, totalSpend: 28600, status: 'Regular', lastOrder: '2026-08-28' },
  { name: 'Zenith Fitness Club', business: 'Gym & Fitness Centers', orders: 2, totalSpend: 24500, status: 'Regular', lastOrder: '2026-08-20' },
];

export default function AdminReports() {
  const [timeRange, setTimeRange] = useState('fiscal_year'); // 'this_month' | 'last_month' | 'quarter' | 'fiscal_year' | 'custom'
  const [customStart, setCustomStart] = useState('2025-04-01');
  const [customEnd, setCustomEnd] = useState('2026-03-31');
  const [activeTab, setActiveTab] = useState('monthly_ledger'); // 'monthly_ledger' | 'top_clients'

  useEffect(() => {
    document.title = 'Total Revenue & Financial Analytics — Aarav Enterprises';
  }, []);

  // Aggregated totals
  const totalGrossRevenue = FISCAL_MONTHS.reduce((sum, m) => sum + m.gross, 0);
  const totalCollected = FISCAL_MONTHS.reduce((sum, m) => sum + m.collected, 0);
  const totalPending = FISCAL_MONTHS.reduce((sum, m) => sum + m.pending, 0);
  const totalTaxCollected = FISCAL_MONTHS.reduce((sum, m) => sum + m.tax, 0);
  const totalOrders = FISCAL_MONTHS.reduce((sum, m) => sum + m.orders, 0);
  const avgOrderValue = Math.round(totalGrossRevenue / totalOrders);

  // Bar Chart Data format
  const chartData = useMemo(() => {
    return FISCAL_MONTHS.map(m => ({
      label: m.month,
      shortLabel: m.short,
      revenue: m.gross,
      orders: m.orders,
    }));
  }, []);

  return (
    <div style={{ paddingBottom: '3.5rem' }}>
      {/* ── Page Header & Period Selector ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit', letterSpacing: '-0.02em' }}>
              Total Revenue & Financial Analytics
            </h1>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '0.2rem 0.65rem',
              borderRadius: 999,
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'rgba(124, 58, 237, 0.12)',
              color: 'var(--brand-violet)',
              border: '1px solid var(--badge-border-purple)'
            }}>
              <Sparkles size={12} color="var(--brand-violet)" /> FY 2025–26
            </span>
          </div>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
            Comprehensive revenue performance, realized cash collections, service margins, and customer lifetime value.
          </p>
        </div>

        {/* Action Buttons & Period Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            padding: '0.25rem',
            borderRadius: 10,
            boxShadow: 'var(--shadow-sm)',
            gap: '0.2rem'
          }}>
            {[
              { id: 'this_month', label: 'This Month' },
              { id: 'quarter', label: 'This Quarter (Q4)' },
              { id: 'fiscal_year', label: 'Fiscal Year 2025-26' },
              { id: 'custom', label: 'Custom' },
            ].map(pill => (
              <button
                key={pill.id}
                onClick={() => setTimeRange(pill.id)}
                style={{
                  border: 'none',
                  background: timeRange === pill.id ? 'var(--brand-violet)' : 'transparent',
                  color: timeRange === pill.id ? '#FFFFFF' : 'var(--text-subtle)',
                  fontWeight: timeRange === pill.id ? 700 : 500,
                  fontSize: '0.8rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Printer size={15} /> Print Statement
          </button>
        </div>
      </div>

      {/* ── Executive Financial KPI Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* 1. Gross Revenue */}
        <div className="glass-card" style={{ padding: '1.35rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IndianRupee size={22} color="var(--brand-violet)" />
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 999, background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <ArrowUpRight size={12} /> +18.4% YoY
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
            Gross Billed Revenue
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)', lineHeight: 1.15 }}>
            ₹{(totalGrossRevenue / 100000).toFixed(2)} Lakhs
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
            Total billed across {totalOrders} orders
          </div>
        </div>

        {/* 2. Realized Collections */}
        <div className="glass-card" style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={22} color="#10B981" />
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 999, background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
              {((totalCollected / totalGrossRevenue) * 100).toFixed(1)}% Realized
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
            Realized Collections
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit', color: '#10B981', lineHeight: 1.15 }}>
            ₹{(totalCollected / 100000).toFixed(2)} Lakhs
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
            Net received in bank & UPI
          </div>
        </div>

        {/* 3. Pending Receivables */}
        <div className="glass-card" style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={22} color="#F59E0B" />
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 999, background: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B' }}>
              {((totalPending / totalGrossRevenue) * 100).toFixed(1)}% Pending
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
            Accounts Receivable
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit', color: '#F59E0B', lineHeight: 1.15 }}>
            ₹{(totalPending / 1000).toFixed(1)}k
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
            Awaiting client settlement
          </div>
        </div>

        {/* 4. Average Order Value */}
        <div className="glass-card" style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={22} color="#3B82F6" />
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 999, background: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6' }}>
              +6.4% AOV
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
            Avg. Order Value (AOV)
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)', lineHeight: 1.15 }}>
            ₹{avgOrderValue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
            Across Signage & Printing
          </div>
        </div>

        {/* 5. GST / Tax Summary */}
        <div className="glass-card" style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} color="#EC4899" />
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 999, background: 'rgba(236, 72, 153, 0.12)', color: '#EC4899' }}>
              GST Invoices
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
            GST Tax Collected
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit', color: '#EC4899', lineHeight: 1.15 }}>
            ₹{(totalTaxCollected / 1000).toFixed(1)}k
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
            18% Output GST recorded
          </div>
        </div>
      </div>

      {/* ── Visual Analytics Row: Bar Graph & Category Donut ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Left: Monthly Revenue & Orders Bar Graph */}
        <RevenueOrderBarChart
          data={chartData}
          range={timeRange}
        />

        {/* Right: Revenue by Category Donut Chart */}
        <CategoryRevenuePieChart
          data={CATEGORY_CONTRIBUTION}
        />
      </div>

      {/* ── Payment Channels & Service Margins Row ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Payment Methods */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit' }}>
                Payment Method Breakdown
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                Client settlement channels and transaction volumes
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: 999, background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
              4 Gateways
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {PAYMENT_METHODS.map((pm, i) => {
              const Icon = pm.icon;
              return (
                <div key={i} style={{ padding: '0.75rem 1rem', borderRadius: 10, background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${pm.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={16} color={pm.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>{pm.method}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{pm.count} transactions</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)' }}>
                        ₹{pm.amount.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: pm.color }}>
                        {pm.share}% share
                      </div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: 6, width: '100%', background: 'var(--border-light)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pm.share}%`, background: pm.color, borderRadius: 999 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Gross Margins & Profitability */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit' }}>
                Service Margins & Share
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                Estimated gross profit margins by service line
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: 999, background: 'var(--badge-bg-purple)', color: 'var(--brand-violet)', border: '1px solid var(--badge-border-purple)' }}>
              Avg. 43% Margin
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {CATEGORY_CONTRIBUTION.map((cat, i) => (
              <div key={i} style={{ padding: '0.75rem 1rem', borderRadius: 10, background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {cat.category}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: 2 }}>
                    {cat.orders} orders · {cat.percentage}% total volume
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--brand-violet)' }}>
                    ₹{cat.revenue.toLocaleString('en-IN')}
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: 4,
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#10B981',
                    display: 'inline-block',
                    marginTop: 2
                  }}>
                    {cat.margin} Gross Margin
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Financial Ledger & Top Accounts ── */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        {/* Switcher & Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit' }}>
              Financial Intelligence & Client Accounts
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              Detailed audit of monthly billing cycles and corporate account lifetime values
            </p>
          </div>

          <div style={{ display: 'flex', background: 'var(--bg-subtle)', padding: '0.2rem', borderRadius: 8, border: '1px solid var(--border-light)', gap: '0.2rem' }}>
            <button
              onClick={() => setActiveTab('monthly_ledger')}
              style={{
                border: 'none',
                background: activeTab === 'monthly_ledger' ? 'var(--brand-violet)' : 'transparent',
                color: activeTab === 'monthly_ledger' ? '#FFFFFF' : 'var(--text-subtle)',
                fontWeight: activeTab === 'monthly_ledger' ? 700 : 500,
                fontSize: '0.8rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Monthly Revenue Ledger (12 Months)
            </button>
            <button
              onClick={() => setActiveTab('top_clients')}
              style={{
                border: 'none',
                background: activeTab === 'top_clients' ? 'var(--brand-violet)' : 'transparent',
                color: activeTab === 'top_clients' ? '#FFFFFF' : 'var(--text-subtle)',
                fontWeight: activeTab === 'top_clients' ? 700 : 500,
                fontSize: '0.8rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Top Corporate Accounts ({TOP_CLIENTS.length})
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          {activeTab === 'monthly_ledger' ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Month Period</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Total Orders</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Gross Billed (₹)</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Collected (₹)</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Pending (₹)</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>GST Tax (18%)</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem', textAlign: 'right' }}>Realization Rate</th>
                </tr>
              </thead>
              <tbody>
                {FISCAL_MONTHS.map((m, idx) => {
                  const rate = ((m.collected / m.gross) * 100).toFixed(0);
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background-color 0.2s' }} className="table-row-hover">
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {m.month}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-subtle)' }}>
                        {m.orders} Orders
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--brand-violet)', fontSize: '0.95rem' }}>
                        ₹{m.gross.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#10B981' }}>
                        ₹{m.collected.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#F59E0B' }}>
                        ₹{m.pending.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-subtle)' }}>
                        ₹{m.tax.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <span style={{
                          padding: '0.2rem 0.55rem',
                          borderRadius: 999,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: Number(rate) >= 90 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          color: Number(rate) >= 90 ? '#10B981' : '#F59E0B',
                        }}>
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Client Name</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Industry / Vertical</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Lifetime Orders</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Gross Spend (₹)</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Account Tier</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem', textAlign: 'right' }}>Last Transaction</th>
                </tr>
              </thead>
              <tbody>
                {TOP_CLIENTS.map((client, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background-color 0.2s' }} className="table-row-hover">
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {client.name}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-subtle)' }}>
                      {client.business}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-subtle)' }}>
                      {client.orders} Orders
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--brand-violet)', fontSize: '1rem' }}>
                      ₹{client.totalSpend.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: 999,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: client.status.includes('VIP') ? 'rgba(124, 58, 237, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                        color: client.status.includes('VIP') ? 'var(--brand-violet)' : '#10B981',
                        border: client.status.includes('VIP') ? '1px solid var(--badge-border-purple)' : '1px solid rgba(16, 185, 129, 0.25)',
                      }}>
                        {client.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-subtle)', textAlign: 'right' }}>
                      {client.lastOrder}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
