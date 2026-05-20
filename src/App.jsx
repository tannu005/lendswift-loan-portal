import { useEffect } from 'react';
import { FormProvider, useFormContext } from './context/FormContext';
import { useAutoSave } from './hooks/useAutoSave';
import Step1LoanType from './components/steps/Step1LoanType';
import Step2PersonalInfo from './components/steps/Step2PersonalInfo';
import Step3KYC from './components/steps/Step3KYC';
import Step4Address from './components/steps/Step4Address';
import Step5Employment from './components/steps/Step5Employment';
import Step6CoApplicant from './components/steps/Step6CoApplicant';
import Step7Documents from './components/steps/Step7Documents';
import Step8Review from './components/steps/Step8Review';
import ThreeBackground from './components/ThreeBackground';
import CustomCursor from './components/CustomCursor';
import './App.css';

const STEP_NAMES = {
  1: 'Loan Selection',
  2: 'Personal Info',
  3: 'KYC Verification',
  4: 'Address Details',
  5: 'Employment & Income',
  6: 'Co-Applicant details',
  7: 'Document Upload',
  8: 'Review & Submit',
};

function WizardContainer() {
  const {
    state,
    setStep,
    restoreState,
    activeSteps,
    getAllFormData,
  } = useFormContext();

  const currentStep = state.currentStep;
  const formData = getAllFormData();

  // Initialize auto-save hook
  const {
    lastSaved,
    showToast,
    showResumeModal,
    savedMeta,
    checkForSavedDraft,
    restore,
    clearDraft,
  } = useAutoSave(
    formData,
    currentStep,
    (restoredData, step) => {
      restoreState(restoredData, step);
    }
  );

  // Check for saved draft on mount
  useEffect(() => {
    checkForSavedDraft();
  }, [checkForSavedDraft]);

  const handleNext = () => {
    // Determine the next step in our active list
    const currentIndex = activeSteps.indexOf(currentStep);
    if (currentIndex < activeSteps.length - 1) {
      setStep(activeSteps[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    const currentIndex = activeSteps.indexOf(currentStep);
    if (currentIndex > 0) {
      setStep(activeSteps[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoToStep = (targetStep) => {
    if (activeSteps.includes(targetStep)) {
      setStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Render the current step component
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1LoanType onNext={handleNext} />;
      case 2:
        return <Step2PersonalInfo onNext={handleNext} onPrev={handlePrev} />;
      case 3:
        return <Step3KYC onNext={handleNext} onPrev={handlePrev} />;
      case 4:
        return <Step4Address onNext={handleNext} onPrev={handlePrev} />;
      case 5:
        return <Step5Employment onNext={handleNext} onPrev={handlePrev} />;
      case 6:
        return <Step6CoApplicant onNext={handleNext} onPrev={handlePrev} />;
      case 7:
        return <Step7Documents onNext={handleNext} onPrev={handlePrev} />;
      case 8:
        return <Step8Review onPrev={handlePrev} onGoToStep={handleGoToStep} />;
      default:
        return <Step1LoanType onNext={handleNext} />;
    }
  };

  // Calculate percentage progress
  const progressPercent = Math.round(
    (activeSteps.indexOf(currentStep) / (activeSteps.length - 1)) * 100
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="gradient-bg">
      {/* Top Header */}
      <header style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }} className="glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: '800', background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            LendSwift
          </span>
          <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '4px', background: 'var(--color-surface-lighter)', color: 'var(--color-text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            NBFC Portal
          </span>
        </div>
        
        {lastSaved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)' }}></span>
            Auto-saved at {lastSaved}
          </div>
        )}
      </header>

      {/* Main Content Layout */}
      <main style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'minmax(250px, 320px) 1fr',
        gap: '2rem',
        padding: '2rem',
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
      }} className="main-responsive">
        
        {/* Left Progress Steps Sidebar */}
        <aside className="sidebar-responsive" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <div className="card glass" style={{ position: 'sticky', top: '2rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
              Application Steps
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeSteps.map((stepNum, idx) => {
                const isActive = stepNum === currentStep;
                const isCompleted = activeSteps.indexOf(stepNum) < activeSteps.indexOf(currentStep);
                
                return (
                  <button
                    key={stepNum}
                    onClick={() => {
                      // Allow navigating back or forward only if completed/active
                      if (isCompleted || isActive) {
                        handleGoToStep(stepNum);
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      textAlign: 'left',
                      cursor: (isCompleted || isActive) ? 'pointer' : 'not-allowed',
                      width: '100%',
                    }}
                    disabled={!(isCompleted || isActive)}
                    aria-label={`Step ${idx + 1}: ${STEP_NAMES[stepNum]}. ${isActive ? 'Current Step' : isCompleted ? 'Completed' : 'Locked'}`}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.625rem 0.75rem',
                      borderRadius: '0.5rem',
                      background: isActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                      border: isActive ? '1px solid rgba(139, 92, 246, 0.35)' : '1px solid transparent',
                      transition: 'all 0.2s',
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        background: isCompleted ? 'var(--color-accent)' : isActive ? 'var(--color-primary-light)' : 'var(--color-surface-lighter)',
                        color: isCompleted || isActive ? 'white' : 'var(--color-text-secondary)',
                      }}>
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <div>
                        <p style={{
                          fontSize: '0.85rem',
                          fontWeight: isActive ? '600' : '500',
                          color: isActive ? 'var(--color-text-primary)' : isCompleted ? 'var(--color-text-secondary)' : 'var(--color-text-muted)',
                        }}>
                          {STEP_NAMES[stepNum]}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Overall Progress Bar */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Overall Progress</span>
                <span style={{ fontWeight: '600', color: 'var(--color-accent)' }}>{progressPercent}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} role="progressbar" aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Form Container */}
        <section className="form-card-responsive">
          <div className="card glass" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
            {renderStep()}
          </div>
        </section>
      </main>

      {/* Auto-save Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 100,
          background: 'var(--color-accent)',
          color: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          fontWeight: '600',
        }} className="animate-slide-in">
          <span>💾 Draft auto-saved securely</span>
        </div>
      )}

      {/* Resume Draft Modal */}
      {showResumeModal && savedMeta && (
        <div className="modal-overlay">
          <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="resume-modal-title">
            <h3 id="resume-modal-title" style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-primary-light)' }}>
              Resume Saved Application?
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              We found a draft application for a <strong>{savedMeta.loanType.toUpperCase()}</strong> loan saved on {new Date(savedMeta.timestamp).toLocaleString('en-IN')}. Would you like to resume from step {savedMeta.step}?
            </p>
            
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary magnetic-btn"
                onClick={clearDraft}
                id="resume-modal-fresh"
              >
                Start Fresh
              </button>
              <button
                type="button"
                className="btn btn-primary magnetic-btn"
                onClick={restore}
                id="resume-modal-resume"
              >
                Resume Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Details */}
      <footer style={{
        padding: '1.5rem',
        borderTop: '1px solid var(--color-border)',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--color-text-muted)',
      }}>
        <p>© 2026 LendSwift NBFC. All rights reserved.</p>
        <p style={{ marginTop: '0.25rem' }}>LendSwift is a registered NBFC licensed by the Reserve Bank of India. Data encrypted with AES-256 standards.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <FormProvider>
      <ThreeBackground />
      <CustomCursor />
      <WizardContainer />
    </FormProvider>
  );
}
