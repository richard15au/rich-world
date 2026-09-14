import { Lightbulb } from 'lucide-react';

export default function IdeasPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lightbulb size={24} color="var(--accent-amber)" />
          <h1 style={{ fontSize: '2rem' }}>Ideas Incubator</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px' }}>
          The conceptual sparks, problem statements, and proposed solutions prior to implementation.
        </p>
      </header>

      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Public Ideas collection shell — read-only view connected to PostgreSQL.</p>
      </div>
    </div>
  );
}
