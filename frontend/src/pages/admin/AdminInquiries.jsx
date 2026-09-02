import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowRight, MessageSquare } from 'lucide-react';
import { inquiryAPI } from '../../services/api';
import { getStatusConfig, timeAgo, getLanguageLabel, truncate } from '../../utils/helpers';

const STATUSES = [
  { value: '', label: 'All' },
  { value: 'NEW', label: 'New' },
  { value: 'REQUIREMENT_COLLECTED', label: 'Requirements Collected' },
  { value: 'ADMIN_REVIEW', label: 'Admin Review' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DESIGN_READY', label: 'Design Ready' },
  { value: 'REVISION', label: 'Revision' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [page,      setPage]      = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') || '';

  useEffect(() => {
    document.title = 'Inquiries — Admin';
    load();
  }, [status, page, search]);

  async function load() {
    setLoading(true);
    try {
      const res = await inquiryAPI.list({ status, search, page, limit: 20 });
      setInquiries(res.data.inquiries || []);
      setTotal(res.data.total || 0);
    } catch { setInquiries([]); }
    finally { setLoading(false); }
  }

  function setStatus(s) {
    const p = new URLSearchParams(searchParams);
    if (s) p.set('status', s); else p.delete('status');
    setSearchParams(p);
    setPage(1);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Inquiries</h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem' }}>{total} total inquiries</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
          <input className="form-input" style={{ paddingLeft: '2.25rem', width: 220 }}
            placeholder="Search inquiries..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button key={s.value} onClick={() => setStatus(s.value)} style={{
              padding: '0.4rem 0.75rem', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${status === s.value ? 'var(--brand-violet)' : 'var(--border-light)'}`,
              background: status === s.value ? 'rgba(124,58,237,0.15)' : 'transparent',
              color: status === s.value ? 'var(--brand-violet)' : 'var(--text-subtle)', transition: 'all 0.2s',
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 52 }} />)}
          </div>
        ) : inquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-subtle)' }}>
            <MessageSquare size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No inquiries found.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Inquiry #</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Language</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(inq => {
                const st = getStatusConfig(inq.status);
                return (
                  <tr key={inq.id}>
                    <td><span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--brand-violet)' }}>{inq.inquiry_number}</span></td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>{inq.customer_name || '—'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{inq.whatsapp_number}</div>
                    </td>
                    <td><span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{inq.service_name || '—'}</span></td>
                    <td><span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{getLanguageLabel(inq.language)}</span></td>
                    <td><span className={`badge ${st.className}`}>{st.label}</span></td>
                    <td><span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{timeAgo(inq.created_at)}</span></td>
                    <td>
                      <Link to={`/admin/inquiries/${inq.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--brand-violet)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                        View <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Previous</button>
          <span style={{ padding: '0.5rem 1rem', color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Page {page} of {Math.ceil(total / 20)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 20)} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Next</button>
        </div>
      )}
    </div>
  );
}
