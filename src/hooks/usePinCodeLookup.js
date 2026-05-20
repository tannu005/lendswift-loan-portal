import { useState, useCallback } from 'react';
import PIN_CODE_DATA from '../utils/pinCodeData';

/**
 * Custom hook for PIN code lookup simulation
 * Looks up city, state, and post office from a 6-digit PIN
 */
export function usePinCodeLookup() {
  const [lookupState, setLookupState] = useState({});

  const lookup = useCallback((pin, fieldPrefix = 'current') => {
    const key = fieldPrefix;
    
    if (!pin || pin.length !== 6) {
      setLookupState(prev => ({
        ...prev,
        [key]: { isLoading: false, data: null, error: null },
      }));
      return null;
    }

    setLookupState(prev => ({
      ...prev,
      [key]: { isLoading: true, data: null, error: null },
    }));

    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = PIN_CODE_DATA[pin];
        if (data) {
          setLookupState(prev => ({
            ...prev,
            [key]: { isLoading: false, data, error: null },
          }));
          resolve(data);
        } else {
          setLookupState(prev => ({
            ...prev,
            [key]: { isLoading: false, data: null, error: 'PIN code not found. Please verify and enter city/state manually.' },
          }));
          resolve(null);
        }
      }, 500);
    });
  }, []);

  const getState = useCallback((fieldPrefix = 'current') => {
    return lookupState[fieldPrefix] || { isLoading: false, data: null, error: null };
  }, [lookupState]);

  return { lookup, getState };
}
