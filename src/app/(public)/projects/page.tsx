import type { Metadata } from 'next';
import Link from 'next/link';
import { FolderGit2, ExternalLink, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Projects | RICH WORLD',
  description: 'Explore high-level architectural initiatives and systems in Rich World.',
};

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  ACTIVE: { label: 'Active', badgeClass: 'badge-emerald' },
  MAINTENANCE: { label: 'Maintenance', badgeClass: 'badge-amber' },
  ARCHIVED: { label: 'Archived', badgeClass: 'badge-slate' },
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FolderGit2 size={24} color="var(--accent-indigo)" />
          <h1 style={{ fontSize: '2rem' }}>Projects</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px' }}>
          High-level architectural initiatives that group and contain deployable applications.
        </p>
      </header>

      {projects.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              display: 'inline-flex',
              color: 'var(--accent-indigo)',
            }}
          >
            <FolderGit2 size={32} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxWidth: '420px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>No public projects yet.</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Projects will appear here as they are published from the ecosystem pipeline and command center.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid-2">
          {projects.map((project) => {
            const statusConfig = STATUS_CONFIG[project.status] ?? {
              label: project.status,
              badgeClass: 'badge-slate',
            };

            return (
              <article
                key={project.id}
                className="glass-panel interactive"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Link
                      href={`/projects/${project.slug}`}
                      style={{
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        display: 'inline-flex',
                        color: 'var(--accent-indigo)',
                      }}
                      title={`View ${project.title} details`}
                    >
                      <FolderGit2 size={18} />
                    </Link>
                    {project.featured && <span className="badge badge-cyan">Featured</span>}
                  </div>
                  <span className={`badge ${statusConfig.badgeClass}`}>{statusConfig.label}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <Link
                    href={`/projects/${project.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      width: 'fit-content',
                    }}
                  >
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{project.title}</h2>
                    <ArrowRight size={15} color="var(--accent-cyan)" />
                  </Link>
                  <p style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>
                    {project.tagline}
                  </p>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
                  {project.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    marginTop: 'auto',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span>Details</span>
                    <ArrowRight size={13} />
                  </Link>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      <ExternalLink size={13} />
                      <span>Live Application</span>
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      <ExternalLink size={13} />
                      <span>Repository</span>
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
