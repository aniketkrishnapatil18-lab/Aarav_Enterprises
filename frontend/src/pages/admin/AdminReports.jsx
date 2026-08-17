import { useState, useEffect } from 'react';
import { reportAPI } from '../../services/api';
import { BarChart2, Globe, Tag } from 'lucide-react';
import { getLanguageLabel } from '../../utils/helpers';

export default function AdminReports() {
  const [byService,  setByService]  = useState([]);
  const [byLang,     setByLang]     = useState([]);
  const [byStatus,   setByStatus]   = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    document.title = 'Analytics & Reports — Admin';
    async function load() {
      try {
        const [sRes, lRes, stRes] = await Promise.all([
          reportAPI.byService(),
          reportAPI.byLanguage(),
          reportAPI.byStatus(),
        ]);
        setByService(sRes.data.data || []);
        setByLang(lRes.data.data || []);
        setByStatus(stRes.data.data || []);
      } catch {} finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Analytics & Reports</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* By Service */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={18} color="#A78BFA" /> Inquiries by Service
          </h3>
          {loading ? <div className="skeleton" style={{ height: 180 }} /> : byService.length === 0 ? <p style={{ color: '#64748B' }}>No data available</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {byService.map(item => (
                <div key={item.service} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                  <span style={{ fontSize: '0.9rem', color: '#CBD5E1' }}>{item.service}</span>
                  <span style={{ fontWeight: 700, color: '#A78BFA', fontSize: '0.95rem' }}>{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* By Language */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={18} color="#EC4899" /> Customer Preferred Languages
          </h3>
          {loading ? <div className="skeleton" style={{ height: 180 }} /> : byLang.length === 0 ? <p style={{ color: '#64748B' }}>No data available</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {byLang.map(item => (
                <div key={item.language} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                  <span style={{ fontSize: '0.9rem', color: '#CBD5E1' }}>{getLanguageLabel(item.language)}</span>
                  <span style={{ fontWeight: 700, color: '#EC4899', fontSize: '0.95rem' }}>{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* By Status */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={18} color="#4ADE80" /> Inquiry Status Breakdown
          </h3>
          {loading ? <div className="skeleton" style={{ height: 180 }} /> : byStatus.length === 0 ? <p style={{ color: '#64748B' }}>No data available</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {byStatus.map(item => (
                <div key={item.status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                  <span style={{ fontSize: '0.85rem', color: '#CBD5E1', textTransform: 'capitalize' }}>{item.status.replace(/_/g, ' ')}</span>
                  <span style={{ fontWeight: 700, color: '#4ADE80', fontSize: '0.95rem' }}>{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
