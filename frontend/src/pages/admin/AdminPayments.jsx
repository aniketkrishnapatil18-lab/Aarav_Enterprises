import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard, IndianRupee, Download, Printer, Search, Filter,
  CheckCircle2, Clock, AlertTriangle, ArrowUpDown, FileSpreadsheet,
  FileText, ExternalLink, Wallet, Building2, Check, X, ShieldCheck,
  Receipt, ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const PAYMENTS_DATA = [
  {
    id: 'TXN-2026-0891',
    customerName: 'Aniket Krishna Patil',
    phone: '+91 97635 30208',
    designName: '3D LED Acrylic Sign Board (4x3 ft)',
    quantity: '1 Unit',
    basePrice: 12288,
    gstAmount: 2212,
    totalAmount: 14500,
    paymentMode: 'UPI / GPay',
    transactionId: 'UPI/329482910492/AXIS',
    status: 'PAID',
    date: '2026-09-02 15:45',
    invoiceRef: 'INV-2026-001',
  },
  {
    id: 'TXN-2026-0890',
    customerName: 'Kiran Signage Corp',
    phone: '+91 94220 11223',
    designName: 'Acrylic Letter Glow Sign (12x4 ft)',
    quantity: '1 Unit',
    basePrice: 23729,
    gstAmount: 4271,
    totalAmount: 28000,
    paymentMode: 'Bank Transfer (NEFT)',
    transactionId: 'NEFT/HDFC000128/948291',
    status: 'PAID',
    date: '2026-09-01 11:20',
    invoiceRef: 'INV-2026-002',
  },
  {
    id: 'TXN-2026-0889',
    customerName: 'Mahesh Electronics',
    phone: '+91 98234 55667',
    designName: 'High-Res UV Flex Banners (5x10 ft)',
    quantity: '3 Units',
    basePrice: 7119,
    gstAmount: 1281,
    totalAmount: 8400,
    paymentMode: 'Cash on Delivery',
    transactionId: 'CASH-REC-0889',
    status: 'PENDING',
    date: '2026-08-30 16:10',
    invoiceRef: 'INV-2026-003',
  },
  {
    id: 'TXN-2026-0888',
    customerName: 'Pooja Wellness Clinic',
    phone: '+91 97654 33221',
    designName: 'Roll-Up Standees Aluminium Base',
    quantity: '4 Units',
    basePrice: 8136,
    gstAmount: 1464,
    totalAmount: 9600,
    paymentMode: 'UPI / PhonePe',
    transactionId: 'UPI/328901238491/SBI',
    status: 'PAID',
    date: '2026-08-28 14:05',
    invoiceRef: 'INV-2026-004',
  },
  {
    id: 'TXN-2026-0887',
    customerName: 'Nexus Cowork Pune',
    phone: '+91 98901 22334',
    designName: 'Wayfinding Metal Letters & Door Signs',
    quantity: '12 Units',
    basePrice: 29661,
    gstAmount: 5339,
    totalAmount: 35000,
    paymentMode: 'Cheque Deposit',
    transactionId: 'CHQ#004821/ICICI',
    status: 'PARTIAL',
    date: '2026-08-25 10:30',
    invoiceRef: 'INV-2026-005',
  },
  {
    id: 'TXN-2026-0886',
    customerName: 'Shree Balaji Jewelers',
    phone: '+91 94231 88990',
    designName: 'Gold Titanium Letter LED Board (15x3 ft)',
    quantity: '1 Unit',
    basePrice: 40678,
    gstAmount: 7322,
    totalAmount: 48000,
    paymentMode: 'Bank Transfer (IMPS)',
    transactionId: 'IMPS/327891049281/KOTAK',
    status: 'PAID',
    date: '2026-08-22 17:15',
    invoiceRef: 'INV-2026-006',
  },
  {
    id: 'TXN-2026-0885',
    customerName: 'Zenith Fitness Club',
    phone: '+91 98500 77889',
    designName: 'Neon LED Acrylic Sign Board',
    quantity: '2 Units',
    basePrice: 13983,
    gstAmount: 2517,
    totalAmount: 16500,
    paymentMode: 'UPI / Paytm',
    transactionId: 'UPI/327102938471/PAYTM',
    status: 'PAID',
    date: '2026-08-20 12:40',
    invoiceRef: 'INV-2026-007',
  },
  {
    id: 'TXN-2026-0884',
    customerName: 'Green Leaf Cafe & Bakery',
    phone: '+91 97643 11224',
    designName: 'Menu Display Boards & Backlit Vinyl',
    quantity: '6 Units',
    basePrice: 10847,
    gstAmount: 1953,
    totalAmount: 12800,
    paymentMode: 'UPI / GPay',
    transactionId: 'UPI/326891029384/HDFC',
    status: 'PENDING',
    date: '2026-08-18 19:20',
    invoiceRef: 'INV-2026-008',
  },
];

