import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '../../context/FormContext';
import { getStep5Schema } from '../../utils/schemas';
import { EMPLOYMENT_SALARIED, EMPLOYMENT_SELF_EMPLOYED, EMPLOYMENT_BUSINESS_OWNER, BUSINESS_TYPES, INDIAN_STATES } from '../../utils/constants';
import { useEffect } from 'react';

const employmentOptions = [
  { value: EMPLOYMENT_SALARIED, label: 'Salaried', icon: '💼', desc: 'Employed by a company/organization' },
  { value: EMPLOYMENT_SELF_EMPLOYED, label: 'Self-Employed', icon: '👨‍💻', desc: 'Freelancer, consultant, or professional' },
  { value: EMPLOYMENT_BUSINESS_OWNER, label: 'Business Owner', icon: '🏢', desc: 'Own and operate a business' },
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in" noValidate>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Employment & Income Details
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
          Provide your employment information and income details
        </p>
      </div>

      {/* Employment Type Selection */}
      <fieldset style={{ border: 'none', marginBottom: '1.5rem' }}>
        <legend className="form-label">Employment Type <span className="required">*</span></legend>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {employmentOptions.map((opt) => (
            <label
              key={opt.value}
              className={`radio-card ${employmentType === opt.value ? 'selected' : ''}`}
              style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '1rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                <input type="radio" value={opt.value} {...register('employmentType')} />
                <span style={{ fontSize: '1.25rem' }}>{opt.icon}</span>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{opt.label}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{opt.desc}</p>
            </label>
          ))}
        </div>
        {errors.employmentType && (
          <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.5rem' }}>
            {errors.employmentType.message}
          </p>
        )}
      </fieldset>

      {/* Salaried Fields */}
      {isSalaried && (
        <div className="card animate-fade-in" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--color-primary-light)' }}>
            💼 Salaried Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label htmlFor="companyName" className="form-label">Company Name <span className="required">*</span></label>
              <input id="companyName" type="text" className={`form-input ${errors.companyName ? 'error' : ''}`} placeholder="Company name" {...register('companyName')} />
              {errors.companyName && <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>{errors.companyName.message}</p>}
            </div>
            <div>
              <label htmlFor="designation" className="form-label">Designation <span className="required">*</span></label>
              <input id="designation" type="text" className={`form-input ${errors.designation ? 'error' : ''}`} placeholder="Your role/title" {...register('designation')} />
              {errors.designation && <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>{errors.designation.message}</p>}
            </div>
            <div>
              <label htmlFor="monthlyNetSalary" className="form-label">Monthly Net Salary (₹) <span className="required">*</span></label>
              <input id="monthlyNetSalary" type="number" className={`form-input ${errors.monthlyNetSalary ? 'error' : ''}`} placeholder="50000" min="15000" {...register('monthlyNetSalary')} />
              {errors.monthlyNetSalary && <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>{errors.monthlyNetSalary.message}</p>}
            </div>
            <div>
              <label htmlFor="yearsOfExperience" className="form-label">Years of Experience <span className="required">*</span></label>
              <input id="yearsOfExperience" type="number" className={`form-input ${errors.yearsOfExperience ? 'error' : ''}`} placeholder="5" min="0" max="50" {...register('yearsOfExperience')} />
              {errors.yearsOfExperience && <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>{errors.yearsOfExperience.message}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Non-Salaried Fields */}
      {isNonSalaried && (
        <div className="card animate-fade-in" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--color-primary-light)' }}>
            🏢 Business Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label htmlFor="businessName" className="form-label">Business Name <span className="required">*</span></label>
              <input id="businessName" type="text" className={`form-input ${errors.businessName ? 'error' : ''}`} placeholder="Business name" {...register('businessName')} />
              {errors.businessName && <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>{errors.businessName.message}</p>}
            </div>
            <div>
              <label htmlFor="businessType" className="form-label">Business Type <span className="required">*</span></label>
              <select id="businessType" className={`form-input ${errors.businessType ? 'error' : ''}`} {...register('businessType')}>
                <option value="">Select type</option>
                {BUSINESS_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              {errors.businessType && <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>{errors.businessType.message}</p>}
            </div>
            <div>
              <label htmlFor="annualTurnover" className="form-label">Annual Turnover (₹) <span className="required">*</span></label>
              <input id="annualTurnover" type="number" className={`form-input ${errors.annualTurnover ? 'error' : ''}`} placeholder="1000000" min="300000" {...register('annualTurnover')} />
              {errors.annualTurnover && <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>{errors.annualTurnover.message}</p>}
            </div>
            <div>
              <label htmlFor="yearsInBusiness" className="form-label">Years in Business <span className="required">*</span></label>
              <input id="yearsInBusiness" type="number" className={`form-input ${errors.yearsInBusiness ? 'error' : ''}`} placeholder="3" min="2" {...register('yearsInBusiness')} />
              {errors.yearsInBusiness && <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>{errors.yearsInBusiness.message}</p>}
            </div>
          </div>

          {employmentType === EMPLOYMENT_SELF_EMPLOYED && (
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="monthlyIncome" className="form-label">Monthly Income (₹) <span className="required">*</span></label>
              <input id="monthlyIncome" type="number" className={`form-input ${errors.monthlyIncome ? 'error' : ''}`} placeholder="75000" {...register('monthlyIncome')} />
              {errors.monthlyIncome && <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>{errors.monthlyIncome.message}</p>}
            </div>
          )}

          {isBusinessOwner && (
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="gstNumber" className="form-label">GST Number <span className="required">*</span></label>
              <input id="gstNumber" type="text" className={`form-input ${errors.gstNumber ? 'error' : ''}`} placeholder="22AAAAA0000A1Z5" maxLength={15} style={{ textTransform: 'uppercase' }} {...register('gstNumber')} />
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Format: 2-digit state code + PAN + Entity + Z + Checksum</p>
              {errors.gstNumber && <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>{errors.gstNumber.message}</p>}
            </div>
          )}

          {/* Office Address */}
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem' }}>Office/Business Address</h4>
            <div style={{ marginBottom: '0.75rem' }}>
              <label htmlFor="officeAddressLine1" className="form-label">Address <span className="required">*</span></label>
              <input id="officeAddressLine1" type="text" className={`form-input ${errors.officeAddressLine1 ? 'error' : ''}`} placeholder="Office address" {...register('officeAddressLine1')} />
              {errors.officeAddressLine1 && <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>{errors.officeAddressLine1.message}</p>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
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
              <div>
                <label htmlFor="officePinCode" className="form-label">PIN Code</label>
                <input id="officePinCode" type="text" className="form-input" placeholder="110001" maxLength={6} {...register('officePinCode')} />
              </div>
            </div>
          </div>
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
