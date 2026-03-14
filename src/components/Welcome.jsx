import React, { useState, useEffect } from 'react'

function Welcome() {
  const [phase, setPhase] = useState(0);
  const [cmdText, setCmdText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [showOutput, setShowOutput] = useState(false);

  const command = '$ cat welcome.txt';

  useEffect(() => {
    let i = 0;
    const typeTimer = setInterval(() => {
      if (i < command.length) {
        setCmdText(command.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeTimer);
        setTimeout(() => setShowOutput(true), 300);
      }
    }, 70);

    const cursorTimer = setInterval(() => setShowCursor(p => !p), 530);

    return () => { clearInterval(typeTimer); clearInterval(cursorTimer); };
  }, []);

  return (
    <div className="welcome-wrap">
      <div className="terminal">
        {/* Title bar */}
        <div className="terminal-bar">
          <div className="terminal-dots">
            <span className="dot dot--close" />
            <span className="dot dot--min" />
            <span className="dot dot--max" />
          </div>
          <span className="terminal-title">welcome.txt — bash</span>
          <span />
        </div>

        {/* Body */}
        <div className="terminal-body">
          {/* Command line */}
          <div className="terminal-line">
            <span className="terminal-prompt">~</span>
            <span className="terminal-cmd">{cmdText}</span>
            <span className={`terminal-cursor ${showCursor ? 'visible' : ''}`}>▌</span>
          </div>

          {/* Output */}
          {showOutput && (
            <div className="terminal-output">
              <div className="terminal-output-line terminal-output-line--dim">
                ──────────────────────────────────────────────
              </div>
              <div className="terminal-output-line terminal-output-line--body">
                This platform hosts academic resources from the 2024 AI batch,
                supplementing existing sites like{' '}
                <span className="terminal-highlight">CSE 2020</span>,{' '}
                <span className="terminal-highlight">KGPellence</span>, and{' '}
                <span className="terminal-highlight">MetaKGP</span>.
                Our focus is on content not readily available elsewhere.
              </div>
              <div className="terminal-output-line terminal-output-line--body" style={{ marginTop: '12px' }}>
                This site is a work in progress. Report errors or missing content
                by emailing us — details in the credits below.
              </div>
              <div className="terminal-output-line terminal-output-line--dim" style={{ marginTop: '16px' }}>
                ──────────────────────────────────────────────
              </div>
              <div className="terminal-output-line terminal-output-line--status">
                <span className="terminal-badge">STATUS</span> Active · First Year 2024–25
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Welcome;
