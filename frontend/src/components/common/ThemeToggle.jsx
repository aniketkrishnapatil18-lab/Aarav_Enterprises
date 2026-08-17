import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '', style = {} }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        border: '1px solid var(--border-light)',
        background: 'var(--bg-subtle)',
        color: 'var(--text-main)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        ...style,
      }}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle Theme Mode"
    >
      {isDark ? (
        <Sun size={20} color="#F59E0B" className="sun-icon" />
      ) : (
        <Moon size={20} color="#7C3AED" className="moon-icon" />
      )}
    </button>
  );
}
