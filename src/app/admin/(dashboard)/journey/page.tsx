import { Milestone } from 'lucide-react';

export default function AdminJourneyPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Milestone size={22} color="var(--accent-amber)" />
        <h1 style={{ fontSize: '1.75rem' }}>Journey Milestones Management</h1>
      </header>
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Admin Journey timeline management shell — CRUD actions will be wired here.</p>
      </div>
    </div>
  );
}
