import React, { useEffect, useState, useRef } from 'react';
import { useFormContext } from '../context/FormContext';
import gsap from 'gsap';

export default function LoanSimulationDashboard() {
  const { getAllFormData } = useFormContext();
  const formData = getAllFormData();
  
  const [animatedPrincipal, setAnimatedPrincipal] = useState(0);
  const [animatedEMI, setAnimatedEMI] = useState(0);
  const [animatedInterest, setAnimatedInterest] = useState(0);
  
  // Base calculations
  const loanType = formData.loanType || 'personal';
  let interestRate = 12.5; 
  let maxTenureYears = 5;
  
  if (loanType === 'home') {
    interestRate = 8.5;
    maxTenureYears = 20;
  } else if (loanType === 'business') {
    interestRate = 14.5;
    maxTenureYears = 10;
  }
  
  // Income parsing
  const incomeStr = formData.monthlyNetSalary || formData.monthlyIncome || formData.annualBusinessIncome || "60000";
  let monthlySalary = parseFloat(incomeStr);
  if (formData.annualBusinessIncome) {
    monthlySalary = parseFloat(formData.annualBusinessIncome) / 12;
  }
  if (isNaN(monthlySalary) || monthlySalary < 10000) monthlySalary = 60000;
  
  const maxEMI = monthlySalary * 0.45; // 45% rule
  
  const r = interestRate / 12 / 100;
  const n = maxTenureYears * 12;
  
  const maxPrincipal = Math.floor(maxEMI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
  const totalInterest = Math.floor((maxEMI * n) - maxPrincipal);
  
  const prevData = useRef({ p: 0, e: 0, i: 0 });
  const stackRef = useRef(null);
  
  useEffect(() => {
    const targets = { p: prevData.current.p, e: prevData.current.e, i: prevData.current.i };
    
    gsap.to(targets, {
      p: maxPrincipal,
      e: maxEMI,
      i: totalInterest,
      duration: 1,
      ease: "power3.out",
      onUpdate: () => {
        setAnimatedPrincipal(Math.floor(targets.p));
        setAnimatedEMI(Math.floor(targets.e));
        setAnimatedInterest(Math.floor(targets.i));
      },
      onComplete: () => {
        prevData.current = { p: maxPrincipal, e: maxEMI, i: totalInterest };
      }
    });
    
    // Isometric Floating Animation
    if (stackRef.current) {
      const layers = stackRef.current.children;
      gsap.fromTo(layers, 
        { z: (i) => i * -40, opacity: 0 },
        { z: (i) => i * 40, opacity: 1, duration: 1.5, stagger: 0.2, ease: "back.out(1.7)" }
      );
      
      gsap.to(layers, {
        z: (i) => (i * 40) + 10,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: {
          each: 0.1,
          from: "start"
        }
      });
    }
  }, [maxPrincipal, maxEMI, totalInterest]);
  
  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  
  // Counter-rotate text so it faces camera perfectly
  const counterRotation = 'rotateZ(45deg) rotateX(-60deg)';

  return (
    <div className="card h-full" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', borderLeft: '1px solid var(--color-primary)' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem', color: 'var(--color-text-primary)' }}>Isometric Data Stack</h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Real-time spatial visualization.</p>
      </div>
      
      {/* Isometric Floating Layers */}
      <div style={{ flex: 1, minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1200px', marginTop: '2rem' }}>
        <div ref={stackRef} style={{
          position: 'relative',
          width: '180px',
          height: '180px',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(60deg) rotateZ(-45deg)'
        }}>
          {/* Layer 1: Processing Fee (Bottom) */}
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(239, 68, 68, 0.1)', border: '2px solid rgba(239, 68, 68, 0.6)',
            boxShadow: 'inset 0 0 20px rgba(239, 68, 68, 0.3), -10px 10px 30px rgba(0,0,0,0.5)',
            transformStyle: 'preserve-3d',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ 
              transform: `translate3d(0, 120px, 0) ${counterRotation}`,
              color: '#EF4444', fontWeight: 'bold', fontSize: '0.75rem', position: 'absolute', textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>Fees</div>
          </div>
          
          {/* Layer 2: Interest (Middle) */}
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(251, 191, 36, 0.15)', border: '2px solid rgba(251, 191, 36, 0.8)',
            boxShadow: 'inset 0 0 20px rgba(251, 191, 36, 0.4), -10px 10px 30px rgba(0,0,0,0.5)',
            transformStyle: 'preserve-3d',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ 
              transform: `translate3d(-140px, 0, 0) ${counterRotation}`, 
              color: '#FBBF24', fontWeight: 'bold', fontSize: '0.75rem', position: 'absolute', textShadow: '0 2px 4px rgba(0,0,0,0.5)', whiteSpace: 'nowrap'
            }}>Interest: {formatCurrency(animatedInterest)}</div>
          </div>
          
          {/* Layer 3: Principal (Top) */}
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(251, 191, 36, 0.25)', border: '2px solid rgba(251, 191, 36, 1)',
            boxShadow: 'inset 0 0 30px rgba(251, 191, 36, 0.5), -10px 10px 40px rgba(0,0,0,0.6)',
            transformStyle: 'preserve-3d',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ 
              transform: `translate3d(-140px, 0, 0) ${counterRotation}`, 
              color: '#FBBF24', fontWeight: 'bold', fontSize: '0.875rem', position: 'absolute', textShadow: '0 2px 4px rgba(0,0,0,0.5)', whiteSpace: 'nowrap'
            }}>Principal: {formatCurrency(animatedPrincipal)}</div>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: 'auto' }}>
        <div style={{ background: 'rgba(251, 191, 36, 0.08)', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
          <p style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#FBBF24', marginBottom: '0.375rem' }}>Max Eligible Loan</p>
          <p className="font-mono-numbers" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#FFFFFF', letterSpacing: '-0.02em' }}>{formatCurrency(animatedPrincipal)}</p>
        </div>
        <div style={{ background: 'var(--color-surface-lighter)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>Est. Monthly EMI</p>
          <p className="font-mono-numbers" style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>{formatCurrency(animatedEMI)}</p>
        </div>
      </div>
    </div>
  );
}
