import { useEffect, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    if (!dot || !ring) return;

    // Track mouse coordinates
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    // Track ring coordinates for spring physics
    let ringX = mouseX;
    let ringY = mouseY;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Move dot instantly
      gsap.set(dot, { x: mouseX, y: mouseY });
    };

    window.addEventListener('mousemove', onMouseMove);

    // Spring physics animation loop for the outer ring
    const render = () => {
      // Lerp (Linear Interpolation) for smooth delay
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      
      gsap.set(ring, { x: ringX, y: ringY });
      requestAnimationFrame(render);
    };
    
    requestAnimationFrame(render);

    const handleMouseOver = (e) => {
      const target = e.target.closest('button, a, input[type="radio"], input[type="checkbox"], .direction-aware, .sidebar-step-btn, .time-picker-item, label');
      const isTextInput = e.target.closest('input[type="text"], input[type="number"], input[type="email"], input[type="tel"], input[type="date"], textarea, select');
      
      if (isTextInput) {
         setIsHovering(false);
         gsap.to(dot, { scale: 0, opacity: 0, duration: 0.3 });
         gsap.to(ring, { scale: 0.5, opacity: 0.2, duration: 0.3 });
      } else if (target) {
         setIsHovering(true);
         // Hover state
         gsap.to(dot, { scale: 0, opacity: 0, duration: 0.3 });
         gsap.to(ring, { 
           scale: 1.5, 
           backgroundColor: 'rgba(251, 191, 36, 0.1)', 
           borderColor: 'rgba(251, 191, 36, 0.8)',
           duration: 0.3 
         });
      } else {
         setIsHovering(false);
         // Normal state
         gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3 });
         gsap.to(ring, { 
           scale: 1, 
           backgroundColor: 'transparent',
           borderColor: 'rgba(251, 191, 36, 0.4)',
           duration: 0.3 
         });
      }
    };
    
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Inner Dot */}
      <div 
        className="cursor-dot"
        style={{
          position: 'fixed',
          top: -4,
          left: -4,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#fbbf24', // Amber
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform'
        }}
      />
      
      {/* Outer Ring */}
      <div 
        className="cursor-ring"
        style={{
          position: 'fixed',
          top: -16,
          left: -16,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '1px solid rgba(251, 191, 36, 0.4)',
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform, width, height, border-color, background-color',
          transition: 'border-color 0.3s ease, background-color 0.3s ease'
        }}
      />
    </>
  );
}
