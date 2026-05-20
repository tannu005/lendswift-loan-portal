import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '../../context/FormContext';
import { getStep6Schema } from '../../utils/schemas';
import { RELATIONSHIP_OPTIONS } from '../../utils/constants';
import { useVerification } from '../../hooks/useVerification';
import { validatePAN } from '../../utils/validators';
import { useEffect } from 'react';

export default function Step6CoApplicant({ onNext, onPrev }) {
  const { state, updateFormData, setVerification } = useFormContext();
  const schema = getStep6Schema();
  const { verify, getState: getVerifyState } = useVerification();
  const coPanState = getVerifyState('coPan');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      coApplicantName: state.formData.coApplicantName || '',
      coApplicantRelationship: state.formData.coApplicantRelationship || '',
      coApplicantPAN: state.formData.coApplicantPAN || '',
      coApplicantIncome: state.formData.coApplicantIncome || '',
      coApplicantConsent: state.formData.coApplicantConsent || false,
    },
  });

  const coPAN = watch('coApplicantPAN');

  useEffect(() => {
    if (coPAN && coPAN.length === 10) {
      verify(coPAN, 'coPan', validatePAN);
    }
  }, [coPAN]);

  const onSubmit = (data) => {
    updateFormData(data);
    setVerification('coApplicantPanVerified', coPanState.isVerified);
    onNext();
  };

  // Filter relationships based on marital status
  const relationships = state.formData.maritalStatus === 'married'
    ? RELATIONSHIP_OPTIONS
    : RELATIONSHIP_OPTIONS.filter(r => r.value !== 'spouse');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in" noValidate>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Co-Applicant Details
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
          A co-applicant is required based on your loan type and amount
        </p>
        <div className="badge badge-info" style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>
          ℹ️ Adding a co-applicant increases your loan eligibility
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label htmlFor="coApplicantName" className="form-label">
              Co-Applicant Name <span className="required">*</span>
            </label>
            <input
              id="coApplicantName"
              type="text"
              className={`form-input ${errors.coApplicantName ? 'error' : ''}`}
              placeholder="Full name as per PAN"
              {...register('coApplicantName')}
            />
            {errors.coApplicantName && (
              <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                {errors.coApplicantName.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="coApplicantRelationship" className="form-label">
              Relationship <span className="required">*</span>
            </label>
            <select
              id="coApplicantRelationship"
              className={`form-input ${errors.coApplicantRelationship ? 'error' : ''}`}
              {...register('coApplicantRelationship')}
            >
              <option value="">Select relationship</option>
              {relationships.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {errors.coApplicantRelationship && (
              <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                {errors.coApplicantRelationship.message}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label htmlFor="coApplicantPAN" className="form-label" style={{ marginBottom: 0 }}>
                PAN Number <span className="required">*</span>
              </label>
              {coPanState.isVerifying && <span className="badge badge-warning" style={{ marginLeft: '0.5rem' }}>Verifying...</span>}
              {coPanState.isVerified && <span className="badge badge-success" style={{ marginLeft: '0.5rem' }}>✓ Verified</span>}
            </div>
            <input
              id="coApplicantPAN"
              type="text"
              className={`form-input ${errors.coApplicantPAN ? 'error' : coPanState.isVerified ? 'verified' : ''}`}
              placeholder="AAAAA9999A"
              maxLength={10}
              style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}
              {...register('coApplicantPAN')}
            />
            {errors.coApplicantPAN && (
              <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                {errors.coApplicantPAN.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="coApplicantIncome" className="form-label">
              Monthly Income (₹) <span className="required">*</span>
            </label>
            <input
              id="coApplicantIncome"
              type="number"
              className={`form-input ${errors.coApplicantIncome ? 'error' : ''}`}
              placeholder="50000"
              {...register('coApplicantIncome')}
            />
            {errors.coApplicantIncome && (
              <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                {errors.coApplicantIncome.message}
              </p>
            )}
          </div>
        </div>

        {/* Consent */}
        <div style={{
          padding: '1rem',
          background: 'rgba(243, 156, 18, 0.05)',
          border: '1px solid rgba(243, 156, 18, 0.2)',
          borderRadius: '0.75rem',
        }}>
          <label style={{ display: 'flex', gap: '0.75rem', cursor: 'pointer', alignItems: 'flex-start' }}>
            <input
              type="checkbox"
              {...register('coApplicantConsent')}
              style={{ marginTop: '0.25rem', width: '18px', height: '18px', accentColor: 'var(--color-primary-light)' }}
            />
            <span style={{ fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--color-text-secondary)' }}>
              I, the co-applicant, hereby consent to be a co-applicant for this loan application. I understand that I will 
              be jointly liable for the repayment of this loan. I authorize LendSwift to verify my identity and check my 
              credit score. <span className="required">*</span>
            </span>
          </label>
          {errors.coApplicantConsent && (
            <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.5rem', marginLeft: '2rem' }}>
              {errors.coApplicantConsent.message}
            </p>
          )}
        </div>
      </div>

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
