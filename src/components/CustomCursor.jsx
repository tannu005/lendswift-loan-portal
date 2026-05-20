import { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor Component
 * Renders a buttery-smooth, hardware-accelerated dual-ring trailing cursor.
 * Features automatic hover-morphing on clickable items and dynamic magnetic pull effects.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  
  // Store mouse positions
  const mouse = useRef({ x: -100, y: -100 });
  const trail = useRef({ x: -100, y: -100 });
  
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Hide custom cursor on mobile/touch screen devices
    const touchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (touchDevice) return;

    // Avoid synchronous setState inside useEffect to satisfy linter
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // 1. Butter-smooth animation loop using direct DOM mutations for high-fps tracking
    let animationFrameId;

    const animateCursor = () => {
      // Lerp (Linear Interpolation) for fluid trailing delay
      trail.current.x += (mouse.current.x - trail.current.x) * 0.16;
      trail.current.y += (mouse.current.y - trail.current.y) * 0.16;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trail.current.x}px, ${trail.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animateCursor);
    };
    
    animateCursor();

    // 2. Global Hover Morphing Listeners
    const addHoverClass = () => setIsHovered(true);
    const removeHoverClass = () => setIsHovered(false);

    const attachHoverListeners = () => {
      const interactiveSelectors = 'button, a, input, select, textarea, .radio-card, .file-upload-box, [role="button"]';
      const targets = document.querySelectorAll(interactiveSelectors);
      
      targets.forEach(target => {
        target.addEventListener('mouseenter', addHoverClass);
        target.addEventListener('mouseleave', removeHoverClass);
      });
    };

    // Run hover detection initially and listen for dynamic page changes via MutationObserver
    attachHoverListeners();

    const observer = new MutationObserver(() => {
      attachHoverListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 3. Dynamic Magnetic Pull Physics
    const handleMagneticMove = (e) => {
      const magneticElements = document.querySelectorAll('.btn:not(:disabled), button:not(:disabled), .radio-card');
      
      magneticElements.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        // Element center coordinates
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Distance from cursor to element center
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        // Threshold check for gravity pull (80px radius)
        if (distance < 75) {
          btn.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)';
          // Pull the element 35% towards the cursor
          btn.style.transform = `translate3d(${distX * 0.3}px, ${distY * 0.3}px, 0) scale(1.02)`;
          btn.classList.add('magnetic-active');
        } else {
          // Snap back smoothly
          btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
          btn.style.transform = 'translate3d(0px, 0px, 0px) scale(1)';
          btn.classList.remove('magnetic-active');
        }
      });
    };

    window.addEventListener('mousemove', handleMagneticMove, { passive: true });

    // Component clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleMagneticMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      observer.disconnect();

      const targets = document.querySelectorAll('button, a, input, select, textarea, .radio-card, .file-upload-box');
      targets.forEach(target => {
        target.removeEventListener('mouseenter', addHoverClass);
        target.removeEventListener('mouseleave', removeHoverClass);
      });
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Hardware-accelerated solid trailing center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-primary pointer-events-none z-50 transition-all duration-75 mix-blend-screen"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          margin: '-3px 0 0 -3px',
          boxShadow: '0 0 10px var(--color-primary-light)',
        }}
      />
      
      {/* Glowing dual-ring translucent trailing cursor */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border border-primary-light pointer-events-none z-50 mix-blend-screen transition-all duration-300 ${
          isHovered
            ? 'w-10 h-10 -mt-5 -ml-5 border-accent bg-accent/10 shadow-[0_0_15px_rgba(16,185,129,0.45)]'
            : 'w-6 h-6 -mt-3 -ml-3 bg-transparent shadow-[0_0_8px_rgba(139,92,246,0.15)]'
        }`}
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      />
    </>
  );
}
