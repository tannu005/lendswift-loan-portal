import { z } from 'zod';
import {
  LOAN_TYPE_PERSONAL, LOAN_TYPE_HOME, LOAN_TYPE_BUSINESS,
  LOAN_CONFIGS, EMPLOYMENT_SALARIED, EMPLOYMENT_SELF_EMPLOYED,
  EMPLOYMENT_BUSINESS_OWNER
} from './constants';
import { validatePAN, validateGST, calculateAge } from './validators';

// ==================== STEP 1: Loan Type & Basic Info ====================
export function getStep1Schema(formState = {}) {
  return z.object({
    loanType: z.enum([LOAN_TYPE_PERSONAL, LOAN_TYPE_HOME, LOAN_TYPE_BUSINESS], {
      required_error: 'Please select a loan type',
    }),
    loanAmount: z.coerce.number({
      required_error: 'Loan amount is required',
      invalid_type_error: 'Please enter a valid amount',
    }).min(50000, 'Minimum loan amount is ₹50,000'),
    loanTenure: z.coerce.number({
      required_error: 'Loan tenure is required',
    }).min(1, 'Please select a tenure'),
    loanPurpose: z.string().min(1, 'Please select a loan purpose'),
    referralCode: z.string().optional().refine(
      (val) => !val || /^[a-zA-Z0-9]{6,10}$/.test(val),
      'Referral code must be 6-10 alphanumeric characters'
    ),
  }).superRefine((data, ctx) => {
    const config = LOAN_CONFIGS[data.loanType];
    if (config) {
      if (data.loanAmount > config.maxAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Maximum amount for ${config.label} is ₹${(config.maxAmount / 100000).toFixed(0)} Lakh`,
          path: ['loanAmount'],
        });
      }
      if (data.loanTenure < config.minTenure) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Minimum tenure for ${config.label} is ${config.minTenure} months`,
          path: ['loanTenure'],
        });
      }
      if (data.loanTenure > config.maxTenure) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Maximum tenure for ${config.label} is ${config.maxTenure} months`,
          path: ['loanTenure'],
        });
      }
    }
    // Cross-step: DOB affects max tenure
    if (formState?.dateOfBirth) {
      const age = calculateAge(formState.dateOfBirth);
      if (age && data.loanTenure) {
        const maxTenureMonths = (65 - age) * 12;
        if (data.loanTenure > maxTenureMonths) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Based on your age (${age}), maximum tenure is ${maxTenureMonths} months (age + tenure must not exceed 65 years)`,
            path: ['loanTenure'],
          });
        }
      }
    }
  });
}

// ==================== STEP 2: Personal Information ====================
export function getStep2Schema() {
  return z.object({
    fullName: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
      .regex(/^[a-zA-Z\s.]+$/, 'Name can only contain letters, spaces, and periods'),
    dateOfBirth: z.string().min(1, 'Date of birth is required').refine((val) => {
      const age = calculateAge(val);
      return age !== null && age >= 21;
    }, 'You must be at least 21 years old').refine((val) => {
      const age = calculateAge(val);
      return age !== null && age <= 65;
    }, 'Maximum age for loan application is 65 years'),
    gender: z.enum(['male', 'female', 'other'], {
      required_error: 'Please select your gender',
    }),
    maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed'], {
      required_error: 'Please select marital status',
    }),
    fatherName: z.string()
      .min(2, "Father's name must be at least 2 characters")
      .max(100, "Father's name must not exceed 100 characters")
      .regex(/^[a-zA-Z\s.]+$/, 'Name can only contain letters, spaces, and periods'),
    motherName: z.string()
      .min(2, "Mother's name must be at least 2 characters")
      .max(100, "Mother's name must not exceed 100 characters")
      .regex(/^[a-zA-Z\s.]+$/, 'Name can only contain letters, spaces, and periods'),
    email: z.string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    mobileNumber: z.string()
      .min(1, 'Mobile number is required')
      .regex(/^[6-9]\d{9}$/, 'Mobile must be 10 digits starting with 6, 7, 8, or 9'),
    alternateMobile: z.string().optional().refine(
      (val) => !val || /^[6-9]\d{9}$/.test(val),
      'Must be a valid 10-digit mobile number'
    ),
  }).refine(
    (data) => !data.alternateMobile || data.alternateMobile !== data.mobileNumber,
    { message: 'Alternate mobile must differ from primary mobile', path: ['alternateMobile'] }
  );
}

