import { useEffect, useState, useRef } from 'react';
import { FormProvider, useFormContext } from './context/FormContext';
import { useAutoSave } from './hooks/useAutoSave';
import { animatePanelEnter, animatePanelExit } from './utils/gsapSystem';
import { ChevronRight, Shield, Clock, FileText, HelpCircle, ArrowRight } from 'lucide-react';
import CustomCursor from './components/CustomCursor';
import ThreeBackground from './components/ThreeBackground';
import LandingPage from './components/LandingPage';
import Step1LoanType from './components/steps/Step1LoanType';
import Step2PersonalInfo from './components/steps/Step2PersonalInfo';
import Step3KYC from './components/steps/Step3KYC';
import Step4Address from './components/steps/Step4Address';
import Step5Employment from './components/steps/Step5Employment';
import Step6CoApplicant from './components/steps/Step6CoApplicant';
import Step7Documents from './components/steps/Step7Documents';
import Step8Review from './components/steps/Step8Review';
import Step9RiskAnalysis from './components/steps/Step9RiskAnalysis';
import ApplicantDashboard from './components/ApplicantDashboard';
import LoanSimulationDashboard from './components/LoanSimulationDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import './App.css';

const STEP_NAMES = {
  0: 'Welcome',
  1: 'Loan type',
  2: 'Personal info',
  3: 'Identity',
  4: 'Address',
  5: 'Employment',
  6: 'Co-applicant',
  7: 'Documents',
  8: 'Review',
  9: 'AI Risk Analysis',
};

