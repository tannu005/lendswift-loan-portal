import { useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import { LOAN_CONFIGS, MARITAL_STATUS_OPTIONS, GENDER_OPTIONS, RESIDENCE_TYPES, BUSINESS_TYPES, RELATIONSHIP_OPTIONS, EMPLOYMENT_SALARIED, EMPLOYMENT_SELF_EMPLOYED, EMPLOYMENT_BUSINESS_OWNER } from '../../utils/constants';
import { formatIndianCurrency, calculateAge } from '../../utils/validators';
import { calculateEMI, getInterestRate, checkEMIAffordability } from '../../utils/emiCalculator';
import { v4 as uuidv4 } from 'uuid';

function SectionCard({ title, onEdit, children }) {
  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-primary-light)' }}>{title}</h3>
        {onEdit && (
          <button type="button" onClick={onEdit} className="btn btn-outline btn-sm">
            ✏️ Edit
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function DataRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.875rem' }}>
      <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
      <span style={{ fontWeight: '500', textAlign: 'right', maxWidth: '60%' }}>{value || '—'}</span>
    </div>
  );
}

export default function Step8Review({ onPrev, onGoToStep }) {
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
  };

  // Success Modal
  if (submitted) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
          Application Submitted Successfully!
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          Your loan application has been received and is being processed
        </p>
        
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto 1.5rem', textAlign: 'left' }}>
          <DataRow label="Application ID" value={appId.substring(0, 8).toUpperCase()} />
          <DataRow label="Loan Type" value={config?.label} />
          <DataRow label="Loan Amount" value={formatIndianCurrency(fd.loanAmount)} />
          <DataRow label="Estimated EMI" value={formatIndianCurrency(emiResult.emi)} />
          <DataRow label="Status" value="Under Review" />
        </div>

        <div style={{
          padding: '1rem',
          background: 'rgba(39, 174, 96, 0.1)',
          border: '1px solid rgba(39, 174, 96, 0.3)',
          borderRadius: '0.75rem',
          maxWidth: '400px',
          margin: '0 auto 1.5rem',
          fontSize: '0.85rem',
          color: 'var(--color-accent)',
        }}>
          📱 You will receive updates on your registered mobile number and email. Expected processing time: 2-5 business days.
        </div>

        <div style={{
          padding: '0.75rem',
          background: 'rgba(243, 156, 18, 0.05)',
          border: '1px solid rgba(243, 156, 18, 0.2)',
          borderRadius: '0.75rem',
          maxWidth: '400px',
          margin: '0 auto',
          fontSize: '0.8rem',
          color: 'var(--color-text-secondary)',
        }}>
          ⚖️ <strong>Cooling-Off Period:</strong> You have the right to exit the loan within 3 days of disbursement without penalty as per RBI guidelines.
        </div>

        <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          <p>Grievance Officer: grievance@lendswift.in | +91 1800-XXX-XXXX</p>
          <p style={{ marginTop: '0.25rem' }}>RBI Ombudsman: https://cms.rbi.org.in</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in" noValidate>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Review & Submit
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
          Please review all details carefully before submitting your application
        </p>
      </div>

      {/* Pre-Approval Summary Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-primary-light)' }}>
          💰 Pre-Approval Summary
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Loan Amount</p>
            <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>{formatIndianCurrency(fd.loanAmount)}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Tenure</p>
            <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>{fd.loanTenure} months</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Interest Rate</p>
            <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>{interestRate}% p.a.</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Monthly EMI</p>
            <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-accent)' }}>{formatIndianCurrency(emiResult.emi)}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Total Interest</p>
            <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>{formatIndianCurrency(emiResult.totalInterest)}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Processing Fee</p>
            <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>{formatIndianCurrency(emiResult.processingFee)}</p>
          </div>
        </div>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span>Total Cost of Borrowing</span>
            <span style={{ fontWeight: '700' }}>{formatIndianCurrency(emiResult.totalInterest + emiResult.processingFee)}</span>
          </div>
        </div>
        {/* EMI Affordability */}
        <div style={{
          marginTop: '0.75rem',
          padding: '0.5rem 0.75rem',
          background: affordability.affordable ? 'rgba(39,174,96,0.1)' : 'rgba(243,156,18,0.1)',
          borderRadius: '0.5rem',
          fontSize: '0.825rem',
          color: affordability.affordable ? 'var(--color-accent)' : 'var(--color-warning)',
        }}>
          {affordability.affordable ? '✓' : '⚠'} {affordability.message}
        </div>
      </div>

      {/* Application Details Review */}
      <SectionCard title="📋 Loan Details" onEdit={() => onGoToStep(1)}>
        <DataRow label="Loan Type" value={config?.label} />
        <DataRow label="Loan Amount" value={formatIndianCurrency(fd.loanAmount)} />
        <DataRow label="Tenure" value={`${fd.loanTenure} months`} />
        <DataRow label="Purpose" value={fd.loanPurpose} />
      </SectionCard>

      <SectionCard title="👤 Personal Information" onEdit={() => onGoToStep(2)}>
        <DataRow label="Full Name" value={fd.fullName} />
        <DataRow label="Date of Birth" value={fd.dateOfBirth ? new Date(fd.dateOfBirth).toLocaleDateString('en-IN') : ''} />
        <DataRow label="Age" value={fd.dateOfBirth ? `${calculateAge(fd.dateOfBirth)} years` : ''} />
        <DataRow label="Gender" value={GENDER_OPTIONS.find(g => g.value === fd.gender)?.label} />
        <DataRow label="Marital Status" value={MARITAL_STATUS_OPTIONS.find(m => m.value === fd.maritalStatus)?.label} />
        <DataRow label="Email" value={fd.email} />
        <DataRow label="Mobile" value={fd.mobileNumber ? `XXXXXX${fd.mobileNumber.slice(-4)}` : ''} />
      </SectionCard>

      <SectionCard title="🆔 KYC Verification" onEdit={() => onGoToStep(3)}>
        <DataRow label="PAN" value={fd.panNumber ? `XXXXXX${fd.panNumber.slice(-4)}` : ''} />
        <DataRow label="PAN Status" value={state.panVerified ? '✓ Verified' : 'Pending'} />
        <DataRow label="Aadhaar" value={fd.aadhaarNumber ? `XXXXXXXX${fd.aadhaarNumber.replace(/\s/g, '').slice(-4)}` : ''} />
        <DataRow label="Aadhaar Status" value={state.aadhaarVerified ? '✓ Verified' : 'Pending'} />
      </SectionCard>

      <SectionCard title="📍 Address" onEdit={() => onGoToStep(4)}>
        <DataRow label="Current Address" value={`${fd.currentAddressLine1 || ''}, ${fd.currentCity || ''}, ${fd.currentState || ''} - ${fd.currentPinCode || ''}`} />
        <DataRow label="Residence Type" value={RESIDENCE_TYPES.find(r => r.value === fd.residenceType)?.label} />
        <DataRow label="Years at Address" value={fd.yearsAtCurrentAddress} />
      </SectionCard>

      <SectionCard title="💼 Employment" onEdit={() => onGoToStep(5)}>
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
        <SectionCard title="👥 Co-Applicant" onEdit={() => onGoToStep(6)}>
          <DataRow label="Name" value={fd.coApplicantName} />
          <DataRow label="Relationship" value={RELATIONSHIP_OPTIONS.find(r => r.value === fd.coApplicantRelationship)?.label} />
          <DataRow label="Monthly Income" value={formatIndianCurrency(fd.coApplicantIncome)} />
        </SectionCard>
      )}

      {/* E-Signature Display */}
      {state.signature && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--color-primary-light)' }}>✍️ Your Signature</h3>
          <div style={{ background: '#fff', borderRadius: '0.5rem', padding: '0.5rem', display: 'inline-block' }}>
            <img src={state.signature} alt="Your signature" style={{ maxWidth: '300px', height: 'auto' }} />
          </div>
        </div>
      )}

      {/* Consent Checkboxes */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--color-primary-light)' }}>
          ✅ Declarations & Consent
        </h3>
        
        {[
          { key: 'confirmAccuracy', text: 'I confirm that all information provided in this application is accurate and complete to the best of my knowledge. I understand that any false information may result in rejection of my application.' },
          { key: 'consentCreditCheck', text: 'I authorize LendSwift to check my credit score and credit history via CIBIL, Equifax, Experian, or CRIF High Mark for the purpose of evaluating this loan application.' },
          { key: 'agreeTerms', text: 'I have read and agree to the Terms and Conditions, Privacy Policy, and Fair Practice Code of LendSwift. I understand the interest rates, fees, and charges applicable to this loan.' },
          { key: 'consentCommunications', text: 'I consent to receive communications regarding this application via SMS, email, phone calls, and WhatsApp from LendSwift and its authorized partners.' },
        ].map((item) => (
          <div key={item.key} style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'flex', gap: '0.75rem', cursor: 'pointer', alignItems: 'flex-start' }}>
              <input
                type="checkbox"
                checked={consents[item.key]}
                onChange={() => handleConsent(item.key)}
                style={{ marginTop: '0.25rem', width: '18px', height: '18px', accentColor: 'var(--color-primary-light)', flexShrink: 0 }}
              />
              <span style={{ fontSize: '0.825rem', lineHeight: '1.5', color: 'var(--color-text-secondary)' }}>
                {item.text} <span className="required">*</span>
              </span>
            </label>
            {consentErrors[item.key] && (
              <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem', marginLeft: '2rem' }}>
                This consent is required
              </p>
            )}
          </div>
        ))}
      </div>

      {/* RBI Disclaimer */}
      <div style={{
        padding: '1rem',
        background: 'rgba(243, 156, 18, 0.05)',
        border: '1px solid rgba(243, 156, 18, 0.2)',
        borderRadius: '0.75rem',
        marginBottom: '1.5rem',
        fontSize: '0.8rem',
        color: 'var(--color-text-muted)',
      }}>
        <strong>⚖️ Key Fact Statement (as per RBI DL Guidelines):</strong>
        <br />Loan Amount: {formatIndianCurrency(fd.loanAmount)} | Tenure: {fd.loanTenure} months | 
        Interest Rate: {interestRate}% p.a. (reducing) | EMI: {formatIndianCurrency(emiResult.emi)} | 
        Total Cost: {formatIndianCurrency(emiResult.totalPayment + emiResult.processingFee)} | 
        Processing Fee: {formatIndianCurrency(emiResult.processingFee)}
        <br /><br />
        <strong>Cooling-Off Period:</strong> You may exit the loan within 3 days of disbursement without any penalty.
        <br />
        <strong>Grievance Redressal:</strong> Nodal Officer: grievance@lendswift.in | RBI Ombudsman: https://cms.rbi.org.in
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem' }}>
        <button type="button" onClick={onPrev} className="btn btn-secondary">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          type="submit"
          className="btn btn-accent"
          disabled={submitting}
          id="submit-application"
        >
          {submitting ? (
            <>
              <span className="animate-spin" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></span>
              Submitting...
            </>
          ) : (
            <>
              Submit Application
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