// ==================== STEP 3: KYC ====================
export function getStep3Schema(loanType = LOAN_TYPE_PERSONAL) {
  return z.object({
    panNumber: z.string().min(1, 'PAN number is required').refine(
      (val) => validatePAN(val, loanType).valid,
      (val) => ({ message: validatePAN(val, loanType).error || 'Invalid PAN' })
    ),
    aadhaarNumber: z.string().min(1, 'Aadhaar number is required').refine(
      (val) => {
        const cleaned = val.replace(/\s/g, '');
        return /^\d{12}$/.test(cleaned);
      },
      'Aadhaar must be exactly 12 digits'
    ),
    aadhaarConsent: z.literal(true, {
      errorMap: () => ({ message: 'You must consent to Aadhaar verification to proceed' }),
    }),
    voterID: z.string().optional().refine(
      (val) => !val || /^[A-Z]{3}\d{7}$/i.test(val),
      'Voter ID must be 3 letters followed by 7 digits'
    ),
    passport: z.string().optional().refine(
      (val) => !val || /^[A-Z]\d{7}$/i.test(val),
      'Passport must be 1 letter followed by 7 digits'
    ),
  });
}

// ==================== STEP 4: Address ====================
export function getStep4Schema() {
  return z.object({
    currentAddressLine1: z.string()
      .min(5, 'Address must be at least 5 characters')
      .max(200, 'Address must not exceed 200 characters'),
    currentAddressLine2: z.string().optional(),
    currentPinCode: z.string()
      .min(1, 'PIN code is required')
      .regex(/^[1-9]\d{5}$/, 'PIN code must be 6 digits and cannot start with 0'),
    currentCity: z.string().min(1, 'City is required'),
    currentState: z.string().min(1, 'State is required'),
    residenceType: z.enum(['owned', 'rented', 'company', 'family'], {
      required_error: 'Please select residence type',
    }),
    rentAmount: z.coerce.number().optional(),
    yearsAtCurrentAddress: z.coerce.number({
      required_error: 'Years at current address is required',
      invalid_type_error: 'Please enter a valid number',
    }).min(0, 'Cannot be negative').max(50, 'Maximum 50 years'),
    sameAsPermanent: z.boolean().optional(),
    permanentAddressLine1: z.string().optional(),
    permanentAddressLine2: z.string().optional(),
    permanentPinCode: z.string().optional(),
    permanentCity: z.string().optional(),
    permanentState: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (data.residenceType === 'rented' && (!data.rentAmount || data.rentAmount <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Rent amount is required for rented residence',
        path: ['rentAmount'],
      });
    }
    if (!data.sameAsPermanent) {
      if (!data.permanentAddressLine1 || data.permanentAddressLine1.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Permanent address is required',
          path: ['permanentAddressLine1'],
        });
      }
      if (!data.permanentPinCode || !/^[1-9]\d{5}$/.test(data.permanentPinCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Valid PIN code is required',
          path: ['permanentPinCode'],
        });
      }
      if (!data.permanentCity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'City is required',
          path: ['permanentCity'],
        });
      }
      if (!data.permanentState) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'State is required',
          path: ['permanentState'],
        });
      }
    }
  });
}

// ==================== STEP 5: Employment & Income ====================
export function getStep5Schema(loanType = LOAN_TYPE_PERSONAL) {
  return z.object({
    employmentType: z.enum([EMPLOYMENT_SALARIED, EMPLOYMENT_SELF_EMPLOYED, EMPLOYMENT_BUSINESS_OWNER], {
      required_error: 'Please select employment type',
    }),
    // Salaried fields
    companyName: z.string().optional(),
    designation: z.string().optional(),
    monthlyNetSalary: z.coerce.number().optional(),
    yearsOfExperience: z.coerce.number().optional(),
    // Self-employed / Business fields
    businessName: z.string().optional(),
    businessType: z.string().optional(),
    annualTurnover: z.coerce.number().optional(),
    yearsInBusiness: z.coerce.number().optional(),
    monthlyIncome: z.coerce.number().optional(),
    gstNumber: z.string().optional(),
    officeAddressLine1: z.string().optional(),
    officeCity: z.string().optional(),
    officeState: z.string().optional(),
    officePinCode: z.string().optional(),
  }).superRefine((data, ctx) => {
    // Business loan requires Business Owner or Self-Employed
    if (loanType === LOAN_TYPE_BUSINESS && data.employmentType === EMPLOYMENT_SALARIED) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Business Loan requires Self-Employed or Business Owner employment type',
        path: ['employmentType'],
      });
    }

    if (data.employmentType === EMPLOYMENT_SALARIED) {
      if (!data.companyName || data.companyName.length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Company name is required', path: ['companyName'] });
      }
      if (!data.designation || data.designation.length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Designation is required', path: ['designation'] });
      }
      if (!data.monthlyNetSalary || data.monthlyNetSalary < 15000) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Monthly salary must be at least ₹15,000', path: ['monthlyNetSalary'] });
      }
      if (data.yearsOfExperience === undefined || data.yearsOfExperience === null || data.yearsOfExperience < 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Years of experience is required', path: ['yearsOfExperience'] });
      }
    }

    if (data.employmentType === EMPLOYMENT_SELF_EMPLOYED || data.employmentType === EMPLOYMENT_BUSINESS_OWNER) {
      if (!data.businessName || data.businessName.length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Business name is required', path: ['businessName'] });
      }
      if (!data.businessType) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Business type is required', path: ['businessType'] });
      }
      if (!data.annualTurnover || data.annualTurnover < 300000) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Annual turnover must be at least ₹3,00,000', path: ['annualTurnover'] });
      }
      if (!data.yearsInBusiness || data.yearsInBusiness < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Minimum 2 years in business required', path: ['yearsInBusiness'] });
      }
      if (data.employmentType === EMPLOYMENT_SELF_EMPLOYED && (!data.monthlyIncome || data.monthlyIncome <= 0)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Monthly income is required', path: ['monthlyIncome'] });
      }
      if (data.employmentType === EMPLOYMENT_BUSINESS_OWNER) {
        if (!data.gstNumber) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'GST number is required', path: ['gstNumber'] });
        } else {
          const gstResult = validateGST(data.gstNumber);
          if (!gstResult.valid) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: gstResult.error, path: ['gstNumber'] });
          }
        }
      }
      if (!data.officeAddressLine1 || data.officeAddressLine1.length < 5) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Office/Business address is required', path: ['officeAddressLine1'] });
      }
    }
  });
}