export default function AdminPayments() {
  const [payments, setPayments] = useState(PAYMENTS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    document.title = 'Payments & Transactions Ledger — Admin';
  }, []);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchSearch =
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.designName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery) ||
        p.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchMode =
        modeFilter === 'ALL' ||
        (modeFilter === 'UPI' && p.paymentMode.includes('UPI')) ||
        (modeFilter === 'BANK' && p.paymentMode.includes('Bank')) ||
        (modeFilter === 'CHEQUE' && p.paymentMode.includes('Cheque')) ||
        (modeFilter === 'CASH' && p.paymentMode.includes('Cash'));

      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;

      return matchSearch && matchMode && matchStatus;
    });
  }, [payments, searchQuery, modeFilter, statusFilter]);

  // Aggregated Totals
  const totalGross = filteredPayments.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalBase = filteredPayments.reduce((sum, p) => sum + p.basePrice, 0);
  const totalGST = filteredPayments.reduce((sum, p) => sum + p.gstAmount, 0);
  const totalPaid = filteredPayments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.totalAmount, 0);
  const totalPending = filteredPayments.filter(p => p.status !== 'PAID').reduce((sum, p) => sum + p.totalAmount, 0);

  // Export to Excel (CSV)
  function exportToCSV() {
    const headers = [
      'Transaction ID',
      'Invoice Ref',
      'Customer Name',
      'Phone',
      'Design / Service Name',
      'Quantity',
      'Base Price (INR)',
      'GST 18% (INR)',
      'Total Amount (INR)',
      'Payment Mode',
      'UPI Ref / Transaction ID',
      'Payment Status',
      'Date & Time',
    ];

    const rows = filteredPayments.map(p => [
      p.id,
      p.invoiceRef,
      `"${p.customerName}"`,
      p.phone,
      `"${p.designName}"`,
      `"${p.quantity}"`,
      p.basePrice,
      p.gstAmount,
      p.totalAmount,
      `"${p.paymentMode}"`,
      `"${p.transactionId}"`,
      p.status,
      `"${p.date}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Aarav_Enterprises_Payments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Excel CSV exported successfully!');
  }

  return (
    <div style={{ paddingBottom: '4rem' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit', letterSpacing: '-0.02em', margin: 0 }}>
              Payments & Transactions Ledger
            </h1>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: 999,
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#10B981',
              border: '1px solid rgba(16, 185, 129, 0.25)'
            }}>
              GST Ready 18%
            </span>
          </div>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem' }}>
            Track client payments, online UPI reference numbers, GST breakdowns, and payment gateway settlements.
          </p>
        </div>

        {/* Export Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={exportToCSV}
            className="btn btn-secondary"
            style={{
              fontSize: '0.85rem',
              padding: '0.55rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#10B981',
              background: 'rgba(16, 185, 129, 0.08)'
            }}
          >
            <FileSpreadsheet size={16} /> Export to Excel (CSV)
          </button>

          <button
            onClick={() => window.print()}
            className="btn btn-primary"
            style={{
              fontSize: '0.85rem',
              padding: '0.55rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'var(--grad-primary)'
            }}
          >
            <Printer size={16} /> Export PDF / Print
          </button>
        </div>
      </div>

      {/* ── Summary Financial Metrics ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Total Collections */}
        <div className="glass-card" style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IndianRupee size={22} color="#10B981" />
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 999, background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
              Settled
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
            Total Net Collected
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit', color: '#10B981', lineHeight: 1.15 }}>
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
            {filteredPayments.filter(p => p.status === 'PAID').length} Successful settlements
          </div>
        </div>

        {/* GST 18% Output Tax */}
        <div className="glass-card" style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} color="var(--brand-violet)" />
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 999, background: 'rgba(124, 58, 237, 0.12)', color: 'var(--brand-violet)' }}>
              18% GST (CGST+SGST)
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
            Total GST Output Tax
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--brand-violet)', lineHeight: 1.15 }}>
            ₹{totalGST.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
            Base Taxable: ₹{totalBase.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Pending Receivables */}
        <div className="glass-card" style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={22} color="#F59E0B" />
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 999, background: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B' }}>
              Pending
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
            Pending Collections
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit', color: '#F59E0B', lineHeight: 1.15 }}>
            ₹{totalPending.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
            {filteredPayments.filter(p => p.status !== 'PAID').length} Invoices awaiting payment
          </div>
        </div>

        {/* UPI & Online Volume */}
        <div className="glass-card" style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={22} color="#3B82F6" />
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 999, background: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6' }}>
              UPI / QR Share
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
            UPI & Direct Gateway
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)', lineHeight: 1.15 }}>
            54% Volume
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
            Auto-reconciled with UPI UTRs
          </div>
        </div>
      </div>

      {/* ── Filters & Search Toolbar ── */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 280 }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by Txn ID, UPI Ref, Customer, Design..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Mode & Status Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Payment Mode Pills */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-subtle)',
            padding: '0.2rem',
            borderRadius: 8,
            border: '1px solid var(--border-light)',
            gap: '0.2rem'
          }}>
            {[
              { id: 'ALL', label: 'All Modes' },
              { id: 'UPI', label: 'UPI / QR' },
              { id: 'BANK', label: 'Bank Transfer' },
              { id: 'CHEQUE', label: 'Cheque' },
              { id: 'CASH', label: 'Cash' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setModeFilter(tab.id)}
                style={{
                  border: 'none',
                  background: modeFilter === tab.id ? 'var(--brand-violet)' : 'transparent',
                  color: modeFilter === tab.id ? '#FFFFFF' : 'var(--text-subtle)',
                  fontWeight: modeFilter === tab.id ? 700 : 500,
                  fontSize: '0.78rem',
                  padding: '0.35rem 0.7rem',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status Pills */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-subtle)',
            padding: '0.2rem',
            borderRadius: 8,
            border: '1px solid var(--border-light)',
            gap: '0.2rem'
          }}>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'PAID', label: 'Paid' },
              { id: 'PENDING', label: 'Pending' },
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
                  padding: '0.35rem 0.65rem',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Payments Data Table ── */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Txn #</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Customer</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Design / Service</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Qty</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Base Price</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>GST (18%)</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Total Amount</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Payment Mode</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>UPI / UTR Ref ID</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem' }}>Date & Time</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem', textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={12} style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-subtle)' }}>
                    No payment records matching your search or filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => (
                  <tr
                    key={p.id}
                    style={{ borderBottom: '1px solid var(--border-light)', transition: 'background-color 0.15s' }}
                    className="table-row-hover"
                  >
                    {/* Txn ID */}
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--brand-violet)', fontFamily: 'Outfit' }}>
                      {p.id}
                    </td>

                    {/* Customer */}
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{p.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{p.phone}</div>
                    </td>

                    {/* Design / Service */}
                    <td style={{ padding: '0.9rem 1rem', maxWidth: 200 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.designName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--brand-violet)', fontWeight: 600 }}>
                        Ref: {p.invoiceRef}
                      </div>
                    </td>

                    {/* Qty */}
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {p.quantity}
                    </td>

                    {/* Base Price */}
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--text-subtle)' }}>
                      ₹{p.basePrice.toLocaleString('en-IN')}
                    </td>

                    {/* GST Amount */}
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--brand-violet)', fontWeight: 600 }}>
                      ₹{p.gstAmount.toLocaleString('en-IN')}
                    </td>

                    {/* Total Amount */}
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      ₹{p.totalAmount.toLocaleString('en-IN')}
                    </td>

                    {/* Payment Mode */}
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: 6,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: p.paymentMode.includes('UPI') ? 'rgba(37, 211, 102, 0.12)' : 'rgba(59, 130, 246, 0.12)',
                        color: p.paymentMode.includes('UPI') ? '#10B981' : '#3B82F6',
                        border: '1px solid var(--border-light)',
                        whiteSpace: 'nowrap',
                      }}>
                        {p.paymentMode}
                      </span>
                    </td>

                    {/* UPI / UTR Transaction ID */}
                    <td style={{ padding: '0.9rem 1rem', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-subtle)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.transactionId}>
                      {p.transactionId}
                    </td>

                    {/* Payment Status */}
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 999,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: p.status === 'PAID' ? 'rgba(16, 185, 129, 0.12)' : p.status === 'PARTIAL' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        color: p.status === 'PAID' ? '#10B981' : p.status === 'PARTIAL' ? '#8B5CF6' : '#F59E0B',
                        border: `1px solid ${p.status === 'PAID' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
                      }}>
                        {p.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--text-subtle)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      {p.date}
                    </td>

                    {/* Action */}
                    <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        style={{
                          border: 'none',
                          background: 'var(--bg-subtle)',
                          color: 'var(--brand-violet)',
                          padding: '0.35rem 0.65rem',
                          borderRadius: 6,
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <Receipt size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Payment Receipt Modal ── */}
      {selectedReceipt && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 540, padding: '2rem', position: 'relative', animation: 'fadeInUp 0.25s ease' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Official Payment Receipt</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)', margin: '0.2rem 0 0' }}>
                  {selectedReceipt.id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                style={{ border: 'none', background: 'var(--bg-subtle)', color: 'var(--text-main)', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            {/* Receipt Details Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Customer:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{selectedReceipt.customerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Phone:</span>
                <span style={{ color: 'var(--text-main)' }}>{selectedReceipt.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Design Item:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)', textAlign: 'right', maxWidth: 280 }}>{selectedReceipt.designName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Quantity:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedReceipt.quantity}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Payment Mode:</span>
                <span style={{ fontWeight: 700, color: '#10B981' }}>{selectedReceipt.paymentMode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>UPI / Bank UTR:</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--brand-violet)', fontWeight: 700 }}>{selectedReceipt.transactionId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Transaction Date:</span>
                <span style={{ color: 'var(--text-main)' }}>{selectedReceipt.date}</span>
              </div>

              {/* Tax calculation box */}
              <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-subtle)', borderRadius: 8, border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Taxable Value (Base):</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>₹{selectedReceipt.basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>CGST (9%) + SGST (9%):</span>
                  <span style={{ fontWeight: 600, color: 'var(--brand-violet)' }}>₹{selectedReceipt.gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-light)', paddingTop: '0.4rem', fontSize: '1rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>Total Paid Amount:</span>
                  <span style={{ fontWeight: 800, color: '#10B981', fontFamily: 'Outfit', fontSize: '1.25rem' }}>
                    ₹{selectedReceipt.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Printer size={15} /> Print Receipt
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="btn btn-primary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
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
