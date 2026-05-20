import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '../../context/FormContext';
import { getStep4Schema } from '../../utils/schemas';
import { usePinCodeLookup } from '../../hooks/usePinCodeLookup';
import { RESIDENCE_TYPES, INDIAN_STATES } from '../../utils/constants';
import { useEffect } from 'react';
import { Check, ChevronLeft, ChevronRight, MapPin, Compass, Shield } from 'lucide-react';

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

  // PIN code lookup for current address
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

  // PIN code lookup for permanent address
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

  const sectionLabelStyle = {
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--color-primary-light)',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.375rem', color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>
          Where do you live?
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
          Please verify your primary residential and billing addresses.
        </p>
      </div>

      {/* Asymmetric Split Layout: Left Form Fields, Right Geographic Locator radar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
      }}>
        {/* Left column: form fields */}
        <div>
          {/* Current Address Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={sectionLabelStyle}>
              <MapPin size={14} />
              Current address
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
                <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
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
                {errors.currentPinCode && (
                  <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
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
                  <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.currentCity.message}
                  </p>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
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
                <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {errors.currentState.message}
                </p>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                  <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.residenceType.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="yearsAtCurrentAddress" className="form-label">
                  Years at Address <span className="required">*</span>
                </label>
                <input
                  id="yearsAtCurrentAddress"
                  type="number"
                  className={`form-input ${errors.yearsAtCurrentAddress ? 'error' : ''}`}
                  placeholder="e.g., 3"
                  min="0"
                  max="50"
                  {...register('yearsAtCurrentAddress')}
                />
                {errors.yearsAtCurrentAddress && (
                  <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.yearsAtCurrentAddress.message}
                  </p>
                )}
              </div>
            </div>

            {residenceType === 'rented' && (
              <div style={{ marginTop: '1rem' }}>
                <label htmlFor="rentAmount" className="form-label">
                  Monthly Rent (₹) <span className="required">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>₹</span>
                  <input
                    id="rentAmount"
                    type="number"
                    className={`form-input ${errors.rentAmount ? 'error' : ''}`}
                    style={{ paddingLeft: '1.75rem' }}
                    placeholder="15000"
                    {...register('rentAmount')}
                  />
                </div>
                {errors.rentAmount && (
                  <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.rentAmount.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Permanent Address */}
          <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ ...sectionLabelStyle, marginBottom: 0 }}>
                <Compass size={14} />
                Permanent address
              </h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                <input
                  type="checkbox"
                  {...register('sameAsPermanent')}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                />
                Same as current
              </label>
            </div>

            {!sameAsPermanent && (
              <div>
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
                    <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {errors.permanentAddressLine1.message}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="permanentAddressLine2" className="form-label">Address Line 2 <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>(Optional)</span></label>
                  <input id="permanentAddressLine2" type="text" className="form-input" placeholder="Landmark, Area" {...register('permanentAddressLine2')} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label htmlFor="permanentPinCode" className="form-label">PIN Code <span className="required">*</span></label>
                    <input id="permanentPinCode" type="text" className={`form-input ${errors.permanentPinCode ? 'error' : ''}`} placeholder="110001" maxLength={6} {...register('permanentPinCode')} />
                    {errors.permanentPinCode && <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.permanentPinCode.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="permanentCity" className="form-label">City <span className="required">*</span></label>
                    <input id="permanentCity" type="text" className={`form-input ${errors.permanentCity ? 'error' : ''}`} placeholder="City" {...register('permanentCity')} />
                    {errors.permanentCity && <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.permanentCity.message}</p>}
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label htmlFor="permanentState" className="form-label">State <span className="required">*</span></label>
                  <select id="permanentState" className={`form-input ${errors.permanentState ? 'error' : ''}`} {...register('permanentState')}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.permanentState && <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.permanentState.message}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Handcrafted Geographic Radar Locator */}
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
            Geographic Post Locator
          </p>

          <div style={{
            background: 'var(--color-surface-lighter)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '6px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Visual radar circular crosshair */}
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              marginBottom: '1rem',
              color: 'var(--color-text-muted)',
            }}>
              {/* Radar sweeps/waves */}
              {(currentPinState.isLoading || permanentPinState.isLoading) && (
                <>
                  <div className="radar-wave" style={{ animationDelay: '0s' }} />
                  <div className="radar-wave" style={{ animationDelay: '0.5s' }} />
                </>
              )}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '1px',
                background: 'rgba(255, 255, 255, 0.05)',
              }} />
              <div style={{
                position: 'absolute',
                height: '100%',
                width: '1px',
                background: 'rgba(255, 255, 255, 0.05)',
              }} />
              <Compass size={24} style={{ color: currentPinState.data ? 'var(--color-primary-light)' : 'var(--color-text-muted)', transition: 'color 0.3s' }} />
            </div>

            {/* Resolved Metadata */}
            <div style={{ width: '100%' }}>
              {currentPinState.isLoading ? (
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Resolving coordinates...
                </p>
              ) : currentPinState.data ? (
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Resolved Post Division</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)', display: 'block', fontWeight: '600' }}>
                      {currentPinState.data.postOffice}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>City / Hub</span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)', display: 'block' }}>
                        {currentPinState.data.city}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>State Zone</span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)', display: 'block' }}>
                        {currentPinState.data.state}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.06)',
                    border: '1px solid rgba(16, 185, 129, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontSize: '0.6875rem',
                    color: 'var(--color-accent)',
                  }}>
                    <Shield size={12} />
                    <span>POSTAL ROUTING SECURED</span>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Enter a 6-digit PIN code on the left to verify regional logistics mapping.
                </p>
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

      <style>{`
        .radar-wave {
          position: absolute;
          border: 1px solid var(--color-primary-light);
          border-radius: 50%;
          opacity: 0;
          width: 100px;
          height: 100px;
          animation: radar-ripple 2s linear infinite;
        }
        @keyframes radar-ripple {
          0% { transform: scale(0.1); opacity: 0.8; }
          100% { transform: scale(1.1); opacity: 0; }
        }
      `}</style>
    </form>
  );
}
