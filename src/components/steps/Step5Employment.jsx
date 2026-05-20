import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '../../context/FormContext';
import { getStep5Schema } from '../../utils/schemas';
import { EMPLOYMENT_SALARIED, EMPLOYMENT_SELF_EMPLOYED, EMPLOYMENT_BUSINESS_OWNER, BUSINESS_TYPES, INDIAN_STATES } from '../../utils/constants';
import { useEffect } from 'react';
import { Briefcase, Laptop, Building2, ChevronLeft, ChevronRight, HelpCircle, ShieldCheck } from 'lucide-react';
import { formatIndianCurrency } from '../../utils/validators';

const employmentOptions = [
  { value: EMPLOYMENT_SALARIED, label: 'Salaried', Icon: Briefcase, desc: 'Regular payroll employee' },
  { value: EMPLOYMENT_SELF_EMPLOYED, label: 'Self-Employed', Icon: Laptop, desc: 'Professional, freelancer, independent' },
  { value: EMPLOYMENT_BUSINESS_OWNER, label: 'Business Owner', Icon: Building2, desc: 'Own/operate registered firm' },
];

export default function Step5Employment({ onNext, onPrev }) {
  const { state, updateFormData } = useFormContext();
  const loanType = state.formData.loanType;
  const schema = getStep5Schema(loanType);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      employmentType: state.formData.employmentType || '',
      companyName: state.formData.companyName || '',
      designation: state.formData.designation || '',
      monthlyNetSalary: state.formData.monthlyNetSalary || '',
      yearsOfExperience: state.formData.yearsOfExperience ?? '',
      businessName: state.formData.businessName || '',
      businessType: state.formData.businessType || '',
      annualTurnover: state.formData.annualTurnover || '',
      yearsInBusiness: state.formData.yearsInBusiness || '',
      monthlyIncome: state.formData.monthlyIncome || '',
      gstNumber: state.formData.gstNumber || '',
      officeAddressLine1: state.formData.officeAddressLine1 || '',
      officeCity: state.formData.officeCity || '',
      officeState: state.formData.officeState || '',
      officePinCode: state.formData.officePinCode || '',
    },
  });

  const employmentType = watch('employmentType');
  const monthlySalary = watch('monthlyNetSalary');
  const monthlyIncome = watch('monthlyIncome');

  // Clear fields when employment type changes
  useEffect(() => {
    if (employmentType !== state.formData.employmentType && state.formData.employmentType) {
      if (employmentType === EMPLOYMENT_SALARIED) {
        setValue('businessName', '');
        setValue('businessType', '');
        setValue('annualTurnover', '');
        setValue('yearsInBusiness', '');
        setValue('monthlyIncome', '');
        setValue('gstNumber', '');
        setValue('officeAddressLine1', '');
        setValue('officeCity', '');
        setValue('officeState', '');
        setValue('officePinCode', '');
      } else {
        setValue('companyName', '');
        setValue('designation', '');
        setValue('monthlyNetSalary', '');
      }
    }
  }, [employmentType]);

  const onSubmit = (data) => {
    updateFormData(data);
    onNext();
  };

  const isSalaried = employmentType === EMPLOYMENT_SALARIED;
  const isNonSalaried = employmentType === EMPLOYMENT_SELF_EMPLOYED || employmentType === EMPLOYMENT_BUSINESS_OWNER;
  const isBusinessOwner = employmentType === EMPLOYMENT_BUSINESS_OWNER;

  // Handcrafted visual limit calculation
  const getAffordabilityDetails = () => {
    const rawIncome = isSalaried ? monthlySalary : monthlyIncome;
    const incomeNum = Number(rawIncome);
    if (!incomeNum || isNaN(incomeNum) || incomeNum <= 0) return null;

    const maxEMI = Math.round(incomeNum * 0.5); // Standard DTI threshold
    const projectedPrincipalLimit = Math.round((maxEMI * 100) / 0.85); // Estimated total loan sizing
    return { maxEMI, projectedPrincipalLimit };
  };

  const affordability = getAffordabilityDetails();

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.375rem', color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>
          Employment & income
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
          Your professional standing and recurring cash flow statements.
        </p>
      </div>

      {/* Asymmetric Split Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
      }}>
        {/* Left Column - Input fields */}
        <div>
          {/* Employment Type Selection - Asymmetric Vertical Stack */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="form-label">
              Employment category <span className="required">*</span>
            </label>
            {employmentOptions.map((opt) => {
              const Icon = opt.Icon;
              const isSelected = employmentType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue('employmentType', opt.value, { shouldValidate: true })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.875rem 1rem',
                    borderRadius: '6px',
                    background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'var(--color-surface-light)',
                    border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '4px',
                    background: isSelected ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? 'white' : 'var(--color-text-muted)',
                    flexShrink: 0,
                  }}>
                    <Icon size={14} />
                  </div>
                  <div>
                    <span style={{
                      fontSize: '0.8125rem',
                      fontWeight: '600',
                      color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      display: 'block',
                    }}>
                      {opt.label}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.125rem' }}>
                      {opt.desc}
                    </span>
                  </div>
                </button>
              );
            })}
            
            <input type="hidden" {...register('employmentType')} />
            {errors.employmentType && (
              <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.employmentType.message}
              </p>
            )}
          </div>

          {/* Salaried Fields */}
          {isSalaried && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label htmlFor="companyName" className="form-label">Company Name <span className="required">*</span></label>
                <input id="companyName" type="text" className={`form-input ${errors.companyName ? 'error' : ''}`} placeholder="Employer legal name" {...register('companyName')} />
                {errors.companyName && <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.companyName.message}</p>}
              </div>

              <div>
                <label htmlFor="designation" className="form-label">Designation <span className="required">*</span></label>
                <input id="designation" type="text" className={`form-input ${errors.designation ? 'error' : ''}`} placeholder="Job role" {...register('designation')} />
                {errors.designation && <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.designation.message}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label htmlFor="monthlyNetSalary" className="form-label">Net Salary (₹) <span className="required">*</span></label>
                  <input id="monthlyNetSalary" type="number" className={`form-input ${errors.monthlyNetSalary ? 'error' : ''}`} placeholder="Take home pay" min="15000" {...register('monthlyNetSalary')} />
                  {errors.monthlyNetSalary && <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.monthlyNetSalary.message}</p>}
                </div>
                <div>
                  <label htmlFor="yearsOfExperience" className="form-label">Experience (Years) <span className="required">*</span></label>
                  <input id="yearsOfExperience" type="number" className={`form-input ${errors.yearsOfExperience ? 'error' : ''}`} placeholder="Years" min="0" max="50" {...register('yearsOfExperience')} />
                  {errors.yearsOfExperience && <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.yearsOfExperience.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Non-Salaried Fields */}
          {isNonSalaried && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label htmlFor="businessName" className="form-label">Business Name <span className="required">*</span></label>
                  <input id="businessName" type="text" className={`form-input ${errors.businessName ? 'error' : ''}`} placeholder="Entity name" {...register('businessName')} />
                  {errors.businessName && <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.businessName.message}</p>}
                </div>
                <div>
                  <label htmlFor="businessType" className="form-label">Business Type <span className="required">*</span></label>
                  <select id="businessType" className={`form-input ${errors.businessType ? 'error' : ''}`} {...register('businessType')}>
                    <option value="">Select type</option>
                    {BUSINESS_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  {errors.businessType && <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.businessType.message}</p>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label htmlFor="annualTurnover" className="form-label">Annual Turnover (₹) <span className="required">*</span></label>
                  <input id="annualTurnover" type="number" className={`form-input ${errors.annualTurnover ? 'error' : ''}`} placeholder="Turnover" min="300000" {...register('annualTurnover')} />
                  {errors.annualTurnover && <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.annualTurnover.message}</p>}
                </div>
                <div>
                  <label htmlFor="yearsInBusiness" className="form-label">Years in Business <span className="required">*</span></label>
                  <input id="yearsInBusiness" type="number" className={`form-input ${errors.yearsInBusiness ? 'error' : ''}`} placeholder="Years" min="2" {...register('yearsInBusiness')} />
                  {errors.yearsInBusiness && <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.yearsInBusiness.message}</p>}
                </div>
              </div>

              {employmentType === EMPLOYMENT_SELF_EMPLOYED && (
                <div>
                  <label htmlFor="monthlyIncome" className="form-label">Monthly Income (₹) <span className="required">*</span></label>
                  <input id="monthlyIncome" type="number" className={`form-input ${errors.monthlyIncome ? 'error' : ''}`} placeholder="75000" {...register('monthlyIncome')} />
                  {errors.monthlyIncome && <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.monthlyIncome.message}</p>}
                </div>
              )}

              {isBusinessOwner && (
                <div>
                  <label htmlFor="gstNumber" className="form-label">GST Number <span className="required">*</span></label>
                  <input id="gstNumber" type="text" className={`form-input ${errors.gstNumber ? 'error' : ''}`} placeholder="22AAAAA0000A1Z5" maxLength={15} style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }} {...register('gstNumber')} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Format: 15-digit GSTIN (e.g. 22AAAAA0000A1Z5)</p>
                  {errors.gstNumber && <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.gstNumber.message}</p>}
                </div>
              )}

              {/* Office Address */}
              <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.75rem' }}>
                  Office / Business address
                </span>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label htmlFor="officeAddressLine1" className="form-label">Address Line 1 <span className="required">*</span></label>
                  <input id="officeAddressLine1" type="text" className={`form-input ${errors.officeAddressLine1 ? 'error' : ''}`} placeholder="Office address" {...register('officeAddressLine1')} />
                  {errors.officeAddressLine1 && <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.officeAddressLine1.message}</p>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label htmlFor="officeCity" className="form-label">City</label>
                    <input id="officeCity" type="text" className="form-input" placeholder="City" {...register('officeCity')} />
                  </div>
                  <div>
                    <label htmlFor="officeState" className="form-label">State</label>
                    <select id="officeState" className="form-input" {...register('officeState')}>
                      <option value="">Select</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem', width: '50%' }}>
                  <label htmlFor="officePinCode" className="form-label">PIN Code</label>
                  <input id="officePinCode" type="text" className="form-input" placeholder="110001" maxLength={6} {...register('officePinCode')} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Handcrafted Affordability / DTI index panel */}
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
            Affordability capability
          </p>

          <div style={{
            background: 'var(--color-surface-lighter)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '6px',
            padding: '1.25rem',
          }}>
            {!affordability ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <HelpCircle size={20} style={{ color: 'var(--color-text-muted)', margin: '0 auto 0.5rem' }} />
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Enter your monthly earnings to estimate credit thresholds.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Recommended Max EMI Cap</span>
                  <span style={{ fontSize: '1.125rem', color: 'var(--color-accent)', fontWeight: '700' }}>
                    {formatIndianCurrency(affordability.maxEMI)}/mo
                  </span>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', margin: '0.125rem 0 0' }}>
                    Calculated at standard 50% Debt-to-Income (DTI) limit.
                  </p>
                </div>

                {/* Progress Visual Bar */}
                <div>
                  <div style={{ height: '4px', background: 'var(--color-surface-light)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '50%', height: '100%', background: 'var(--color-primary)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    <span>0% DTI</span>
                    <span>50% Threshold</span>
                  </div>
                </div>

                <div style={{ paddingTop: '0.75rem', borderTop: '1px dashed var(--color-border)' }}>
                  <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Projected Credit Facility Limit</span>
                  <span style={{ fontSize: '0.9375rem', color: 'var(--color-text-primary)', fontWeight: '600' }}>
                    ~ {formatIndianCurrency(affordability.projectedPrincipalLimit)}
                  </span>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', margin: '0.125rem 0 0' }}>
                    Estimated baseline approval cap pending credit bureau review.
                  </p>
                </div>

                <div style={{
                  padding: '0.5rem',
                  borderRadius: '4px',
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.6875rem',
                  color: 'var(--color-accent)',
                }}>
                  <ShieldCheck size={12} />
                  <span>DTI Compliant Workspace</span>
                </div>
              </div>
            )}
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
