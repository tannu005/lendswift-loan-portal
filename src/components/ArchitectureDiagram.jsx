import React, { useEffect, useRef } from 'react';
import { X, Server, Database, Cloud, Shield, Cpu, Activity, ArrowRight, Smartphone, Key } from 'lucide-react';
import gsap from 'gsap';

export default function ArchitectureDiagram({ onClose }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Add overflow hidden to body to prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    const ctx = gsap.context(() => {
      // Background fade in
      gsap.fromTo('.arch-bg', { opacity: 0 }, { opacity: 1, duration: 0.5 });
      
      // Panel slide up
      gsap.fromTo('.arch-panel', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.1 }
      );

      // Node stagger in
      gsap.fromTo('.arch-node',
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)', delay: 0.4 }
      );

      // Data flow lines animation
      gsap.fromTo('.data-flow',
        { strokeDashoffset: 100 },
        { strokeDashoffset: 0, duration: 2, repeat: -1, ease: 'linear' }
      );
    }, containerRef);

    return () => {
      document.body.style.overflow = 'unset';
      ctx.revert();
    };
  }, []);

  const Node = ({ icon: Icon, title, desc, color, delay }) => (
    <div className="arch-node" style={{
      background: 'rgba(15, 23, 42, 0.6)',
      border: `1px solid ${color}40`,
      padding: '1.25rem',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      width: '180px',
      position: 'relative',
      zIndex: 2,
      backdropFilter: 'blur(8px)',
      boxShadow: `0 8px 32px ${color}10`
    }}>
      <div style={{
        background: `${color}15`,
        color: color,
        padding: '0.75rem',
        borderRadius: '50%',
        marginBottom: '1rem',
        border: `1px solid ${color}40`
      }}>
        <Icon size={24} />
      </div>
      <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f8fafc', marginBottom: '0.25rem' }}>{title}</h3>
      <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>{desc}</p>
    </div>
  );

  return (
    <div ref={containerRef} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div className="arch-bg" onClick={onClose} style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)', cursor: 'pointer'
      }} />

      <div className="arch-panel" style={{
        position: 'relative', width: '100%', maxWidth: '1000px', background: '#020617',
        border: '1px solid #1e293b', borderRadius: '24px', padding: '3rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent',
          border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%'
        }} onMouseOver={e => e.currentTarget.style.background = '#0f172a'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '0.5rem' }}>System Architecture</h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Enterprise-grade microservices topology built for sub-second loan approvals, high availability, and banking-grade security.
          </p>
        </div>

        {/* Diagram Area */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
          
          {/* Top Row: Client layer */}
          <div style={{ display: 'flex', gap: '2rem', width: '100%', justifyContent: 'center' }}>
            <Node icon={Smartphone} title="Client Application" desc="React + GSAP Frontend, Edge-deployed" color="#38bdf8" />
            <Node icon={Shield} title="WAF & API Gateway" desc="Cloudflare + Kong, Rate Limiting & Auth" color="#10b981" />
          </div>

          {/* Middle Row: Microservices */}
          <div style={{ display: 'flex', gap: '3rem', width: '100%', justifyContent: 'center' }}>
            <Node icon={Cpu} title="AI Underwriting Engine" desc="Python/TensorFlow, Real-time Risk Scoring" color="#8b5cf6" />
            <Node icon={Server} title="Core Lending Service" desc="Go Microservices, Kafka Event Streaming" color="#3b82f6" />
            <Node icon={Activity} title="Bureau Integration" desc="Experian/CIBIL API Aggregator" color="#ef4444" />
          </div>

          {/* Bottom Row: Data & External */}
          <div style={{ display: 'flex', gap: '4rem', width: '100%', justifyContent: 'center' }}>
            <Node icon={Database} title="Data Layer" desc="PostgreSQL (ACID) + Redis (Cache)" color="#f59e0b" />
            <Node icon={Cloud} title="Open Banking APIs" desc="Account Aggregator / Plaid Integration" color="#14b8a6" />
          </div>

        </div>

      </div>
    </div>
  );
}
