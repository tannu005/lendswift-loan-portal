import { useEffect, useRef, useState } from 'react';

/**
 * Obsidian-inspired minimal custom cursor.
 * Shows a soft ring + dot on desktop only.
 * Expands gently over interactive elements.
 * Falls back to native cursor on mobile and reduced-motion.
 */
export default function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    // Only show on desktop with fine pointer
    const mq = window.matchMedia('(pointer: fine)');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches || prefersReducedMotion.matches) return;

    setVisible(true);

    const onMouseMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseEnter = () => setVisible(true);
    const onMouseLeave = () => setVisible(false);

    const interactiveSelector = 'button, a, label[for], [role="button"], .radio-card, .dropzone, .btn';

    const onPointerOver = (e) => {
      if (e.target.closest(interactiveSelector)) {
        setIsHovering(true);
      }
    };
    const onPointerOut = (e) => {
      if (e.target.closest(interactiveSelector)) {
        setIsHovering(false);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('pointerout', onPointerOut);

    // Smooth trailing animation
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.current.x}px, ${target.current.y}px) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? '40px' : '28px',
          height: isHovering ? '40px' : '28px',
          borderRadius: '50%',
          border: `1px solid ${isHovering ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.15)'}`,
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease',
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      />
      {/* Center dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: isHovering ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.5)',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'background 0.15s ease',
          willChange: 'transform',
        }}
      />
    </>
  );
}
