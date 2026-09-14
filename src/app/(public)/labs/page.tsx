import { Server } from 'lucide-react';

export default function LabsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Server size={24} color="var(--accent-cyan)" />
          <h1 style={{ fontSize: '2rem' }}>Network Labs</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px' }}>
          Technical learning and virtualization environments (VMware + OPNsense + Linux/Docker).
        </p>
      </header>

      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Public Network Labs topology shell — read-only view connected to PostgreSQL.</p>
      </div>
    </div>
  );
}
