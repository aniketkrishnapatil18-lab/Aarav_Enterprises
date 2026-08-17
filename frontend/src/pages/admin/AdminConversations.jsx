import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { conversationAPI } from '../../services/api';
import { timeAgo, getLanguageLabel } from '../../utils/helpers';

export default function AdminConversations() {
  const [convs,   setConvs]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [status,  setStatus]  = useState('');

  useEffect(() => {
    document.title = 'WhatsApp Conversations — Admin';
    load();
  }, [status]);

  async function load() {
    setLoading(true);
    try {
      const res = await conversationAPI.list({ status, limit: 30 });
      setConvs(res.data.conversations || []);
      setTotal(res.data.total || 0);
    } catch { setConvs([]); }
    finally { setLoading(false); }
  }

  const statusColor = s => ({
    active: '#4ADE80', human_handoff: '#F87171', closed: '#64748B', archived: '#475569',
  })[s] || '#94A3B8';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>WhatsApp Conversations</h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>{total} conversations</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[{v:'',l:'All'},{v:'active',l:'Active'},{v:'human_handoff',l:'🙋 Handoff'},{v:'closed',l:'Closed'}].map(s => (
          <button key={s.v} onClick={() => setStatus(s.v)} style={{ padding: '0.4rem 0.85rem', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: `1px solid ${status===s.v?'#7C3AED':'rgba(255,255,255,0.1)'}`, background: status===s.v?'rgba(124,58,237,0.2)':'transparent', color: status===s.v?'#A78BFA':'#64748B' }}>
            {s.l}
          </button>
        ))}
      </div>
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 52 }} />)}
          </div>
        ) : convs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748B' }}>
            <MessageCircle size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No conversations yet.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Customer</th><th>Language</th><th>Messages</th><th>Status</th><th>Last Message</th><th></th></tr></thead>
            <tbody>
              {convs.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#F8FAFC' }}>{c.customer_name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', fontFamily: 'monospace' }}>{c.whatsapp_number}</div>
                  </td>
                  <td>{getLanguageLabel(c.language)}</td>
                  <td>{c.message_count}</td>
                  <td>
                    <span style={{ color: statusColor(c.status), fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>
                      {c.status === 'human_handoff' ? '⚠️ Handoff' : c.status}
                    </span>
                  </td>
                  <td><span style={{ fontSize: '0.8rem', color: '#64748B' }}>{timeAgo(c.last_message_at)}</span></td>
                  <td>
                    <Link to={`/admin/conversations/${c.id}`} style={{ color: '#A78BFA', textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
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
