'use client';

import { useActionState, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AppWindow,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  RotateCcw,
  FolderGit2,
} from 'lucide-react';
import { createApplicationAction, type CreateApplicationState } from './actions';

interface ProjectOption {
  id: string;
  title: string;
  slug: string;
}

interface ApplicationCreateFormProps {
  availableProjects: ProjectOption[];
  onSuccess?: (app: { id: string; slug: string; name: string }) => void;
  onCancel?: () => void;
  backHref?: string;
}

const initialState: CreateApplicationState = {};

export default function ApplicationCreateForm({
  availableProjects,
  onSuccess,
  onCancel,
  backHref = '/admin/applications',
}: ApplicationCreateFormProps) {
  const [state, formAction, isPending] = useActionState(createApplicationAction, initialState);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);

  // Auto-generate slug from name unless manually edited
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (!isSlugManual) {
      const generated = newName
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
    const generated = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(generated);
    setIsSlugManual(false);
  };

  useEffect(() => {
    if (state.success && state.application && onSuccess) {
      onSuccess(state.application);
    }
  }, [state.success, state.application, onSuccess]);

  // If no projects exist, an application cannot be created
  if (availableProjects.length === 0) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'inline-flex',
            color: 'var(--accent-amber)',
          }}
        >
          <AlertCircle size={32} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxWidth: '480px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>No Projects Available</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Every application must belong to an umbrella architectural Project. Please register at least one Project in the ecosystem before creating an application.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Link
            href="/admin/projects/new"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <FolderGit2 size={15} />
            <span>Create a Project First</span>
          </Link>
          {onCancel ? (
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Back
            </button>
          ) : (
            <Link href={backHref} className="btn btn-secondary">
              Back to Applications
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Success view
  if (state.success && state.application) {
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Application Created Successfully!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--text-primary)' }}>{state.application.name}</strong> (
            <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
              {state.application.slug}
            </code>
            ) has been recorded in Neon PostgreSQL and linked to its parent project.
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
              <AppWindow size={15} />
              <span>Back to Applications List</span>
            </button>
          ) : (
            <Link
              href={backHref}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <AppWindow size={15} />
              <span>Back to Applications List</span>
            </Link>
          )}

          <Link
            href="/applications"
            target="_blank"
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ExternalLink size={14} />
            <span>View Public Applications</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setName('');
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
            <AppWindow size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>New Application Registration</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Register a deployable software unit and link it to an architectural project.
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
        {/* Parent Project Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label htmlFor="projectId" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Parent Project <span style={{ color: '#f87171' }}>*</span>
          </label>
          <select id="projectId" name="projectId" defaultValue={availableProjects[0]?.id} className="form-input" required>
            {availableProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} (/{p.slug})
              </option>
            ))}
          </select>
          {state.fieldErrors?.projectId ? (
            <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.projectId}</span>
          ) : (
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              The high-level engineering project this application belongs to.
            </span>
          )}
        </div>

        {/* Application Name & Slug */}
        <div className="grid-2" style={{ gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="name" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Application Name <span style={{ color: '#f87171' }}>*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. EduFlex Web App"
              className="form-input"
            />
            {state.fieldErrors?.name && (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.name}</span>
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
              placeholder="e.g. eduflex-app"
              className="form-input"
              style={{ fontFamily: 'var(--font-mono)' }}
            />
            {state.fieldErrors?.slug ? (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.slug}</span>
            ) : (
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                Lowercase alphanumeric with hyphens (e.g. &quot;eduflex-app&quot;).
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label htmlFor="summary" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Summary <span style={{ color: '#f87171' }}>*</span>
          </label>
          <textarea
            id="summary"
            name="summary"
            rows={3}
            required
            placeholder="Concise overview of this deployable system, user capabilities, and technical role..."
            className="form-input"
            style={{ resize: 'vertical', lineHeight: 1.5 }}
          />
          {state.fieldErrors?.summary && (
            <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.summary}</span>
          )}
        </div>

        {/* AppType & TechStack */}
        <div className="grid-2" style={{ gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="appType" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Application Type <span style={{ color: '#f87171' }}>*</span>
            </label>
            <select id="appType" name="appType" defaultValue="WEB" className="form-input">
              <option value="WEB">WEB — Web Application / Frontend</option>
              <option value="API">API — REST / GraphQL / Backend Service</option>
              <option value="CLI">CLI — Command Line Tool</option>
              <option value="SERVICE">SERVICE — Background Worker / Daemon</option>
              <option value="MOBILE">MOBILE — Native / Cross-platform Mobile App</option>
            </select>
            {state.fieldErrors?.appType && (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.appType}</span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="techStack" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Tech Stack <span style={{ color: '#f87171' }}>*</span>
            </label>
            <input
              id="techStack"
              name="techStack"
              type="text"
              required
              placeholder="Next.js, React, TypeScript, Prisma, PostgreSQL"
              className="form-input"
            />
            {state.fieldErrors?.techStack ? (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.techStack}</span>
            ) : (
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                Comma-separated list of frameworks, languages, and databases.
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
              placeholder="https://github.com/richard/eduflex"
              className="form-input"
            />
            {state.fieldErrors?.repoUrl && (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.repoUrl}</span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="liveUrl" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Live Deployment URL <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Optional)</span>
            </label>
            <input
              id="liveUrl"
              name="liveUrl"
              type="url"
              placeholder="https://eduflex.app"
              className="form-input"
            />
            {state.fieldErrors?.liveUrl && (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.liveUrl}</span>
            )}
          </div>
        </div>

        {/* Visibility Flag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}>
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
                Make this application visible on the public /applications catalog immediately.
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
            style={{ minWidth: '170px' }}
          >
            {isPending ? 'Creating Application...' : 'Create Application'}
          </button>
        </div>
      </form>
    </div>
  );
}
