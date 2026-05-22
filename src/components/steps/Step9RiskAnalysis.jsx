import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useFormContext } from '../../context/FormContext';
import { Server, Database, Cpu, ShieldCheck, CheckCircle2, Activity, ArrowRight, Loader2 } from 'lucide-react';
import { formatIndianCurrency } from '../../utils/validators';

const PROCESSING_STEPS = [
  { id: 'banking', label: 'Connecting to Open Banking API...', icon: Server },
  { id: 'bureau', label: 'Fetching Credit Bureau Data (Experian)...', icon: Database },
  { id: 'fraud', label: 'Running ML Fraud Detection Model...', icon: ShieldCheck },
  { id: 'scoring', label: 'Calculating Dynamic Risk Profile...', icon: Cpu },
];

export default function Step9RiskAnalysis({ onNext }) {
  const { state } = useFormContext();
  const { formData } = state;
  const containerRef = useRef(null);
  
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [finalScore, setFinalScore] = useState(0);
  
  // Calculate a fake "AI Score" based on their inputs to make it feel real
  const calculateSimulatedScore = () => {
    let score = 650; // Base score
    if (formData.employmentType === 'salaried') score += 50;
    if (formData.monthlyIncome > 100000) score += 75;
    if (formData.loanAmount < 500000) score += 25;
    // Cap at 850
    return Math.min(score + Math.floor(Math.random() * 40), 850);
  };

  useEffect(() => {
    // Sequence the processing steps using GSAP
    const tl = gsap.timeline({
      onComplete: () => {
        setIsProcessing(false);
        const targetScore = calculateSimulatedScore();
        // Animate the final score rolling up
        gsap.to({ val: 0 }, {
          val: targetScore,
          duration: 2,
          ease: 'power3.out',
          onUpdate: function() {
            setFinalScore(Math.round(this.targets()[0].val));
          }
        });
        
        // Show final result UI
        gsap.fromTo('.final-result-card', 
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.2)' }
        );
      }
    });

    // Animate each processing step sequentially
    PROCESSING_STEPS.forEach((step, index) => {
      tl.call(() => setActiveStepIndex(index))
        .fromTo(`.processing-step-${index}`, 
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.4 }
        )
        .to(`.processing-step-${index} .spinner`, { opacity: 0, duration: 0.2, delay: 1.2 }) // Fake processing time
        .to(`.processing-step-${index} .check`, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' });
    });

  }, []);

  const getRiskCategory = (score) => {
    if (score >= 750) return { label: 'Excellent', color: '#10b981', prob: '98%' };
    if (score >= 680) return { label: 'Good', color: '#3b82f6', prob: '85%' };
    return { label: 'Fair', color: '#fbbf24', prob: '60%' };
  };

  const riskDetails = getRiskCategory(finalScore);

  return (
    <div ref={containerRef} style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '2rem' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '64px', 
          height: '64px', 
          borderRadius: '16px', 
          background: 'rgba(251, 191, 36, 0.1)',
          color: 'var(--color-primary)',
          marginBottom: '1.5rem'
        }}>
          <Activity size={32} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
          {isProcessing ? 'Analyzing Application...' : 'Risk Assessment Complete'}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {isProcessing 
            ? 'Our AI engine is securely evaluating your credit profile in real-time.' 
            : 'Your dynamic risk profile has been generated successfully.'}
        </p>
      </div>

      {/* Live Processing Terminal */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        fontFamily: 'monospace',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle grid background for terminal feel */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          zIndex: 0,
          opacity: 0.5
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {PROCESSING_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStepIndex && isProcessing;
            const isCompleted = index < activeStepIndex || !isProcessing;

            return (
              <div 
                key={step.id} 
                className={`processing-step-${index}`}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  opacity: 0, // GSAP will handle this
                  color: isActive ? 'var(--color-text-primary)' : (isCompleted ? 'var(--color-text-secondary)' : 'var(--color-text-muted)')
                }}
              >
                <div style={{ 
                  color: isActive ? 'var(--color-primary)' : (isCompleted ? '#10b981' : 'inherit')
                }}>
                  <Icon size={20} />
                </div>
                
                <span style={{ flex: 1, fontSize: '0.9rem' }}>{step.label}</span>
                
                <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                  {isActive && (
                    <div className="spinner" style={{ animation: 'spin 1s linear infinite' }}>
                      <Loader2 size={20} color="var(--color-primary)" />
                    </div>
                  )}
                  <div 
                    className="check" 
                    style={{ 
                      position: 'absolute', 
                      top: 0, left: 0, 
                      opacity: isCompleted ? 1 : 0, 
                      transform: 'scale(0)' 
                    }}
                  >
                    <CheckCircle2 size={20} color="#10b981" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final AI Result Card */}
      {!isProcessing && (
        <div 
          className="final-result-card"
          style={{
            background: 'linear-gradient(145deg, rgba(251, 191, 36, 0.05) 0%, rgba(251, 191, 36, 0.01) 100%)',
            border: '1px solid rgba(251, 191, 36, 0.2)',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            opacity: 0 // GSAP will fade this in
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)' }}>
              AI Confidence Score
            </span>
            <div style={{ 
              fontSize: '4rem', 
              fontWeight: '800', 
              color: riskDetails.color,
              lineHeight: '1',
              margin: '0.5rem 0',
              textShadow: `0 0 20px ${riskDetails.color}40`
            }}>
              {finalScore}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: `${riskDetails.color}20`, color: riskDetails.color, padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.875rem', fontWeight: '600' }}>
              {riskDetails.label} Profile
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', textAlign: 'left' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Approval Probability</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>{riskDetails.prob}</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Requested Capital</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                {formatIndianCurrency(formData.loanAmount)}
              </div>
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '2rem', borderRadius: '8px' }}
            onClick={() => onNext()} // Route to Dashboard!
          >
            Go to Applicant Dashboard
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Keyframe for spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
