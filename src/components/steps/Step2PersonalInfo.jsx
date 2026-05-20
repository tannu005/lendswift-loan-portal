import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '../../context/FormContext';
import { getStep2Schema } from '../../utils/schemas';
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS } from '../../utils/constants';
import { ChevronLeft, ChevronRight, Fingerprint, ShieldAlert } from 'lucide-react';
import { useEffect } from 'react';

export default function Step2PersonalInfo({ onNext, onPrev }) {
  const { state, updateFormData } = useFormContext();
  const schema = getStep2Schema();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: state.formData.fullName || '',
      dateOfBirth: state.formData.dateOfBirth || '',
      gender: state.formData.gender || '',
      maritalStatus: state.formData.maritalStatus || '',
      fatherName: state.formData.fatherName || '',
      motherName: state.formData.motherName || '',
      email: state.formData.email || '',
      mobileNumber: state.formData.mobileNumber || '',
      alternateMobile: state.formData.alternateMobile || '',
    },
  });

  const onSubmit = (data) => {
    updateFormData(data);
    onNext();
  };

  // Watch values for live identity badge visualization
  const fullName = watch('fullName');
  const dateOfBirth = watch('dateOfBirth');
  const email = watch('email');
  const mobileNumber = watch('mobileNumber');
  const gender = watch('gender');

  const renderField = (id, label, type, registerName, placeholder, required = true, extraProps = {}) => (
    <div style={{ marginBottom: '1.25rem' }}>
      <label htmlFor={id} className="form-label">
        {label} {required && <span className="required" aria-hidden="true">*</span>}
        {!required && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>(Optional)</span>}
      </label>
      <input
        id={id}
        type={type}
        className={`form-input ${errors[registerName] ? 'error' : ''}`}
        placeholder={placeholder}
        autoComplete={extraProps.autoComplete}
        {...register(registerName)}
        aria-invalid={errors[registerName] ? 'true' : 'false'}
        aria-describedby={errors[registerName] ? `${id}-error` : undefined}
      />
      {errors[registerName] && (
        <p id={`${id}-error`} role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
          {errors[registerName].message}
        </p>
      )}
    </div>
  );

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
          Tell us about yourself
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem', lineHeight: '1.5' }}>
          Please enter your details as they appear on your government-issued credentials.
        </p>
      </div>

      {/* Asymmetric Split Layout: Left Form Fields, Right Identity Passport Badge */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
      }}>
        {/* Left column: input fields */}
        <div>
          {renderField('fullName', 'Full Name (as per PAN)', 'text', 'fullName', 'Enter your full name', true, { autoComplete: 'name' })}

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="dateOfBirth" className="form-label">
                Date of Birth <span className="required" aria-hidden="true">*</span>
              </label>
              <input
                id="dateOfBirth"
                type="date"
                className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 21)).toISOString().split('T')[0]}
                min={new Date(new Date().setFullYear(new Date().getFullYear() - 65)).toISOString().split('T')[0]}
                {...register('dateOfBirth')}
                autoComplete="bday"
                aria-invalid={errors.dateOfBirth ? 'true' : 'false'}
              />
              {errors.dateOfBirth && (
                <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Gender <span className="required" aria-hidden="true">*</span></label>
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                {GENDER_OPTIONS.map((opt) => (
                  <label key={opt.value} className="radio-card" style={{ padding: '0.5rem 0.75rem', flex: '1', borderRadius: '6px', textAlign: 'center', justifyContent: 'center' }}>
                    <input type="radio" value={opt.value} {...register('gender')} style={{ display: 'none' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: gender === opt.value ? '600' : '400' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="maritalStatus" className="form-label">
              Marital Status <span className="required" aria-hidden="true">*</span>
            </label>
            <select
              id="maritalStatus"
              className={`form-input ${errors.maritalStatus ? 'error' : ''}`}
              {...register('maritalStatus')}
            >
              <option value="">Select status</option>
              {MARITAL_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.maritalStatus && (
              <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.maritalStatus.message}
              </p>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--color-border)',
          }}>
            {renderField('fatherName', "Father's Name", 'text', 'fatherName', 'Full name')}
            {renderField('motherName', "Mother's Name", 'text', 'motherName', 'Full name')}
          </div>

          <div style={{
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--color-border)',
          }}>
            {renderField('email', 'Email Address', 'email', 'email', 'you@example.com', true, { autoComplete: 'email' })}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}>
            {renderField('mobileNumber', 'Mobile Number', 'tel', 'mobileNumber', '10-digit mobile', true, { autoComplete: 'tel' })}
            {renderField('alternateMobile', 'Alternate Mobile', 'tel', 'alternateMobile', '10-digit mobile', false)}
          </div>
        </div>

        {/* Right column: Handcrafted applicant card badge */}
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
            marginBottom: '1.25rem',
          }}>
            Applicant Credential Draft
          </p>

          <div style={{
            background: 'var(--color-surface-lighter)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '6px',
            padding: '1.25rem',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Watermark logo */}
            <div style={{
              position: 'absolute',
              right: '-10px',
              bottom: '-10px',
              opacity: 0.04,
              transform: 'rotate(-15deg)',
              color: 'white',
            }}>
              <Fingerprint size={120} />
            </div>

            {/* Avatar section */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-muted)',
              }}>
                <Fingerprint size={20} />
              </div>
              <div>
                <p style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  LendSwift Identity ID
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)', margin: 0, fontFamily: 'monospace' }}>
                  LS-{email ? email.substring(0, 4).toUpperCase() + '-' : 'XXXX-'}882
                </p>
              </div>
            </div>

            {/* Live profile details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Full Name</span>
                <span style={{ fontSize: '0.8125rem', color: fullName ? 'var(--color-text-primary)' : 'rgba(255, 255, 255, 0.15)', fontWeight: '600' }}>
                  {fullName || 'PENDING ENTRY'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Date of Birth</span>
                  <span style={{ fontSize: '0.8125rem', color: dateOfBirth ? 'var(--color-text-primary)' : 'rgba(255, 255, 255, 0.15)' }}>
                    {dateOfBirth || 'YYYY-MM-DD'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Gender</span>
                  <span style={{ fontSize: '0.8125rem', color: gender ? 'var(--color-text-primary)' : 'rgba(255, 255, 255, 0.15)' }}>
                    {gender ? GENDER_OPTIONS.find(g => g.value === gender)?.label : 'UNSPECIFIED'}
                  </span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Secure Email</span>
                <span style={{ fontSize: '0.8125rem', color: email ? 'var(--color-text-primary)' : 'rgba(255, 255, 255, 0.15)', wordBreak: 'break-all' }}>
                  {email || 'username@domain.com'}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Contact Contact</span>
                <span style={{ fontSize: '0.8125rem', color: mobileNumber ? 'var(--color-text-primary)' : 'rgba(255, 255, 255, 0.15)' }}>
                  {mobileNumber ? `+91 ${mobileNumber}` : '+91 XXXXX XXXXX'}
                </span>
              </div>
            </div>

            {/* Footer stamp */}
            <div style={{
              marginTop: '1.25rem',
              paddingTop: '0.75rem',
              borderTop: '1px dashed var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              color: 'rgba(251, 191, 36, 0.6)',
            }}>
              <ShieldAlert size={12} />
              <span style={{ fontSize: '0.625rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pending verification checks
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
        <button type="button" onClick={onPrev} className="btn btn-secondary" id="step2-prev" style={{ borderRadius: '6px' }}>
          <ChevronLeft size={16} />
          Back
        </button>
        <button type="submit" className="btn btn-primary" id="step2-next" style={{ borderRadius: '6px' }}>
          Continue
          <ChevronRight size={16} />
        </button>
      </div>
    </form>
  );
}
