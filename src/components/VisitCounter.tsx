'use client';

import React, { useEffect, useState } from 'react';
import { Eye, ShieldCheck } from 'lucide-react';

export default function VisitCounter() {
  const [data, setData] = useState<{ visits: number; isAdmin: boolean }>({
    visits: 0,
    isAdmin: false,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/analytics/visit', { method: 'POST' })
      .then((res) => res.json())
      .then((json) => {
        if (typeof json.visits === 'number') {
          setData(json);
          setLoaded(true);
        }
      })
      .catch((err) => {
        console.error('Failed to load visits:', err);
      });
  }, []);

  return (
    <div
      className={`rich-visit-counter-wrap ${data.isAdmin ? 'is-admin' : 'is-stealth'}`}
      aria-label="Website Visit Counter"
    >
      <div
        className="rich-visit-pill"
        title={data.isAdmin ? 'Live Website Visits (Admin View)' : 'Live Website Visits (Stealth Mode)'}
      >
        {data.isAdmin ? (
          <>
            <span className="rich-admin-dot" />
            <span className="rich-visit-count">
              {data.visits.toLocaleString()} visits
            </span>
            <span className="rich-visit-badge">Admin</span>
          </>
        ) : (
          <>
            <Eye size={12} className="rich-visit-icon" />
            <span className="rich-visit-count">
              {data.visits > 0 ? `${data.visits.toLocaleString()} visits` : 'Visits'}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
