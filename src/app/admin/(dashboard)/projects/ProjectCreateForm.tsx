'use client';

import { useActionState, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { createProjectAction, type CreateProjectState } from './actions';

interface IdeaOption {
  id: string;
  title: string;
  slug: string;
}

interface ProjectCreateFormProps {
  availableIdeas: IdeaOption[];
  onSuccess?: (project: { id: string; slug: string; title: string }) => void;
  onCancel?: () => void;
  backHref?: string;
}

const initialState: CreateProjectState = {};

export default function ProjectCreateForm({
  availableIdeas,
  onSuccess,
  onCancel,
  backHref = '/admin/projects',
}: ProjectCreateFormProps) {
  const [state, formAction, isPending] = useActionState(createProjectAction, initialState);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);

  // Auto-generate slug from title unless manually edited
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isSlugManual) {
      const generated = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManual(true);
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
  };

  const handleRegenerateSlug = () => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(generated);
    setIsSlugManual(false);
  };

  useEffect(() => {
    if (state.success && state.project && onSuccess) {
      onSuccess(state.project);
    }
  }, [state.success, state.project, onSuccess]);

  if (state.success && state.project) {
    return (
      <div
        className="glass-panel animate-fade-in"
        style={{
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.25rem',
        }}
      >
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'inline-flex',
            color: 'var(--accent-emerald)',
          }}
        >
          <CheckCircle2 size={36} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Project Created Successfully!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--text-primary)' }}>{state.project.title}</strong> (
            <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
              {state.project.slug}
            </code>
            ) has been recorded in Neon PostgreSQL.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '0.75rem',
          }}
        >
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <FolderGit2 size={15} />
              <span>Back to Projects List</span>
            </button>
          ) : (
            <Link
              href={backHref}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <FolderGit2 size={15} />
              <span>Back to Projects List</span>
            </Link>
          )}

          <Link
            href="/projects"
            target="_blank"
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ExternalLink size={14} />
            <span>View Public Projects</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setTitle('');
              setSlug('');
              setIsSlugManual(false);
              window.location.reload();
            }}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RotateCcw size={14} />
            <span>Create Another</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass-panel"
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.55rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              display: 'inline-flex',
              color: 'var(--accent-indigo)',
            }}
          >
            <FolderGit2 size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>New Project Registration</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Add a new architectural project to Rich World ecosystem.
            </p>
          </div>
        </div>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} />
            <span>Back to List</span>
          </button>
        ) : (
          <Link
            href={backHref}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} />
            <span>Back to List</span>
          </Link>
        )}
      </div>

      {state.error && (
        <div
          style={{
            padding: '0.85rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={16} />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Title & Slug */}
        <div className="grid-2" style={{ gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="title" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Project Title <span style={{ color: '#f87171' }}>*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Distributed Cloud Core"
              className="form-input"
            />
            {state.fieldErrors?.title && (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.title}</span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label htmlFor="slug" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                URL Slug <span style={{ color: '#f87171' }}>*</span>
              </label>
              {isSlugManual && (
                <button
                  type="button"
                  onClick={handleRegenerateSlug}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <Sparkles size={11} />
                  <span>Auto-sync</span>
                </button>
              )}
            </div>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={slug}
              onChange={handleSlugChange}
              placeholder="e.g. distributed-cloud-core"
              className="form-input"
              style={{ fontFamily: 'var(--font-mono)' }}
            />
            {state.fieldErrors?.slug ? (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.slug}</span>
            ) : (
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                Unique identifier used in routes. Lowercase letters, numbers, and hyphens only.
              </span>
            )}
          </div>
        </div>

        {/* Tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label htmlFor="tagline" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Tagline <span style={{ color: '#f87171' }}>*</span>
          </label>
          <input
            id="tagline"
            name="tagline"
            type="text"
            required
            placeholder="High-level one-line summary of what this project accomplishes"
            className="form-input"
          />
          {state.fieldErrors?.tagline && (
            <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.tagline}</span>
          )}
        </div>

        {/* Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label htmlFor="description" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Description <span style={{ color: '#f87171' }}>*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            placeholder="Detailed architectural scope, objectives, technical components, and operational impact..."
            className="form-input"
            style={{ resize: 'vertical', lineHeight: 1.5 }}
          />
          {state.fieldErrors?.description && (
            <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.description}</span>
          )}
        </div>

        {/* Status, Idea Link, Featured & Visibility */}
        <div className="grid-2" style={{ gap: '1.25rem' }}>
          {/* Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="status" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Project Status <span style={{ color: '#f87171' }}>*</span>
            </label>
            <select id="status" name="status" defaultValue="ACTIVE" className="form-input">
              <option value="ACTIVE">ACTIVE — In active development or production</option>
              <option value="MAINTENANCE">MAINTENANCE — Stable and maintained</option>
              <option value="ARCHIVED">ARCHIVED — Completed historical project</option>
            </select>
            {state.fieldErrors?.status && (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.status}</span>
            )}
          </div>

          {/* Graduated from Idea (optional) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="ideaId" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Graduated Idea Link <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Optional)</span>
            </label>
            <select id="ideaId" name="ideaId" defaultValue="" className="form-input">
              <option value="">None — Independent initiative</option>
              {availableIdeas.map((idea) => (
                <option key={idea.id} value={idea.id}>
                  {idea.title} ({idea.slug})
                </option>
              ))}
            </select>
            {state.fieldErrors?.ideaId ? (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.ideaId}</span>
            ) : (
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                Links to the incubation idea this project formulated from.
              </span>
            )}
          </div>
        </div>

        {/* URLs */}
        <div className="grid-2" style={{ gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="repoUrl" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Repository URL <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Optional)</span>
            </label>
            <input
              id="repoUrl"
              name="repoUrl"
              type="url"
              placeholder="https://github.com/richard/my-repo"
              className="form-input"
            />
            {state.fieldErrors?.repoUrl && (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.repoUrl}</span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="liveUrl" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Live System URL <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Optional)</span>
            </label>
            <input
              id="liveUrl"
              name="liveUrl"
              type="url"
              placeholder="https://project.example.com"
              className="form-input"
            />
            {state.fieldErrors?.liveUrl && (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.liveUrl}</span>
            )}
          </div>
        </div>

        {/* Flags: Featured & IsPublic */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              defaultChecked
              style={{ width: '1rem', height: '1rem', accentColor: 'var(--accent-cyan)' }}
            />
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Public Visibility
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Publish project immediately on the public /projects listing.
              </p>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              id="featured"
              name="featured"
              style={{ width: '1rem', height: '1rem', accentColor: 'var(--accent-indigo)' }}
            />
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Featured Project
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Highlight project with special badge on homepage and atlas cards.
              </p>
            </div>
          </label>
        </div>

        {/* Form Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary"
            style={{ minWidth: '160px' }}
          >
            {isPending ? 'Creating Project...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
