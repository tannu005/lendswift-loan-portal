import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '../../context/FormContext';
import { getStep3Schema } from '../../utils/schemas';
import { useVerification } from '../../hooks/useVerification';
import { validatePAN, validateAadhaar } from '../../utils/validators';
import { LOAN_TYPE_HOME } from '../../utils/constants';
import { useEffect } from 'react';
import { Check, ChevronLeft, ChevronRight, Fingerprint, ScanLine, X } from 'lucide-react';

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

  // Auto-verify on blur/entry
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
        <span style={{
          marginLeft: '0.5rem',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}>
          <span className="animate-pulse" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-warning)' }} />
          Verifying details...
        </span>
      );
    }
    if (vState.isVerified) {
      return (
        <span style={{
          marginLeft: '0.5rem',
          fontSize: '0.75rem',
          color: 'var(--color-accent)',
          fontWeight: '500',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}>
          <Check size={12} />
          Identity verified
        </span>
      );
    }
    if (vState.error) {
      return (
        <span style={{
          marginLeft: '0.5rem',
          fontSize: '0.75rem',
          color: 'var(--color-error)',
          fontWeight: '500',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}>
          <X size={12} />
          Verification failed
        </span>
      );
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '0.375rem',
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.01em',
        }}>
          Verify your identity
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem', lineHeight: '1.5' }}>
          Identity checks are processed via secure government registry endpoints.
        </p>
      </div>

      {/* Asymmetric Split Layout: Left Form Fields, Right Identity scanner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
      }}>
        {/* Left column: form fields */}
        <div>
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
              className={`form-input ${errors.panNumber || panState.error ? 'error' : panState.isVerified ? 'verified' : ''}`}
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
              <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
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
              className={`form-input ${errors.aadhaarNumber || aadhaarState.error ? 'error' : aadhaarState.isVerified ? 'verified' : ''}`}
              placeholder="XXXX XXXX 1234"
              maxLength={14}
              {...register('aadhaarNumber', {
                onChange: (e) => {
                  // Format digits with spaces
                  const value = e.target.value.replace(/\D/g, '');
                  const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                  setValue('aadhaarNumber', formatted.substring(0, 14));
                }
              })}
              aria-invalid={errors.aadhaarNumber ? 'true' : 'false'}
              aria-describedby="aadhaar-help"
            />
            <p id="aadhaar-help" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              12-digit unique national identification number
            </p>
            {(errors.aadhaarNumber || aadhaarState.error) && (
              <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.aadhaarNumber?.message || aadhaarState.error}
              </p>
            )}
          </div>

          {/* Aadhaar Consent */}
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            background: 'var(--color-surface-lighter)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '6px',
          }}>
            <label style={{ display: 'flex', gap: '0.75rem', cursor: 'pointer', alignItems: 'flex-start' }}>
              <input
                type="checkbox"
                {...register('aadhaarConsent')}
                style={{ marginTop: '0.25rem', width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
              />
              <span style={{ fontSize: '0.775rem', lineHeight: '1.45', color: 'var(--color-text-secondary)' }}>
                I voluntarily authorize LendSwift to access and process my Aadhaar profile credentials solely for identity validation under standard UIDAI KYC protocol guidelines.
                <span className="required" aria-hidden="true"> *</span>
              </span>
            </label>
            {errors.aadhaarConsent && (
              <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.5rem', marginLeft: '1.75rem' }}>
                {errors.aadhaarConsent.message}
              </p>
            )}
          </div>

          {/* Voter ID */}
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
              <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.voterID.message}
              </p>
            )}
          </div>

          {/* Passport */}
          {showPassport && (
            <div style={{ marginBottom: '1.25rem' }}>
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
                <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {errors.passport.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right column: Handcrafted holographic scanners */}
        <div style={{
          background: 'var(--color-surface-light)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          <p style={{
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--color-text-muted)',
            fontWeight: '600',
            margin: 0,
          }}>
            Identity Document Scanner
          </p>

          {/* PAN scanner mockup */}
          <div style={{
            background: 'var(--color-surface-lighter)',
            border: `1px solid ${panState.isVerified ? 'rgba(16, 185, 129, 0.2)' : 'var(--color-border-light)'}`,
            borderRadius: '6px',
            padding: '1rem',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '80px',
            transition: 'border-color 0.3s',
          }}>
            {/* Scan animation bar */}
            {panState.isVerifying && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'var(--color-primary)',
                  boxShadow: '0 0 8px var(--color-primary)',
                  zIndex: 2,
                  animation: 'sweep 1.5s ease-in-out infinite',
                }}
              />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Permanent Account Number Card
                </span>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', margin: '0.25rem 0 0', fontFamily: 'monospace', letterSpacing: '0.08em', color: panValue ? 'var(--color-text-primary)' : 'rgba(255,255,255,0.1)' }}>
                  {panValue ? panValue.toUpperCase() : 'AAAAA0000A'}
                </p>
              </div>
              <div style={{
                color: panState.isVerified ? 'var(--color-accent)' : panState.isVerifying ? 'var(--color-warning)' : 'var(--color-text-muted)',
              }}>
                <ScanLine size={18} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.6875rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Income Tax Dept.</span>
              <span style={{
                color: panState.isVerified ? 'var(--color-accent)' : panState.error ? 'var(--color-error)' : 'var(--color-text-muted)',
                fontWeight: '500',
              }}>
                {panState.isVerified ? 'SECURED ✓' : panState.error ? 'VERIFY FAIL' : panState.isVerifying ? 'SCANNING...' : 'WAITING'}
              </span>
            </div>
          </div>

          {/* Aadhaar scanner mockup */}
          <div style={{
            background: 'var(--color-surface-lighter)',
            border: `1px solid ${aadhaarState.isVerified ? 'rgba(16, 185, 129, 0.2)' : 'var(--color-border-light)'}`,
            borderRadius: '6px',
            padding: '1rem',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '80px',
            transition: 'border-color 0.3s',
          }}>
            {/* Scan animation bar */}
            {aadhaarState.isVerifying && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'var(--color-primary)',
                  boxShadow: '0 0 8px var(--color-primary)',
                  zIndex: 2,
                  animation: 'sweep 1.5s ease-in-out infinite',
                }}
              />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Unique Identification Authority (UIDAI)
                </span>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', margin: '0.25rem 0 0', fontFamily: 'monospace', letterSpacing: '0.08em', color: aadhaarValue ? 'var(--color-text-primary)' : 'rgba(255,255,255,0.1)' }}>
                  {aadhaarValue ? aadhaarValue : '0000 0000 0000'}
                </p>
              </div>
              <div style={{
                color: aadhaarState.isVerified ? 'var(--color-accent)' : aadhaarState.isVerifying ? 'var(--color-warning)' : 'var(--color-text-muted)',
              }}>
                <ScanLine size={18} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.6875rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Mera Aadhaar, Meri Pehchan</span>
              <span style={{
                color: aadhaarState.isVerified ? 'var(--color-accent)' : aadhaarState.error ? 'var(--color-error)' : 'var(--color-text-muted)',
                fontWeight: '500',
              }}>
                {aadhaarState.isVerified ? 'SECURED ✓' : aadhaarState.error ? 'VERIFY FAIL' : aadhaarState.isVerifying ? 'SCANNING...' : 'WAITING'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '1rem',
        borderTop: '1px solid var(--color-border)',
        marginTop: '2rem',
      }}>
        <button type="button" onClick={onPrev} className="btn btn-secondary" style={{ borderRadius: '6px' }}>
          <ChevronLeft size={16} />
          Back
        </button>
        <button type="submit" className="btn btn-primary" style={{ borderRadius: '6px' }}>
          Continue
          <ChevronRight size={16} />
        </button>
      </div>
      
      {/* Inject custom CSS keyframes for scan sweeping animation */}
      <style>{`
        @keyframes sweep {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
          100% { top: 0%; opacity: 0.8; }
        }
      `}</style>
    </form>
  );
}
