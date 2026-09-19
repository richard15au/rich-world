'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminHeaderTrigger() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if session cookie is active
    fetch('/api/analytics/visit', { method: 'GET' })
      .then((res) => res.json())
      .then((data) => {
        if (data.isAdmin) {
          setIsAdmin(true);
        }
      })
      .catch(() => {});

    // Secret keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A to jump straight to admin
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        router.push('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    <div
      className={`rich-admin-header-wrap ${isAdmin ? 'is-admin-active' : 'is-stealth'}`}
      title={isAdmin ? 'Admin Console' : 'Admin Access (Hover to reveal)'}
    >
      <Link
        href="/admin"
        className="rich-admin-header-btn"
        aria-label="Admin Console"
      >
        {isAdmin ? (
          <>
            <span className="rich-admin-beacon" />
            <Shield size={13} className="rich-admin-icon" />
            <span>Admin Console</span>
          </>
        ) : (
          <>
            <Lock size={12} className="rich-admin-icon" />
            <span>Admin</span>
          </>
        )}
      </Link>
    </div>
  );
}
