import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronDown, BookOpen, ExternalLink, Search, X } from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';

// ─── Recently-added badge helper (< 14 days) ─────────────────
function isNew(dateStr) {
  if (!dateStr) return false;
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff >= 0 && diff < 14 * 24 * 60 * 60 * 1000;
}

// ─── Skeleton while data loads ────────────────────────────────
function ResourcesSkeleton() {
  return (
    <div className="page-section">
      <div className="page-eyebrow-row">
        <div className="skel skel--eyebrow" />
      </div>
      <div className="resources-list resources-list--skel">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="res-sem">
            <div className="res-sem-header-skel">
              <div className="skel skel--num" />
              <div className="skel skel--line" style={{ width: `${120 + i * 30}px` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────
function Resources() {
  const [openSemester, setOpenSemester]   = useState(null);
  const [openSubject,  setOpenSubject]    = useState({});
  const [semesterData, setSemesterData]   = useState(null);
  const [query,        setQuery]          = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    import('../data/semester').then(m => setSemesterData(m.semesterData));
  }, []);

  const toggleSemester = useCallback((sem) => {
    setOpenSemester(p => p === sem ? null : sem);
  }, []);

  const toggleSubject = useCallback((id) => {
    setOpenSubject(p => ({ ...p, [id]: !p[id] }));
  }, []);

  // ── Keyboard navigation: arrow keys between sem headers ─────
  const semRefs = useRef({});

  const handleSemKeyDown = useCallback((e, semKey, allKeys) => {
    const idx = allKeys.indexOf(semKey);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      semRefs.current[allKeys[Math.min(idx + 1, allKeys.length - 1)]]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      semRefs.current[allKeys[Math.max(idx - 1, 0)]]?.focus();
    }
  }, []);

  if (!semesterData) return <ResourcesSkeleton />;

  // ── Search filtering ─────────────────────────────────────────
  const qLow = query.toLowerCase().trim();

  function matchesSem(semData) {
    if (!qLow) return true;
    if (semData.name.toLowerCase().includes(qLow)) return true;
    return semData.subjects.some(s =>
      s.name.toLowerCase().includes(qLow) ||
      s.resources.some(r => r.name.toLowerCase().includes(qLow))
    );
  }

  function filteredSubjects(subjects) {
    if (!qLow) return subjects;
    return subjects.filter(s =>
      s.name.toLowerCase().includes(qLow) ||
      s.resources.some(r => r.name.toLowerCase().includes(qLow))
    );
  }

  const futureSems  = [4, 5, 6, 7, 8];
  const activeSems  = Object.keys(semesterData);
  const allSemKeys  = [
    ...activeSems,
    ...futureSems.map(n => `s${n}`),
  ];

  return (
    <div className="page-section">
      {/* Header + search */}
      <div className="page-eyebrow-row">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
          <span className="text-eyebrow">Academic Resources</span>
          <span className="page-eyebrow-meta">IIT KGP · AI 2024</span>
        </div>
      </div>

      {/* Search bar */}
      <div className="res-search-wrap">
        <Search size={14} className="res-search-icon" />
        <input
          ref={searchRef}
          type="text"
          className="res-search"
          placeholder="Search subjects or resources…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search resources"
        />
        {query && (
          <button className="res-search-clear" onClick={() => { setQuery(''); searchRef.current?.focus(); }} aria-label="Clear search">
            <X size={13} />
          </button>
        )}
      </div>

      <div className="resources-list">
        {/* Active semesters */}
        {activeSems.filter(k => matchesSem(semesterData[k])).map(semKey => {
          const semData  = semesterData[semKey];
          const isOpen   = openSemester === semKey || (qLow && matchesSem(semData));
          const subjects = filteredSubjects(semData.subjects);

          return (
            <div key={semKey} className={`res-sem ${isOpen ? 'res-sem--open' : ''}`}>
              <button
                ref={el => semRefs.current[semKey] = el}
                className="res-sem-header"
                onClick={() => toggleSemester(semKey)}
                onKeyDown={e => handleSemKeyDown(e, semKey, allSemKeys)}
                aria-expanded={isOpen}
              >
                <div className="res-sem-left">
                  <span className="res-sem-num">{semKey.substring(1)}</span>
                  <span className="res-sem-name">{semData.name}</span>
                </div>
                <ChevronDown className={`res-chevron ${isOpen ? 'res-chevron--open' : ''}`} size={15} />
              </button>

              <div className={`res-sem-body ${isOpen ? 'res-sem-body--open' : ''}`}>
                <div className="res-subjects">
                  {subjects.map(subject => {
                    const subjOpen = openSubject[subject.id] || (qLow && filteredSubjects([subject]).length > 0);
                    return (
                      <div key={subject.id} className={`res-subject ${subjOpen ? 'res-subject--open' : ''}`}>
                        <button
                          className="res-subject-header"
                          onClick={e => { e.stopPropagation(); toggleSubject(subject.id); }}
                          aria-expanded={subjOpen}
                        >
                          <div className="res-subject-left">
                            <img src={subject.image} alt="" className="res-subject-img" />
                            <span className="res-subject-name">{subject.name}</span>
                          </div>
                          <ChevronDown className={`res-chevron ${subjOpen ? 'res-chevron--open' : ''}`} size={13} />
                        </button>

                        <div className={`res-links-wrap ${subjOpen ? 'res-links-wrap--open' : ''}`}>
                          <div className="res-links">
                            {subject.resources
                              .filter(r => !qLow || r.name.toLowerCase().includes(qLow))
                              .map((resource, ri) => (
                                <a
                                  key={ri}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="res-link"
                                >
                                  <resource.icon size={13} className="res-link-icon" />
                                  <span className="res-link-name">{resource.name}</span>
                                  {isNew(resource.addedDate) && (
                                    <span className="res-new-badge">NEW</span>
                                  )}
                                  <ExternalLink size={11} className="res-link-ext" />
                                </a>
                              ))}
                          </div>

                          {/* Last updated */}
                          {subject.lastUpdated && (
                            <div className="res-last-updated">
                              Updated {new Date(subject.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {semKey === 's1' && !qLow && (
                    <div className="res-coming-soon">
                      <span className="text-eyebrow">More coming soon</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* No results */}
        {qLow && activeSems.filter(k => matchesSem(semesterData[k])).length === 0 && (
          <div className="res-no-results">
            <Search size={18} className="res-empty-icon" />
            <span className="text-eyebrow">No results for "{query}"</span>
          </div>
        )}

        {/* Future semesters — hide during search */}
        {!qLow && futureSems.map(n => {
          const key    = `s${n}`;
          const isOpen = openSemester === key;
          return (
            <div key={key} className="res-sem res-sem--future">
              <button
                ref={el => semRefs.current[key] = el}
                className="res-sem-header"
                onClick={() => toggleSemester(key)}
                onKeyDown={e => handleSemKeyDown(e, key, allSemKeys)}
                aria-expanded={isOpen}
              >
                <div className="res-sem-left">
                  <span className="res-sem-num res-sem-num--dim">{n}</span>
                  <span className="res-sem-name res-sem-name--dim">Semester {n}</span>
                </div>
                <ChevronDown className={`res-chevron ${isOpen ? 'res-chevron--open' : ''}`} size={15} />
              </button>

              <div className={`res-sem-body ${isOpen ? 'res-sem-body--open' : ''}`}>
                <div className="res-empty-state">
                  <BookOpen size={18} className="res-empty-icon" />
                  <span className="text-eyebrow">Coming soon</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <ErrorBoundary>
      <Resources />
    </ErrorBoundary>
  );
}
