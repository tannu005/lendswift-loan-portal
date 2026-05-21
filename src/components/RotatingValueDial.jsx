import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

export default function RotatingValueDial({ value, onChange, min = 15000, max = 500000, step = 5000 }) {
  const dialRef = useRef(null);
  const containerRef = useRef(null);
  const [internalVal, setInternalVal] = useState(value);
  
  useEffect(() => {
    setInternalVal(value);
  }, [value]);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -step : step;
    const newVal = Math.max(min, Math.min(max, internalVal + delta));
    setInternalVal(newVal);
    onChange(newVal);
    
    // Animate dial rotation based on value
    const rotation = ((newVal - min) / (max - min)) * -360;
    gsap.to(dialRef.current, {
      rotateX: rotation,
      duration: 0.5,
      ease: 'back.out(1.5)',
      force3D: true
    });
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div 
      ref={containerRef}
      onWheel={handleWheel}
      style={{
        width: '100%',
        height: '100px',
        background: 'var(--color-input-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '800px',
        cursor: 'ns-resize',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: '8px', left: '12px', fontSize: '0.625rem', color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '0.05em', zIndex: 10 }}>
        Scroll to adjust
      </div>
      
      <div 
        ref={dialRef}
        style={{
          transformStyle: 'preserve-3d',
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100px'
        }}
      >
        <div style={{
            color: 'var(--color-primary)',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
            transform: 'translateZ(150px)',
            pointerEvents: 'none'
          }}>
          {formatCurrency(internalVal)}
        </div>
      </div>
      
      {/* 3D overlay gradient to make it look like a cylinder window */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, var(--color-surface) 0%, transparent 30%, transparent 70%, var(--color-surface) 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
