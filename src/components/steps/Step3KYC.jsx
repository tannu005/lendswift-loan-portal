import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '../../context/FormContext';
import { getStep3Schema } from '../../utils/schemas';
import { useVerification } from '../../hooks/useVerification';
import { validatePAN, validateAadhaar } from '../../utils/validators';
import { LOAN_TYPE_HOME } from '../../utils/constants';
import { useEffect } from 'react';

export default function Step3KYC({ onNext, onPrev }) {
  const { state, updateFormData, setVerification } = useFormContext();
  const loanType = state.formData.loanType;
  const loanAmount = Number(state.formData.loanAmount) || 0;
  const schema = getStep3Schema(loanType);
  const { verify, getState } = useVerification();

  const panState = getState('pan');
  const aadhaarState = getState('aadhaar');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      panNumber: state.formData.panNumber || '',
      aadhaarNumber: state.formData.aadhaarNumber || '',
      aadhaarConsent: state.formData.aadhaarConsent || false,
      voterID: state.formData.voterID || '',
      passport: state.formData.passport || '',
    },
  });

  const panValue = watch('panNumber');
  const aadhaarValue = watch('aadhaarNumber');

  // Auto-verify on blur with debounce
  useEffect(() => {
    if (panValue && panValue.length === 10) {
      verify(panValue, 'pan', (val) => validatePAN(val, loanType));
    }
  }, [panValue]);

  useEffect(() => {
    if (aadhaarValue) {
      const cleaned = aadhaarValue.replace(/\s/g, '');
      if (cleaned.length === 12) {
        verify(cleaned, 'aadhaar', validateAadhaar);
      }
    }
  }, [aadhaarValue]);

  const onSubmit = (data) => {
    updateFormData(data);
    setVerification('panVerified', panState.isVerified);
    setVerification('aadhaarVerified', aadhaarState.isVerified);
    onNext();
  };

  const showPassport = loanType === LOAN_TYPE_HOME && loanAmount > 5000000;

  const VerificationBadge = ({ vState }) => {
    if (vState.isVerifying) {
      return (
        <span className="badge badge-warning" style={{ marginLeft: '0.5rem' }}>
          <span className="animate-spin" style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid var(--color-warning)', borderTopColor: 'transparent', borderRadius: '50%' }}></span>
          Verifying...
        </span>
      );
    }
    if (vState.isVerified) {
      return <span className="badge badge-success" style={{ marginLeft: '0.5rem' }}>✓ Verified</span>;
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in" noValidate>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Identity Verification (KYC)
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
          Provide your identity documents for verification
        </p>
      </div>

      {/* PAN Number */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label htmlFor="panNumber" className="form-label" style={{ marginBottom: 0 }}>
            PAN Number <span className="required" aria-hidden="true">*</span>
          </label>
          <VerificationBadge vState={panState} />
        </div>
        <input
          id="panNumber"
          type="text"
          className={`form-input ${errors.panNumber ? 'error' : panState.isVerified ? 'verified' : ''}`}
          placeholder="AAAAA9999A"
          maxLength={10}
          style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}
          {...register('panNumber')}
          aria-invalid={errors.panNumber ? 'true' : 'false'}
          aria-describedby="pan-help"
        />
        <p id="pan-help" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          Format: 5 letters + 4 digits + 1 letter (e.g., ABCPD1234E)
        </p>
        {(errors.panNumber || panState.error) && (
          <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
            {errors.panNumber?.message || panState.error}
          </p>
        )}
      </div>

      {/* Aadhaar Number */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label htmlFor="aadhaarNumber" className="form-label" style={{ marginBottom: 0 }}>
            Aadhaar Number <span className="required" aria-hidden="true">*</span>
          </label>
          <VerificationBadge vState={aadhaarState} />
        </div>
        <input
          id="aadhaarNumber"
          type="text"
          className={`form-input ${errors.aadhaarNumber ? 'error' : aadhaarState.isVerified ? 'verified' : ''}`}
          placeholder="XXXX XXXX 1234"
          maxLength={14}
          {...register('aadhaarNumber')}
          aria-invalid={errors.aadhaarNumber ? 'true' : 'false'}
          aria-describedby="aadhaar-help"
        />
        <p id="aadhaar-help" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          12-digit unique identification number
        </p>
        {(errors.aadhaarNumber || aadhaarState.error) && (
          <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
            {errors.aadhaarNumber?.message || aadhaarState.error}
          </p>
        )}
      </div>

      {/* Aadhaar Consent */}
      <div style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        background: 'rgba(243, 156, 18, 0.05)',
        border: '1px solid rgba(243, 156, 18, 0.2)',
        borderRadius: '0.75rem',
      }}>
        <label style={{ display: 'flex', gap: '0.75rem', cursor: 'pointer', alignItems: 'flex-start' }}>
          <input
            type="checkbox"
            {...register('aadhaarConsent')}
            style={{ marginTop: '0.25rem', width: '18px', height: '18px', accentColor: 'var(--color-primary-light)' }}
          />
          <span style={{ fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--color-text-secondary)' }}>
            I hereby provide my voluntary consent to LendSwift to obtain and use my Aadhaar number and biometric/demographic 
            information for the purpose of identity verification as per the Aadhaar (Targeted Delivery of Financial and Other 
            Subsidies, Benefits and Services) Act, 2016 and its regulations.
            <span className="required" aria-hidden="true"> *</span>
          </span>
        </label>
        {errors.aadhaarConsent && (
          <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.5rem', marginLeft: '2rem' }}>
            {errors.aadhaarConsent.message}
          </p>
        )}
      </div>

      {/* Voter ID (Optional) */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="voterID" className="form-label">
          Voter ID <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>(Optional)</span>
        </label>
        <input
          id="voterID"
          type="text"
          className={`form-input ${errors.voterID ? 'error' : ''}`}
          placeholder="ABC1234567"
          maxLength={10}
          style={{ textTransform: 'uppercase' }}
          {...register('voterID')}
        />
        {errors.voterID && (
          <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
            {errors.voterID.message}
          </p>
        )}
      </div>

      {/* Passport (Conditional) */}
      {showPassport && (
        <div className="animate-fade-in" style={{ marginBottom: '1.25rem' }}>
          <label htmlFor="passport" className="form-label">
            Passport Number <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>(Optional)</span>
          </label>
          <input
            id="passport"
            type="text"
            className={`form-input ${errors.passport ? 'error' : ''}`}
            placeholder="A1234567"
            maxLength={8}
            style={{ textTransform: 'uppercase' }}
            {...register('passport')}
          />
          {errors.passport && (
            <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
              {errors.passport.message}
            </p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem' }}>
        <button type="button" onClick={onPrev} className="btn btn-secondary">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button type="submit" className="btn btn-primary">
          Continue
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
