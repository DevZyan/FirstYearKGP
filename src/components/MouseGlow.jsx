import React, { useState, useEffect } from 'react';

function MouseGlow({ children }) {
  const [coords, setCoords] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const handleMouseMove = (e) => setCoords({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, var(--mouse-glow), transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}

export default MouseGlow;
