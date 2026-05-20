import { useEffect, useRef, useCallback, useState } from 'react';
import { encrypt, decrypt } from '../utils/encryption';
import { AUTO_SAVE_INTERVAL, DRAFT_TTL_HOURS, STORAGE_KEY_PREFIX, STORAGE_META_PREFIX } from '../utils/constants';

/**
 * Custom hook for auto-save with encryption
 * Saves form state to localStorage every 30 seconds
 * Supports resume-from-save functionality
 */
export function useAutoSave(formState, currentStep, onRestore) {
  const timerRef = useRef(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [savedMeta, setSavedMeta] = useState(null);

  const storageKey = STORAGE_KEY_PREFIX + (formState?.loanType || 'draft');
  const metaKey = STORAGE_META_PREFIX + (formState?.loanType || 'draft');

  // Save current state
  const save = useCallback(async () => {
    try {
      const dataToSave = {
        ...formState,
        _currentStep: currentStep,
        _version: '1.0',
      };
      
      const json = JSON.stringify(dataToSave);
      const encrypted = await encrypt(json);
      
      localStorage.setItem(storageKey, encrypted);
      localStorage.setItem(metaKey, JSON.stringify({
        version: '1.0',
        timestamp: new Date().toISOString(),
        step: currentStep,
        loanType: formState?.loanType || 'unknown',
      }));

      const now = new Date();
      setLastSaved(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  }, [formState, currentStep, storageKey, metaKey]);

  // Auto-save timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      if (formState && Object.keys(formState).length > 0) {
        save();
      }
    }, AUTO_SAVE_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [save, formState]);

  // Check for saved draft on mount
  const checkForSavedDraft = useCallback(async () => {
    try {
      // Check all possible draft keys
      const keys = [
        STORAGE_KEY_PREFIX + 'personal',
        STORAGE_KEY_PREFIX + 'home',
        STORAGE_KEY_PREFIX + 'business',
        STORAGE_KEY_PREFIX + 'draft',
      ];

      for (const key of keys) {
        const encrypted = localStorage.getItem(key);
        const metaStr = localStorage.getItem(key.replace(STORAGE_KEY_PREFIX, STORAGE_META_PREFIX));
        
        if (encrypted && metaStr) {
          const meta = JSON.parse(metaStr);
          const savedTime = new Date(meta.timestamp);
          const now = new Date();
          const hoursDiff = (now - savedTime) / (1000 * 60 * 60);
          
          // Check TTL
          if (hoursDiff > DRAFT_TTL_HOURS) {
            localStorage.removeItem(key);
            localStorage.removeItem(key.replace(STORAGE_KEY_PREFIX, STORAGE_META_PREFIX));
            continue;
          }

          setSavedMeta(meta);
          setShowResumeModal(true);
          return;
        }
      }
    } catch (err) {
      console.error('Error checking saved draft:', err);
    }
  }, []);

  // Clear saved draft
  const clearDraft = useCallback(() => {
    const keys = [
      STORAGE_KEY_PREFIX + 'personal',
      STORAGE_KEY_PREFIX + 'home',
      STORAGE_KEY_PREFIX + 'business',
      STORAGE_KEY_PREFIX + 'draft',
    ];
    keys.forEach(key => {
      localStorage.removeItem(key);
      localStorage.removeItem(key.replace(STORAGE_KEY_PREFIX, STORAGE_META_PREFIX));
    });
    setShowResumeModal(false);
    setSavedMeta(null);
  }, []);

  // Restore saved draft
  const restore = useCallback(async () => {
    try {
      const keys = [
        STORAGE_KEY_PREFIX + 'personal',
        STORAGE_KEY_PREFIX + 'home',
        STORAGE_KEY_PREFIX + 'business',
        STORAGE_KEY_PREFIX + 'draft',
      ];

      for (const key of keys) {
        const encrypted = localStorage.getItem(key);
        if (encrypted) {
          const json = await decrypt(encrypted);
          const data = JSON.parse(json);
          
          if (data && data._version === '1.0') {
            const step = data._currentStep || 1;
            delete data._currentStep;
            delete data._version;
            
            setShowResumeModal(false);
            if (onRestore) onRestore(data, step);
            return;
          }
        }
      }
    } catch (err) {
      console.error('Failed to restore draft:', err);
      clearDraft();
    }
    setShowResumeModal(false);
  }, [onRestore, clearDraft]);

  return {
    save,
    lastSaved,
    showToast,
    showResumeModal,
    savedMeta,
    checkForSavedDraft,
    restore,
    clearDraft,
    setShowResumeModal,
  };
}

