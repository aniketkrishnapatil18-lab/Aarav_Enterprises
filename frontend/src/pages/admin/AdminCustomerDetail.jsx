import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, MessageCircle, Calendar, Edit3, Save } from 'lucide-react';
import { customerAPI } from '../../services/api';
import { timeAgo, formatDate, getLanguageLabel, getStatusConfig } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AdminCustomerDetail() {
  const { id } = useParams();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [notes, setNotes]     = useState('');

  useEffect(() => {
    document.title = `Customer #${id} — Admin`;
    load();
  }, [id]);

  async function load() {
    try {
      const res = await customerAPI.detail(id);
      const cust = res.data.customer || res.data;
      setData(res.data);
      setName(cust.name || '');
      setEmail(cust.email || '');
      setNotes(cust.notes || '');
    } catch (err) {
      toast.error('Failed to load customer details');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      await customerAPI.update(id, { name, email, notes });
      toast.success('Customer details updated');
      setEditing(false);
      load();
    } catch {
      toast.error('Failed to update customer');
    }
  }

  if (loading) return (
    <div style={{ padding: '2rem' }}>
      <div className="skeleton" style={{ height: 40, width: 200, marginBottom: '1rem' }} />
      <div className="skeleton" style={{ height: 400, borderRadius: '1rem' }} />
    </div>
  );

  const c           = data?.customer || data || {};
  const inquiries   = data?.inquiries || [];
  const conversations = data?.conversations || [];

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link to="/admin/customers" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '0.75rem', background: 'var(--bg-subtle)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            {c.name || c.profile_name || 'Customer Profile'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Registered {formatDate(c.created_at)}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Profile Card */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="var(--brand-violet)" /> Profile Info
            </h3>
            <button onClick={() => setEditing(!editing)} className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}>
              <Edit3 size={13} /> {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label className="form-label">Full Name</label>
                <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Admin Notes</label>
                <textarea className="form-input" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}><Save size={15} /> Save Changes</button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '0.85rem', background: 'var(--bg-subtle)', borderRadius: 8, border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600 }}>WhatsApp Number</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--brand-violet)', fontFamily: 'monospace', marginTop: '0.2rem' }}>
                  {c.whatsapp_number || c.phone}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600 }}>Language Preference</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {getLanguageLabel(c.preferred_language)}
                </div>
              </div>

              {c.email && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600 }}>Email</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>{c.email}</div>
                </div>
              )}

              {c.notes && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600 }}>Notes</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.5 }}>{c.notes}</div>
                </div>
              )}

              <a
                href={`https://wa.me/${c.whatsapp_number}`}
                target="_blank" rel="noreferrer"
                className="btn-whatsapp"
                style={{ justifyContent: 'center', marginTop: '0.5rem', padding: '0.65rem' }}
              >
                <MessageCircle size={16} /> Open in WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* Right Details Tabs: Inquiries & Conversations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Associated Inquiries */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
              Customer Inquiries ({inquiries.length})
            </h3>
            {inquiries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-subtle)' }}>No inquiries recorded for this customer.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {inquiries.map(inq => {
                  const st = getStatusConfig(inq.status);
                  return (
                    <Link key={inq.id} to={`/admin/inquiries/${inq.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', background: 'var(--bg-subtle)', borderRadius: 8, textDecoration: 'none', border: '1px solid var(--border-light)' }}>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{inq.service_name || 'Design Service'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{timeAgo(inq.created_at)}</div>
                      </div>
                      <span className={`badge ${st.className}`}>{st.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Associated Conversations */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
              WhatsApp Conversations ({conversations.length})
            </h3>
            {conversations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-subtle)' }}>No active chat history.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {conversations.map(conv => (
                  <Link key={conv.id} to={`/admin/conversations/${conv.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', background: 'var(--bg-subtle)', borderRadius: 8, textDecoration: 'none', border: '1px solid var(--border-light)' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>Conversation #{conv.id}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{conv.message_count} msgs · {timeAgo(conv.last_message_at)}</div>
                    </div>
                    <span className={`badge ${conv.status === 'active' ? 'badge-accepted' : 'badge-revision'}`}>{conv.status}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
