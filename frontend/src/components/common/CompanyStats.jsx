import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

const FALLBACK_COMPANY_PROFILE = {
  natureOfBusiness: 'Service Provider & Manufacturer',
  totalEmployees: '11 to 25 People',
  yearOfEstablishment: '2016',
  legalStatus: 'Proprietorship',
  annualTurnover: '₹1 - 2 Crore',
  gstNumber: '27ABCDE1234F1Z5',
  isVerified: true,
};

export function Badge({ text, icon: Icon, variant = 'purple' }) {
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return {
          bg: 'rgba(16, 185, 129, 0.15)',
          text: 'var(--brand-emerald)',
          border: 'rgba(16, 185, 129, 0.3)',
        };
      case 'purple':
      default:
        return {
          bg: 'var(--badge-bg-purple)',
          text: 'var(--brand-violet)',
          border: 'var(--badge-border-purple)',
        };
    }
  };

  const styles = getStyles();

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
      background: styles.bg, color: styles.text,
      border: `1px solid ${styles.border}`,
      padding: '0.2rem 0.65rem', borderRadius: 999,
      fontSize: '0.75rem', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.05em',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {Icon && <Icon size={14} />}
      {text}
    </span>
  );
}

export function StatCard({ label, value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{
        padding: '1.25rem',
        borderRight: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'var(--bg-card)',
      }}
      className="stat-card-border"
    >
      <div style={{
        fontSize: '0.75rem', color: 'var(--text-subtle)',
        textTransform: 'uppercase', letterSpacing: '0.05em',
        fontWeight: 600, marginBottom: '0.25rem'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)'
      }}>
        {value}
      </div>
    </motion.div>
  );
}

export function CompanyStatsGrid({ profile = FALLBACK_COMPANY_PROFILE }) {
  const stats = [
    { label: 'Nature of Business', value: profile.natureOfBusiness },
    { label: 'Total Employees', value: profile.totalEmployees },
    { label: 'Year of Establishment', value: profile.yearOfEstablishment },
    { label: 'Legal Status of Firm', value: profile.legalStatus },
    { label: 'Annual Turnover', value: profile.annualTurnover },
    { label: 'GST No.', value: profile.gstNumber },
  ];

  return (
    <section className="section" style={{ background: 'var(--bg-main)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', margin: 0 }}>Company <span className="gradient-text">Profile</span></h2>
            {profile.isVerified && (
              <Badge text="Verified" icon={ShieldCheck} variant="success" />
            )}
          </div>
          <p className="section-subtitle" style={{ maxWidth: 600, margin: '0 auto' }}>
            Key statistics and legal details about Aarav Enterprises.
          </p>
        </div>

        <div style={{
          maxWidth: 900, margin: '0 auto',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid var(--border-light)',
          borderRight: 'none',
          borderBottom: 'none',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          }}>
            {stats.map((stat, i) => (
              <StatCard key={i} index={i} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