// ==================== STEP 6: Co-Applicant ====================
export function getStep6Schema() {
  return z.object({
    coApplicantName: z.string()
      .min(2, 'Co-applicant name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
      .regex(/^[a-zA-Z\s.]+$/, 'Name can only contain letters, spaces, and periods'),
    coApplicantRelationship: z.string().min(1, 'Relationship is required'),
    coApplicantPAN: z.string().min(1, 'Co-applicant PAN is required').refine(
      (val) => validatePAN(val).valid,
      (val) => ({ message: validatePAN(val).error || 'Invalid PAN' })
    ),
    coApplicantIncome: z.coerce.number({
      required_error: 'Co-applicant income is required',
    }).min(1, 'Income must be greater than 0'),
    coApplicantConsent: z.literal(true, {
      errorMap: () => ({ message: 'Co-applicant consent is required to proceed' }),
    }),
  });
}

// ==================== STEP 7: Documents ====================
export function getStep7Schema(loanType, employmentType, panVerified = false) {
  return z.object({
    panCardDoc: panVerified
      ? z.any().optional()
      : z.any().refine((val) => val && val.length > 0, 'PAN card copy is required'),
    aadhaarFrontDoc: z.any().refine((val) => val && val.length > 0, 'Aadhaar front is required'),
    aadhaarBackDoc: z.any().refine((val) => val && val.length > 0, 'Aadhaar back is required'),
    salarySlipsDoc: employmentType === EMPLOYMENT_SALARIED
      ? z.any().refine((val) => val && val.length > 0, 'Salary slips are required for salaried applicants')
      : z.any().optional(),
    bankStatementsDoc: z.any().refine((val) => val && val.length > 0, 'Bank statements are required'),
    itrDoc: (employmentType === EMPLOYMENT_SELF_EMPLOYED || employmentType === EMPLOYMENT_BUSINESS_OWNER)
      ? z.any().refine((val) => val && val.length > 0, 'ITR documents are required')
      : z.any().optional(),
    propertyDoc: loanType === LOAN_TYPE_HOME
      ? z.any().refine((val) => val && val.length > 0, 'Property documents are required for home loans')
      : z.any().optional(),
    businessRegDoc: loanType === LOAN_TYPE_BUSINESS
      ? z.any().refine((val) => val && val.length > 0, 'Business registration certificate is required')
      : z.any().optional(),
    gstReturnsDoc: loanType === LOAN_TYPE_BUSINESS
      ? z.any().refine((val) => val && val.length > 0, 'GST returns are required for business loans')
      : z.any().optional(),
    photographDoc: z.any().refine((val) => val && val.length > 0, 'Passport size photograph is required'),
    signature: z.string().min(1, 'E-signature is required'),
  });
}

// ==================== STEP 8: Review & Consent ====================
export function getStep8Schema() {
  return z.object({
    confirmAccuracy: z.literal(true, {
      errorMap: () => ({ message: 'You must confirm all information is accurate' }),
    }),
    consentCreditCheck: z.literal(true, {
      errorMap: () => ({ message: 'Credit check authorization is required' }),
    }),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms and Conditions' }),
    }),
    consentCommunications: z.literal(true, {
      errorMap: () => ({ message: 'Communication consent is required' }),
    }),
  });
}

/**
 * Schema factory: returns the appropriate schema for a step given the full form state
 */
export function getSchemaForStep(step, formState = {}) {
  switch (step) {
    case 1: return getStep1Schema(formState);
    case 2: return getStep2Schema();
    case 3: return getStep3Schema(formState.loanType);
    case 4: return getStep4Schema();
    case 5: return getStep5Schema(formState.loanType);
    case 6: return getStep6Schema();
    case 7: return getStep7Schema(formState.loanType, formState.employmentType, formState.panVerified);
    case 8: return getStep8Schema();
    default: return z.object({});
  }
}
