import { Sparkles } from 'lucide-react';

export default function SkillsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={24} color="var(--accent-emerald)" />
          <h1 style={{ fontSize: '2rem' }}>Skills Matrix</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px' }}>
          Demonstrated technical competencies linked directly to verified projects and network labs.
        </p>
      </header>

      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Public Skills matrix shell — read-only view connected to PostgreSQL.</p>
      </div>
    </div>
  );
}
