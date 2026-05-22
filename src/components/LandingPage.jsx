import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Zap, Shield, Clock, Lock, Server } from 'lucide-react';
import gsap from 'gsap';
import ArchitectureDiagram from './ArchitectureDiagram';

export default function LandingPage({ onStart, onAdminLogin }) {
  const containerRef = useRef(null);
  const [showArchitecture, setShowArchitecture] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.stagger-in', 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 10,
        color: 'var(--color-text-primary)'
      }}
    >
      {/* Central Hero Block */}
      <div 
        className="stagger-in"
        style={{
          background: 'rgba(15, 17, 21, 0.4)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          padding: '4rem',
          borderRadius: '24px',
          maxWidth: '800px',
          width: '100%',
          textAlign: 'center'
        }}
      >
        <div 
          className="stagger-in"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            color: 'var(--color-primary)',
            padding: '0.5rem 1rem',
            borderRadius: '100px',
            fontSize: '0.75rem',
            fontWeight: '600',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '2rem'
          }}
        >
          <Zap size={14} /> The Future of Financing
        </div>
        
        <h1 
          className="stagger-in"
          style={{
            fontSize: '4rem',
            fontWeight: '800',
            lineHeight: '1.1',
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            background: 'linear-gradient(to right, #ffffff, #a1a1aa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Loans at the speed<br />of thought.
        </h1>
        
        <p 
          className="stagger-in"
          style={{
            fontSize: '1.25rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.6'
          }}
        >
          Experience a frictionless, fully encrypted application process designed for maximum speed and absolute clarity.
        </p>

        <div className="stagger-in">
          <button 
            onClick={onStart}
            style={{
              background: 'var(--color-primary)',
              color: '#000000',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 4px 14px rgba(251, 191, 36, 0.4)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(251, 191, 36, 0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(251, 191, 36, 0.4)';
            }}
          >
            Start your application <ArrowRight size={20} />
          </button>
        </div>
        
        <div 
          className="stagger-in"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            <Shield size={16} /> 256-bit Encryption
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            <Clock size={16} /> 3-Minute Approval
          </div>
        </div>

        {/* Enterprise Portfolio Links */}
        <div className="stagger-in" style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
           <button 
             onClick={onAdminLogin}
             style={{
               background: 'transparent',
               color: 'var(--color-text-secondary)',
               border: '1px solid rgba(255,255,255,0.1)',
               padding: '0.5rem 1rem',
               borderRadius: '6px',
               fontSize: '0.875rem',
               cursor: 'pointer',
               display: 'inline-flex',
               alignItems: 'center',
               gap: '0.5rem',
               transition: 'all 0.2s'
             }}
             onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#fbbf24'; }}
             onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
           >
             <Lock size={14} /> Underwriter OS Login
           </button>
           <button 
             onClick={() => setShowArchitecture(true)}
             style={{
               background: 'transparent',
               color: 'var(--color-text-secondary)',
               border: '1px solid rgba(255,255,255,0.1)',
               padding: '0.5rem 1rem',
               borderRadius: '6px',
               fontSize: '0.875rem',
               cursor: 'pointer',
               display: 'inline-flex',
               alignItems: 'center',
               gap: '0.5rem',
               transition: 'all 0.2s'
             }}
             onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#3b82f6'; }}
             onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
           >
             <Server size={14} /> View Architecture Diagram
           </button>
        </div>
      </div>
      
      {showArchitecture && <ArchitectureDiagram onClose={() => setShowArchitecture(false)} />}
    </div>
  );
}
