import { Sparkles } from 'lucide-react';

export default function AdminSkillsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Sparkles size={22} color="var(--accent-emerald)" />
        <h1 style={{ fontSize: '1.75rem' }}>Skills Management</h1>
      </header>
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Admin Skills management shell — linking skills to projects, apps, and labs.</p>
      </div>
    </div>
  );
}
