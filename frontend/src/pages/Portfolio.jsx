import { useState, useEffect } from 'react';
import { portfolioAPI, categoryAPI, clientAPI, videoAPI } from '../services/api';
import { openWhatsApp } from '../utils/helpers';
import { CheckCircle2, Factory, Info, Award, MessageSquare, Download, Briefcase, ChevronRight } from 'lucide-react';
import AdminAccessSection from '../components/AdminAccess/AdminAccessSection';
import VideoCard from '../components/common/VideoCard';
import VideoLightboxModal from '../components/common/VideoLightboxModal';

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('intro');
  const [activeCat, setActiveCat] = useState('all');
  const [selected, setSelected] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    document.title = 'Portfolio — Aarav Enterprises';
    async function load() {
      try {
        const [pRes, cRes, clRes, vRes] = await Promise.all([
          portfolioAPI.list({ active: true }),
          categoryAPI.list({ active: true }),
          clientAPI.list({ active: true }),
          videoAPI.list({ active: true }),
        ]);
        setItems(pRes.data.data || []);
        setCategories(cRes.data.data || []);
        setClients(clRes.data.data || []);
        setVideos(vRes.data.data || []);
      } catch {
        setItems(FALLBACK_PORTFOLIO);
        setCategories(FALLBACK_CATS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredItems = activeCat === 'all' ? items : items.filter(i => i.category_slug === activeCat || i.category_id?.toString() === activeCat);

  const sidebarTabs = [
    { id: 'intro', label: 'Introduction & Profiles' },
    { id: 'testimonial', label: 'Testimonial' },
    { id: 'about', label: 'About The Company' },
    { id: 'brochure', label: 'Download Brochure' },
    { id: 'clients', label: 'Our Clients' },
    { id: 'videos', label: 'Videos' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'intro':
        return (
          <div className="tab-content-animation">
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontFamily: 'Outfit' }}>Introduction & Profiles</h2>
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                “Aarav Enterprises” is a well-known Manufacturer of a trendy and flawless assortment of LED Sign Boards, Designer Canopies, Innovative Branding, etc. Incepted in the year 2019 at Pune (Maharashtra, India), we design these products as per current market trends. We are actively committed to providing high-quality products that are widely appreciated for their mesmerizing look, smooth texture, longevity, and colorfastness. Managed under the headship of our CEO, our firm has covered a foremost share in the market.
              </p>
            </div>

            <h3 style={{ fontSize: '1.4rem', marginTop: '3rem', marginBottom: '1.2rem', color: 'var(--text-main)', fontFamily: 'Outfit' }}>Statutory Profile</h3>
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><CheckCircle2 size={16} color="var(--brand-violet)" /> Bank: HDFC Bank Ltd.</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--brand-violet)" /> GST No: 27AAMCM4944N1ZQ (Placeholder)</li>
              </ul>
            </div>

            <h3 style={{ fontSize: '1.4rem', marginTop: '3rem', marginBottom: '1.2rem', color: 'var(--text-main)', fontFamily: 'Outfit' }}>Why Us?</h3>
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                We are an eminent firm that is actively committed to offering a premium quality range of products within the minimum time and at genuine rates. Few of the essential factors that help us to become the prime choice of our patrons are listed below:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-main)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {['Qualitative products', 'Dexterous team of professionals', 'Client-centric approach', 'Positive records', 'Excellent transport & logistic facility', 'Economical price range', 'Prompt delivery'].map((point, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.4rem', borderRadius: '50%' }}><Award size={14} color="var(--brand-emerald)" /></div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <h3 style={{ fontSize: '1.4rem', marginTop: '3rem', marginBottom: '1.2rem', color: 'var(--text-main)', fontFamily: 'Outfit' }}>Infrastructural Set-Up</h3>
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                At Aarav Enterprises, our advanced manufacturing facility is the heart of our operations, equipped with cutting-edge technology and machinery. This state-of-the-art setup allows us to deliver high-quality, precision-driven solutions across a wide range of printing and signage services.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-main)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {['GRANDO 5121 SOLVENT PRINTER', 'HP LATEX 560 PRINTER', 'UV FLATBED', 'UV ROLL TO ROLL', 'CNC CHANNEL BENDER', 'LASER MACHINE 8X4', 'CNC ROUTER 12X5', 'ECO SOLVENT DUALHEAD', 'VINYL PLOTTER', 'XL JET LAMINATION MACHINE'].map((machine, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                    <Factory size={16} color="var(--brand-amber)" /> {machine}
                  </li>
                ))}
              </ul>
            </div>

            <h3 style={{ fontSize: '1.4rem', marginTop: '3rem', marginBottom: '1.2rem', color: 'var(--text-main)', fontFamily: 'Outfit' }}>Our Warehouse</h3>
            <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                We maintain a spacious and well-organized warehouse facility that allows us to store raw materials and finished products safely. Our inventory management ensures rapid deployment and uninterrupted supply for large scale projects.
              </p>
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div className="tab-content-animation" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--text-main)', fontFamily: 'Outfit' }}>Client Testimonials</h2>
            <p style={{ color: 'var(--text-muted)' }}>Feedback and reviews from our valued clients will be updated here shortly.</p>
          </div>
        );

      case 'about':
        return (
          <div className="tab-content-animation">
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontFamily: 'Outfit' }}>About The Company</h2>
            <div className="glass-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1rem' }}>
                Aarav Enterprises, based in Pune, specializes in premium printing and innovative signage solutions. With over a decade of experience, we offer expertise in large-format printing, wayfinding systems, and branded office environments. Our services span a range of materials and projects, from detailed architectural signage to impactful building wraps and billboards for brand launches.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                Our commitment to quality is matched by our mastery of cutting-edge technology, allowing us to deliver high-calibre products, even within tight timelines. Our facility is where creativity, precision, and craftsmanship converge, creating a seamless journey from concept to completion—all under one roof. With a proven track record, Aarav Enterprises stands as a trusted leader in visual communication. Our legacy reflects extensive branding initiatives and successful projects across diverse sectors, backed by a dedication to excellence, innovation, and client satisfaction.
              </p>
            </div>
          </div>
        );

      case 'brochure':
        return (
          <div className="tab-content-animation" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ display: 'inline-flex', background: 'var(--badge-bg-purple)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <Download size={40} color="var(--brand-violet)" />
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--text-main)', fontFamily: 'Outfit' }}>Download Brochure</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Get a complete overview of our services, products, and manufacturing capabilities.</p>
            <button className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem', borderRadius: '999px' }}>
              Download PDF Brochure
            </button>
          </div>
        );

      case 'clients':
        return (
          <div className="tab-content-animation" style={{ width: '100%' }}>
            <AdminAccessSection isPageTab={true} dynamicClients={clients} />
          </div>
        );

      case 'videos':
        return (
          <div className="tab-content-animation" style={{ width: '100%' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontFamily: 'Outfit' }}>Product Videos</h2>

            {videos.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No videos are currently available.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} onOpen={setActiveVideo} />
                ))}
              </div>
            )}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ paddingTop: 90 }}>


      <div className="container section" style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* Sidebar Menu */}
        <div style={{ flex: '1 1 280px', maxWidth: '320px', position: 'sticky', top: 120 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sidebarTabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    textAlign: 'left',
                    padding: '1.25rem 1.5rem',
                    borderRadius: '0.75rem',
                    background: isActive ? 'var(--badge-bg-purple)' : 'var(--bg-surface)',
                    color: isActive ? 'var(--brand-violet)' : 'var(--text-main)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--brand-violet)' : 'transparent',
                    fontSize: '1rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? 'none' : '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: '3 1 600px', minWidth: 0 }}>
          {renderContent()}
        </div>

      </div>

      {/* Lightbox for Portfolio Tab */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 800, width: '100%', background: 'var(--bg-surface)', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)' }}>
            <img src={selected.image_url} alt={selected.title} style={{ width: '100%', objectFit: 'cover', maxHeight: 450 }}
              onError={e => { e.target.src = `https://placehold.co/800x450/160C33/A78BFA?text=${encodeURIComponent(selected.title)}`; }} />
            <div style={{ padding: '2rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--brand-violet)', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{selected.category_name}</div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--text-main)', fontFamily: 'Outfit' }}>{selected.title}</h3>
              {selected.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{selected.description}</p>}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button onClick={() => openWhatsApp(`Hi! I'm interested in a design similar to your "${selected.title}" (${selected.category_name}).`, selected.category_name)} className="btn-whatsapp" style={{ flex: 1, justifyContent: 'center', padding: '0.8rem', borderRadius: '0.5rem' }}>Enquire for Similar Design</button>
                <button onClick={() => setSelected(null)} className="btn-secondary" style={{ padding: '0.8rem 1.5rem', borderRadius: '0.5rem' }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox for Videos Tab */}
      {activeVideo && (
        <VideoLightboxModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .tab-content-animation { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}

const FALLBACK_PORTFOLIO = [
  { id: 1, title: 'Modern Tech Logo', category_name: 'Logo Design', category_slug: 'logo-design', image_url: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 2, title: 'Premium Business Card', category_name: 'Visiting Card', category_slug: 'visiting-card', image_url: 'https://images.pexels.com/photos/6804104/pexels-photo-6804104.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 3, title: '3D Corporate Brand', category_name: '3D Logo', category_slug: '3d-logo-design', image_url: 'https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 4, title: 'Instagram Post', category_name: 'Social Media', category_slug: 'social-media-design', image_url: 'https://images.pexels.com/photos/3178818/pexels-photo-3178818.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 5, title: 'Restaurant Menu', category_name: 'Menu Card', category_slug: 'menu-card-design', image_url: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 6, title: 'Festival Banner', category_name: 'Banner Design', category_slug: 'banner-design', image_url: 'https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 7, title: 'Business Brochure', category_name: 'Brochure', category_slug: 'brochure-design', image_url: 'https://images.pexels.com/photos/6476254/pexels-photo-6476254.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 8, title: 'Event Flyer', category_name: 'Pamphlet/Flyer', category_slug: 'pamphlet-flyer', image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 9, title: 'Advertisement Creative', category_name: 'Advertisement', category_slug: 'advertisement', image_url: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=600' },
];
const FALLBACK_CATS = [
  { id: 1, name: 'Logo Design', slug: 'logo-design' },
  { id: 2, name: 'Visiting Card', slug: 'visiting-card' },
  { id: 9, name: 'Social Media', slug: 'social-media-design' },
];

const FALLBACK_VIDEOS = [
  {
    id: 1,
    title: 'Aarav Enterprises Overview',
    description: 'Learn about our journey, values, and the printing services we offer to businesses in Pune.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: 2,
    title: 'UV Printing Demo',
    description: 'Watch our advanced UV flatbed printer in action, creating stunning large-format displays.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620601831868-b80c9a444a77?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: 3,
    title: 'Manufacturing Facility Tour',
    description: 'Take a virtual tour of our 10,000 sq ft manufacturing warehouse located in the heart of Pune.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
];
