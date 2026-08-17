import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, CheckCircle, Clock, MessageCircle, TrendingUp, ArrowRight, Bell } from 'lucide-react';
import { reportAPI } from '../../services/api';
import { getStatusConfig, timeAgo, getLanguageLabel } from '../../utils/helpers';

function StatCard({ icon: Icon, label, value, sub, color, to }) {
  const content = (
    <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '0.3rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)', lineHeight: 1 }}>{value ?? '—'}</div>
        {sub && <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.3rem' }}>{sub}</div>}
      </div>
    </div>
  );

  return to ? (
    <Link to={to} className="glass-card glass-card-hover" style={{ display: 'block', textDecoration: 'none' }}>{content}</Link>
  ) : (
    <div className="glass-card">{content}</div>
  );
}

export default function AdminDashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard — Admin';
    reportAPI.summary()
      .then(res => setData(res.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
        {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: '1rem' }} />)}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem' }}>Welcome back! Here is a real-time overview of your business.</p>
        </div>
        <Link to="/admin/inquiries?status=NEW" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--badge-bg-purple)', color: 'var(--brand-violet)', padding: '0.5rem 1rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700, border: '1px solid var(--badge-border-purple)' }}>
          <Bell size={16} /> {data?.newInquiries || 0} New Inquiries
        </Link>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard icon={Users}         label="Total Customers"     value={data?.totalCustomers}     color="#8B5CF6" to="/admin/customers" />
        <StatCard icon={MessageSquare} label="New Inquiries"       value={data?.newInquiries}        color="#3B82F6" to="/admin/inquiries?status=NEW" sub="Waiting for review" />
        <StatCard icon={TrendingUp}    label="In Progress"         value={data?.inProgress}          color="#6366F1" to="/admin/inquiries?status=IN_PROGRESS" />
        <StatCard icon={CheckCircle}   label="Completed Orders"    value={data?.completed}           color="#10B981" to="/admin/inquiries?status=COMPLETED" />
        <StatCard icon={MessageCircle} label="WhatsApp Chats"      value={data?.totalConversations}  color="#25D366" to="/admin/conversations" />
        <StatCard icon={Bell}          label="Notifications"       value={data?.unreadNotifications} color="#F59E0B" to="/admin/notifications" sub="Unread items" />
      </div>

      {/* Recent Inquiries & Conversations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Recent Inquiries</h3>
            <Link to="/admin/inquiries" style={{ fontSize: '0.8rem', color: 'var(--brand-violet)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {(data?.recentInquiries || []).length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-subtle)', padding: '2rem' }}>No inquiries yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(data?.recentInquiries || []).map(inq => {
                const st = getStatusConfig(inq.status);
                return (
                  <Link key={inq.id} to={`/admin/inquiries/${inq.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', background: 'var(--bg-subtle)', borderRadius: 8, textDecoration: 'none', border: '1px solid var(--border-light)' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{inq.customer_name || inq.whatsapp_number}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{inq.service_name || 'Design Service'} · {timeAgo(inq.created_at)}</div>
                    </div>
                    <span className={`badge ${st.className}`}>{st.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Recent WhatsApp Chats</h3>
            <Link to="/admin/conversations" style={{ fontSize: '0.8rem', color: 'var(--brand-violet)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {(data?.recentConversations || []).length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-subtle)', padding: '2rem' }}>No conversations yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(data?.recentConversations || []).map(conv => (
                <Link key={conv.id} to={`/admin/conversations/${conv.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', background: 'var(--bg-subtle)', borderRadius: 8, textDecoration: 'none', border: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{conv.customer_name || conv.whatsapp_number}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{conv.message_count} msgs · {getLanguageLabel(conv.language)} · {timeAgo(conv.last_message_at)}</div>
                  </div>
                  <span className={`badge ${conv.status === 'active' ? 'badge-accepted' : conv.status === 'human_handoff' ? 'badge-revision' : 'badge-cancelled'}`}>
                    {conv.status === 'human_handoff' ? 'Handoff' : conv.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
