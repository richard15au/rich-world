import { Server } from 'lucide-react';

export default function AdminLabsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Server size={22} color="var(--accent-cyan)" />
        <h1 style={{ fontSize: '1.75rem' }}>Network Labs Management</h1>
      </header>
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Admin Network Labs management shell (VMware + OPNsense + Linux/Docker) — status toggles will be wired here.</p>
      </div>
    </div>
  );
}
