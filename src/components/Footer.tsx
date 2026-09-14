export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
        padding: '2rem 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.825rem',
          color: 'var(--text-muted)',
        }}
      >
        <div>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
            RICH WORLD
          </span>{' '}
          — Turning ideas into reality
        </div>
        <div>Next.js 16 • PostgreSQL • Prisma • Neon</div>
      </div>
    </footer>
  );
}
