import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '../../context/FormContext';
import { getStep1Schema } from '../../utils/schemas';
import { LOAN_CONFIGS, LOAN_TYPE_PERSONAL, LOAN_TYPE_HOME, LOAN_TYPE_BUSINESS } from '../../utils/constants';
import { formatIndianCurrency } from '../../utils/validators';
import { useEffect, useState } from 'react';
import { User, Home, Briefcase, ChevronRight, Info } from 'lucide-react';
import DirectionAwareCard from '../DirectionAwareCard';

const LOAN_ICONS = {
  [LOAN_TYPE_PERSONAL]: User,
  [LOAN_TYPE_HOME]: Home,
  [LOAN_TYPE_BUSINESS]: Briefcase,
};

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
  const loanTenure = watch('loanTenure');
  const config = LOAN_CONFIGS[selectedLoanType];

  // Sync loanType change with reset fields
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
    if (options.length > 0 && options[options.length - 1].value !== config.maxTenure) {
      const m = config.maxTenure;
      const years = Math.floor(m / 12);
      options.push({ value: m, label: `${years} years (${m} months)` });
    }
    return options;
  })() : [];

  // Handcrafted visual EMI calculations
  const calculateEMIPreview = () => {
    if (!config || !loanAmount || isNaN(Number(loanAmount)) || !loanTenure || isNaN(Number(loanTenure))) {
      return null;
    }
    const P = Number(loanAmount);
    const N = Number(loanTenure);
    const R = (config.interestRate / 12) / 100;
    const emi = Math.round((P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1));
    const totalPayment = emi * N;
    const interest = totalPayment - P;
    const processingFee = Math.round(P * 0.01); // 1% estimation
    const principalPercent = Math.round((P / (P + interest)) * 100);
    return { emi, totalPayment, interest, processingFee, principalPercent };
  };

  const emiDetails = calculateEMIPreview();

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
          Choose the loan that fits your goal
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem', lineHeight: '1.5' }}>
          Specify your credit requirements in our secure onboarding workspace.
        </p>
      </div>

      {/* Asymmetric Split Layout: Left Selection, Right Visual Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
        marginBottom: '2rem',
      }}>
        {/* Left Pane - List-based asymmetric selection (Obsidian file-like list) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="form-label" style={{ marginBottom: '0.25rem' }}>
            Select loan category <span className="required">*</span>
          </label>
          {loanTypes.map((type) => {
            const Icon = LOAN_ICONS[type.value];
            const isSelected = selectedLoanType === type.value;
            return (
              <DirectionAwareCard
                key={type.value}
                as="button"
                type="button"
                onClick={() => setValue('loanType', type.value, { shouldValidate: true })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: '6px',
                  background: isSelected ? 'rgba(251, 191, 36, 0.05)' : 'var(--color-input-bg)',
                  border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  background: isSelected ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                  flexShrink: 0,
                  transition: 'background 0.2s, color 0.2s',
                }}>
                  <Icon size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    margin: 0,
                  }}>
                    {type.label}
                  </p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    margin: '0.125rem 0 0',
                    lineHeight: '1.3',
                  }}>
                    {type.description}
                  </p>
                </div>
              </DirectionAwareCard>
            );
          })}
          
          {/* Hidden input for react-hook-form integration */}
          <input type="hidden" {...register('loanType')} />
          {errors.loanType && (
            <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              {errors.loanType.message}
            </p>
          )}
        </div>

        {/* Right Pane - Form Details & Dynamic Visual Calculator */}
        <div style={{
          background: 'var(--color-surface-light)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          padding: '1.5rem',
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: selectedLoanType ? 'flex-start' : 'center',
        }}>
          {!selectedLoanType ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                <Info size={24} style={{ margin: '0 auto' }} />
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                Select a category on the left to configure loan amount and tenure.
              </p>
            </div>
          ) : (
            <div>
              <p style={{
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-primary-light)',
                fontWeight: '600',
                marginBottom: '1rem',
              }}>
                Configuration parameters
              </p>

              {/* Loan Amount Input & Slider */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label htmlFor="loanAmount" className="form-label" style={{ margin: 0 }}>
                    Loan Amount
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Interest: {config.interestRate}% p.a.
                  </span>
                </div>

                <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                  <span style={{
                    position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)', fontWeight: '600', fontSize: '0.875rem'
                  }}>₹</span>
                  <input
                    id="loanAmount"
                    type="number"
                    className={`form-input ${errors.loanAmount ? 'error' : ''}`}
                    style={{ paddingLeft: '1.75rem' }}
                    placeholder={`Min ${formatIndianCurrency(config.minAmount)}`}
                    {...register('loanAmount', {
                      onChange: (e) => {
                        // Keeps form context updated
                      }
                    })}
                  />
                </div>

                {/* Tactile Range Slider - Handcrafted Detail */}
                <input
                  type="range"
                  min={config.minAmount}
                  max={config.maxAmount}
                  step={selectedLoanType === LOAN_TYPE_HOME ? 50000 : 10000}
                  value={Number(loanAmount) || config.minAmount}
                  onChange={(e) => setValue('loanAmount', e.target.value, { shouldValidate: true })}
                  style={{
                    width: '100%',
                    accentColor: 'var(--color-primary)',
                    background: 'var(--color-surface-lighter)',
                    height: '4px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    marginTop: '0.25rem',
                  }}
                />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  <span>{formatIndianCurrency(config.minAmount)}</span>
                  <span>{formatIndianCurrency(config.maxAmount)}</span>
                </div>
                {errors.loanAmount && (
                  <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.loanAmount.message}
                  </p>
                )}
              </div>

              {/* Loan Tenure Selection */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="loanTenure" className="form-label">
                  Loan Tenure
                </label>
                <select
                  id="loanTenure"
                  className={`form-input ${errors.loanTenure ? 'error' : ''}`}
                  {...register('loanTenure')}
                >
                  <option value="">Select duration</option>
                  {tenureOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {errors.loanTenure && (
                  <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.loanTenure.message}
                  </p>
                )}
              </div>

              {/* Loan Purpose */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="loanPurpose" className="form-label">
                  Loan Purpose
                </label>
                <select
                  id="loanPurpose"
                  className={`form-input ${errors.loanPurpose ? 'error' : ''}`}
                  {...register('loanPurpose')}
                >
                  <option value="">Select purpose</option>
                  {config.purposes.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {errors.loanPurpose && (
                  <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.loanPurpose.message}
                  </p>
                )}
              </div>

              {/* Handcrafted Visual affordability feedback */}
              {emiDetails && (
                <div style={{
                  marginTop: '1.25rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--color-border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Estimated Monthly EMI:</span>
                    <span style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-accent)' }}>
                      {formatIndianCurrency(emiDetails.emi)}/mo
                    </span>
                  </div>

                  {/* Visual Split bar - Handcrafted Affordability Gauge */}
                  <div style={{
                    height: '6px',
                    borderRadius: '3px',
                    background: 'var(--color-surface-lighter)',
                    width: '100%',
                    display: 'flex',
                    overflow: 'hidden',
                    marginBottom: '0.375rem',
                  }}>
                    <div style={{
                      width: `${emiDetails.principalPercent}%`,
                      height: '100%',
                      background: 'var(--color-primary-light)',
                    }} />
                    <div style={{
                      flex: 1,
                      height: '100%',
                      background: 'rgba(16, 185, 129, 0.4)',
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary-light)' }} />
                      Principal: {emiDetails.principalPercent}%
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.7)' }} />
                      Est. Interest & Fees
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Referral Code (Accordion style or minor drawer to save vertical workspace height) */}
      <div style={{ marginBottom: '1.5rem', maxWidth: '320px' }}>
        <label htmlFor="referralCode" className="form-label" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Referral Code (Optional)
        </label>
        <input
          id="referralCode"
          type="text"
          className={`form-input ${errors.referralCode ? 'error' : ''}`}
          placeholder="Enter code"
          {...register('referralCode')}
        />
        {errors.referralCode && (
          <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            {errors.referralCode.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: '1rem',
        borderTop: '1px solid var(--color-border)',
      }}>
        <button type="submit" className="btn btn-primary" id="step1-next" style={{ borderRadius: '6px' }}>
          Continue
          <ChevronRight size={16} />
        </button>
      </div>
    </form>
  );
}
