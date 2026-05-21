import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// A single wheel in the time picker
const PickerColumn = ({ items, itemHeight, value, onChange, label }) => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  
  // Create padding items so we can scroll to the first and last item
  const paddingItems = Array(2).fill(null);
  const displayItems = [...paddingItems, ...items, ...paddingItems];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial scroll position
    const selectedIndex = items.findIndex(item => item === value);
    if (selectedIndex !== -1) {
      container.scrollTop = selectedIndex * itemHeight;
    }

    const update3DEffects = () => {
      const scrollY = container.scrollTop;
      const centerPos = scrollY + (itemHeight * 2); // The center item index is offset by padding

      // Update rotation for all items based on distance from center
      const domItems = wrapperRef.current.children;
      for (let i = 0; i < domItems.length; i++) {
        const itemDom = domItems[i];
        if (!itemDom.innerText) continue; // skip padding

        const itemCenter = i * itemHeight;
        const distance = centerPos - itemCenter;
        
        // Map distance to an angle (-90 to 90 degrees)
        // itemHeight distance = roughly 25 degrees of rotation
        const angle = Math.max(-90, Math.min(90, (distance / itemHeight) * 25));
        
        // Map opacity (fades out as it goes further from center)
        const absDistance = Math.abs(distance);
        const opacity = Math.max(0.2, 1 - (absDistance / (itemHeight * 2.5)));

        gsap.set(itemDom, {
          rotateX: angle,
          opacity: opacity,
          z: Math.abs(angle) * -1, // Push back slightly as they rotate
          scale: opacity === 1 ? 1.05 : 0.95,
          color: Math.abs(distance) < itemHeight / 2 ? 'var(--color-primary)' : 'var(--color-text-secondary)',
          fontWeight: Math.abs(distance) < itemHeight / 2 ? 600 : 400
        });
      }
    };

    // Run once on mount
    update3DEffects();

    // Listen to scroll events
    container.addEventListener('scroll', update3DEffects, { passive: true });
    
    // Snapping logic on scroll end
    let scrollTimeout;
    const handleScrollEnd = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollY = container.scrollTop;
        const index = Math.round(scrollY / itemHeight);
        
        // Snap perfectly if slightly off
        container.scrollTo({
          top: index * itemHeight,
          behavior: 'smooth'
        });

        // Fire onChange if the value changed
        if (items[index] && items[index] !== value) {
          onChange(items[index]);
        }
      }, 150); // wait for scroll to pause
    };

    container.addEventListener('scroll', handleScrollEnd, { passive: true });

    return () => {
      container.removeEventListener('scroll', update3DEffects);
      container.removeEventListener('scroll', handleScrollEnd);
      clearTimeout(scrollTimeout);
    };
  }, [items, itemHeight, value, onChange]);

  return (
    <div 
      className="picker-column" 
      style={{ 
        flex: 1, 
        height: `${itemHeight * 5}px`, 
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE
        position: 'relative',
        scrollSnapType: 'y mandatory',
        perspective: '1000px',
        WebkitOverflowScrolling: 'touch',
        cursor: 'grab'
      }}
      ref={containerRef}
    >
      <style>{`
        .picker-column::-webkit-scrollbar { display: none; }
      `}</style>
      
      <div 
        ref={wrapperRef}
        style={{ 
          transformStyle: 'preserve-3d',
          paddingTop: '0'
        }}
      >
        {displayItems.map((item, i) => (
          <div 
            key={i}
            className="time-picker-item"
            style={{ 
              height: `${itemHeight}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              color: 'var(--color-text-secondary)',
              scrollSnapAlign: 'center',
              transformOrigin: 'center center -50px',
              userSelect: 'none'
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function IosTimePicker({ value, onChange }) {
  const itemHeight = 44; // standard iOS touch target height

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const periods = ['AM', 'PM'];

  // Parse initial value (e.g., "10:30 AM")
  const parseTime = (timeStr) => {
    if (!timeStr) return { h: '10', m: '30', p: 'AM' };
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) return { h: match[1].padStart(2, '0'), m: match[2].padStart(2, '0'), p: match[3].toUpperCase() };
    return { h: '10', m: '30', p: 'AM' };
  };

  const [time, setTime] = useState(parseTime(value));

  const handleChange = (key, val) => {
    const newTime = { ...time, [key]: val };
    setTime(newTime);
    if (onChange) {
      onChange(`${newTime.h}:${newTime.m} ${newTime.p}`);
    }
  };

  return (
    <div style={{
      position: 'relative',
      background: 'rgba(15, 17, 21, 0.4)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '16px',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.3)',
      width: '100%',
      maxWidth: '300px',
      margin: '0 auto'
    }}>
      {/* Center Highlight Bar */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '1rem',
        right: '1rem',
        height: `${itemHeight}px`,
        transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(0,0,0,0.5)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ display: 'flex', width: '100%', zIndex: 1, position: 'relative' }}>
        <PickerColumn 
          items={hours} 
          itemHeight={itemHeight} 
          value={time.h} 
          onChange={(val) => handleChange('h', val)} 
        />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '0 0.5rem',
          fontSize: '1.25rem',
          fontWeight: '600',
          color: 'var(--color-primary)',
          height: `${itemHeight * 5}px`
        }}>:</div>
        <PickerColumn 
          items={minutes} 
          itemHeight={itemHeight} 
          value={time.m} 
          onChange={(val) => handleChange('m', val)} 
        />
        <PickerColumn 
          items={periods} 
          itemHeight={itemHeight} 
          value={time.p} 
          onChange={(val) => handleChange('p', val)} 
        />
      </div>
    </div>
  );
}
