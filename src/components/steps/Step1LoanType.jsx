import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '../../context/FormContext';
import { getStep1Schema } from '../../utils/schemas';
import { LOAN_CONFIGS, LOAN_TYPE_PERSONAL, LOAN_TYPE_HOME, LOAN_TYPE_BUSINESS } from '../../utils/constants';
import { formatIndianCurrency } from '../../utils/validators';
import { useEffect } from 'react';

const loanTypes = [
  { value: LOAN_TYPE_PERSONAL, ...LOAN_CONFIGS[LOAN_TYPE_PERSONAL] },
  { value: LOAN_TYPE_HOME, ...LOAN_CONFIGS[LOAN_TYPE_HOME] },
  { value: LOAN_TYPE_BUSINESS, ...LOAN_CONFIGS[LOAN_TYPE_BUSINESS] },
];

export default function Step1LoanType({ onNext }) {
  const { state, updateFormData } = useFormContext();
  const schema = getStep1Schema(state.formData);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      loanType: state.formData.loanType || '',
      loanAmount: state.formData.loanAmount || '',
      loanTenure: state.formData.loanTenure || '',
      loanPurpose: state.formData.loanPurpose || '',
      referralCode: state.formData.referralCode || '',
    },
  });

  const selectedLoanType = watch('loanType');
  const loanAmount = watch('loanAmount');
  const config = LOAN_CONFIGS[selectedLoanType];

  // Reset dependent fields when loan type changes
  useEffect(() => {
    if (selectedLoanType && selectedLoanType !== state.formData.loanType) {
      setValue('loanAmount', '');
      setValue('loanTenure', '');
      setValue('loanPurpose', '');
    }
  }, [selectedLoanType]);

  const onSubmit = (data) => {
    updateFormData(data);
    onNext();
  };

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;
    
    const rotateX = -normalizedY * 15;
    const rotateY = normalizedX * 15;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.025)`;
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  // Generate tenure options
  const tenureOptions = config ? (() => {
    const options = [];
    for (let m = config.minTenure; m <= config.maxTenure; m += (config.minTenure >= 60 ? 12 : 6)) {
      const years = Math.floor(m / 12);
      const months = m % 12;
      let label = '';
      if (years > 0) label += `${years} year${years > 1 ? 's' : ''}`;
      if (months > 0) label += ` ${months} month${months > 1 ? 's' : ''}`;
      label += ` (${m} months)`;
      options.push({ value: m, label: label.trim() });
    }
    // Make sure max is included
    if (options.length > 0 && options[options.length - 1].value !== config.maxTenure) {
      const m = config.maxTenure;
      const years = Math.floor(m / 12);
      options.push({ value: m, label: `${years} years (${m} months)` });
    }
    return options;
  })() : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in" noValidate>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Select Your Loan Type
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
          Choose the type of loan that best suits your needs
        </p>
      </div>

      {/* Loan Type Selection */}
      <fieldset style={{ border: 'none', marginBottom: '1.5rem' }}>
        <legend className="form-label">Loan Type <span className="required" aria-hidden="true">*</span></legend>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {loanTypes.map((type) => (
            <label
              key={type.value}
              className={`radio-card tilt-card ${selectedLoanType === type.value ? 'selected' : ''}`}
              style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '1.25rem' }}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                <input
                  type="radio"
                  value={type.value}
                  {...register('loanType')}
                  aria-describedby={`loanType-desc-${type.value}`}
                />
                <span style={{ fontSize: '1.5rem' }}>{type.icon}</span>
                <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{type.label}</span>
              </div>
              <p id={`loanType-desc-${type.value}`} style={{
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                marginTop: '0.5rem',
                lineHeight: '1.4',
              }}>
                {type.description}
              </p>
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-info">Up to {formatIndianCurrency(type.maxAmount)}</span>
                <span className="badge badge-info">{type.interestRate}% p.a.</span>
              </div>
            </label>
          ))}
        </div>
        {errors.loanType && (
          <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.5rem' }}>
            {errors.loanType.message}
          </p>
        )}
      </fieldset>

      {/* Loan Amount */}
      {selectedLoanType && (
        <div className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="loanAmount" className="form-label">
            Loan Amount <span className="required" aria-hidden="true">*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)', fontWeight: '600',
            }}>₹</span>
            <input
              id="loanAmount"
              type="number"
              className={`form-input ${errors.loanAmount ? 'error' : ''}`}
              style={{ paddingLeft: '2rem' }}
              placeholder={`${config ? formatIndianCurrency(config.minAmount) : '50,000'} - ${config ? formatIndianCurrency(config.maxAmount) : ''}`}
              {...register('loanAmount')}
              aria-describedby="loanAmount-help"
              aria-invalid={errors.loanAmount ? 'true' : 'false'}
            />
          </div>
          <p id="loanAmount-help" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            {config && `Range: ${formatIndianCurrency(config.minAmount)} - ${formatIndianCurrency(config.maxAmount)}`}
            {loanAmount && Number(loanAmount) > 0 && ` | Entered: ${formatIndianCurrency(loanAmount)}`}
          </p>
          {errors.loanAmount && (
            <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
              {errors.loanAmount.message}
            </p>
          )}
        </div>
      )}

      {/* Loan Tenure */}
      {selectedLoanType && (
        <div className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="loanTenure" className="form-label">
            Loan Tenure <span className="required" aria-hidden="true">*</span>
          </label>
          <select
            id="loanTenure"
            className={`form-input ${errors.loanTenure ? 'error' : ''}`}
            {...register('loanTenure')}
            aria-invalid={errors.loanTenure ? 'true' : 'false'}
          >
            <option value="">Select tenure</option>
            {tenureOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.loanTenure && (
            <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
              {errors.loanTenure.message}
            </p>
          )}
        </div>
      )}

      {/* Loan Purpose */}
      {selectedLoanType && (
        <div className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="loanPurpose" className="form-label">
            Loan Purpose <span className="required" aria-hidden="true">*</span>
          </label>
          <select
            id="loanPurpose"
            className={`form-input ${errors.loanPurpose ? 'error' : ''}`}
            {...register('loanPurpose')}
            aria-invalid={errors.loanPurpose ? 'true' : 'false'}
          >
            <option value="">Select purpose</option>
            {config?.purposes.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.loanPurpose && (
            <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
              {errors.loanPurpose.message}
            </p>
          )}
        </div>
      )}

      {/* Referral Code */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="referralCode" className="form-label">
          Referral Code <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>(Optional)</span>
        </label>
        <input
          id="referralCode"
          type="text"
          className={`form-input ${errors.referralCode ? 'error' : ''}`}
          placeholder="Enter referral code"
          {...register('referralCode')}
          aria-invalid={errors.referralCode ? 'true' : 'false'}
        />
        {errors.referralCode && (
          <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
            {errors.referralCode.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
        <button type="submit" className="btn btn-primary magnetic-btn" id="step1-next">
          Continue
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
