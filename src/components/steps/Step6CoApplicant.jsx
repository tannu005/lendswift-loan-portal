import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '../../context/FormContext';
import { getStep6Schema } from '../../utils/schemas';
import { RELATIONSHIP_OPTIONS } from '../../utils/constants';
import { useVerification } from '../../hooks/useVerification';
import { validatePAN } from '../../utils/validators';
import { useEffect } from 'react';
import { Check, ChevronLeft, ChevronRight, Users, PlusCircle } from 'lucide-react';
import { formatIndianCurrency } from '../../utils/validators';

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
  const coName = watch('coApplicantName');
  const coRelationship = watch('coApplicantRelationship');
  const coIncome = watch('coApplicantIncome');

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

  const primaryIncome = Number(state.formData.monthlyNetSalary || state.formData.monthlyIncome || 0);
  const secondaryIncome = Number(coIncome || 0);
  const combinedIncome = primaryIncome + secondaryIncome;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.375rem', color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>
          Co-applicant details
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
          A co-applicant strengthens credit parameters and improves final eligibility.
        </p>
      </div>

      {/* Asymmetric Split Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
      }}>
        {/* Left Column: Form Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label htmlFor="coApplicantName" className="form-label">
              Full Name <span className="required">*</span>
            </label>
            <input
              id="coApplicantName"
              type="text"
              className={`form-input ${errors.coApplicantName ? 'error' : ''}`}
              placeholder="As printed on PAN Card"
              {...register('coApplicantName')}
            />
            {errors.coApplicantName && (
              <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
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
              <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.coApplicantRelationship.message}
              </p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label htmlFor="coApplicantPAN" className="form-label" style={{ marginBottom: 0 }}>
                  PAN Number <span className="required">*</span>
                </label>
                {coPanState.isVerifying && (
                  <span style={{ marginLeft: '0.375rem', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Checking...</span>
                )}
                {coPanState.isVerified && (
                  <span style={{ marginLeft: '0.375rem', fontSize: '0.7rem', color: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', gap: '0.125rem' }}>
                    <Check size={10} /> Verified
                  </span>
                )}
              </div>
              <input
                id="coApplicantPAN"
                type="text"
                className={`form-input ${errors.coApplicantPAN ? 'error' : coPanState.isVerified ? 'verified' : ''}`}
                placeholder="AAAAA9999A"
                maxLength={10}
                style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
                {...register('coApplicantPAN')}
              />
              {errors.coApplicantPAN && (
                <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {errors.coApplicantPAN.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="coApplicantIncome" className="form-label">
                Monthly Income (₹) <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>₹</span>
                <input
                  id="coApplicantIncome"
                  type="number"
                  className={`form-input ${errors.coApplicantIncome ? 'error' : ''}`}
                  style={{ paddingLeft: '1.75rem' }}
                  placeholder="50000"
                  {...register('coApplicantIncome')}
                />
              </div>
              {errors.coApplicantIncome && (
                <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {errors.coApplicantIncome.message}
                </p>
              )}
            </div>
          </div>

          {/* Consent */}
          <div style={{
            padding: '1rem',
            background: 'var(--color-surface-lighter)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '6px',
            marginTop: '0.5rem',
          }}>
            <label style={{ display: 'flex', gap: '0.75rem', cursor: 'pointer', alignItems: 'flex-start' }}>
              <input
                type="checkbox"
                {...register('coApplicantConsent')}
                style={{ marginTop: '0.25rem', width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
              />
              <span style={{ fontSize: '0.775rem', lineHeight: '1.45', color: 'var(--color-text-secondary)' }}>
                I, the co-applicant, authorize LendSwift to pull credit bureau reports and verify my identity records under joint liability parameters.
                <span className="required" aria-hidden="true"> *</span>
              </span>
            </label>
            {errors.coApplicantConsent && (
              <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.5rem', marginLeft: '1.75rem' }}>
                {errors.coApplicantConsent.message}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Handcrafted Joint Dependency Tree Diagram */}
        <div style={{
          background: 'var(--color-surface-light)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          padding: '1.5rem',
          position: 'sticky',
          top: '20px',
        }}>
          <p style={{
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--color-text-muted)',
            fontWeight: '600',
            marginBottom: '1.5rem',
          }}>
            Joint Eligibility Framework
          </p>

          <div style={{
            background: 'var(--color-surface-lighter)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '6px',
            padding: '1.25rem',
            position: 'relative',
          }}>
            {/* Visual Node Diagram */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', position: 'relative' }}>
              
              {/* Primary Node */}
              <div style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                background: 'var(--color-surface-light)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-light)' }}>
                  <span style={{ fontSize: '0.625rem', fontWeight: 'bold' }}>P</span>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Primary Applicant</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-primary)', fontWeight: '600' }}>
                    {state.formData.fullName || 'Primary'}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {formatIndianCurrency(primaryIncome)}
                </span>
              </div>

              {/* Linking connector line */}
              <div style={{
                width: '2px',
                height: '16px',
                background: 'var(--color-border)',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'var(--color-text-muted)',
                }}>
                  <PlusCircle size={10} />
                </div>
              </div>

              {/* Co-Applicant Node */}
              <div style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                background: coName ? 'var(--color-surface-light)' : 'rgba(255,255,255,0.01)',
                border: `1px dashed ${coName ? 'var(--color-border)' : 'rgba(255, 255, 255, 0.05)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                opacity: coName ? 1 : 0.4,
                transition: 'all 0.3s',
              }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
                  <span style={{ fontSize: '0.625rem', fontWeight: 'bold' }}>S</span>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                    Co-Applicant {coRelationship ? `(${coRelationship})` : ''}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-primary)', fontWeight: '600' }}>
                    {coName || 'Not linked'}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {coIncome ? formatIndianCurrency(secondaryIncome) : '—'}
                </span>
              </div>

              {/* Total Summary */}
              {combinedIncome > primaryIncome && (
                <div style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.12)',
                  marginTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
                    <Users size={14} />
                    <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Combined Pool:</span>
                  </div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--color-accent)' }}>
                    {formatIndianCurrency(combinedIncome)}/mo
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', marginTop: '2rem' }}>
        <button type="button" onClick={onPrev} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <ChevronLeft size={16} />
          Back
        </button>
        <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          Continue
          <ChevronRight size={16} />
        </button>
      </div>
    </form>
  );
}
