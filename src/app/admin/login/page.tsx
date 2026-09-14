'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Lock } from 'lucide-react';

function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Authentication failed');
        setLoading(false);
        return;
      }

      router.push(redirectUrl);
      router.refresh();
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }}>
        <div
          style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
          }}
        >
          <Shield size={28} color="var(--accent-amber)" />
        </div>
        <h1 style={{ fontSize: '1.5rem' }}>Admin Access</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Enter your owner passphrase to access the command center.
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '0.85rem',
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label htmlFor="passphrase" style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Passphrase
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="passphrase"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
            />
            <Lock
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          {loading ? 'Authenticating...' : 'Unlock Console'}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <Suspense fallback={<div style={{ color: 'var(--text-muted)' }}>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
