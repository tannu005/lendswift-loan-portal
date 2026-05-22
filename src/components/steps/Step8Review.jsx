import { useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import { LOAN_CONFIGS, MARITAL_STATUS_OPTIONS, GENDER_OPTIONS, RESIDENCE_TYPES, BUSINESS_TYPES, RELATIONSHIP_OPTIONS, EMPLOYMENT_SALARIED, EMPLOYMENT_SELF_EMPLOYED, EMPLOYMENT_BUSINESS_OWNER } from '../../utils/constants';
import { formatIndianCurrency, calculateAge } from '../../utils/validators';
import { calculateEMI, getInterestRate, checkEMIAffordability } from '../../utils/emiCalculator';
import { v4 as uuidv4 } from 'uuid';
import { ChevronLeft, ChevronRight, Lock, ShieldCheck, CheckCircle } from 'lucide-react';

function SectionCard({ title, onEdit, children }) {
  return (
    <div className="card" style={{ marginBottom: '1rem', padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</h3>
        {onEdit && (
          <button type="button" onClick={onEdit} className="btn btn-secondary btn-sm" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
            Edit
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function DataRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid var(--color-border-light)', fontSize: '0.8125rem' }}>
      <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: '500', color: 'var(--color-text-primary)', textAlign: 'right', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || '—'}</span>
    </div>
  );
}

export default function Step8Review({ onPrev, onGoToStep, onNext }) {
  const { state, submitApplication, getMonthlyIncome, isStep6Required } = useFormContext();
  const [consents, setConsents] = useState({
    confirmAccuracy: false,
    consentCreditCheck: false,
    agreeTerms: false,
    consentCommunications: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState('');
  const [consentErrors, setConsentErrors] = useState({});
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const fd = state.formData;
  const config = LOAN_CONFIGS[fd.loanType];
  const interestRate = getInterestRate(fd.loanType);
  const emiResult = calculateEMI(fd.loanAmount, interestRate, fd.loanTenure);
  const monthlyIncome = getMonthlyIncome();
  const coApplicantIncome = Number(fd.coApplicantIncome) || 0;
  const affordability = checkEMIAffordability(emiResult.emi, monthlyIncome, coApplicantIncome);

  const handleConsent = (key) => {
    setConsents(prev => ({ ...prev, [key]: !prev[key] }));
    setConsentErrors(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = {};
    if (!consents.confirmAccuracy) errors.confirmAccuracy = 'Required';
    if (!consents.consentCreditCheck) errors.consentCreditCheck = 'Required';
    if (!consents.agreeTerms) errors.agreeTerms = 'Required';
    if (!consents.consentCommunications) errors.consentCommunications = 'Required';
    
    if (Object.keys(errors).length > 0) {
      setConsentErrors(errors);
      return;
    }

    // Generate a random 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    // Show MFA Modal
    setShowMfaModal(true);
    setOtpError(false);
    setOtp(['', '', '', '', '', '']); // Reset input fields

    // Simulate sending an SMS to the user's phone
    setTimeout(() => {
      alert(`📩 SMS from LendSwift:\n\nYour loan application verification code is: ${newOtp}. Do not share this with anyone.`);
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple chars
    const newOtpArr = [...otp];
    newOtpArr[index] = value;
    setOtp(newOtpArr);
    setOtpError(false);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const processSubmission = async () => {
    if (otp.join('') !== generatedOtp) {
      setOtpError(true);
      return;
    }
    
    setShowMfaModal(false);
    setSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const applicationId = uuidv4();
    setAppId(applicationId);
    submitApplication(applicationId);
    setSubmitted(true);
    setSubmitting(false);

    // Clear draft from localStorage
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('lendswift_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (err) {
      console.warn('Failed to clear post-submit draft:', err);
    }
    
    // Proceed to Step 9: AI Risk Analysis
    if (onNext) onNext();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.375rem', color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>
          Review your application
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
          Verify your details and sign the Key Fact Statement below to submit your application.
        </p>
      </div>

      {/* Asymmetric Split Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
      }}>
        {/* Left Column: Data Summaries */}
        <div>
          <SectionCard title="Loan details" onEdit={() => onGoToStep(1)}>
            <DataRow label="Loan Type" value={config?.label} />
            <DataRow label="Loan Amount" value={formatIndianCurrency(fd.loanAmount)} />
            <DataRow label="Tenure" value={`${fd.loanTenure} months`} />
            <DataRow label="Purpose" value={fd.loanPurpose} />
          </SectionCard>

          <SectionCard title="Personal information" onEdit={() => onGoToStep(2)}>
            <DataRow label="Full Name" value={fd.fullName} />
            <DataRow label="Date of Birth" value={fd.dateOfBirth ? new Date(fd.dateOfBirth).toLocaleDateString('en-IN') : ''} />
            <DataRow label="Age" value={fd.dateOfBirth ? `${calculateAge(fd.dateOfBirth)} years` : ''} />
            <DataRow label="Gender" value={GENDER_OPTIONS.find(g => g.value === fd.gender)?.label} />
            <DataRow label="Marital Status" value={MARITAL_STATUS_OPTIONS.find(m => m.value === fd.maritalStatus)?.label} />
            <DataRow label="Email" value={fd.email} />
            <DataRow label="Mobile" value={fd.mobileNumber ? `XXXXXX${fd.mobileNumber.slice(-4)}` : ''} />
          </SectionCard>

          <SectionCard title="Identity verification" onEdit={() => onGoToStep(3)}>
            <DataRow label="PAN" value={fd.panNumber ? `XXXXXX${fd.panNumber.slice(-4)}` : ''} />
            <DataRow label="PAN Status" value={state.panVerified ? 'Verified' : 'Pending'} />
            <DataRow label="Aadhaar" value={fd.aadhaarNumber ? `XXXXXXXX${fd.aadhaarNumber.replace(/\s/g, '').slice(-4)}` : ''} />
            <DataRow label="Aadhaar Status" value={state.aadhaarVerified ? 'Verified' : 'Pending'} />
          </SectionCard>

          <SectionCard title="Address" onEdit={() => onGoToStep(4)}>
            <DataRow label="Current Address" value={`${fd.currentAddressLine1 || ''}, ${fd.currentCity || ''}, ${fd.currentState || ''} - ${fd.currentPinCode || ''}`} />
            <DataRow label="Residence Type" value={RESIDENCE_TYPES.find(r => r.value === fd.residenceType)?.label} />
            <DataRow label="Years at Address" value={fd.yearsAtCurrentAddress} />
          </SectionCard>

          <SectionCard title="Employment" onEdit={() => onGoToStep(5)}>
            <DataRow label="Employment Type" value={
              fd.employmentType === EMPLOYMENT_SALARIED ? 'Salaried' :
              fd.employmentType === EMPLOYMENT_SELF_EMPLOYED ? 'Self-Employed' :
              fd.employmentType === EMPLOYMENT_BUSINESS_OWNER ? 'Business Owner' : ''
            } />
            {fd.employmentType === EMPLOYMENT_SALARIED && (
              <>
                <DataRow label="Company" value={fd.companyName} />
                <DataRow label="Designation" value={fd.designation} />
                <DataRow label="Monthly Salary" value={formatIndianCurrency(fd.monthlyNetSalary)} />
              </>
            )}
            {(fd.employmentType === EMPLOYMENT_SELF_EMPLOYED || fd.employmentType === EMPLOYMENT_BUSINESS_OWNER) && (
              <>
                <DataRow label="Business Name" value={fd.businessName} />
                <DataRow label="Business Type" value={BUSINESS_TYPES.find(b => b.value === fd.businessType)?.label} />
                <DataRow label="Annual Turnover" value={formatIndianCurrency(fd.annualTurnover)} />
              </>
            )}
          </SectionCard>

          {isStep6Required && (
            <SectionCard title="Co-applicant" onEdit={() => onGoToStep(6)}>
              <DataRow label="Name" value={fd.coApplicantName} />
              <DataRow label="Relationship" value={RELATIONSHIP_OPTIONS.find(r => r.value === fd.coApplicantRelationship)?.label} />
              <DataRow label="Monthly Income" value={formatIndianCurrency(fd.coApplicantIncome)} />
            </SectionCard>
          )}
        </div>

        {/* Right Column: Handcrafted Key Fact Statement (KFS) Sheet */}
        <div style={{
          background: 'var(--color-surface-light)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          padding: '1.5rem',
          position: 'sticky',
          top: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <span style={{
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-text-muted)',
              fontWeight: '600',
            }}>
              Key Fact Statement
            </span>
            <span style={{ fontSize: '0.625rem', padding: '2px 6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', borderRadius: '3px', fontFamily: 'monospace' }}>
              RBI-DL V2.1
            </span>
          </div>

          <div style={{
            background: 'var(--color-surface-lighter)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '6px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {/* Financial Parameters Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem', fontFamily: 'monospace' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>LOAN AMOUNT</span>
                <span style={{ fontWeight: 'bold' }}>{formatIndianCurrency(fd.loanAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>RATE OF INTEREST</span>
                <span>{interestRate}% p.a. (Reducing)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>TENURE</span>
                <span>{fd.loanTenure} Months</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>MONTHLY EMI</span>
                <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>{formatIndianCurrency(emiResult.emi)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>PROCESSING CHARGE</span>
                <span>{formatIndianCurrency(emiResult.processingFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>TOTAL INTEREST PAYABLE</span>
                <span>{formatIndianCurrency(emiResult.totalInterest)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>NET DISBURSED AMOUNT</span>
                <span>{formatIndianCurrency(fd.loanAmount - emiResult.processingFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                <span>TOTAL REPAYMENT COST</span>
                <span>{formatIndianCurrency(emiResult.totalPayment + emiResult.processingFee)}</span>
              </div>
            </div>

            {/* Affordability Index check */}
            <div style={{
              padding: '0.625rem',
              borderRadius: '4px',
              background: affordability.affordable ? 'rgba(16, 185, 129, 0.03)' : 'rgba(251, 191, 36, 0.03)',
              border: `1px solid ${affordability.affordable ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 191, 36, 0.1)'}`,
              fontSize: '0.725rem',
              color: affordability.affordable ? 'var(--color-accent)' : 'var(--color-warning)',
              lineHeight: '1.4',
            }}>
              {affordability.message.replace('👍 ', '').replace('⚠️ ', '')}
            </div>

            {/* Declarations & Consents Checklist (Integrated into the compact) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.5rem' }}>
              {[
                { key: 'confirmAccuracy', text: 'I confirm all information is correct and valid.' },
                { key: 'consentCreditCheck', text: 'I authorize credit score assessment bureau pulls.' },
                { key: 'agreeTerms', text: 'I accept LendSwift Fair Practice Code & KFS guidelines.' },
                { key: 'consentCommunications', text: 'I agree to contact notifications on WhatsApp/email.' },
              ].map((item) => (
                <div key={item.key}>
                  <label style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer', alignItems: 'flex-start' }}>
                    <input
                      type="checkbox"
                      checked={consents[item.key]}
                      onChange={() => handleConsent(item.key)}
                      style={{ marginTop: '0.125rem', width: '14px', height: '14px', accentColor: 'var(--color-primary)', flexShrink: 0 }}
                    />
                    <span style={{ fontSize: '0.725rem', lineHeight: '1.35', color: 'var(--color-text-secondary)' }}>
                      {item.text} <span className="required">*</span>
                    </span>
                  </label>
                  {consentErrors[item.key] && (
                    <p style={{ color: 'var(--color-error)', fontSize: '0.65rem', margin: '0.125rem 0 0 1.25rem' }}>
                      Authorization required
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Embedded Signature Image as a Seal */}
            {state.signature && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px dashed var(--color-border)',
                marginTop: '0.25rem',
              }}>
                <div>
                  <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Digital Seal Signature</span>
                  <span style={{ fontSize: '0.625rem', color: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', gap: '0.125rem', marginTop: '0.125rem' }}>
                    <ShieldCheck size={10} /> Certified
                  </span>
                </div>
                <div style={{
                  background: 'var(--color-surface-light)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <img src={state.signature} alt="Digital Seal signature" style={{ height: '100%' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', marginTop: '2rem' }}>
        <button type="button" onClick={onPrev} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          <ChevronLeft size={16} />
          Back
        </button>
        <button
          type="submit"
          className="btn btn-accent"
          disabled={submitting}
          id="submit-application"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
        >
          {submitting ? (
            <>
              <span className="animate-spin" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></span>
              Submitting...
            </>
          ) : (
            <>
              Submit for AI Risk Assessment
              <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>

      {/* MFA OTP Modal */}
      {showMfaModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-fade-in card" style={{ padding: '2rem', maxWidth: '400px', width: '90%', background: '#0f172a', border: '1px solid #1e293b', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', width: '48px', height: '48px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={24} />
              </div>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#f8fafc' }}>2-Step Verification</h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem', lineHeight: '1.5' }}>
              We've sent a 6-digit verification code to your registered mobile number ending in {fd.mobileNumber ? fd.mobileNumber.slice(-4) : 'XXXX'}.
            </p>
            
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  style={{ width: '40px', height: '48px', textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold', background: '#1e293b', border: `1px solid ${otpError ? '#ef4444' : '#334155'}`, borderRadius: '8px', color: '#fff', outline: 'none' }}
                  onFocus={e => e.currentTarget.style.borderColor = otpError ? '#ef4444' : '#3b82f6'}
                  onBlur={e => e.currentTarget.style.borderColor = otpError ? '#ef4444' : '#334155'}
                />
              ))}
            </div>
            
            <div style={{ height: '20px', marginBottom: '1rem' }}>
              {otpError && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: 0 }}>Invalid OTP. Please try again.</p>
              )}
            </div>

            <button 
              type="button"
              onClick={processSubmission}
              disabled={otp.join('').length !== 6}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', display: 'flex', justifyContent: 'center' }}
            >
              Verify & Submit Application
            </button>
            <button 
              type="button" 
              onClick={() => setShowMfaModal(false)}
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.875rem', marginTop: '1rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </form>
  );
}
