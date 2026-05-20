/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { LOAN_CONFIGS, LOAN_TYPE_HOME } from '../utils/constants';

const FormContext = createContext(null);

const initialState = {
  currentStep: 0,
  completedSteps: [],
  formData: {},
  panVerified: false,
  aadhaarVerified: false,
  coApplicantPanVerified: false,
  documents: {},
  signature: null,
  isSubmitted: false,
  applicationId: null,
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'COMPLETE_STEP':
      return {
        ...state,
        completedSteps: state.completedSteps.includes(action.payload)
          ? state.completedSteps
          : [...state.completedSteps, action.payload],
      };
    
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      };
    
    case 'SET_VERIFICATION':
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    
    case 'SET_DOCUMENTS':
      return {
        ...state,
        documents: { ...state.documents, ...action.payload },
      };
    
    case 'SET_SIGNATURE':
      return { ...state, signature: action.payload };
    
    case 'SUBMIT':
      return {
        ...state,
        isSubmitted: true,
        applicationId: action.payload,
      };
    
    case 'RESTORE':
      return {
        ...state,
        ...action.payload,
      };
    
    case 'RESET':
      return { ...initialState };
    
    default:
      return state;
  }
}

export function FormProvider({ children }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const updateFormData = useCallback((data) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
  }, []);

  const setStep = useCallback((step) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const completeStep = useCallback((step) => {
    dispatch({ type: 'COMPLETE_STEP', payload: step });
  }, []);

  const setVerification = useCallback((field, value) => {
    dispatch({ type: 'SET_VERIFICATION', payload: { field, value } });
  }, []);

  const setDocuments = useCallback((docs) => {
    dispatch({ type: 'SET_DOCUMENTS', payload: docs });
  }, []);

  const setSignature = useCallback((sig) => {
    dispatch({ type: 'SET_SIGNATURE', payload: sig });
  }, []);

  const submitApplication = useCallback((appId) => {
    dispatch({ type: 'SUBMIT', payload: appId });
  }, []);

  const restoreState = useCallback((data, step) => {
    dispatch({ type: 'RESTORE', payload: { formData: data, currentStep: step } });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Determine if Step 6 (Co-Applicant) is required
  const isStep6Required = useMemo(() => {
    const { loanType, loanAmount } = state.formData;
    if (!loanType || !loanAmount) return false;
    
    if (loanType === LOAN_TYPE_HOME) return true;
    
    const config = LOAN_CONFIGS[loanType];
    if (!config) return false;
    
    return Number(loanAmount) > config.coApplicantThreshold;
  }, [state.formData]);

  // Get active steps (accounting for conditional Step 6)
  const activeSteps = useMemo(() => {
    const steps = [1, 2, 3, 4, 5];
    if (isStep6Required) steps.push(6);
    steps.push(7, 8);
    return steps;
  }, [isStep6Required]);

  // Get all form data for serialization
  const getAllFormData = useCallback(() => {
    return {
      ...state.formData,
      panVerified: state.panVerified,
      aadhaarVerified: state.aadhaarVerified,
      signature: state.signature,
    };
  }, [state]);

  const getMonthlyIncome = useCallback(() => {
    const { employmentType, monthlyNetSalary, monthlyIncome } = state.formData;
    if (employmentType === 'salaried') return Number(monthlyNetSalary) || 0;
    return Number(monthlyIncome) || 0;
  }, [state.formData]);

  const value = useMemo(() => ({
    state,
    dispatch,
    updateFormData,
    setStep,
    completeStep,
    setVerification,
    setDocuments,
    setSignature,
    submitApplication,
    restoreState,
    resetForm,
    isStep6Required,
    activeSteps,
    getAllFormData,
    getMonthlyIncome,
  }), [state, updateFormData, setStep, completeStep, setVerification,
    setDocuments, setSignature, submitApplication, restoreState, resetForm,
    isStep6Required, activeSteps, getAllFormData, getMonthlyIncome]);

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}
