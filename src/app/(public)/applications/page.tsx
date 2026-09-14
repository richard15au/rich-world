import type { Metadata } from 'next';
import Link from 'next/link';
import { AppWindow, ExternalLink, FolderGit2, Code2, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Applications | RICH WORLD',
  description: 'Explore deployable web applications, APIs, services, and developer tools in Rich World.',
};

const APP_TYPE_BADGE: Record<string, string> = {
  WEB: 'badge-cyan',
  API: 'badge-indigo',
  CLI: 'badge-amber',
  SERVICE: 'badge-purple',
  MOBILE: 'badge-emerald',
};

export default async function ApplicationsPage() {
  const applications = await prisma.application.findMany({
    where: { isPublic: true },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AppWindow size={24} color="var(--accent-indigo)" />
          <h1 style={{ fontSize: '2rem' }}>Applications</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px' }}>
          Concrete software systems, user interfaces, services, and CLI tools contained within projects.
        </p>
      </header>

      {applications.length === 0 ? (
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
            <AppWindow size={32} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxWidth: '420px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>No public applications yet.</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Applications will appear here as deployable software systems are published from engineering projects.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid-2">
          {applications.map((app) => {
            const typeBadge = APP_TYPE_BADGE[app.appType] ?? 'badge-slate';

            return (
              <article
                key={app.id}
                className="glass-panel interactive"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {/* Top Row: AppType Badge + Parent Project Pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Link
                      href={`/applications/${app.slug}`}
                      style={{
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        display: 'inline-flex',
                        color: 'var(--accent-indigo)',
                      }}
                      title={`View ${app.name} details`}
                    >
                      <AppWindow size={18} />
                    </Link>
                    <span className={`badge ${typeBadge}`}>{app.appType}</span>
                  </div>

                  {app.project && (
                    <Link
                      href={`/projects/${app.project.slug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.775rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--accent-cyan)',
                        transition: 'border-color var(--transition-fast)',
                      }}
                      title={`Belongs to Project: ${app.project.title}`}
                    >
                      <FolderGit2 size={12} />
                      <span>{app.project.title}</span>
                    </Link>
                  )}
                </div>

                {/* Application Name as Link */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <Link
                    href={`/applications/${app.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      width: 'fit-content',
                    }}
                  >
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{app.name}</h2>
                    <ArrowRight size={15} color="var(--accent-cyan)" />
                  </Link>
                </div>

                {/* Summary */}
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
                  {app.summary}
                </p>

                {/* Tech Stack Pills */}
                {app.techStack && app.techStack.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <Code2 size={13} color="var(--text-muted)" />
                    {app.techStack.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links / Actions */}
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
                    href={`/applications/${app.slug}`}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span>Details</span>
                    <ArrowRight size={13} />
                  </Link>

                  {app.liveUrl && (
                    <a
                      href={app.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      <ExternalLink size={13} />
                      <span>Live App</span>
                    </a>
                  )}
                  {app.repoUrl && (
                    <a
                      href={app.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      <ExternalLink size={13} />
                      <span>Repo</span>
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
