import { Outlet } from 'react-router-dom';
import Navbar        from '../components/common/Navbar';
import Footer        from '../components/common/Footer';
import WhatsAppFloat from '../components/common/WhatsAppFloat';

export default function PublicLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
