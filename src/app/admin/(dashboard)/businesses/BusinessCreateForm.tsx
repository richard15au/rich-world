'use client';

import { useActionState, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  RotateCcw,
  AppWindow,
  Layers,
} from 'lucide-react';
import { createBusinessAction, type CreateBusinessState } from './actions';

interface ApplicationOption {
  id: string;
  name: string;
  slug: string;
  appType: string;
}

interface BusinessCreateFormProps {
  availableApplications: ApplicationOption[];
  onSuccess?: (business: { id: string; slug: string; name: string }) => void;
  onCancel?: () => void;
  backHref?: string;
}

const initialState: CreateBusinessState = {};

export default function BusinessCreateForm({
  availableApplications,
  onSuccess,
  onCancel,
  backHref = '/admin/businesses',
}: BusinessCreateFormProps) {
  const [state, formAction, isPending] = useActionState(createBusinessAction, initialState);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState('');

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
    if (state.success && state.business && onSuccess) {
      onSuccess(state.business);
    }
  }, [state.success, state.business, onSuccess]);

  // Success view
  if (state.success && state.business) {
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxWidth: '540px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Business Registered Successfully!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--text-primary)' }}>{state.business.name}</strong> (
            <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>
              {state.business.slug}
            </code>
            ) has been recorded in Neon PostgreSQL as an active operational entity.
          </p>
        </div>

        {/* Linked Application details if created */}
        {state.business.linkedApplicationName && (
          <div
            className="glass-panel"
            style={{
              padding: '1rem 1.25rem',
              maxWidth: '520px',
              width: '100%',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              background: 'rgba(99, 102, 241, 0.08)',
              borderColor: 'rgba(99, 102, 241, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-indigo)', fontSize: '0.825rem', fontWeight: 600 }}>
              <Layers size={14} />
              <span>Connected Application: {state.business.linkedApplicationName}</span>
            </div>
            {state.business.purpose && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
                &ldquo;{state.business.purpose}&rdquo;
              </p>
            )}
          </div>
        )}

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
              <Building2 size={15} />
              <span>Back to Businesses List</span>
            </button>
          ) : (
            <Link
              href={backHref}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Building2 size={15} />
              <span>Back to Businesses List</span>
            </Link>
          )}

          <Link
            href="/businesses"
            target="_blank"
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ExternalLink size={14} />
            <span>View Public Businesses</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setName('');
              setSlug('');
              setSelectedAppId('');
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.55rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(168, 85, 247, 0.12)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              display: 'inline-flex',
              color: 'var(--accent-purple)',
            }}
          >
            <Building2 size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>New Business Registration</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Register a business, studio, or corporate office and connect it to supporting software applications.
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

      {/* Global Error Notice */}
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
        {/* Name & Slug */}
        <div className="grid-2" style={{ gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="name" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Business / Office Name <span style={{ color: '#f87171' }}>*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. RichAcademy"
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
              placeholder="e.g. richacademy"
              className="form-input"
              style={{ fontFamily: 'var(--font-mono)' }}
            />
            {state.fieldErrors?.slug ? (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.slug}</span>
            ) : (
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                Lowercase alphanumeric with hyphens (e.g. &quot;richacademy&quot;).
              </span>
            )}
          </div>
        </div>

        {/* Legal Type & Role */}
        <div className="grid-2" style={{ gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="legalType" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Legal / Entity Type <span style={{ color: '#f87171' }}>*</span>
            </label>
            <select id="legalType" name="legalType" defaultValue="STUDIO" className="form-input">
              <option value="STUDIO">STUDIO — Creative Studio / Academy / Lab</option>
              <option value="COMPANY">COMPANY — Incorporated Commercial Entity</option>
              <option value="AGENCY">AGENCY — Agency / Client Services</option>
              <option value="FREELANCE">FREELANCE — Freelance / Independent Practice</option>
            </select>
            {state.fieldErrors?.legalType && (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.legalType}</span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="role" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Your Role / Title <span style={{ color: '#f87171' }}>*</span>
            </label>
            <input
              id="role"
              name="role"
              type="text"
              required
              placeholder="e.g. Founder & Director"
              className="form-input"
            />
            {state.fieldErrors?.role ? (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.role}</span>
            ) : (
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                Your operational leadership title in this entity.
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
            placeholder="Executive overview of the business mission, operational focus, services, and audience..."
            className="form-input"
            style={{ resize: 'vertical', lineHeight: 1.5 }}
          />
          {state.fieldErrors?.summary && (
            <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.summary}</span>
          )}
        </div>

        {/* Status & Website URL */}
        <div className="grid-2" style={{ gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="status" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Operational Status <span style={{ color: '#f87171' }}>*</span>
            </label>
            <select id="status" name="status" defaultValue="ACTIVE" className="form-input">
              <option value="ACTIVE">ACTIVE — Currently Operating</option>
              <option value="INACTIVE">INACTIVE — Inactive / Archived</option>
            </select>
            {state.fieldErrors?.status && (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.status}</span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="websiteUrl" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Website URL <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Optional)</span>
            </label>
            <input
              id="websiteUrl"
              name="websiteUrl"
              type="url"
              placeholder="https://richacademy.io"
              className="form-input"
            />
            {state.fieldErrors?.websiteUrl && (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.websiteUrl}</span>
            )}
          </div>
        </div>

        {/* Connected Application Section (Optional Relationship) */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AppWindow size={18} color="var(--accent-indigo)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Connect Existing Application <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Optional)</span>
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '-0.35rem' }}>
            Link a software application that powers this business, along with the operational purpose of that relationship.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="applicationId" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Select Application
            </label>
            <select
              id="applicationId"
              name="applicationId"
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="form-input"
            >
              <option value="">-- None (Do not connect an application at this time) --</option>
              {availableApplications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name} (/{app.slug}) — {app.appType}
                </option>
              ))}
            </select>
            {state.fieldErrors?.applicationId && (
              <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.applicationId}</span>
            )}
          </div>

          {selectedAppId && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label htmlFor="purpose" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Relationship Purpose <span style={{ color: '#f87171' }}>*</span>
              </label>
              <textarea
                id="purpose"
                name="purpose"
                rows={2}
                required={Boolean(selectedAppId)}
                placeholder="e.g. Primary learning management platform powering student onboarding, courses, and interactive learning."
                className="form-input"
                style={{ resize: 'vertical', lineHeight: 1.5 }}
              />
              {state.fieldErrors?.purpose ? (
                <span style={{ fontSize: '0.775rem', color: '#f87171' }}>{state.fieldErrors.purpose}</span>
              ) : (
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  State the specific operational role or function this software system performs for this business.
                </span>
              )}
            </div>
          )}
        </div>

        {/* Public Visibility Checkbox */}
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
              style={{ width: '1rem', height: '1rem', accentColor: 'var(--accent-purple)' }}
            />
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Public Visibility
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Make this business entity visible on the public /businesses catalog.
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
            {isPending ? 'Registering Business...' : 'Register Business'}
          </button>
        </div>
      </form>
    </div>
  );
}
