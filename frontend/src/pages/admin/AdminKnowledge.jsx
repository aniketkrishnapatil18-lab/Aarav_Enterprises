import { useState, useEffect } from 'react';
import { knowledgeAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { BookOpen, Save, RefreshCw } from 'lucide-react';

export default function AdminKnowledge() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    document.title = 'AI Knowledge Base — Admin';
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await knowledgeAPI.list();
      setItems(res.data.data || []);
    } catch { toast.error('Failed to load knowledge base.'); }
    finally { setLoading(false); }
  }

  function handleChange(key_name, field, val) {
    setItems(list => list.map(item => item.key_name === key_name ? { ...item, [field]: val } : item));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await knowledgeAPI.bulkUpdate(items);
      toast.success('Knowledge base updated successfully!');
      load();
    } catch { toast.error('Failed to update knowledge base.'); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>AI Knowledge Base</h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem' }}>Configure the knowledge and rules that guide the AI assistant on WhatsApp.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ fontSize: '0.875rem' }}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {loading ? (
          [...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 90, borderRadius: '0.75rem' }} />)
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-subtle)' }}>
            <BookOpen size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No knowledge base items loaded.</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.key_name} className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: 0, fontWeight: 600, color: 'var(--text-main)' }}>
                  {item.label || item.key_name}
                </label>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--brand-violet)', background: 'rgba(124,58,237,0.15)', padding: '0.15rem 0.5rem', borderRadius: 4 }}>
                  {item.key_name}
                </span>
              </div>
              <textarea
                className="form-input"
                rows={item.value?.length > 100 ? 3 : 2}
                value={item.value || ''}
                onChange={e => handleChange(item.key_name, 'value', e.target.value)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
