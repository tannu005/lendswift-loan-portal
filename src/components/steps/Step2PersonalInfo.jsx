import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '../../context/FormContext';
import { getStep2Schema } from '../../utils/schemas';
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS } from '../../utils/constants';

export default function Step2PersonalInfo({ onNext, onPrev }) {
  const { state, updateFormData } = useFormContext();
  const schema = getStep2Schema();

  const { register, handleSubmit, formState: { errors } } = useForm({
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
        <p id={`${id}-error`} role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
          {errors[registerName].message}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in" noValidate>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Personal Information
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
          Enter your personal details as per your official documents
        </p>
      </div>

      {renderField('fullName', 'Full Name (as per PAN)', 'text', 'fullName', 'Enter your full name', true, { autoComplete: 'name' })}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
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
            <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <fieldset style={{ border: 'none' }}>
            <legend className="form-label">Gender <span className="required" aria-hidden="true">*</span></legend>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {GENDER_OPTIONS.map((opt) => (
                <label key={opt.value} className={`radio-card`} style={{ padding: '0.625rem 1rem', flex: '1' }}>
                  <input type="radio" value={opt.value} {...register('gender')} />
                  <span style={{ fontSize: '0.875rem' }}>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {errors.gender && (
            <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
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
          aria-invalid={errors.maritalStatus ? 'true' : 'false'}
        >
          <option value="">Select status</option>
          {MARITAL_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.maritalStatus && (
          <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
            {errors.maritalStatus.message}
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {renderField('fatherName', "Father's Name", 'text', 'fatherName', "Enter father's full name")}
        {renderField('motherName', "Mother's Name", 'text', 'motherName', "Enter mother's full name")}
      </div>

      {renderField('email', 'Email Address', 'email', 'email', 'you@example.com', true, { autoComplete: 'email' })}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {renderField('mobileNumber', 'Mobile Number', 'tel', 'mobileNumber', '9876543210', true, { autoComplete: 'tel' })}
        {renderField('alternateMobile', 'Alternate Mobile', 'tel', 'alternateMobile', '9876543210', false)}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem' }}>
        <button type="button" onClick={onPrev} className="btn btn-secondary" id="step2-prev">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button type="submit" className="btn btn-primary" id="step2-next">
          Continue
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
