import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for PAN/Aadhaar verification simulation
 * Simulates a 1.5s API call and returns verification status
 */
export function useVerification() {
  const [verificationState, setVerificationState] = useState({});
  const timerRef = useRef({});

  const verify = useCallback((value, type, validationFn) => {
    const key = type;
    
    // Cancel any existing timer
    if (timerRef.current[key]) {
      clearTimeout(timerRef.current[key]);
    }

    // Validate format first
    const result = validationFn(value);
    
    if (!result.valid) {
      setVerificationState(prev => ({
        ...prev,
        [key]: { isVerifying: false, isVerified: false, error: result.error },
      }));
      return;
    }

    // Start verification simulation
    setVerificationState(prev => ({
      ...prev,
      [key]: { isVerifying: true, isVerified: false, error: null },
    }));

    // Simulate API call with 1.5s delay
    timerRef.current[key] = setTimeout(() => {
      setVerificationState(prev => ({
        ...prev,
        [key]: { isVerifying: false, isVerified: true, error: null },
      }));
    }, 1500);
  }, []);

  const reset = useCallback((type) => {
    if (timerRef.current[type]) {
      clearTimeout(timerRef.current[type]);
    }
    setVerificationState(prev => ({
      ...prev,
      [type]: { isVerifying: false, isVerified: false, error: null },
    }));
  }, []);

  const getState = useCallback((type) => {
    return verificationState[type] || { isVerifying: false, isVerified: false, error: null };
  }, [verificationState]);

  return { verify, reset, getState };
}
