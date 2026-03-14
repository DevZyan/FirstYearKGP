import { useEffect } from 'react';

function TouchEffect({ children }) {
  useEffect(() => {
    const handleTouch = (e) => {
      const ripple = document.createElement('div');
      const x = e.touches[0].clientX + window.scrollX;
      const y = e.touches[0].clientY + window.scrollY;
      Object.assign(ripple.style, {
        position: 'absolute',
        width: '120px', height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)',
        left: `${x - 60}px`, top: `${y - 60}px`,
        pointerEvents: 'none', zIndex: 9999,
        transform: 'scale(0.5)', opacity: '1',
        transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
      });
      document.body.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(2)';
        ripple.style.opacity = '0';
      });
      setTimeout(() => ripple.remove(), 500);
    };

    window.addEventListener('touchstart', handleTouch);
    return () => window.removeEventListener('touchstart', handleTouch);
  }, []);

  return <div className="relative">{children}</div>;
}

export default TouchEffect;
