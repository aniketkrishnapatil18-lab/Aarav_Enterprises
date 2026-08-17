import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, User } from 'lucide-react';
import { customerAPI } from '../../services/api';
import { timeAgo, getLanguageLabel } from '../../utils/helpers';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [page,      setPage]      = useState(1);

  useEffect(() => {
    document.title = 'Customers — Admin';
    load();
  }, [search, page]);

  async function load() {
    setLoading(true);
    try {
      const res = await customerAPI.list({ search, page, limit: 20 });
      setCustomers(res.data.customers || []);
      setTotal(res.data.total || 0);
    } catch { setCustomers([]); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Customers</h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>{total} total customers</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input className="form-input" style={{ paddingLeft: '2.25rem' }} placeholder="Search by name or phone..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 52 }} />)}
          </div>
        ) : customers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748B' }}>
            <User size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No customers yet.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Customer</th><th>WhatsApp</th><th>Language</th><th>Inquiries</th><th>Last Contact</th><th></th></tr></thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#F8FAFC' }}>{c.name || c.profile_name || 'Unknown'}</div>
                    {c.email && <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{c.email}</div>}
                  </td>
                  <td><span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{c.whatsapp_number}</span></td>
                  <td><span style={{ fontSize: '0.875rem', color: '#94A3B8' }}>{getLanguageLabel(c.preferred_language)}</span></td>
                  <td><span style={{ fontWeight: 600 }}>{c.total_inquiries}</span></td>
                  <td><span style={{ fontSize: '0.8rem', color: '#64748B' }}>{timeAgo(c.last_contact_at)}</span></td>
                  <td>
                    <Link to={`/admin/customers/${c.id}`} style={{ color: '#A78BFA', textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      View <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
