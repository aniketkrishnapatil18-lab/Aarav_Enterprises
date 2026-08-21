import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { EnquiryModalProvider } from './context/EnquiryModalContext';
import EnquiryFormModal from './components/common/EnquiryFormModal';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout  from './layouts/AdminLayout';

// Public Pages
import Home          from './pages/Home';
import About         from './pages/About';
import Services      from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import CategoryProducts from './pages/CategoryProducts';
import Portfolio     from './pages/Portfolio';
import Pricing       from './pages/Pricing';
import Contact       from './pages/Contact';

// Admin Pages
import AdminLogin          from './pages/admin/AdminLogin';
import AdminDashboard      from './pages/admin/AdminDashboard';
import AdminInquiries      from './pages/admin/AdminInquiries';
import AdminInquiryDetail  from './pages/admin/AdminInquiryDetail';
import AdminCustomers       from './pages/admin/AdminCustomers';
import AdminCustomerDetail   from './pages/admin/AdminCustomerDetail';
import AdminConversations        from './pages/admin/AdminConversations';
import AdminConversationDetail  from './pages/admin/AdminConversationDetail';
import AdminProducts             from './pages/admin/AdminProducts';
import AdminPortfolio      from './pages/admin/AdminPortfolio';
import AdminKnowledge      from './pages/admin/AdminKnowledge';
import AdminNotifications  from './pages/admin/AdminNotifications';
import AdminReports        from './pages/admin/AdminReports';
import AdminSettings       from './pages/admin/AdminSettings';

export default function App() {
  return (
    <ThemeProvider>
      <EnquiryModalProvider>
        <BrowserRouter>
          <EnquiryFormModal />
          <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-surface)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-light)',
            },
          }}
        />
        <Routes>
          {/* Public Website */}
          <Route element={<PublicLayout />}>
            <Route path="/"              element={<Home />} />
            <Route path="/about"         element={<About />} />
            <Route path="/services"      element={<Services />} />
            <Route path="/services/:id"  element={<ServiceDetail />} />
            <Route path="/products/:category" element={<CategoryProducts />} />
            <Route path="/portfolio"     element={<Portfolio />} />
            <Route path="/pricing"       element={<Pricing />} />
            <Route path="/contact"       element={<Contact />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Panel */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index                   element={<AdminDashboard />} />
            <Route path="inquiries"        element={<AdminInquiries />} />
            <Route path="inquiries/:id"    element={<AdminInquiryDetail />} />
            <Route path="customers"        element={<AdminCustomers />} />
            <Route path="customers/:id"    element={<AdminCustomerDetail />} />
            <Route path="conversations"        element={<AdminConversations />} />
            <Route path="conversations/:id"    element={<AdminConversationDetail />} />
            <Route path="products"         element={<AdminProducts />} />
            <Route path="portfolio"        element={<AdminPortfolio />} />
            <Route path="knowledge"        element={<AdminKnowledge />} />
            <Route path="notifications"    element={<AdminNotifications />} />
            <Route path="reports"          element={<AdminReports />} />
            <Route path="settings"         element={<AdminSettings />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </EnquiryModalProvider>
    </ThemeProvider>
  );
}
