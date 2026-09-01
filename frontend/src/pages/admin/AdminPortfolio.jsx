import { useState, useEffect } from 'react';
import { portfolioAPI, categoryAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Image as ImageIcon } from 'lucide-react';
import Select from '../../components/common/Select';

export default function AdminPortfolio() {
  const [items,      setItems]      = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [form,       setForm]       = useState(defaultForm());

  function defaultForm() {
    return { title: '', category_id: '', description: '', caption: '', tags: '', is_featured: false, is_active: true, whatsapp_sample: true };
  }

  useEffect(() => {
    document.title = 'Portfolio — Admin';
    load();
  }, []);

  // Lock background page scroll while the form modal is open.
  useEffect(() => {
    document.body.style.overflow = showForm ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showForm]);

  async function load() {
    try {
      const [pRes, cRes] = await Promise.all([portfolioAPI.list({}), categoryAPI.list({})]);
      setItems(pRes.data.data || []);
      setCategories(cRes.data.data || []);
    } catch {} finally { setLoading(false); }
  }

  function openEdit(item) {
    setEditItem(item);
    setForm({
      title: item.title,
      category_id: item.category_id,
      description: item.description || '',
      caption: item.caption || '',
      tags: item.tags || '',
      is_featured: !!item.is_featured,
      is_active: !!item.is_active,
      whatsapp_sample: item.whatsapp_sample !== undefined ? !!item.whatsapp_sample : true,
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    const fileInput = document.getElementById('portfolio_image_file');
    if (fileInput?.files?.[0]) {
      fd.append('image', fileInput.files[0]);
    }
    try {
      if (editItem) {
        await portfolioAPI.update(editItem.id, fd);
        toast.success('Portfolio item updated!');
      } else {
        if (!fileInput?.files?.[0]) { toast.error('Image is required.'); return; }
        await portfolioAPI.create(fd);
        toast.success('Portfolio item created!');
      }
      setShowForm(false); setEditItem(null); setForm(defaultForm()); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving item.'); }
  }

  async function handleToggle(id) {
    try { await portfolioAPI.toggle(id); load(); } catch { toast.error('Failed to toggle.'); }
  }

  async function handleWaToggle(id) {
    try { await portfolioAPI.waToggle(id); toast.success('WhatsApp sample status updated!'); load(); } catch { toast.error('Failed to update.'); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this portfolio item?')) return;
    try { await portfolioAPI.remove(id); toast.success('Deleted.'); load(); } catch { toast.error('Failed.'); }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Portfolio & WhatsApp AI Samples Showcase</h1>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>Manage design portfolio items and WhatsApp AI sample image library</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm(defaultForm()); setShowForm(true); }} className="btn-primary" style={{ fontSize: '0.875rem' }}>
          <Plus size={16} /> Add Portfolio Sample
        </button>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'hidden', padding: 0 }}>
          <div className="hide-scrollbar" style={{ maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{editItem ? 'Edit Portfolio Sample' : 'Add Portfolio Sample'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Title *</label>
                <input className="form-input" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Modern Visiting Card" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Category *</label>
                <Select
                  value={form.category_id}
                  onChange={val => setForm(f => ({ ...f, category_id: val }))}
                  options={[
                    { value: '', label: 'Select Category' },
                    ...categories.map(c => ({ value: c.id, label: c.name }))
                  ]}
                  required={true}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Image {editItem ? '(Optional to replace)' : '*'}</label>
                <input type="file" id="portfolio_image_file" accept="image/*" className="form-input" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">WhatsApp Image Caption</label>
                <input className="form-input" value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="e.g. Visiting Card Sample 1 — Modern Corporate Style" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Tags / Keywords (comma separated)</label>
                <input className="form-input" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. modern, corporate, minimal, black" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#94A3B8' }}>
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} /> ⭐ Featured
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#94A3B8' }}>
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} /> Active
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#4ADE80' }}>
                  <input type="checkbox" checked={form.whatsapp_sample} onChange={e => setForm(f => ({ ...f, whatsapp_sample: e.target.checked }))} /> 💬 Enable WhatsApp AI Sample
                </label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Sample</button>
              </div>
            </form>
          </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {loading ? (
          [...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 240, borderRadius: '1rem' }} />)
        ) : items.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#64748B' }}>
            <ImageIcon size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No portfolio items added yet.</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ height: 160, position: 'relative', overflow: 'hidden' }}>
                <img
                  src={item.image_url}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.src = `https://placehold.co/400x300/231845/A78BFA?text=${encodeURIComponent(item.category_name || 'Design')}`; }}
                />
                <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: '0.25rem' }}>
                  {item.is_featured && (
                    <span style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700, color: 'white' }}>
                      ⭐ Featured
                    </span>
                  )}
                  {item.whatsapp_sample && (
                    <span style={{ background: 'rgba(34, 197, 94, 0.9)', padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700, color: 'white' }}>
                      💬 WA AI
                    </span>
                  )}
                </div>
              </div>
              <div style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#A78BFA', fontWeight: 600 }}>{item.category_name}</div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>{item.title}</h4>
                {item.caption && <p style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic', marginBottom: '0.5rem' }}>"{item.caption}"</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                  <span style={{ color: item.is_active ? '#4ADE80' : '#EF4444', fontSize: '0.75rem', fontWeight: 600 }}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <button onClick={() => handleWaToggle(item.id)} title="Toggle WhatsApp AI Sample" style={{ background: 'none', border: 'none', color: item.whatsapp_sample ? '#4ADE80' : '#64748B', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                      💬
                    </button>
                    <button onClick={() => openEdit(item)} style={{ background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer' }}><Edit2 size={15} /></button>
                    <button onClick={() => handleToggle(item.id)} style={{ background: 'none', border: 'none', color: item.is_active ? '#4ADE80' : '#64748B', cursor: 'pointer' }}>
                      {item.is_active ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
                    </button>
                    <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

