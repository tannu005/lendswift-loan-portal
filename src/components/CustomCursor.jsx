import { useEffect, useRef, useState } from 'react';
import * as animejs from 'animejs';
const anime = animejs.default || animejs;

export default function CustomCursor() {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true); // Default to true so it doesn't stay hidden if mouse is already in window
  const [isHovering, setIsHovering] = useState(false);
  
  // Create an array of 8 particles for the blob
  const particles = Array.from({ length: 8 });
  
  useEffect(() => {
    const onMouseMove = (e) => {
      // Trigger anime.js to move all particles to the cursor position
      // with a staggered delay to create the organic trailing blob effect
      anime({
        targets: '.cursor-particle',
        translateX: e.clientX,
        translateY: e.clientY,
        duration: 800,
        easing: 'easeOutElastic(1, .5)',
        delay: anime.stagger(20) // Each particle is delayed by 20ms
      });
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseenter', onMouseEnter);
    document.body.addEventListener('mouseleave', onMouseLeave);

    const handleMouseOver = (e) => {
      const target = e.target.closest('button, a, input[type="radio"], input[type="checkbox"], .card, .direction-aware, .sidebar-step-btn, .time-picker-item');
      const isTextInput = e.target.closest('input[type="text"], input[type="number"], input[type="email"], input[type="tel"], input[type="date"], textarea, select');
      
      if (isTextInput) {
         setIsHovering(false);
         anime({
           targets: '.cursor-particle',
           scale: 0,
           duration: 300,
           easing: 'easeOutExpo'
         });
      } else if (target) {
         setIsHovering(true);
         // When hovering, particles scatter slightly and expand
         anime({
           targets: '.cursor-particle',
           scale: (el, i, l) => 1.5 + (i * 0.1),
           opacity: 0.8,
           backgroundColor: '#fbbf24', // Amber glow
           duration: 400,
           easing: 'easeOutExpo',
           // Introduce a slight random spread on hover
           translateX: (el) => parseFloat(el.style.transform.split('(')[1]) + (Math.random() * 20 - 10),
           translateY: (el) => parseFloat(el.style.transform.split(', ')[1]) + (Math.random() * 20 - 10),
         });
      } else {
         setIsHovering(false);
         // Return to normal cohesive blob
         anime({
           targets: '.cursor-particle',
           scale: (el, i, l) => 1 - (i * 0.08), // Smaller as they go back
           opacity: (el, i, l) => 1 - (i * 0.1),
           backgroundColor: '#fbbf24', // Use amber as base color for better visibility
           duration: 400,
           easing: 'easeOutQuad'
         });
      }
    };
    
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseenter', onMouseEnter);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        // Optional: SVG gooey filter could be added here for even more organic blending
      }}
    >
      {/* SVG Filter for Gooey Effect (optional but highly recommended for blobs) */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>

      <div style={{ filter: 'url(#goo)' }}>
        {particles.map((_, i) => (
          <div
            key={i}
            className="cursor-particle"
            style={{
              position: 'absolute',
              top: '-15px', // Center offset based on size
              left: '-15px',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#fbbf24', // Amber base color
              // Dynamic size reduction for trailing particles
              transform: `scale(${1 - (i * 0.08)})`,
              // Dynamic opacity
              opacity: 1 - (i * 0.1),
              mixBlendMode: 'screen',
              willChange: 'transform'
            }}
          />
        ))}
      </div>
    </div>
  );
}
