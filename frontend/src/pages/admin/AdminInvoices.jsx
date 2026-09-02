import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Receipt, FileText, Search, Filter, Download, PlusCircle,
  CheckCircle2, Clock, AlertCircle, ArrowUpDown, Calendar,
  Printer, ExternalLink, IndianRupee, ShieldCheck
} from 'lucide-react';
import { InvoicingStatusCard } from '../../components/admin/DashboardCharts';
import { formatPrice } from '../../utils/helpers';

const INITIAL_INVOICES = [
  { id: 'INV-2026-001', inquiryId: 'INQ-4821', customer: 'Aniket Krishna Patil', phone: '+91 98765 43210', service: 'Mascot 3D LED Board (4x3 ft)', amount: 14500, date: '2026-09-02', status: 'PAID', method: 'UPI / Razorpay', dueDate: '2026-09-02' },
  { id: 'INV-2026-002', inquiryId: 'INQ-4819', customer: 'Kiran Signage Corp', phone: '+91 94220 11223', service: 'Acrylic Letter Glow Sign (12x4 ft)', amount: 28000, date: '2026-09-01', status: 'PAID', method: 'Bank Transfer (NEFT)', dueDate: '2026-09-05' },
  { id: 'INV-2026-003', inquiryId: 'INQ-4815', customer: 'Mahesh Electronics', phone: '+91 98234 55667', service: 'UV Flex Banners High Quality (5x10)', amount: 8400, date: '2026-08-30', status: 'PENDING', method: 'Cash on Delivery', dueDate: '2026-09-06' },
  { id: 'INV-2026-004', inquiryId: 'INQ-4809', customer: 'Pooja Wellness Clinic', phone: '+91 97654 33221', service: 'Roll-Up Standees (Aluminium Base) x 4', amount: 9600, date: '2026-08-28', status: 'PAID', method: 'UPI (GPay)', dueDate: '2026-08-28' },
  { id: 'INV-2026-005', inquiryId: 'INQ-4802', customer: 'Nexus Cowork Pune', phone: '+91 98901 22334', service: 'Wayfinding Metal Letters & Door Signs', amount: 35000, date: '2026-08-25', status: 'PARTIAL', method: 'Cheque Deposit', dueDate: '2026-09-10' },
  { id: 'INV-2026-006', inquiryId: 'INQ-4798', customer: 'Shree Balaji Jewelers', phone: '+91 94231 88990', service: 'Gold Titanium Letter LED Board', amount: 48000, date: '2026-08-22', status: 'PAID', method: 'Bank Transfer (IMPS)', dueDate: '2026-08-22' },
  { id: 'INV-2026-007', inquiryId: 'INQ-4791', customer: 'Zenith Fitness Club', phone: '+91 98500 77889', service: 'Neon LED Acrylic Sign Board', amount: 16500, date: '2026-08-20', status: 'PAID', method: 'UPI', dueDate: '2026-08-20' },
  { id: 'INV-2026-008', inquiryId: 'INQ-4785', customer: 'Green Leaf Cafe & Bakery', phone: '+91 97643 11224', service: 'Menu Boards & Backlit Vinyl', amount: 12800, date: '2026-08-18', status: 'PENDING', method: 'UPI', dueDate: '2026-09-04' },
];

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    document.title = 'Invoices & Orders Ledger — Admin';
  }, []);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchSearch =
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.phone.includes(searchQuery);

      const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  // Totals
  const totalBilled = invoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === 'PENDING' || i.status === 'PARTIAL').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* ── Page Header ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit', letterSpacing: '-0.02em' }}>
              Invoices & Orders Ledger
            </h1>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: 999,
              background: 'var(--badge-bg-purple)',
              color: 'var(--brand-violet)',
              border: '1px solid var(--badge-border-purple)'
            }}>
              {invoices.length} Total Invoices
            </span>
          </div>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem' }}>
            Track billing histories, GST tax invoices, client settlements, and accounts receivable.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.print()}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Printer size={15} /> Print Ledger
          </button>
          <button
            onClick={() => alert('New invoice draft created!')}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <PlusCircle size={15} /> Create Invoice
          </button>
        </div>
      </div>

      {/* ── Billing Flow & Financial Summary ── */}
      <div style={{ marginBottom: '2rem' }}>
        <InvoicingStatusCard
          totalInvoiced={totalBilled}
          paidAmount={totalPaid}
          pendingAmount={totalPending}
          paidCount={invoices.filter(i => i.status === 'PAID').length}
          pendingCount={invoices.filter(i => i.status !== 'PAID').length}
          totalInvoices={invoices.length}
        />
      </div>

      {/* ── Filters & Search Toolbar ── */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 260 }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by Invoice #, Customer, Service..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-subtle)',
          padding: '0.25rem',
          borderRadius: 8,
          border: '1px solid var(--border-light)',
          gap: '0.2rem'
        }}>
          {[
            { id: 'ALL', label: 'All Invoices' },
            { id: 'PAID', label: 'Paid' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'PARTIAL', label: 'Partial' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                border: 'none',
                background: statusFilter === tab.id ? 'var(--brand-violet)' : 'transparent',
                color: statusFilter === tab.id ? '#FFFFFF' : 'var(--text-subtle)',
                fontWeight: statusFilter === tab.id ? 700 : 500,
                fontSize: '0.78rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Invoices Ledger Table ── */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Invoice #</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Customer Details</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Service / Product Item</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Amount (₹)</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Payment Method</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Date</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-subtle)' }}>
                    No invoices matching your search or filter.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => (
                  <tr
                    key={inv.id}
                    style={{ borderBottom: '1px solid var(--border-light)', transition: 'background-color 0.2s' }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--brand-violet)', fontFamily: 'Outfit' }}>
                      {inv.id}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{inv.customer}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{inv.phone}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-main)', maxWidth: 240 }}>
                      <div style={{ fontWeight: 600 }}>{inv.service}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--brand-violet)', fontWeight: 600 }}>Ref: {inv.inquiryId}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)', fontSize: '1rem' }}>
                      ₹{inv.amount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: 999,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: inv.status === 'PAID' ? 'rgba(16, 185, 129, 0.12)' : inv.status === 'PARTIAL' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        color: inv.status === 'PAID' ? '#10B981' : inv.status === 'PARTIAL' ? '#8B5CF6' : '#F59E0B',
                        border: `1px solid ${inv.status === 'PAID' ? 'rgba(16, 185, 129, 0.25)' : inv.status === 'PARTIAL' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
                      }}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                      {inv.method}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                      {inv.date}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        style={{
                          border: 'none',
                          background: 'var(--bg-subtle)',
                          color: 'var(--brand-violet)',
                          padding: '0.4rem 0.75rem',
                          borderRadius: 6,
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <FileText size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Invoice Detail Modal ── */}
      {selectedInvoice && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 520, padding: '2rem', position: 'relative', animation: 'fadeInUp 0.25s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--brand-violet)', fontWeight: 700, textTransform: 'uppercase' }}>Tax Invoice</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)' }}>{selectedInvoice.id}</h2>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                style={{ border: 'none', background: 'var(--bg-subtle)', color: 'var(--text-main)', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Billed To:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{selectedInvoice.customer}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Phone:</span>
                <span style={{ color: 'var(--text-main)' }}>{selectedInvoice.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Item Description:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)', textAlign: 'right', maxWidth: 260 }}>{selectedInvoice.service}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Payment Status:</span>
                <span style={{ fontWeight: 700, color: selectedInvoice.status === 'PAID' ? '#10B981' : '#F59E0B' }}>{selectedInvoice.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Payment Mode:</span>
                <span style={{ color: 'var(--text-main)' }}>{selectedInvoice.method}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-light)', paddingTop: '0.75rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>Total Amount:</span>
                <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--brand-violet)', fontFamily: 'Outfit' }}>
                  ₹{selectedInvoice.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                Print / Download PDF
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="btn btn-primary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
