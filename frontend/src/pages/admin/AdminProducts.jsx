import { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Package, Image as ImageIcon, ChevronLeft, ChevronRight, Upload, Search } from 'lucide-react';
import UnsplashImageSearch from '../../components/common/UnsplashImageSearch';
import Select from '../../components/common/Select';

const PAGE_SIZE = 8;

export default function AdminProducts() {
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [editItem,    setEditItem]    = useState(null);
  const [form,        setForm]        = useState(defaultForm());
  const [page,        setPage]        = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const [showUnsplash, setShowUnsplash] = useState(false);
  const [thumbnailFileName, setThumbnailFileName] = useState('');

  function defaultForm() {
    return { name: '', slug: '', category_id: '', short_desc: '', description: '', starting_price: '', price_label: 'onwards', delivery_days: '', revisions: 2, file_formats: 'AI, PDF, PNG, JPEG', is_featured: false, is_active: true, thumbnail_url: '' };
  }

  useEffect(() => {
    document.title = 'Products — Admin';
    load();
  }, []);

  // Lock background page scroll while the form modal is open — otherwise
  // the page's own scrollbar stays active and visible poking out past the
  // modal's right edge.
  useEffect(() => {
    document.body.style.overflow = showForm ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showForm]);

  async function load() {
    try {
      const [pRes, cRes] = await Promise.all([productAPI.list({ limit: 500 }), categoryAPI.list({})]);
      setProducts(pRes.data.data || []);
      setCategories(cRes.data.data || []);
      setPage(1);
    } catch {} finally { setLoading(false); }
  }

  function resetThumbnailFile() {
    const fileInput = document.getElementById('product_thumbnail_file');
    if (fileInput) fileInput.value = '';
    setThumbnailFileName('');
  }

  function openEdit(item) {
    setEditItem(item);
    setForm({ name: item.name, slug: item.slug, category_id: item.category_id, short_desc: item.short_desc || '', description: item.description || '', starting_price: item.starting_price || '', price_label: item.price_label || 'onwards', delivery_days: item.delivery_days || '', revisions: item.revisions || 2, file_formats: item.file_formats || 'AI, PDF, PNG, JPEG', is_featured: !!item.is_featured, is_active: !!item.is_active, thumbnail_url: item.thumbnail_url || '' });
    resetThumbnailFile();
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    const fileInput = document.getElementById('product_thumbnail_file');
    if (fileInput?.files?.[0]) {
      fd.append('thumbnail', fileInput.files[0]);
    }
    try {
      if (editItem) {
        await productAPI.update(editItem.id, fd);
        toast.success('Service updated!');
      } else {
        await productAPI.create(fd);
        toast.success('Service created!');
      }
      resetThumbnailFile();
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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category_name && p.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}>Products & Services</h1>
        <div style={{ display: 'flex', gap: '1rem', flex: 1, maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search services..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              style={{ paddingLeft: '2.5rem', width: '100%' }}
            />
          </div>
        </div>
        <button onClick={() => { setEditItem(null); setForm(defaultForm()); resetThumbnailFile(); setShowForm(true); }} className="btn-primary" style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'hidden', padding: 0 }}>
          <div style={{ maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{editItem ? 'Edit Service' : 'Add Service'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div><label className="form-label">Service Name *</label><input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))} /></div>
                <div><label className="form-label">Slug *</label><input className="form-input" required value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} /></div>
                <div><label className="form-label">Category *</label>
                  <Select
                    required
                    placeholder="Select Category"
                    value={form.category_id}
                    onChange={v => setForm(f => ({ ...f, category_id: v }))}
                    options={categories.map(c => ({ value: c.id, label: c.name }))}
                  />
                </div>
                <div><label className="form-label">Starting Price (₹)</label><input type="number" className="form-input" value={form.starting_price} onChange={e => setForm(f => ({ ...f, starting_price: e.target.value }))} /></div>
                <div><label className="form-label">Price Label</label><input className="form-input" value={form.price_label} onChange={e => setForm(f => ({ ...f, price_label: e.target.value }))} /></div>
                <div><label className="form-label">Delivery (days)</label><input type="number" className="form-input" value={form.delivery_days} onChange={e => setForm(f => ({ ...f, delivery_days: e.target.value }))} /></div>
                <div><label className="form-label">Revisions</label><input type="number" className="form-input" value={form.revisions} onChange={e => setForm(f => ({ ...f, revisions: e.target.value }))} /></div>
                <div><label className="form-label">File Formats</label><input className="form-input" value={form.file_formats} onChange={e => setForm(f => ({ ...f, file_formats: e.target.value }))} /></div>
              </div>
              
              {/* Thumbnail field with Unsplash Search */}
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Thumbnail Image URL</span>
                  <button 
                    type="button" 
                    onClick={() => setShowUnsplash(true)}
                    style={{ background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <ImageIcon size={14} /> Search Unsplash
                  </button>
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input className="form-input" style={{ flex: 1 }} value={form.thumbnail_url} onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))} placeholder="https://..." />
                  {form.thumbnail_url && (
                    <img src={form.thumbnail_url} alt="Thumbnail preview" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }} />
                  )}
                </div>

                {/* Or upload an image file from device */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.6rem' }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 600 }}>OR</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
                </div>
                <label
                  htmlFor="product_thumbnail_file"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.6rem',
                    padding: '0.65rem 0.85rem', borderRadius: '0.65rem',
                    border: '1px dashed var(--border-light)', background: 'var(--bg-subtle)',
                    cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-subtle)',
                  }}
                >
                  <Upload size={16} color="var(--brand-violet)" />
                  {thumbnailFileName || 'Upload image from device...'}
                </label>
                <input
                  id="product_thumbnail_file"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => setThumbnailFileName(e.target.files?.[0]?.name || '')}
                />
                {thumbnailFileName && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.4rem' }}>
                    This file will be used instead of the URL above when you save.
                  </p>
                )}
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
        </div>
      )}

      {/* Unsplash Modal */}
      {showUnsplash && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 800, height: '80vh', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3>Select Image from Unsplash</h3>
              <button onClick={() => setShowUnsplash(false)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>Close</button>
            </div>
            <UnsplashImageSearch 
              initialQuery={form.name || 'business'}
              onSelect={(img) => {
                setForm(f => ({ ...f, thumbnail_url: img.url }));
                setShowUnsplash(false);
              }} 
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem' }}>{[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 52, marginBottom: '0.75rem' }} />)}</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748B' }}><Package size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} /><p>{searchQuery ? 'No matching services found.' : 'No services yet.'}</p></div>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Delivery</th><th>Featured</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(p => (
                <tr key={p.id} style={{ opacity: p.is_active ? 1 : 0.6, backgroundColor: p.is_active ? 'transparent' : 'var(--bg-subtle)' }}>
                  <td><div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.name}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{p.slug}</div></td>
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

      {/* Pagination */}
      {!loading && filteredProducts.length > PAGE_SIZE && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ width: 34, height: 34, borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: page === 1 ? '#475569' : '#A78BFA', cursor: page === 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>
              Page {page} of {Math.ceil(filteredProducts.length / PAGE_SIZE)}
            </span>
            <button
              onClick={() => setPage(p => Math.min(Math.ceil(filteredProducts.length / PAGE_SIZE), p + 1))}
              disabled={page === Math.ceil(filteredProducts.length / PAGE_SIZE)}
              style={{ width: 34, height: 34, borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: page === Math.ceil(filteredProducts.length / PAGE_SIZE) ? '#475569' : '#A78BFA', cursor: page === Math.ceil(filteredProducts.length / PAGE_SIZE) ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