function WizardContainer() {
  const { state, setStep } = useFormContext();
  const { currentStep } = state;
  const { lastSaved, saveDraft, clearDraft, restore, savedMeta } = useAutoSave(state);
  
  const [showToast, setShowToast] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [renderedStep, setRenderedStep] = useState(currentStep);
  const containerRef = useRef(null);

  // Resume check
  useEffect(() => {
    if (savedMeta && currentStep === 1) {
      setShowResumeModal(true);
    }
  }, [savedMeta, currentStep]);

  useEffect(() => {
    if (lastSaved) {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(t);
    }
  }, [lastSaved]);

  // GSAP Transition Logic
  useEffect(() => {
    if (currentStep !== renderedStep && containerRef.current) {
      const direction = currentStep > renderedStep ? 1 : -1;
      animatePanelExit(containerRef.current, direction, () => {
        setRenderedStep(currentStep);
        requestAnimationFrame(() => {
          if (containerRef.current) {
            animatePanelEnter(containerRef.current, direction);
          }
        });
      });
    }
  }, [currentStep, renderedStep]);

  const handleNext = () => setStep(currentStep + 1);
  const handleBack = () => setStep(currentStep - 1);

  const renderStep = () => {
    switch (renderedStep) {
      case 1: return <Step1LoanType onNext={handleNext} />;
      case 2: return <Step2PersonalInfo onNext={handleNext} onBack={handleBack} />;
      case 3: return <Step3KYC onNext={handleNext} onBack={handleBack} />;
      case 4: return <Step4Address onNext={handleNext} onBack={handleBack} />;
      case 5: return <Step5Employment onNext={handleNext} onBack={handleBack} />;
      case 6: return <Step6CoApplicant onNext={handleNext} onBack={handleBack} />;
      case 7: return <Step7Documents onNext={handleNext} onBack={handleBack} />;
      case 8: return <Step8Review onBack={handleBack} onNext={handleNext} />;
      case 9: return <Step9RiskAnalysis onNext={handleNext} />;
      case 'admin': return <AdminDashboard onBack={() => setStep(0)} />;
      default: return null;
    }
  };

  const activeSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const appStepIndex = activeSteps.indexOf(currentStep);
  const progressPercent = typeof currentStep !== 'number' ? 0 : currentStep === 0 ? 0 : Math.round(
    (appStepIndex / (activeSteps.length - 1)) * 100
  );

  if (state.isSubmitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="cursor-area">
        <header style={{
          padding: '0 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '48px',
          background: 'rgba(15, 17, 21, 0.85)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9375rem', fontWeight: '700', color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>
              LendSwift
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ChevronRight size={12} />
              Application Dashboard
            </span>
          </div>
        </header>

        <main className="workspace-main" style={{
          padding: '2rem 1rem',
          overflowY: 'auto',
          height: 'calc(100vh - 48px)',
        }}>
          <ApplicantDashboard />
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="cursor-area">
      {/* Immersive Floating Header */}
      <header style={{
        padding: '2rem 3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', pointerEvents: 'auto' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fbbf24', letterSpacing: '-0.02em' }}>
            LendSwift
          </span>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.25rem' }}>/</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>
            {STEP_NAMES[currentStep]}
          </span>
        </div>
        
        {/* Progress Bar Top Right */}
        {typeof currentStep === 'number' && currentStep > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '250px', pointerEvents: 'auto' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', minWidth: '35px', textAlign: 'right' }}>{progressPercent}%</span>
            <div className="progress-track" style={{ flex: 1, background: 'rgba(255,255,255,0.1)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
              <div className="progress-fill" style={{ width: `${progressPercent}%`, background: '#fbbf24', height: '100%', transition: 'width 0.5s ease-out' }} />
            </div>
            {lastSaved && (
              <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>
                Saved
              </span>
            )}
          </div>
        )}
      </header>

      {/* Main Immersive Workspace */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 3rem 2rem 3rem',
        maxWidth: '1800px',
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{ display: 'flex', flex: 1, width: '100%', gap: '4rem', alignItems: 'center' }}>
          {/* Main Content Area (Form) - Immersive floating */}
          <div style={{ flex: '1 1 60%', position: 'relative', perspective: '2000px', maxWidth: '800px' }}>
            <div 
              ref={containerRef}
              style={{ 
                opacity: 1,
                transform: 'translateY(0)',
                willChange: 'transform, opacity',
              }}
            >
              {/* Render step directly, without .card wrapper for true immersive feel */}
              <div style={{ padding: '2rem 0' }}>
                {renderStep()}
              </div>
            </div>

            {/* Subtle Footer */}
            <footer style={{
              marginTop: '4rem',
              fontSize: '0.625rem',
              color: 'rgba(255,255,255,0.2)',
              textAlign: 'left',
            }}>
              <p>© 2026 LendSwift NBFC · Encrypted Workspace</p>
            </footer>
          </div>

          {/* Dynamic Data Dashboard (Floating Spatial Panel) */}
          {currentStep > 0 && currentStep !== 'admin' && (
            <div style={{ flex: '0 0 480px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ 
                width: '100%', 
                height: 'auto', 
                minHeight: '600px', 
                background: 'rgba(15, 17, 21, 0.4)', 
                backdropFilter: 'blur(30px)', 
                WebkitBackdropFilter: 'blur(30px)',
                borderRadius: '24px', 
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)', 
                overflow: 'hidden',
                transform: 'translateZ(50px)'
              }}>
                <LoanSimulationDashboard />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auto-save toast */}
      {showToast && (
        <div
          className="animate-slide-in"
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            zIndex: 1000,
            background: 'var(--color-surface-lighter)',
            color: 'var(--color-text-secondary)',
            padding: '0.5rem 0.875rem',
            borderRadius: '6px',
            border: '1px solid var(--color-border)',
            fontSize: '0.75rem',
            fontWeight: '500',
          }}
        >
          Draft saved
        </div>
      )}

      {/* Resume modal */}
      {showResumeModal && savedMeta && (
        <div className="modal-overlay">
          <div
            className="modal-content animate-fade-in"
            style={{ transform: 'scale(1)', background: 'rgba(15,17,21,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-title"
          >
            <h3 id="resume-title" style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
              Resume your application?
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              We found a saved draft for a <strong>{savedMeta.loanType}</strong> loan from {new Date(savedMeta.timestamp).toLocaleString('en-IN')}. Pick up where you left off?
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => { clearDraft(); setShowResumeModal(false); }}>
                Start fresh
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => { restore(); setShowResumeModal(false); }}>
                Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AppContent() {
  const { state, setStep } = useFormContext();
  
  if (state.currentStep === 0) {
    return (
      <>
        <ThreeBackground />
        <LandingPage onStart={() => setStep(1)} />
      </>
    );
  }

  return (
    <>
      <ThreeBackground />
      <WizardContainer />
    </>
  );
}

export default function App() {
  return (
    <FormProvider>
      <CustomCursor />
      <AppContent />
    </FormProvider>
  );
}
