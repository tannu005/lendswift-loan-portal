import { useEffect, useState, useRef } from 'react';
import { FormProvider, useFormContext } from './context/FormContext';
import { useAutoSave } from './hooks/useAutoSave';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Shield, Clock, FileText, HelpCircle, ArrowRight } from 'lucide-react';
import CustomCursor from './components/CustomCursor';
import Step1LoanType from './components/steps/Step1LoanType';
import Step2PersonalInfo from './components/steps/Step2PersonalInfo';
import Step3KYC from './components/steps/Step3KYC';
import Step4Address from './components/steps/Step4Address';
import Step5Employment from './components/steps/Step5Employment';
import Step6CoApplicant from './components/steps/Step6CoApplicant';
import Step7Documents from './components/steps/Step7Documents';
import Step8Review from './components/steps/Step8Review';
import ApplicantDashboard from './components/ApplicantDashboard';
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
};

const STEP_SUPPORT = {
  0: null,
  1: { title: 'What you\'ll need', items: ['An idea of loan amount and purpose', 'Preferred repayment timeline'] },
  2: { title: 'What you\'ll need', items: ['Full name as on PAN card', 'Date of birth', 'Contact details'] },
  3: { title: 'What you\'ll need', items: ['PAN card number', 'Aadhaar number', 'Consent for verification'] },
  4: { title: 'What you\'ll need', items: ['Current residential address', 'PIN code', 'Residence type details'] },
  5: { title: 'What you\'ll need', items: ['Employment type', 'Company or business details', 'Income information'] },
  6: { title: 'What you\'ll need', items: ['Co-applicant\'s PAN and name', 'Their income details', 'Relationship information'] },
  7: { title: 'What you\'ll need', items: ['Identity documents (PAN, Aadhaar)', 'Income proof (salary slips / ITR)', 'Bank statements (6 months)', 'Passport-size photograph'] },
  8: { title: 'Before you submit', items: ['Review all sections carefully', 'You can go back to edit any section', 'All four consent checkboxes are required'] },
};

// Framer Motion variants for directional panel transitions
const panelVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

