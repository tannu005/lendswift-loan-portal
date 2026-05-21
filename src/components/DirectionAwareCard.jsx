import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function DirectionAwareCard({ children, className = '', style = {}, as: Component = 'div', ...props }) {
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const shineRef = useRef(null);

  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return; // Disable on touch

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center (-1 to 1)
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    
    // Extreme 3D rotation for 'Cube Gallery' feel
    const rotateX = y * -25;
    const rotateY = x * 25;

    gsap.to(contentRef.current, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 1200,
      transformOrigin: 'center center',
      z: 30, // lift off the page
      boxShadow: `${x * -20}px ${y * -20}px 30px rgba(0,0,0,0.5), 0 0 20px rgba(251, 191, 36, 0.2)`,
      force3D: true
    });

    // Make children pop out
    gsap.to(contentRef.current.children, {
      z: 50,
      duration: 0.4,
      ease: 'power2.out',
      force3D: true
    });

    // Move shine effect
    gsap.to(shineRef.current, {
      x: (e.clientX - rect.left) - rect.width / 2,
      y: (e.clientY - rect.top) - rect.height / 2,
      opacity: 0.15,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(contentRef.current, {
      rotateX: 0,
      rotateY: 0,
      z: 0,
      boxShadow: '0 0 0 rgba(0,0,0,0)',
      duration: 0.7,
      ease: 'power3.out'
    });
    
    gsap.to(contentRef.current.children, {
      z: 0,
      duration: 0.7,
      ease: 'power3.out'
    });
    gsap.to(shineRef.current, {
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out'
    });
  };

  return (
    <Component
      ref={cardRef}
      className={`direction-aware ${className}`}
      style={{ ...style, perspective: '1200px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div 
        ref={contentRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          transformStyle: 'preserve-3d',
          position: 'relative',
          borderRadius: 'inherit',
          transition: 'border-color 0.2s',
          backgroundColor: 'inherit' // Inherit background to float with the card
        }}
      >
        {children}
        <div
          ref={shineRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 60%)',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            opacity: 0,
            mixBlendMode: 'overlay',
            borderRadius: 'inherit'
          }}
        />
      </div>
    </Component>
  );
}
