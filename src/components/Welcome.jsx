import React, { useState, useEffect, useRef } from 'react';

// Respects prefers-reduced-motion
function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

function Welcome() {
  const reducedMotion = useReducedMotion();
  const [cmdText, setCmdText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [showOutput, setShowOutput] = useState(false);
  const command = '$ cat welcome.txt';

  useEffect(() => {
    if (reducedMotion) {
      // Skip animation entirely
      setCmdText(command);
      setShowOutput(true);
      return;
    }

    let i = 0;
    const typeTimer = setInterval(() => {
      if (i < command.length) { setCmdText(command.slice(0, i + 1)); i++; }
      else { clearInterval(typeTimer); setTimeout(() => setShowOutput(true), 280); }
    }, 65);

    const cursorTimer = setInterval(() => setShowCursor(p => !p), 520);
    return () => { clearInterval(typeTimer); clearInterval(cursorTimer); };
  }, [reducedMotion]);

  return (
    <div className="welcome-wrap">
      <div className="terminal">
        {/* Title bar */}
        <div className="terminal-bar">
          <div className="terminal-dots">
            <span className="dot" /><span className="dot" /><span className="dot" />
          </div>
          <span className="terminal-title">welcome.txt — bash</span>
          <span />
        </div>

        {/* Body */}
        <div className="terminal-body">
          <div className="terminal-line">
            <span className="terminal-cmd">{cmdText}</span>
            {!showOutput && (
              <span className={`terminal-cursor ${showCursor ? 'visible' : ''}`}>▌</span>
            )}
          </div>

          {showOutput && (
            <div className={`terminal-output ${reducedMotion ? '' : 'terminal-output--animate'}`}>
              <div className="terminal-output-line terminal-output-line--dim">
                ────────────────────────────────────────────
              </div>
              <div className="terminal-output-line terminal-output-line--body">
                This platform hosts academic resources from the 2024 AI batch,
                supplementing existing sites like{' '}
                <span className="terminal-highlight">CSE 2020</span>,{' '}
                <span className="terminal-highlight">KGPellence</span>, and{' '}
                <span className="terminal-highlight">MetaKGP</span>.
                Our focus is on content not readily available elsewhere.
              </div>
              <div className="terminal-output-line terminal-output-line--body" style={{ marginTop: '10px' }}>
                This site is a work in progress. Report errors or missing
                content by emailing us — details in the credits below.
              </div>
              <div className="terminal-output-line terminal-output-line--dim" style={{ marginTop: '14px' }}>
                ────────────────────────────────────────────
              </div>
              <div className="terminal-output-line terminal-output-line--status">
                <span className="terminal-badge">STATUS</span>
                Active · First Year 2024–25
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Welcome;
