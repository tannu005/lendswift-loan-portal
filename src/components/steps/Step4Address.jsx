import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '../../context/FormContext';
import { getStep4Schema } from '../../utils/schemas';
import { usePinCodeLookup } from '../../hooks/usePinCodeLookup';
import { RESIDENCE_TYPES, INDIAN_STATES } from '../../utils/constants';
import { useEffect } from 'react';

export default function Step4Address({ onNext, onPrev }) {
  const { state, updateFormData } = useFormContext();
  const schema = getStep4Schema();
  const { lookup, getState: getPinState } = usePinCodeLookup();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      currentAddressLine1: state.formData.currentAddressLine1 || '',
      currentAddressLine2: state.formData.currentAddressLine2 || '',
      currentPinCode: state.formData.currentPinCode || '',
      currentCity: state.formData.currentCity || '',
      currentState: state.formData.currentState || '',
      residenceType: state.formData.residenceType || '',
      rentAmount: state.formData.rentAmount || '',
      yearsAtCurrentAddress: state.formData.yearsAtCurrentAddress ?? '',
      sameAsPermanent: state.formData.sameAsPermanent ?? true,
      permanentAddressLine1: state.formData.permanentAddressLine1 || '',
      permanentAddressLine2: state.formData.permanentAddressLine2 || '',
      permanentPinCode: state.formData.permanentPinCode || '',
      permanentCity: state.formData.permanentCity || '',
      permanentState: state.formData.permanentState || '',
    },
  });

  const residenceType = watch('residenceType');
  const sameAsPermanent = watch('sameAsPermanent');
  const currentPinCode = watch('currentPinCode');
  const permanentPinCode = watch('permanentPinCode');

  const currentPinState = getPinState('current');
  const permanentPinState = getPinState('permanent');

  // PIN code auto-fill for current address
  useEffect(() => {
    if (currentPinCode && currentPinCode.length === 6) {
      lookup(currentPinCode, 'current').then((data) => {
        if (data) {
          setValue('currentCity', data.city);
          setValue('currentState', data.state);
        }
      });
    }
  }, [currentPinCode]);

  // PIN code auto-fill for permanent address
  useEffect(() => {
    if (permanentPinCode && permanentPinCode.length === 6 && !sameAsPermanent) {
      lookup(permanentPinCode, 'permanent').then((data) => {
        if (data) {
          setValue('permanentCity', data.city);
          setValue('permanentState', data.state);
        }
      });
    }
  }, [permanentPinCode, sameAsPermanent]);

  const onSubmit = (data) => {
    if (data.sameAsPermanent) {
      data.permanentAddressLine1 = data.currentAddressLine1;
      data.permanentAddressLine2 = data.currentAddressLine2;
      data.permanentPinCode = data.currentPinCode;
      data.permanentCity = data.currentCity;
      data.permanentState = data.currentState;
    }
    updateFormData(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in" noValidate>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Address Information
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
          Provide your current and permanent address details
        </p>
      </div>

      {/* Current Address Section */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--color-primary-light)' }}>
          📍 Current Address
        </h3>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="currentAddressLine1" className="form-label">
            Address Line 1 <span className="required">*</span>
          </label>
          <input
            id="currentAddressLine1"
            type="text"
            className={`form-input ${errors.currentAddressLine1 ? 'error' : ''}`}
            placeholder="House/Flat No., Building Name, Street"
            autoComplete="address-line1"
            {...register('currentAddressLine1')}
          />
          {errors.currentAddressLine1 && (
            <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
              {errors.currentAddressLine1.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="currentAddressLine2" className="form-label">
            Address Line 2 <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>(Optional)</span>
          </label>
          <input
            id="currentAddressLine2"
            type="text"
            className="form-input"
            placeholder="Landmark, Area"
            autoComplete="address-line2"
            {...register('currentAddressLine2')}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label htmlFor="currentPinCode" className="form-label">
              PIN Code <span className="required">*</span>
            </label>
            <input
              id="currentPinCode"
              type="text"
              className={`form-input ${errors.currentPinCode ? 'error' : ''}`}
              placeholder="110001"
              maxLength={6}
              autoComplete="postal-code"
              {...register('currentPinCode')}
            />
            {currentPinState.isLoading && (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-warning)', marginTop: '0.25rem' }}>Looking up PIN code...</p>
            )}
            {currentPinState.data && (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-accent)', marginTop: '0.25rem' }}>
                ✓ {currentPinState.data.postOffice}
              </p>
            )}
            {currentPinState.error && (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-warning)', marginTop: '0.25rem' }}>{currentPinState.error}</p>
            )}
            {errors.currentPinCode && (
              <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                {errors.currentPinCode.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="currentCity" className="form-label">City <span className="required">*</span></label>
            <input
              id="currentCity"
              type="text"
              className={`form-input ${errors.currentCity ? 'error' : ''}`}
              placeholder="City"
              {...register('currentCity')}
            />
            {errors.currentCity && (
              <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                {errors.currentCity.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="currentState" className="form-label">State <span className="required">*</span></label>
            <select
              id="currentState"
              className={`form-input ${errors.currentState ? 'error' : ''}`}
              {...register('currentState')}
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.currentState && (
              <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                {errors.currentState.message}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label htmlFor="residenceType" className="form-label">
              Residence Type <span className="required">*</span>
            </label>
            <select
              id="residenceType"
              className={`form-input ${errors.residenceType ? 'error' : ''}`}
              {...register('residenceType')}
            >
              <option value="">Select type</option>
              {RESIDENCE_TYPES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {errors.residenceType && (
              <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                {errors.residenceType.message}
              </p>
            )}
          </div>

          {residenceType === 'rented' && (
            <div className="animate-fade-in">
              <label htmlFor="rentAmount" className="form-label">
                Monthly Rent (₹) <span className="required">*</span>
              </label>
              <input
                id="rentAmount"
                type="number"
                className={`form-input ${errors.rentAmount ? 'error' : ''}`}
                placeholder="15000"
                {...register('rentAmount')}
              />
              {errors.rentAmount && (
                <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                  {errors.rentAmount.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="yearsAtCurrentAddress" className="form-label">
              Years at Current Address <span className="required">*</span>
            </label>
            <input
              id="yearsAtCurrentAddress"
              type="number"
              className={`form-input ${errors.yearsAtCurrentAddress ? 'error' : ''}`}
              placeholder="3"
              min="0"
              max="50"
              {...register('yearsAtCurrentAddress')}
            />
            {errors.yearsAtCurrentAddress && (
              <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                {errors.yearsAtCurrentAddress.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Permanent Address */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-primary-light)' }}>
            🏠 Permanent Address
          </h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
            <input
              type="checkbox"
              {...register('sameAsPermanent')}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-light)' }}
            />
            Same as current address
          </label>
        </div>

        {!sameAsPermanent && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="permanentAddressLine1" className="form-label">Address Line 1 <span className="required">*</span></label>
              <input
                id="permanentAddressLine1"
                type="text"
                className={`form-input ${errors.permanentAddressLine1 ? 'error' : ''}`}
                placeholder="House/Flat No., Building Name, Street"
                {...register('permanentAddressLine1')}
              />
              {errors.permanentAddressLine1 && (
                <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                  {errors.permanentAddressLine1.message}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="permanentAddressLine2" className="form-label">Address Line 2 <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>(Optional)</span></label>
              <input id="permanentAddressLine2" type="text" className="form-input" placeholder="Landmark, Area" {...register('permanentAddressLine2')} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              <div>
                <label htmlFor="permanentPinCode" className="form-label">PIN Code <span className="required">*</span></label>
                <input id="permanentPinCode" type="text" className={`form-input ${errors.permanentPinCode ? 'error' : ''}`} placeholder="110001" maxLength={6} {...register('permanentPinCode')} />
                {permanentPinState.data && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-accent)', marginTop: '0.25rem' }}>✓ {permanentPinState.data.postOffice}</p>
                )}
                {errors.permanentPinCode && <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>{errors.permanentPinCode.message}</p>}
              </div>
              <div>
                <label htmlFor="permanentCity" className="form-label">City <span className="required">*</span></label>
                <input id="permanentCity" type="text" className={`form-input ${errors.permanentCity ? 'error' : ''}`} placeholder="City" {...register('permanentCity')} />
                {errors.permanentCity && <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>{errors.permanentCity.message}</p>}
              </div>
              <div>
                <label htmlFor="permanentState" className="form-label">State <span className="required">*</span></label>
                <select id="permanentState" className={`form-input ${errors.permanentState ? 'error' : ''}`} {...register('permanentState')}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.permanentState && <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.25rem' }}>{errors.permanentState.message}</p>}
              </div>
            </div>
          </div>
        )}
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
