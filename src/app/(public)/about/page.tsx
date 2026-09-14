import { User } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={24} color="var(--accent-cyan)" />
          <h1 style={{ fontSize: '2rem' }}>About</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px' }}>
          Personal philosophy, architectural principles, and the background behind Rich World — turning ideas into reality.
        </p>
      </header>

      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Public About shell view.</p>
      </div>
    </div>
  );
}
