import React, { useState } from "react";
import ErrorBoundary from "../components/ErrorBoundary";

const LAST_UPDATED = "2025-08-01"; // update this string when content changes

function AnnouncementsContent() {
  const [status, setStatus] = useState('loading'); // loading | loaded | error

  return (
    <div className="page-section">
      <div className="page-eyebrow-row">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
          <span className="text-eyebrow">Announcements</span>
          {status === 'loaded' && (
            <span className="page-eyebrow-meta">
              Updated {new Date(LAST_UPDATED).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      <div className="announcements-wrap">
        {/* Skeleton shown while loading */}
        {status === 'loading' && (
          <div className="announcements-skeleton">
            <div className="skel skel--img-placeholder" />
          </div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className="announcements-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span className="text-eyebrow">Could not load announcements</span>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Check back later or contact the team directly.
            </p>
          </div>
        )}

        <img
          src="https://github.com/Shubhajeetgithub/photos/blob/main/nalanda.jpeg?raw=true"
          alt="Nalanda announcements board"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`announcements-img ${status !== 'loaded' ? 'announcements-img--hidden' : ''}`}
        />
      </div>
    </div>
  );
}

export default function Announcements() {
  return (
    <ErrorBoundary>
      <AnnouncementsContent />
    </ErrorBoundary>
  );
}