const panelTransition = {
  x: { type: 'tween', duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  opacity: { duration: 0.2 },
};

// Welcome screen component
function WelcomeScreen({ onStart }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '480px', textAlign: 'center', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          Digital Loan Application
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', maxWidth: '420px', lineHeight: '1.6' }}>
          Apply for a personal, home, or business loan in a few guided steps.
          This usually takes 3–5 minutes.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px', width: '100%', marginBottom: '2rem' }}>
        {[
          { icon: Shield, text: 'Your data is encrypted end-to-end' },
          { icon: Clock, text: 'Save progress and return anytime' },
          { icon: FileText, text: 'Review everything before submitting' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem', background: 'var(--color-surface-lighter)', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
            <item.icon size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{item.text}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="btn btn-primary"
        style={{ padding: '0.625rem 1.5rem', fontSize: '0.875rem' }}
        id="start-application"
      >
        Start application
        <ArrowRight size={16} />
      </button>

      <p style={{ marginTop: '1.5rem', fontSize: '0.6875rem', color: 'var(--color-text-muted)', maxWidth: '360px' }}>
        LendSwift is a registered NBFC. All applications are processed under RBI fair practice guidelines.
      </p>
    </div>
  );
}

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
  const [direction, setDirection] = useState(1);
  const [supportOpen, setSupportOpen] = useState(true);
  const prevStepRef = useRef(currentStep);

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

  // Track direction when step changes
  useEffect(() => {
    if (currentStep !== prevStepRef.current) {
      setDirection(currentStep > prevStepRef.current ? 1 : -1);
      prevStepRef.current = currentStep;
    }
  }, [currentStep]);

  const allSteps = [0, ...activeSteps]; // 0 = welcome

  const handleNext = () => {
    const currentIndex = allSteps.indexOf(currentStep);
    if (currentIndex < allSteps.length - 1) {
      setDirection(1);
      setStep(allSteps[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const currentIndex = allSteps.indexOf(currentStep);
    if (currentIndex > 0) {
      setDirection(-1);
      setStep(allSteps[currentIndex - 1]);
    }
  };

  const handleGoToStep = (targetStep) => {
    if (allSteps.includes(targetStep)) {
      setDirection(targetStep > currentStep ? 1 : -1);
      setStep(targetStep);
    }
  };

  const handleStart = () => {
    setDirection(1);
    setStep(1);
  };

  // Render the current step component
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeScreen onStart={handleStart} />;
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
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  // Progress calculation (excluding welcome)
  const appStepIndex = activeSteps.indexOf(currentStep);
  const progressPercent = currentStep === 0 ? 0 : Math.round(
    (appStepIndex / (activeSteps.length - 1)) * 100
  );

  const support = STEP_SUPPORT[currentStep];
  const showSidebar = currentStep > 0;

  if (state.isSubmitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="workspace-bg cursor-area">
        {/* Header */}
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

        {/* Dashboard Main View */}
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="workspace-bg cursor-area">
      {/* Header */}
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
          {currentStep > 0 && (
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ChevronRight size={12} />
              {STEP_NAMES[currentStep]}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {lastSaved && (
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
              Saved {lastSaved}
            </span>
          )}

          {currentStep > 0 && support && (
            <button
              onClick={() => setSupportOpen(!supportOpen)}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border)',
                color: supportOpen ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.6875rem',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'color 0.15s ease',
              }}
            >
              <HelpCircle size={13} />
              <span className="hide-mobile">Help</span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile stepper */}
      {showSidebar && (
        <div className="mobile-stepper">
          <div className="progress-track" style={{ flex: 1 }}>
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
            {appStepIndex + 1} of {activeSteps.length}
          </span>
        </div>
      )}

      {/* Main Workspace */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: showSidebar
          ? (supportOpen && support ? '220px 1fr 260px' : '220px 1fr')
          : '1fr',
        overflow: 'hidden',
      }}>

        {/* Left Rail */}
        {showSidebar && (
          <nav className="workspace-sidebar" style={{
            borderRight: '1px solid var(--color-border)',
            background: 'var(--color-surface-light)',
            padding: '1.25rem 0.875rem',
            height: 'calc(100vh - 48px)',
            position: 'sticky',
            top: '48px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto',
          }}>
            <div>
              <p style={{ fontSize: '0.625rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
                Steps
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {activeSteps.map((stepNum, idx) => {
                  const isActive = stepNum === currentStep;
                  const isCompleted = activeSteps.indexOf(stepNum) < activeSteps.indexOf(currentStep);
                  const isAccessible = isCompleted || isActive;

                  return (
                    <button
                      key={stepNum}
                      onClick={() => isAccessible && handleGoToStep(stepNum)}
                      disabled={!isAccessible}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        textAlign: 'left',
                        cursor: isAccessible ? 'pointer' : 'default',
                        width: '100%',
                        opacity: isAccessible ? 1 : 0.4,
                      }}
                      aria-label={`Step ${idx + 1}: ${STEP_NAMES[stepNum]}`}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4375rem 0.5rem',
                        borderRadius: '5px',
                        background: isActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                        transition: 'background 0.15s ease',
                        position: 'relative',
                      }}>
                        {/* Active pill indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeStepPill"
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '2px',
                              height: '16px',
                              borderRadius: '1px',
                              background: 'var(--color-primary)',
                            }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}

                        <span style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.625rem',
                          fontWeight: '600',
                          background: isCompleted ? 'var(--color-accent)' : isActive ? 'var(--color-primary)' : 'transparent',
                          color: isCompleted || isActive ? 'white' : 'var(--color-text-muted)',
                          border: isCompleted || isActive ? 'none' : '1px solid var(--color-border)',
                          flexShrink: 0,
                        }}>
                          {isCompleted ? '✓' : idx + 1}
                        </span>

                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: isActive ? '600' : '400',
                          color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        }}>
                          {STEP_NAMES[stepNum]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Progress */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', marginBottom: '0.375rem', color: 'var(--color-text-muted)' }}>
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>

            {/* Trust note */}
            <div style={{ padding: '0.625rem', borderTop: '1px solid var(--color-border)', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                Your information is encrypted and processed securely under RBI guidelines.
              </p>
            </div>
          </nav>
        )}

        {/* Center Panel */}
        <main className="workspace-main" style={{
          padding: '2rem 2.5rem',
          overflowY: 'auto',
          height: 'calc(100vh - 48px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <div style={{ maxWidth: '640px', width: '100%', flex: 1 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={panelTransition}
              >
                {currentStep === 0 ? (
                  renderStep()
                ) : (
                  <div className="card" style={{ padding: '1.5rem' }}>
                    {renderStep()}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <footer style={{
            padding: '1rem 0',
            marginTop: '1.5rem',
            fontSize: '0.625rem',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            maxWidth: '640px',
            width: '100%',
          }}>
            <p>© 2026 LendSwift NBFC · RBI Registered · Fair Practice Code Compliant</p>
          </footer>
        </main>

        {/* Right Support Panel */}
        {showSidebar && supportOpen && support && (
          <aside className="workspace-support" style={{
            borderLeft: '1px solid var(--color-border)',
            background: 'var(--color-surface-light)',
            padding: '1.25rem 1rem',
            height: 'calc(100vh - 48px)',
            position: 'sticky',
            top: '48px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}>
            <div>
              <p style={{ fontSize: '0.625rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                {support.title}
              </p>

              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {support.items.map((item, i) => (
                  <li key={i} style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.5',
                    paddingLeft: '0.75rem',
                    position: 'relative',
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      top: '0.5rem',
                      width: '3px',
                      height: '3px',
                      borderRadius: '50%',
                      background: 'var(--color-text-muted)',
                    }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <p style={{ fontSize: '0.625rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                Need help?
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                Reach us at support@lendswift.in or call 1800-XXX-XXXX (Mon–Sat, 9am–6pm).
              </p>
            </div>
          </aside>
        )}
      </div>

      {/* Auto-save toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume modal */}
      {showResumeModal && savedMeta && (
        <div className="modal-overlay">
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
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
              <button className="btn btn-secondary btn-sm" onClick={clearDraft}>
                Start fresh
              </button>
              <button className="btn btn-primary btn-sm" onClick={restore}>
                Resume
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <FormProvider>
      <CustomCursor />
      <WizardContainer />
    </FormProvider>
  );
}
