'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Milestone,
  CheckCircle2,
  Globe,
  Radio,
  Clock,
} from 'lucide-react';
import ProjectCreateForm from './ProjectCreateForm';

interface IdeaOption {
  id: string;
  title: string;
  slug: string;
}

interface ProjectRecord {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  status: string;
  featured: boolean;
  repoUrl: string | null;
  liveUrl: string | null;
  isPublic: boolean;
  createdAt: Date | string;
  idea: {
    title: string;
  } | null;
}

interface ProjectsAdminClientProps {
  initialProjects: ProjectRecord[];
  availableIdeas: IdeaOption[];
  initialMode?: 'list' | 'create';
}

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  ACTIVE: { label: 'Active', badgeClass: 'badge-emerald' },
  MAINTENANCE: { label: 'Maintenance', badgeClass: 'badge-amber' },
  ARCHIVED: { label: 'Archived', badgeClass: 'badge-slate' },
};

export default function ProjectsAdminClient({
  initialProjects,
  availableIdeas,
  initialMode = 'list',
}: ProjectsAdminClientProps) {
  const [mode, setMode] = useState<'list' | 'create'>(initialMode);
  const [justCreatedSlug, setJustCreatedSlug] = useState<string | null>(null);

  const handleProjectCreated = (newProject: { id: string; slug: string; title: string }) => {
    setJustCreatedSlug(newProject.slug);
    // Note: revalidatePath runs in the server action, so page refresh will fetch latest data
    setMode('list');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'inline-flex',
              color: 'var(--accent-indigo)',
            }}
          >
            <FolderGit2 size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.85rem' }}>Projects Management</h1>
              <span className="badge badge-slate" style={{ fontSize: '0.75rem' }}>
                {initialProjects.length} {initialProjects.length === 1 ? 'Record' : 'Records'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Owner control for formulating, configuring, and publishing portfolio engineering projects.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            href="/projects"
            target="_blank"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <ExternalLink size={13} />
            <span>Public Listing</span>
          </Link>

          {mode === 'list' ? (
            <button
              type="button"
              onClick={() => {
                setJustCreatedSlug(null);
                setMode('create');
              }}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={15} />
              <span>New Project</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode('list')}
              className="btn btn-secondary btn-sm"
            >
              <span>Back to Projects List</span>
            </button>
          )}
        </div>
      </header>

      {/* Just created notification banner */}
      {justCreatedSlug && mode === 'list' && (
        <div
          className="glass-panel"
          style={{
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            background: 'rgba(16, 185, 129, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#34d399' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: '0.875rem' }}>
              Project created successfully! Check the listing below.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setJustCreatedSlug(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main View: Create Form vs Project List */}
      {mode === 'create' ? (
        <ProjectCreateForm
          availableIdeas={availableIdeas}
          onSuccess={handleProjectCreated}
          onCancel={() => setMode('list')}
        />
      ) : initialProjects.length === 0 ? (
        /* Empty State */
        <div
          className="glass-panel"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
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
            <FolderGit2 size={36} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxWidth: '440px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>No projects recorded yet</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Use the creation form to register your first engineering project in Neon PostgreSQL.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMode('create')}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}
          >
            <Plus size={16} />
            <span>Create Your First Project</span>
          </button>
        </div>
      ) : (
        /* Project Listing */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {initialProjects.map((project) => {
            const statusConfig = STATUS_CONFIG[project.status] ?? {
              label: project.status,
              badgeClass: 'badge-slate',
            };
            const createdDate = new Date(project.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <article
                key={project.id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  borderColor:
                    justCreatedSlug === project.slug ? 'var(--accent-cyan)' : undefined,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{project.title}</h3>
                    <code
                      style={{
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      /{project.slug}
                    </code>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${statusConfig.badgeClass}`}>{statusConfig.label}</span>
                    {project.isPublic ? (
                      <span className="badge badge-cyan">Public</span>
                    ) : (
                      <span className="badge badge-slate">Private / Draft</span>
                    )}
                    {project.featured && <span className="badge badge-purple">Featured</span>}
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>
                  {project.tagline}
                </p>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {project.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} />
                      <span>{createdDate}</span>
                    </span>

                    {project.idea && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-amber)' }}>
                        <Milestone size={13} />
                        <span>Source Idea: {project.idea.title}</span>
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: 'var(--text-secondary)',
                          fontSize: '0.775rem',
                        }}
                      >
                        <Radio size={12} />
                        <span>Repo</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: 'var(--accent-cyan)',
                          fontSize: '0.775rem',
                        }}
                      >
                        <Globe size={12} />
                        <span>Live</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
