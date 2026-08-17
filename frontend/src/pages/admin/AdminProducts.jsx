import { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Package } from 'lucide-react';

export default function AdminProducts() {
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [editItem,    setEditItem]    = useState(null);
  const [form,        setForm]        = useState(defaultForm());

  function defaultForm() {
    return { name: '', slug: '', category_id: '', short_desc: '', description: '', starting_price: '', price_label: 'onwards', delivery_days: '', revisions: 2, file_formats: 'AI, PDF, PNG, JPEG', is_featured: false, is_active: true };
  }

  useEffect(() => {
    document.title = 'Products — Admin';
    load();
  }, []);

  async function load() {
    try {
      const [pRes, cRes] = await Promise.all([productAPI.list({}), categoryAPI.list({})]);
      setProducts(pRes.data.data || []);
      setCategories(cRes.data.data || []);
    } catch {} finally { setLoading(false); }
  }

  function openEdit(item) {
    setEditItem(item);
    setForm({ name: item.name, slug: item.slug, category_id: item.category_id, short_desc: item.short_desc || '', description: item.description || '', starting_price: item.starting_price || '', price_label: item.price_label || 'onwards', delivery_days: item.delivery_days || '', revisions: item.revisions || 2, file_formats: item.file_formats || 'AI, PDF, PNG, JPEG', is_featured: !!item.is_featured, is_active: !!item.is_active });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    try {
      if (editItem) {
        await productAPI.update(editItem.id, fd);
        toast.success('Service updated!');
      } else {
        await productAPI.create(fd);
        toast.success('Service created!');
      }
      setShowForm(false); setEditItem(null); setForm(defaultForm()); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving service.'); }
  }

  async function handleToggle(id) {
    try { await productAPI.toggle(id); load(); } catch { toast.error('Failed to toggle.'); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this service?')) return;
    try { await productAPI.remove(id); toast.success('Deleted.'); load(); } catch { toast.error('Failed.'); }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}>Products & Services</h1>
        <button onClick={() => { setEditItem(null); setForm(defaultForm()); setShowForm(true); }} className="btn-primary" style={{ fontSize: '0.875rem' }}>
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{editItem ? 'Edit Service' : 'Add Service'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div><label className="form-label">Service Name *</label><input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))} /></div>
                <div><label className="form-label">Slug *</label><input className="form-input" required value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} /></div>
                <div><label className="form-label">Category *</label>
                  <select className="form-input" required value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div><label className="form-label">Starting Price (₹)</label><input type="number" className="form-input" value={form.starting_price} onChange={e => setForm(f => ({ ...f, starting_price: e.target.value }))} /></div>
                <div><label className="form-label">Price Label</label><input className="form-input" value={form.price_label} onChange={e => setForm(f => ({ ...f, price_label: e.target.value }))} /></div>
                <div><label className="form-label">Delivery (days)</label><input type="number" className="form-input" value={form.delivery_days} onChange={e => setForm(f => ({ ...f, delivery_days: e.target.value }))} /></div>
                <div><label className="form-label">Revisions</label><input type="number" className="form-input" value={form.revisions} onChange={e => setForm(f => ({ ...f, revisions: e.target.value }))} /></div>
                <div><label className="form-label">File Formats</label><input className="form-input" value={form.file_formats} onChange={e => setForm(f => ({ ...f, file_formats: e.target.value }))} /></div>
              </div>
              <div style={{ marginBottom: '1rem' }}><label className="form-label">Short Description</label><input className="form-input" value={form.short_desc} onChange={e => setForm(f => ({ ...f, short_desc: e.target.value }))} /></div>
              <div style={{ marginBottom: '1rem' }}><label className="form-label">Full Description</label><textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#94A3B8' }}>
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} /> Featured
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#94A3B8' }}>
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} /> Active
                </label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem' }}>{[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 52, marginBottom: '0.75rem' }} />)}</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748B' }}><Package size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} /><p>No services yet.</p></div>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Delivery</th><th>Featured</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td><div style={{ fontWeight: 600, color: '#F8FAFC' }}>{p.name}</div><div style={{ fontSize: '0.75rem', color: '#64748B' }}>{p.slug}</div></td>
                  <td>{p.category_name}</td>
                  <td>{p.starting_price > 0 ? `₹${parseInt(p.starting_price).toLocaleString('en-IN')} ${p.price_label || ''}` : 'Custom'}</td>
                  <td>{p.delivery_days ? `${p.delivery_days}d` : '—'}</td>
                  <td>{p.is_featured ? <span style={{ color: '#FBBF24' }}>⭐</span> : '—'}</td>
                  <td><span style={{ color: p.is_active ? '#4ADE80' : '#EF4444', fontWeight: 600, fontSize: '0.8rem' }}>{p.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer' }}><Edit2 size={16} /></button>
                      <button onClick={() => handleToggle(p.id)} style={{ background: 'none', border: 'none', color: p.is_active ? '#4ADE80' : '#64748B', cursor: 'pointer' }}>{p.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}</button>
                      <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
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
