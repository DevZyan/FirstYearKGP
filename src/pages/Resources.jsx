import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, ExternalLink } from 'lucide-react';

function Resources() {
  const [openSemester, setOpenSemester] = useState(null);
  const [openSubject, setOpenSubject] = useState({});
  const [semesterData, setSemesterData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { semesterData } = await import('../data/semester');
      setSemesterData(semesterData);
    };
    load();
  }, []);

  const toggleSemester = (sem) => setOpenSemester(openSemester === sem ? null : sem);
  const toggleSubject = (id) => setOpenSubject(prev => ({ ...prev, [id]: !prev[id] }));

  if (!semesterData) {
    return (
      <div className="page-section">
        <div className="resources-loading">
          <div className="loader-ring" style={{ width: 32, height: 32 }} />
          <span className="loader-text">Loading resources...</span>
        </div>
      </div>
    );
  }

  const futureSems = [4, 5, 6, 7, 8];

  return (
    <div className="page-section">
      <div className="page-eyebrow-row">
        <span className="text-eyebrow">Academic Resources</span>
        <span className="page-eyebrow-meta">IIT KGP · AI 2024</span>
      </div>

      <div className="resources-list">
        {/* Active semesters */}
        {Object.entries(semesterData).map(([semKey, semData]) => {
          const isOpen = openSemester === semKey;
          return (
            <div key={semKey} className={`res-sem ${isOpen ? 'res-sem--open' : ''}`}>
              <button className="res-sem-header" onClick={() => toggleSemester(semKey)}>
                <div className="res-sem-left">
                  <span className="res-sem-num">{semKey.substring(1)}</span>
                  <span className="res-sem-name">{semData.name}</span>
                </div>
                <ChevronDown className={`res-chevron ${isOpen ? 'res-chevron--open' : ''}`} size={16} />
              </button>

              <div className={`res-sem-body ${isOpen ? 'res-sem-body--open' : ''}`}>
                <div className="res-subjects">
                  {semData.subjects.map((subject) => {
                    const subjOpen = openSubject[subject.id];
                    return (
                      <div key={subject.id} className={`res-subject ${subjOpen ? 'res-subject--open' : ''}`}>
                        <button
                          className="res-subject-header"
                          onClick={(e) => { e.stopPropagation(); toggleSubject(subject.id); }}
                        >
                          <div className="res-subject-left">
                            <img src={subject.image} alt={subject.name} className="res-subject-img" />
                            <span className="res-subject-name">{subject.name}</span>
                          </div>
                          <ChevronDown className={`res-chevron ${subjOpen ? 'res-chevron--open' : ''}`} size={14} />
                        </button>

                        <div className={`res-links-wrap ${subjOpen ? 'res-links-wrap--open' : ''}`}>
                          <div className="res-links">
                            {subject.resources.map((resource, ri) => (
                              <a
                                key={ri}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="res-link"
                              >
                                <resource.icon size={14} className="res-link-icon" />
                                <span className="res-link-name">{resource.name}</span>
                                <ExternalLink size={12} className="res-link-ext" />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {semKey === 's1' && (
                    <div className="res-coming-soon">
                      <span className="text-eyebrow">More coming soon</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Future semesters */}
        {futureSems.map((n) => {
          const key = `s${n}`;
          const isOpen = openSemester === key;
          return (
            <div key={key} className={`res-sem res-sem--future ${isOpen ? 'res-sem--open' : ''}`}>
              <button className="res-sem-header" onClick={() => toggleSemester(key)}>
                <div className="res-sem-left">
                  <span className="res-sem-num res-sem-num--dim">{n}</span>
                  <span className="res-sem-name res-sem-name--dim">Semester {n}</span>
                </div>
                <ChevronDown className={`res-chevron ${isOpen ? 'res-chevron--open' : ''}`} size={16} />
              </button>

              <div className={`res-sem-body ${isOpen ? 'res-sem-body--open' : ''}`}>
                <div className="res-empty-state">
                  <BookOpen size={20} className="res-empty-icon" />
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

export default Resources;
